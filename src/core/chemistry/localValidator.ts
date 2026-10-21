import {
  ElementSymbol,
  MolecularGraph,
  ValidationIssue,
  ValidationResult,
} from '../model/types';
import { getElement } from '../model/periodicTable';

export interface LocalValidatorOptions {
  mustBeConnected?: boolean;
}

/**
 * Determina la valencia máxima permitida para un elemento considerando su carga formal.
 */
export function getMaxAllowedValence(element: ElementSymbol, formalCharge: number): number {
  switch (element) {
    case 'C':
      // Carbono neutro: 4. Carbocatión (+1) o carbanión (-1): 3.
      if (formalCharge === 0) return 4;
      if (Math.abs(formalCharge) === 1) return 3;
      return Math.max(0, 4 - Math.abs(formalCharge));

    case 'H':
      // Hidrógeno neutro solo puede formar 1 enlace. Con carga no forma enlaces covalentes normales.
      return formalCharge === 0 ? 1 : 0;

    case 'O':
      // Oxígeno neutro: 2. Oxonio (+1): 3. Alcóxido / Carboxilato (-1): 1.
      if (formalCharge === 0) return 2;
      if (formalCharge === 1) return 3;
      if (formalCharge === -1) return 1;
      return Math.max(0, 2 + formalCharge);

    case 'N':
      // Nitrógeno neutro: 3. Amonio / Nitrógeno cuaternario (+1): 4. Amida desprotonada (-1): 2.
      if (formalCharge === 0) return 3;
      if (formalCharge === 1) return 4;
      if (formalCharge === -1) return 2;
      return Math.max(0, 3 + formalCharge);

    case 'P':
      // Fósforo: puede expandir octeto (3 o 5 enlaces en ésteres de fosfato como ATP).
      if (formalCharge === 0) return 5;
      if (formalCharge === 1) return 4;
      if (formalCharge === -1) return 6;
      return Math.max(0, 5 + formalCharge);

    case 'S':
      // Azufre: 2 (tioles/tioéteres), 4 (sulfóxidos), 6 (sulfatos/sulfonas).
      if (formalCharge === 0) return 6;
      if (formalCharge === 1) return 3;
      if (formalCharge === -1) return 1;
      return Math.max(0, 6 + formalCharge);

    case 'F':
    case 'Cl':
    case 'Br':
    case 'I':
      // Halógenos orgánicos: 1 enlace covalente neutro. Anión haluro (-1): 0 enlaces.
      return formalCharge === 0 ? 1 : 0;

    case 'Na':
    case 'K':
    case 'Li':
      return formalCharge === 0 ? 1 : 0;

    case 'Mg':
    case 'Ca':
      return formalCharge === 0 ? 2 : 0;

    default: {
      const data = getElement(element);
      if (data && data.allowedValences.length > 0) {
        const base = Math.max(...data.allowedValences);
        return Math.max(0, base + formalCharge);
      }
      return 4;
    }
  }
}

/**
 * Genera una explicación pedagógica clara en español cuando se transgrede una valencia.
 */
function createValenceErrorMessage(
  element: ElementSymbol,
  formalCharge: number,
  currentValence: number,
  maxValence: number
): string {
  const chargeStr =
    formalCharge === 0
      ? 'neutro'
      : formalCharge > 0
      ? `con carga +${formalCharge}`
      : `con carga ${formalCharge}`;

  if (element === 'C' && currentValence > 4) {
    return `El átomo de Carbono (C) tiene ${currentValence} enlaces (valencia máxima: 4). ¡El carbono no puede ser pentavalente! Viola la regla del octeto.`;
  }
  if (element === 'H' && currentValence > 1) {
    return `El átomo de Hidrógeno (H) solo puede formar 1 enlace simple (tiene ${currentValence} enlaces). Solo posee el orbital 1s para compartir electrones.`;
  }
  if (element === 'O' && formalCharge === 0 && currentValence > 2) {
    return `El átomo de Oxígeno (O) neutro excede su valencia máxima de 2 (tiene ${currentValence} enlaces). Para formar 3 enlaces (como en el ion oxonio), debe tener carga formal +1.`;
  }
  if (element === 'O' && formalCharge === -1 && currentValence > 1) {
    return `El átomo de Oxígeno (O⁻) con carga -1 solo puede formar 1 enlace (tiene ${currentValence} enlaces). Un oxígeno desprotonado ya saturó su octeto.`;
  }
  if (element === 'N' && formalCharge === 0 && currentValence > 3) {
    return `El átomo de Nitrógeno (N) neutro excede su valencia típica de 3 enlaces (tiene ${currentValence} enlaces). Para formar 4 enlaces (como en el amonio), requiere carga formal +1.`;
  }
  if (element === 'P' && currentValence > 5) {
    return `El átomo de Fósforo (P) tiene ${currentValence} enlaces, superando su valencia máxima fisiológica de 5.`;
  }
  if (element === 'S' && currentValence > 6) {
    return `El átomo de Azufre (S) tiene ${currentValence} enlaces, superando su valencia máxima expandida de 6.`;
  }
  if (['F', 'Cl', 'Br', 'I'].includes(element) && currentValence > 1) {
    return `El átomo de halógeno (${element}) solo puede formar 1 enlace covalente simple en biomoléculas (tiene ${currentValence} enlaces).`;
  }

  return `El átomo de ${element} ${chargeStr} tiene ${currentValence} enlaces, pero su valencia máxima permitida es ${maxValence}.`;
}

