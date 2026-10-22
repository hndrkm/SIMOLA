import {
  HaworthRingCheck,
  MolecularGraph,
  ValidationIssue,
} from '../model/types';

/**
 * Validador Espacial y Estereoquímico de Proyecciones de Haworth (Etapa 6 - SIMOLA).
 *
 * Evalúa la orientación espacial rigurosa de carbohidratos en proyección de Haworth:
 * 1. Verifica la posición del oxígeno heterocíclico en el anillo (ej. cuadrante superior derecho en piranosas).
 * 2. Asigna la numeración de los carbonos del anillo (C1 a C5) siguiendo el orden canónico a partir del oxígeno.
 * 3. Evalúa la orientación axial de los sustituyentes exocíclicos (-OH y -CH2OH) hacia arriba (Δy < 0)
 *    o hacia abajo (Δy > 0) para verificar anómeros (α vs β) y series enantioméricas (D vs L).
 */
export function validateSpatialHaworth(
  graph: MolecularGraph,
  rule: HaworthRingCheck
): { isValid: boolean; issues: ValidationIssue[] } {
  const issues: ValidationIssue[] = [];

  // 1. Encontrar todos los ciclos de tamaño esperado (6 para piranosa, 5 para furanosa)
  const expectedRingSize = rule.ringType === 'pyranose' ? 6 : 5;
  const rings = findCyclesOfSize(graph, expectedRingSize);

  // Filtrar el anillo que contenga exactamente 1 átomo de Oxígeno y el resto de Carbonos
  const sugarRing = rings.find((ring) => {
    const elements = ring.map((id) => graph.nodes[id]?.element);
    const oxygenCount = elements.filter((e) => e === 'O').length;
    const carbonCount = elements.filter((e) => e === 'C').length;
    return oxygenCount === 1 && carbonCount === expectedRingSize - 1;
  });

  if (!sugarRing) {
    issues.push({
      code: 'STRUCTURE_MISMATCH',
      message: `No se detectó un anillo ${rule.ringType === 'pyranose' ? 'piranósico (6 miembros: 5 carbonos y 1 oxígeno)' : 'furanósico (5 miembros: 4 carbonos y 1 oxígeno)'} cerrado en el lienzo.`,
      affectedAtomIds: Object.keys(graph.nodes),
    });
    return { isValid: false, issues };
  }

  // 2. Calcular centroide del anillo
  let sumX = 0;
  let sumY = 0;
  for (const id of sugarRing) {
    const node = graph.nodes[id];
    sumX += node.x;
    sumY += node.y;
  }
  const centroidX = sumX / sugarRing.length;
  const centroidY = sumY / sugarRing.length;

  // 3. Localizar el átomo de Oxígeno en el anillo
  const oxygenId = sugarRing.find((id) => graph.nodes[id]?.element === 'O');
  if (!oxygenId) {
    issues.push({
      code: 'STRUCTURE_MISMATCH',
      message: 'El anillo carece del átomo de oxígeno heterocíclico.',
      affectedAtomIds: sugarRing,
    });
    return { isValid: false, issues };
  }

  const oxygenNode = graph.nodes[oxygenId];

  // Verificar posición angular del oxígeno
  if (rule.expectedOxygenSector === 'top-right' || (!rule.expectedOxygenSector && rule.ringType === 'pyranose')) {
    // En piranosa Haworth, el oxígeno está en el sector superior derecho: x > centroidX - 25 y y < centroidY + 25
    const isTop = oxygenNode.y < centroidY + 30;
    const isRight = oxygenNode.x > centroidX - 30;

    if (!isTop || !isRight) {
      issues.push({
        code: 'STRUCTURE_MISMATCH',
        message:
          'Orientación del anillo en Haworth: En la proyección estándar de Haworth para piranosas, el heteroátomo de oxígeno debe ubicarse en el sector superior derecho del ciclo.',
        affectedAtomIds: [oxygenId],
      });
    }
  }

  // 4. Identificar C1..C5
  // Los dos vecinos en el anillo conectados al oxígeno
  const oNeighborsInRing = getNeighborsInRing(graph, oxygenId, sugarRing);
  if (oNeighborsInRing.length !== 2) {
    issues.push({
      code: 'STRUCTURE_MISMATCH',
      message: 'Conectividad heterocíclica anómala en el anillo de carbohidrato.',
      affectedAtomIds: [oxygenId],
    });
    return { isValid: false, issues };
  }

  // En proyección de Haworth estándar con O arriba-derecha:
  // C1 es el carbono con mayor coordenada Y (más hacia abajo) o mayor X
  // C5 es el carbono con menor coordenada X (hacia la izquierda del O)
  let c1Id: string;

  const nodeA = graph.nodes[oNeighborsInRing[0]];
  const nodeB = graph.nodes[oNeighborsInRing[1]];

  // C1 está en el lado derecho/inferior del oxígeno
  if (nodeA.y > nodeB.y || (Math.abs(nodeA.y - nodeB.y) < 15 && nodeA.x > nodeB.x)) {
    c1Id = nodeA.id;
  } else {
    c1Id = nodeB.id;
  }

  // Trazar el camino ordenado del anillo: C1 -> C2 -> C3 -> C4 -> C5
  const ringOrder: string[] = [c1Id];
  let currentId = c1Id;
  let prevId = oxygenId;

  for (let step = 1; step <= expectedRingSize - 2; step++) {
    const nextNeighbors = getNeighborsInRing(graph, currentId, sugarRing).filter(
      (nid) => nid !== prevId && nid !== oxygenId
    );
    if (nextNeighbors.length === 0) break;
    const nextId = nextNeighbors[0];
    ringOrder.push(nextId);
    prevId = currentId;
    currentId = nextId;
  }

  // Validar cada regla de sustituyente especificada
  for (const subRule of rule.substituents) {
    const carbonIndex = subRule.carbonIndex; // 1 a 5
    const carbonId = ringOrder[carbonIndex - 1];
    if (!carbonId) continue;

    const carbonNode = graph.nodes[carbonId];
    if (!carbonNode) continue;

    // Buscar sustituyentes exocíclicos unidos a este carbono (no pertenecientes al anillo)
    const exocyclicNeighbors = getExocyclicNeighbors(graph, carbonId, sugarRing);

    if (exocyclicNeighbors.length === 0) {
      issues.push({
        code: 'MISSING_FUNCTIONAL_GROUP',
        message: `Falta el sustituyente (${subRule.name}) en el carbono C${carbonIndex}.`,
        affectedAtomIds: [carbonId],
      });
      continue;
    }

    // Para C1..C4, buscamos típicamente el átomo de Oxígeno del hidroxilo
    // Para C5, buscamos el C6 del grupo -CH2OH
    let targetSubst = exocyclicNeighbors[0];
    if (carbonIndex === 5) {
      // Priorizar el átomo de Carbono (C6)
      const carbonSub = exocyclicNeighbors.find((nid) => graph.nodes[nid]?.element === 'C');
      if (carbonSub) targetSubst = carbonSub;
    } else {
      // Priorizar el átomo de Oxígeno (-OH)
      const oxygenSub = exocyclicNeighbors.find((nid) => graph.nodes[nid]?.element === 'O');
      if (oxygenSub) targetSubst = oxygenSub;
    }

    const substNode = graph.nodes[targetSubst];
    if (!substNode) continue;

    // Diferencia en eje Y (en canvas, Y crece hacia abajo)
    // Δy = y_sustituyente - y_carbono
    // Si Δy > 6px -> está abajo (DOWN)
    // Si Δy < -6px -> está arriba (UP)
    const deltaY = substNode.y - carbonNode.y;
    const detectedDirection: 'up' | 'down' | 'planar' =
      deltaY < -6 ? 'up' : deltaY > 6 ? 'down' : 'planar';

    if (detectedDirection !== subRule.direction) {
      const isAnomeric = carbonIndex === 1;
      const isSeriesC6 = carbonIndex === 5;

      let msg = '';
      if (isAnomeric) {
        msg = `Estereoquímica anomérica incorrecta: El sustituyente en C1 (${subRule.name}) se orienta hacia ${
          detectedDirection === 'up' ? 'ARRIBA (anómero β)' : 'ABAJO (anómero α)'
        }. Para el anómero ${rule.anomer === 'alpha' ? 'alfa (α)' : 'beta (β)'}, debe proyectarse hacia ${
          subRule.direction === 'down' ? 'ABAJO (posición trans respecto a C6)' : 'ARRIBA'
        }.`;
      } else if (isSeriesC6) {
        msg = `Estereoquímica de serie enantiomérica incorrecta: El grupo -CH₂OH en C5 (${subRule.name}) debe proyectarse hacia ${
          subRule.direction === 'up' ? 'ARRIBA' : 'ABAJO'
        } respecto al plano del anillo para pertenecer a la serie ${rule.series}.`;
      } else {
        msg = `Estereoquímica en C${carbonIndex} incorrecta: El grupo en C${carbonIndex} (${subRule.name}) debe proyectarse hacia ${
          subRule.direction === 'up' ? 'ARRIBA' : 'ABAJO'
        } respecto al plano del anillo de acuerdo con la configuración de la D-glucosa.`;
      }

      issues.push({
        code: 'STRUCTURE_MISMATCH',
        message: msg,
        affectedAtomIds: [carbonId, targetSubst],
      });
    }
  }

  return {
    isValid: issues.length === 0,
    issues,
  };
}

