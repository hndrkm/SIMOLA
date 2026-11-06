import {
  MissionConfig,
  MolecularDescriptors,
  MolecularGraph,
  ValidationIssue,
  ValidationResult,
} from '../model/types';
import { validateLocalGraph } from '../chemistry/localValidator';
import { graphToMol } from '../chemistry/graphToMol';
import { getRDKit, Mol } from '../chemistry/rdkitClient';
import { extractMolecularFormula } from '../chemistry/rdkitValidator';
import { BIOCHEMICAL_FUNCTIONAL_GROUPS } from '../chemistry/functionalGroups';
import { validateSpatialHaworth } from '../chemistry/spatialValidator';

interface CommonMistake {
  name: string;
  smarts?: string;
  message: string;
}

const COMMON_MISTAKES_GLOBAL: CommonMistake[] = [
  {
    name: 'Enlace Carbono-Fósforo directo (C-P)',
    smarts: '[#6][P]',
    message: 'Diagnóstico pedagógico: Has enlazado el átomo de Fósforo directamente a un Carbono (C-P). En los ésteres fosfóricos biológicos, la unión siempre se realiza a través de un átomo de oxígeno puente (enlace fosfoéster: C-O-P).',
  },
];

const COMMON_MISTAKES_BY_MISSION: Record<string, CommonMistake[]> = {
  m2_step1_hexokinase: [
    {
      name: 'Enlace C-P directo',
      smarts: '[#6][P]',
      message: 'Diagnóstico pedagógico: Has enlazado el Fósforo directamente a un Carbono (C-P). Conecta el bloque Fosforilo (-PO3²⁻) al oxígeno puente en C6 (C-O-P).',
    },
  ],
  m2_step4_aldolase: [
    {
      name: 'C1 alcohol en lugar de carbonilo',
      smarts: '[#6][OX2H]',
      message: 'Diagnóstico pedagógico: El carbono C1 del Gliceraldehído-3-fosfato debe oxidarse a grupo carbonilo (C=O, orden 2). Haz clic sobre el enlace C1-O1 para elevarlo de simple a doble enlace.',
    },
  ],
  m2_step5_tim: [
    {
      name: 'Carbonilo residual en C2',
      smarts: '[#6](=O)COP',
      message: 'Diagnóstico pedagógico: La isomerización por TIM traslada el carbonilo de C2 a C1. Asegúrate de que C1 sea un aldehído (C=O, orden 2) y C2 sea un alcohol secundario (-OH, orden 1).',
    },
  ],
  m2_step7_pgk: [
    {
      name: 'Carboxilato no ionizado a pH 7.4',
      smarts: '[#6](=O)[OX2H]',
      message: 'Diagnóstico pedagógico: El grupo carboxilo en C1 del 3-Fosfoglicerato debe encontrarse desprotonado (-COO⁻ con carga formal -1) a pH fisiológico 7.4. Selecciona el oxígeno y asígnale carga formal -1 en la barra inferior.',
    },
  ],
  m2_step9_enolase: [
    {
      name: 'C2-C3 enlace simple en lugar de enol',
      smarts: 'CC(OP(=O))C(=O)',
      message: 'Diagnóstico pedagógico: La deshidratación catalizada por la Enolasa forma un doble enlace C=C entre C2 y C3. Haz clic sobre el enlace C2-C3 para convertirlo en doble enlace (orden 2), generando Fosfoenolpiruvato.',
    },
  ],
  m2_step10_pyruvate_kinase: [
    {
      name: 'Enolpiruvato sin tautomerizar',
      smarts: 'C=C(O)C(=O)',
      message: 'Diagnóstico pedagógico: El intermediario Enolpiruvato debe tautomerizarse a la forma ceto más estable de Piruvato. Haz clic en el enlace C2=C3 para bajarlo a enlace simple (2 -> 1) y en el enlace C2-O2 para elevarlo a doble enlace carbonilo (1 -> 2).',
    },
  ],
};


/**
 * Orquestador principal de evaluación de misiones (Etapa 5 - T5.1).
 *
 * Integra:
 * 1. Capa 1: Validación local (valencias físicas y conectividad BFS).
 *    Aplica cortocircuito inmediato (Regla A4.3) si hay violaciones físicas.
 * 2. Capa 2: Validación química con RDKit WebAssembly (MOL V2000, SMILES canónico, SMARTS).
 * 3. Diagnóstico diferencial pedagógico:
 *    - Detección de isómeros constitucionales y regioisómeros (fórmula correcta, pero SMILES incorrecto).
 *    - Identificación precisa de subestructuras SMARTS requeridas o prohibidas.
 *
 * Garantiza la Regla A4.1: Toda instancia de RDKit `mol` o `qmol` se destruye en `finally`.
 */
