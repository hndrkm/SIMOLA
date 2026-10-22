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