/**
 * Ejecuta la validación de Capa 1 (Validador Local de Grafo).
 * Examina instantáneamente:
 * 1. Existencia de átomos en el lienzo.
 * 2. Chequeo de valencias permitidas ajustadas por carga formal.
 * 3. Chequeo de conectividad BFS (grafo conectado) si mustBeConnected = true.
 */
export function validateLocalGraph(
  graph: MolecularGraph,
  options: LocalValidatorOptions = {}
): ValidationResult {
  const issues: ValidationIssue[] = [];
  const nodeEntries = Object.entries(graph.nodes);
  const totalAtoms = nodeEntries.length;

  // 1. Verificación de lienzo vacío
  if (totalAtoms === 0) {
    return {
      isValid: false,
      passedLayer1: false,
      passedMission: false,
      issues: [
        {
          code: 'INVALID_CHEMISTRY',
          message: 'El lienzo está vacío. Agrega átomos y conéctalos con enlaces antes de validar.',
          affectedAtomIds: [],
        },
      ],
    };
  }

  // 2. Cálculo de valencias por átomo
  const valenceMap = new Map<string, number>();
  for (const [id] of nodeEntries) {
    valenceMap.set(id, 0);
  }

  for (const edge of Object.values(graph.edges)) {
    if (valenceMap.has(edge.sourceId)) {
      valenceMap.set(edge.sourceId, (valenceMap.get(edge.sourceId) || 0) + edge.order);
    }
    if (valenceMap.has(edge.targetId)) {
      valenceMap.set(edge.targetId, (valenceMap.get(edge.targetId) || 0) + edge.order);
    }
  }

  // 3. Chequeo de valencia para cada átomo
  for (const [id, atom] of nodeEntries) {
    const currentValence = valenceMap.get(id) || 0;
    const maxValence = getMaxAllowedValence(atom.element, atom.formalCharge);

    if (currentValence > maxValence) {
      issues.push({
        code: 'VALENCE_EXCEEDED',
        message: createValenceErrorMessage(atom.element, atom.formalCharge, currentValence, maxValence),
        affectedAtomIds: [id],
      });
    }
  }

  // 4. Chequeo de Conectividad (BFS) si se exige molécula única
  if (options.mustBeConnected && totalAtoms > 1) {
    const adj = new Map<string, string[]>();
    for (const [id] of nodeEntries) {
      adj.set(id, []);
    }
    for (const edge of Object.values(graph.edges)) {
      adj.get(edge.sourceId)?.push(edge.targetId);
      adj.get(edge.targetId)?.push(edge.sourceId);
    }

    const startId = nodeEntries[0][0];
    const visited = new Set<string>();
    const queue = [startId];
    visited.add(startId);

    while (queue.length > 0) {
      const current = queue.shift()!;
      for (const neighbor of adj.get(current) || []) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }

    if (visited.size < totalAtoms) {
      const disconnectedIds = nodeEntries
        .map(([id]) => id)
        .filter((id) => !visited.has(id));

      issues.push({
        code: 'DISCONNECTED_GRAPH',
        message:
          'La estructura contiene átomos o fragmentos sueltos/desconectados. Todos los átomos deben formar una única molécula continua.',
        affectedAtomIds: disconnectedIds,
      });
    }
  }

  const isValid = issues.length === 0;

  return {
    isValid,
    passedLayer1: isValid,
    passedMission: false,
    issues,
  };
}