export async function evaluateMission(
  graph: MolecularGraph,
  mission: MissionConfig
): Promise<ValidationResult> {
  const nodeCount = Object.keys(graph.nodes).length;

  // 1. Verificación preliminar de grafo no vacío
  if (nodeCount === 0) {
    return {
      isValid: false,
      passedLayer1: false,
      passedMission: false,
      issues: [
        {
          code: 'INVALID_CHEMISTRY',
          message: 'El lienzo está vacío. Construye la molécula requerida por la misión antes de verificar.',
          affectedAtomIds: [],
        },
      ],
    };
  }

  // 2. Capa 1: Valencias locales y Conectividad
  const localResult = validateLocalGraph(graph, {
    mustBeConnected: mission.winConditions.mustBeConnected,
  });

  if (!localResult.isValid) {
    return {
      ...localResult,
      passedMission: false,
    };
  }

  // 3. Capa 2: Procesamiento RDKit.js WebAssembly
  const molBlock = graphToMol(graph);
  const RDKit = await getRDKit();

  let mol: Mol | null = null;
  try {
    mol = RDKit.get_mol(molBlock);

    if (!mol || !mol.is_valid()) {
      return {
        isValid: false,
        passedLayer1: true,
        passedMission: false,
        issues: [
          {
            code: 'INVALID_CHEMISTRY',
            message:
              'RDKit no pudo interpretar la estructura generada. Verifica la conectividad, aromaticidad o cargas de los átomos.',
            affectedAtomIds: Object.keys(graph.nodes),
          },
        ],
      };
    }

    const canonicalSmiles = mol.get_smiles();
    const formula = extractMolecularFormula(mol);

    let ringCount = 0;
    try {
      const descJson = JSON.parse(mol.get_descriptors() || '{}');
      ringCount = descJson.NumRings ?? 0;
    } catch {
      ringCount = 0;
    }

    const descriptors: MolecularDescriptors = {
      formula,
      canonicalSmiles,
      atomCount: nodeCount,
      bondCount: Object.keys(graph.edges).length,
      ringCount,
    };

    // Detección general de grupos funcionales
    const detectedFunctionalGroups: { name: string; count: number }[] = [];
    for (const fg of BIOCHEMICAL_FUNCTIONAL_GROUPS) {
      let qmol: Mol | null = null;
      try {
        qmol = RDKit.get_qmol(fg.smarts);
        if (qmol && qmol.is_valid()) {
          const matchStr = mol.get_substruct_matches(qmol);
          if (matchStr && matchStr !== '{}') {
            const parsed = JSON.parse(matchStr);
            const count = Array.isArray(parsed) ? parsed.length : 1;
            if (count > 0) {
              detectedFunctionalGroups.push({ name: fg.name, count });
            }
          }
        }
      } catch (err) {
        console.warn(`Error analizando grupo funcional ${fg.name}:`, err);
      } finally {
        if (qmol) qmol.delete();
      }
    }

    // 4. Evaluación de Condiciones de Victoria y Diagnóstico Diferencial
    const issues: ValidationIssue[] = [];
    let differentialDiagnosis: string | undefined = undefined;

    const wc = mission.winConditions;

    // Recopilación de SMILES aceptados normalizados
    const rawSmilesList: string[] = [];
    if (wc.targetCanonicalSmiles) {
      rawSmilesList.push(wc.targetCanonicalSmiles);
    }
    if (wc.acceptedSmiles && wc.acceptedSmiles.length > 0) {
      rawSmilesList.push(...wc.acceptedSmiles);
    }

    const acceptedCanonicalSmiles: string[] = [];
    const validFormulas: string[] = [];

    if (wc.targetFormula) {
      validFormulas.push(wc.targetFormula.toUpperCase());
    }

    // Normalizar SMILES válidos y derivar sus fórmulas aceptables
    for (const rawSmiles of rawSmilesList) {
      let tempMol: Mol | null = null;
      try {
        tempMol = RDKit.get_mol(rawSmiles);
        if (tempMol && tempMol.is_valid()) {
          const cSmiles = tempMol.get_smiles();
          if (!acceptedCanonicalSmiles.includes(cSmiles)) {
            acceptedCanonicalSmiles.push(cSmiles);
          }
          const f = extractMolecularFormula(tempMol).toUpperCase();
          if (!validFormulas.includes(f)) {
            validFormulas.push(f);
          }
        } else {
          acceptedCanonicalSmiles.push(rawSmiles);
        }
      } catch {
        acceptedCanonicalSmiles.push(rawSmiles);
      } finally {
        if (tempMol) tempMol.delete();
      }
    }

    const smilesMatch =
      acceptedCanonicalSmiles.length === 0 ||
      acceptedCanonicalSmiles.includes(canonicalSmiles);

    const formulaMatch =
      validFormulas.length === 0 ||
      validFormulas.includes(formula.toUpperCase());

    // DIAGNÓSTICO DIFERENCIAL 1: Isomería Constitucional / Regioquímica
    if (formulaMatch && !smilesMatch) {
      const isomerMsg =
        `Los átomos y la fórmula molecular son correctos (${formula}), pero el grupo funcional está conectado en el carbono equivocado para esta enzima (isómero o regioisómero no reconocido).`;
      issues.push({
        code: 'STRUCTURE_MISMATCH',
        message: isomerMsg,
        affectedAtomIds: [],
      });
      differentialDiagnosis = isomerMsg;
    } else if (!formulaMatch && validFormulas.length > 0) {
      issues.push({
        code: 'FORMULA_MISMATCH',
        message: `La fórmula molecular calculada (${formula}) no coincide con la esperada (${validFormulas.join(' o ')}).`,
        affectedAtomIds: [],
      });
    } else if (!smilesMatch) {
      issues.push({
        code: 'STRUCTURE_MISMATCH',
        message: `La estructura construida (${canonicalSmiles}) no coincide con la molécula objetivo requerida.`,
        affectedAtomIds: [],
      });
    }

    // Verificación de Anillos
    if (wc.expectedRingCount !== undefined && wc.expectedRingCount !== ringCount) {
      issues.push({
        code: 'STRUCTURE_MISMATCH',
        message: `El número de anillos presentes (${ringCount}) no coincide con el objetivo (${wc.expectedRingCount}).`,
        affectedAtomIds: [],
      });
    }

    // DIAGNÓSTICO DIFERENCIAL 2: Subestructuras SMARTS Requeridas
    if (wc.requiredSubstructures && wc.requiredSubstructures.length > 0) {
      for (const req of wc.requiredSubstructures) {
        let qmol: Mol | null = null;
        try {
          qmol = RDKit.get_qmol(req.smarts);
          if (qmol && qmol.is_valid()) {
            const matchStr = mol.get_substruct_matches(qmol);
            let count = 0;
            if (matchStr && matchStr !== '{}') {
              const parsed = JSON.parse(matchStr);
              count = Array.isArray(parsed) ? parsed.length : 1;
            }
            if (count < req.minCount) {
              const msg =
                req.description ||
                `Falta el grupo funcional o enlace enzimático requerido: ${req.name} (mínimo ${req.minCount}, presentes: ${count}).`;
              issues.push({
                code: 'MISSING_FUNCTIONAL_GROUP',
                message: msg,
                affectedAtomIds: [],
              });
              if (!differentialDiagnosis) {
                differentialDiagnosis = msg;
              }
            }
          }
        } finally {
          if (qmol) qmol.delete();
        }
      }
    }

    // DIAGNÓSTICO DIFERENCIAL 3: Subestructuras SMARTS Prohibidas
    if (wc.forbiddenSubstructures && wc.forbiddenSubstructures.length > 0) {
      for (const forbidden of wc.forbiddenSubstructures) {
        let qmol: Mol | null = null;
        try {
          qmol = RDKit.get_qmol(forbidden.smarts);
          if (qmol && qmol.is_valid()) {
            const matchStr = mol.get_substruct_matches(qmol);
            let count = 0;
            if (matchStr && matchStr !== '{}') {
              const parsed = JSON.parse(matchStr);
              count = Array.isArray(parsed) ? parsed.length : 1;
            }
            if (count > 0) {
              const msg =
                forbidden.description ||
                `La molécula contiene una subestructura no permitida para esta reacción: ${forbidden.name}.`;
              issues.push({
                code: 'FORBIDDEN_SUBSTRUCTURE',
                message: msg,
                affectedAtomIds: [],
              });
              if (!differentialDiagnosis) {
                differentialDiagnosis = msg;
              }
            }
          }
        } finally {
          if (qmol) qmol.delete();
        }
      }
    }

    // DIAGNÓSTICO DIFERENCIAL 4: Reglas de Estereoquímica Espacial (Proyecciones de Haworth)
    if (wc.spatialRules?.haworth) {
      const spatialResult = validateSpatialHaworth(graph, wc.spatialRules.haworth);
      if (!spatialResult.isValid) {
        issues.push(...spatialResult.issues);
        if (!differentialDiagnosis && spatialResult.issues.length > 0) {
          differentialDiagnosis = spatialResult.issues[0].message;
        }
      }
    }

    // DIAGNÓSTICO DIFERENCIAL 5: Evaluación de Errores Comunes de la Misión (P3.1 commonMistakes)
    if (issues.length > 0) {
      const missionMistakes = COMMON_MISTAKES_BY_MISSION[mission.id] || [];
      const allMistakes = [...missionMistakes, ...COMMON_MISTAKES_GLOBAL];

      for (const mistake of allMistakes) {
        if (mistake.smarts) {
          let qmol: Mol | null = null;
          try {
            qmol = RDKit.get_qmol(mistake.smarts);
            if (qmol && qmol.is_valid()) {
              const matchStr = mol.get_substruct_matches(qmol);
              if (matchStr && matchStr !== '{}' && matchStr !== '[]') {
                differentialDiagnosis = mistake.message;
                break;
              }
            }
          } catch {
            // Continuar con otros errores
          } finally {
            if (qmol) qmol.delete();
          }
        }
      }
    }

    const passedMission = issues.length === 0;


    return {
      isValid: passedMission,
      passedLayer1: true,
      passedMission,
      issues,
      descriptors,
      detectedFunctionalGroups,
      differentialDiagnosis,
    };
  } finally {
    if (mol) {
      mol.delete();
    }
  }
}
