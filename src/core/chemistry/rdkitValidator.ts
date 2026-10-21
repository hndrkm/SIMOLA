import {
  MissionConfig,
  MolecularDescriptors,
  MolecularGraph,
  ValidationIssue,
  ValidationResult,
} from '../model/types';
import { graphToMol } from './graphToMol';
import { getRDKit, Mol } from './rdkitClient';
import { BIOCHEMICAL_FUNCTIONAL_GROUPS } from './functionalGroups';

/**
 * Extrae la fórmula molecular real según el sistema Hill (C primero, luego H, y
 * los demás elementos en orden alfabético) calculando los hidrógenos implícitos.
 */
export function extractMolecularFormula(mol: Mol): string {
  try {
    const hsMolBlock = mol.add_hs();
    const counts: Record<string, number> = {};

    for (const line of hsMolBlock.split('\n')) {
      const match = line.match(/^\s*[-0-9.]+\s+[-0-9.]+\s+[-0-9.]+\s+([A-Za-z]{1,2})\b/);
      if (match) {
        const sym = match[1];
        counts[sym] = (counts[sym] || 0) + 1;
      }
    }

    let result = '';
    // Sistema Hill: C, luego H
    if (counts['C']) {
      result += 'C' + (counts['C'] > 1 ? counts['C'] : '');
      delete counts['C'];
      if (counts['H']) {
        result += 'H' + (counts['H'] > 1 ? counts['H'] : '');
        delete counts['H'];
      }
    }

    // Resto de elementos en orden alfabético
    const sortedRemaining = Object.keys(counts).sort();
    for (const sym of sortedRemaining) {
      result += sym + (counts[sym] > 1 ? counts[sym] : '');
    }

    return result || 'Incierta';
  } catch {
    return 'Incierta';
  }
}

/**
 * Valida la estructura química mediante RDKit.js (Capa 2).
 *
 * Requiere que la Capa 1 (localValidator) haya pasado previamente para evitar
 * enviar grafos con valencias rotas a WebAssembly.
 *
 * Garantiza la regla A4.1 de liberación de memoria C++ invocando siempre .delete()
 * en bloques try / finally.
 */
export async function validateWithRDKit(
  graph: MolecularGraph,
  mission?: MissionConfig | null
): Promise<ValidationResult> {
  const issues: ValidationIssue[] = [];
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

    // 1. SMILES Canónico
    const canonicalSmiles = mol.get_smiles();

    // 2. Descriptores moleculares y anillos
    let ringCount = 0;
    try {
      const descJson = JSON.parse(mol.get_descriptors() || '{}');
      ringCount = descJson.NumRings ?? 0;
    } catch {
      ringCount = 0;
    }

    // 3. Fórmula molecular real con hidrógenos implícitos
    const formula = extractMolecularFormula(mol);

    const descriptors: MolecularDescriptors = {
      formula,
      canonicalSmiles,
      atomCount: Object.keys(graph.nodes).length,
      bondCount: Object.keys(graph.edges).length,
      ringCount,
    };

    // 4. Detección de grupos funcionales mediante subestructuras SMARTS
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
        if (qmol) {
          qmol.delete();
        }
      }
    }

    // 5. Verificación de condiciones de victoria si se está jugando una misión
    let passedMission = true;
    if (mission && mission.winConditions) {
      const wc = mission.winConditions;

      if (wc.targetFormula && wc.targetFormula.toUpperCase() !== formula.toUpperCase()) {
        passedMission = false;
        issues.push({
          code: 'FORMULA_MISMATCH',
          message: `La fórmula molecular calculada (${formula}) no coincide con la esperada (${wc.targetFormula}).`,
          affectedAtomIds: [],
        });
      }

      if (wc.targetCanonicalSmiles && wc.targetCanonicalSmiles !== canonicalSmiles) {
        passedMission = false;
        issues.push({
          code: 'STRUCTURE_MISMATCH',
          message: `La estructura construida (${canonicalSmiles}) no coincide con la molécula objetivo (${wc.targetCanonicalSmiles}).`,
          affectedAtomIds: [],
        });
      }

      if (wc.expectedRingCount !== undefined && wc.expectedRingCount !== ringCount) {
        passedMission = false;
        issues.push({
          code: 'STRUCTURE_MISMATCH',
          message: `El número de anillos presentes (${ringCount}) no coincide con el objetivo (${wc.expectedRingCount}).`,
          affectedAtomIds: [],
        });
      }

      if (wc.requiredSubstructures && wc.requiredSubstructures.length > 0) {
        for (const req of wc.requiredSubstructures) {
          let reqQMol: Mol | null = null;
          try {
            reqQMol = RDKit.get_qmol(req.smarts);
            if (reqQMol && reqQMol.is_valid()) {
              const matchStr = mol.get_substruct_matches(reqQMol);
              let count = 0;
              if (matchStr && matchStr !== '{}') {
                const parsed = JSON.parse(matchStr);
                count = Array.isArray(parsed) ? parsed.length : 1;
              }
              if (count < req.minCount) {
                passedMission = false;
                issues.push({
                  code: 'MISSING_FUNCTIONAL_GROUP',
                  message: `Falta el grupo funcional requerido: ${req.name} (mínimo ${req.minCount}, presentes: ${count}).`,
                  affectedAtomIds: [],
                });
              }
            }
          } finally {
            if (reqQMol) {
              reqQMol.delete();
            }
          }
        }
      }
    }

    const isValid = issues.length === 0;

    return {
      isValid,
      passedLayer1: true,
      passedMission: mission ? passedMission : true,
      issues,
      descriptors,
      detectedFunctionalGroups,
    };
  } finally {
    if (mol) {
      mol.delete();
    }
  }
}