/**
 * Encuentra ciclos de tamaño N usando búsqueda DFS simple sin repetición.
 */
function findCyclesOfSize(graph: MolecularGraph, size: number): string[][] {
  const result: string[][] = [];
  const visited = new Set<string>();

  // Mapa de adyacencia
  const adj: Record<string, string[]> = {};
  for (const edge of Object.values(graph.edges)) {
    if (!adj[edge.sourceId]) adj[edge.sourceId] = [];
    if (!adj[edge.targetId]) adj[edge.targetId] = [];
    adj[edge.sourceId].push(edge.targetId);
    adj[edge.targetId].push(edge.sourceId);
  }

  function dfs(startId: string, currentId: string, depth: number, path: string[]) {
    if (depth === size) {
      // Verificar si hay una arista de vuelta a startId
      if (adj[currentId]?.includes(startId)) {
        // Normalizar ciclo ordenado lexicográficamente para evitar duplicados
        const cycle = [...path];
        const minVal = cycle.reduce((m, x) => (x < m ? x : m), cycle[0]);
        const minIdx = cycle.indexOf(minVal);
        const normalized = [...cycle.slice(minIdx), ...cycle.slice(0, minIdx)];
        const key = normalized.join('_');
        if (!visited.has(key)) {
          visited.add(key);
          result.push(normalized);
        }
      }
      return;
    }

    for (const neighbor of adj[currentId] || []) {
      if (!path.includes(neighbor)) {
        dfs(startId, neighbor, depth + 1, [...path, neighbor]);
      }
    }
  }

  for (const node of Object.values(graph.nodes)) {
    dfs(node.id, node.id, 1, [node.id]);
  }

  return result;
}

function getNeighborsInRing(
  graph: MolecularGraph,
  atomId: string,
  ringIds: string[]
): string[] {
  const ringSet = new Set(ringIds);
  const neighbors: string[] = [];
  for (const edge of Object.values(graph.edges)) {
    if (edge.sourceId === atomId && ringSet.has(edge.targetId)) {
      neighbors.push(edge.targetId);
    } else if (edge.targetId === atomId && ringSet.has(edge.sourceId)) {
      neighbors.push(edge.sourceId);
    }
  }
  return neighbors;
}

function getExocyclicNeighbors(
  graph: MolecularGraph,
  atomId: string,
  ringIds: string[]
): string[] {
  const ringSet = new Set(ringIds);
  const neighbors: string[] = [];
  for (const edge of Object.values(graph.edges)) {
    if (edge.sourceId === atomId && !ringSet.has(edge.targetId)) {
      neighbors.push(edge.targetId);
    } else if (edge.targetId === atomId && !ringSet.has(edge.sourceId)) {
      neighbors.push(edge.sourceId);
    }
  }
  return neighbors;
}
