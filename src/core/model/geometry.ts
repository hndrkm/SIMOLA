import { BondOrder, ElementSymbol, MolecularGraph } from './types';
import { getMaxValence } from './constants';

export const STANDARD_BOND_LENGTH = 60;
export const ANGLE_SNAP_STEP = (30 * Math.PI) / 180; // Snap cada 30° (π/6)
export const SPROUT_ANGLE_120 = (120 * Math.PI) / 180; // Ángulo canónico en zigzag de 120°

/**
 * Ajusta un ángulo en radianes al múltiplo más cercano de 30° (imán magnético de ángulo).
 */
export function snapAngleTo30Degrees(angleRad: number): number {
  return Math.round(angleRad / ANGLE_SNAP_STEP) * ANGLE_SNAP_STEP;
}

/**
 * Calcula la posición de brote óptima a 120° en zigzag o dirección opuesta con longitud exacta STANDARD_BOND_LENGTH (60px).
 */
export function calculateAutoSproutPosition(
  origin: { x: number; y: number },
  neighbors: Array<{ x: number; y: number }>,
  bondLength: number = STANDARD_BOND_LENGTH
): { x: number; y: number } {
  if (neighbors.length === 0) {
    // Si no tiene vecinos, brotar hacia la derecha-arriba a 30° estándar (-π/6)
    const angle = -Math.PI / 6;
    return {
      x: Math.round(origin.x + bondLength * Math.cos(angle)),
      y: Math.round(origin.y + bondLength * Math.sin(angle)),
    };
  }

  if (neighbors.length === 1) {
    // Si tiene 1 vecino, brotar a 120° respecto al enlace existente (patrón zigzag de KingDraw)
    const neighbor = neighbors[0];
    const incomingAngle = Math.atan2(origin.y - neighbor.y, origin.x - neighbor.x);
    // Alternar según inclinación: si viene subiendo, bajar a 120°, o viceversa
    const sproutAngle = incomingAngle + (Math.sin(incomingAngle) > 0 ? -SPROUT_ANGLE_120 : SPROUT_ANGLE_120);
    const snapped = snapAngleTo30Degrees(sproutAngle);
    return {
      x: Math.round(origin.x + bondLength * Math.cos(snapped)),
      y: Math.round(origin.y + bondLength * Math.sin(snapped)),
    };
  }

  // Si tiene 2 o más vecinos, encontrar el sector angular más amplio disponible
  const angles = neighbors
    .map((n) => Math.atan2(n.y - origin.y, n.x - origin.x))
    .sort((a, b) => a - b);

  let maxDiff = 0;
  let bestBisector = 0;

  for (let i = 0; i < angles.length; i++) {
    const nextIdx = (i + 1) % angles.length;
    let diff = angles[nextIdx] - angles[i];
    if (diff < 0) diff += 2 * Math.PI;

    if (diff > maxDiff) {
      maxDiff = diff;
      bestBisector = angles[i] + diff / 2;
    }
  }

  const snapped = snapAngleTo30Degrees(bestBisector);
  return {
    x: Math.round(origin.x + bondLength * Math.cos(snapped)),
    y: Math.round(origin.y + bondLength * Math.sin(snapped)),
  };
}

export type RingCategory = 'saturated' | 'unsaturated' | 'heterocycle';

export interface RingPreset {
  id: string;
  name: string;
  sides: number; // 3 a 8
  category: RingCategory;
  description: string;
  heteroAtoms?: Record<number, ElementSymbol>; // índice vértice -> elemento
  doubleBondIndices?: number[]; // índices de enlace (entre vértice i e i+1)
}

export const RING_PRESETS: RingPreset[] = [
  // --- A) Saturados (3 a 8) ---
  {
    id: 'cyclopropane',
    name: 'Ciclopropano',
    sides: 3,
    category: 'saturated',
    description: 'Anillo de 3 carbonos con alta tensión de enlace',
  },
  {
    id: 'cyclobutane',
    name: 'Ciclobutano',
    sides: 4,
    category: 'saturated',
    description: 'Anillo de 4 carbonos en conformación plegada',
  },
  {
    id: 'cyclopentane',
    name: 'Ciclopentano',
    sides: 5,
    category: 'saturated',
    description: 'Anillo de 5 carbonos en conformación sobre',
  },
  {
    id: 'cyclohexane',
    name: 'Ciclohexano',
    sides: 6,
    category: 'saturated',
    description: 'Anillo de 6 carbonos en conformación silla de baja tensión',
  },
  {
    id: 'cycloheptane',
    name: 'Cicloheptano',
    sides: 7,
    category: 'saturated',
    description: 'Anillo de 7 carbonos flexible',
  },
  {
    id: 'cyclooctane',
    name: 'Ciclooctano',
    sides: 8,
    category: 'saturated',
    description: 'Anillo de 8 carbonos de conformaciones dinámicas',
  },

  // --- B) Insaturados y Conjugados ---
  {
    id: 'cyclopropene',
    name: 'Ciclopropeno',
    sides: 3,
    category: 'unsaturated',
    description: 'Anillo de 3 carbonos con 1 doble enlace',
    doubleBondIndices: [0],
  },
  {
    id: 'cyclobutene',
    name: 'Ciclobuteno',
    sides: 4,
    category: 'unsaturated',
    description: 'Anillo de 4 carbonos con 1 doble enlace',
    doubleBondIndices: [0],
  },
  {
    id: 'cyclopentene',
    name: 'Ciclopenteno',
    sides: 5,
    category: 'unsaturated',
    description: 'Anillo de 5 carbonos con 1 doble enlace',
    doubleBondIndices: [0],
  },
  {
    id: 'cyclopentadiene',
    name: 'Ciclopentadieno',
    sides: 5,
    category: 'unsaturated',
    description: 'Anillo diénico conjugado de 5 carbonos',
    doubleBondIndices: [0, 2],
  },
  {
    id: 'cyclohexene',
    name: 'Ciclohexeno',
    sides: 6,
    category: 'unsaturated',
    description: 'Anillo de 6 carbonos con 1 doble enlace',
    doubleBondIndices: [0],
  },
  {
    id: 'benzene',
    name: 'Benceno',
    sides: 6,
    category: 'unsaturated',
    description: 'Anillo aromático de 6 carbonos con enlaces conjugados alternados',
    doubleBondIndices: [0, 2, 4],
  },
  {
    id: 'cycloheptene',
    name: 'Ciclohepteno',
    sides: 7,
    category: 'unsaturated',
    description: 'Anillo de 7 carbonos con 1 doble enlace',
    doubleBondIndices: [0],
  },
  {
    id: 'cyclooctene',
    name: 'Cicloocteno',
    sides: 8,
    category: 'unsaturated',
    description: 'Anillo de 8 carbonos con 1 doble enlace',
    doubleBondIndices: [0],
  },
  {
    id: 'cyclooctatetraene',
    name: 'Ciclooctatetraeno',
    sides: 8,
    category: 'unsaturated',
    description: 'Anillo de 8 carbonos con 4 dobles enlaces alternados',
    doubleBondIndices: [0, 2, 4, 6],
  },

  // --- C) Heterociclos Bioquímicos ---
  {
    id: 'pyranose',
    name: 'Anillo de Piranosa',
    sides: 6,
    category: 'heterocycle',
    description: 'Heterociclo de 6 miembros (5 C + 1 O) presente en aldohexosas',
    heteroAtoms: { 0: 'O' },
  },
  {
    id: 'furanose',
    name: 'Anillo de Furanosa',
    sides: 5,
    category: 'heterocycle',
    description: 'Heterociclo de 5 miembros (4 C + 1 O) presente en aldopentosas y fructosa',
    heteroAtoms: { 0: 'O' },
  },
];

/**
 * Calcula el radio del polígono regular para que cada lado mida bondLength.
 * R = bondLength / (2 * sin(pi / N))
 */
export function calculateRingRadius(sides: number, bondLength: number = STANDARD_BOND_LENGTH): number {
  if (sides < 3) return bondLength;
  return bondLength / (2 * Math.sin(Math.PI / sides));
}

export interface GeneratedRingData {
  nodes: Array<{
    tempId: string;
    element: ElementSymbol;
    x: number;
    y: number;
    formalCharge: number;
  }>;
  edges: Array<{
    sourceTempId: string;
    targetTempId: string;
    order: BondOrder;
  }>;
}

/**
 * Genera las coordenadas y enlaces de un anillo independiente centrado en (centerX, centerY).
 */
export function generateRing(
  preset: RingPreset,
  center: { x: number; y: number },
  bondLength: number = STANDARD_BOND_LENGTH,
  rotationAngle: number = 0
): GeneratedRingData {
  const N = Math.max(3, Math.min(8, preset.sides));
  const radius = calculateRingRadius(N, bondLength);

  // Orientación inicial simétrica con el primer vértice apuntando hacia arriba
  const baseOffset = -Math.PI / 2 + rotationAngle;
  const nodes: GeneratedRingData['nodes'] = [];

  for (let i = 0; i < N; i++) {
    const theta = baseOffset + (i * 2 * Math.PI) / N;
    const x = Math.round(center.x + radius * Math.cos(theta));
    const y = Math.round(center.y + radius * Math.sin(theta));
    const element = preset.heteroAtoms?.[i] || 'C';

    nodes.push({
      tempId: `node_${i}`,
      element,
      x,
      y,
      formalCharge: 0,
    });
  }

  const doubleSet = new Set(preset.doubleBondIndices || []);
  const edges: GeneratedRingData['edges'] = [];

  for (let i = 0; i < N; i++) {
    const nextIdx = (i + 1) % N;
    const isDouble = doubleSet.has(i);

    edges.push({
      sourceTempId: `node_${i}`,
      targetTempId: `node_${nextIdx}`,
      order: isDouble ? 2 : 1,
    });
  }

  return { nodes, edges };
}

/**
 * Fusión de anillo sobre un enlace existente entre atomA y atomB.
 * Calcula las coordenadas de los (N - 2) vértices restantes preservando el enlace original,
 * y verifica las valencias para no sobrecargar los átomos compartidos.
 */
export function fuseRingOntoBond(
  graph: MolecularGraph,
  bondId: string,
  preset: RingPreset,
  bondLength: number = STANDARD_BOND_LENGTH
): {
  newNodes: Array<{ element: ElementSymbol; x: number; y: number; formalCharge: number }>;
  newEdges: Array<{
    sourceId: string | number; // ID existente o índice en newNodes
    targetId: string | number;
    order: BondOrder;
  }>;
} | null {
  const bond = graph.edges[bondId];
  if (!bond) return null;

  const atomA = graph.nodes[bond.sourceId];
  const atomB = graph.nodes[bond.targetId];
  if (!atomA || !atomB) return null;

  const N = Math.max(3, Math.min(8, preset.sides));
  const dx = atomB.x - atomA.x;
  const dy = atomB.y - atomA.y;
  const L = Math.hypot(dx, dy) || bondLength;

  // Vector unitario y normal perpendicular
  const ux = dx / L;
  const uy = dy / L;

  // Determinar dirección normal: evaluar si hay otros átomos del lado +normal para ubicar el nuevo ciclo hacia el lado libre
  const midX = (atomA.x + atomB.x) / 2;
  const midY = (atomA.y + atomB.y) / 2;

  const normal1 = { x: -uy, y: ux };
  const normal2 = { x: uy, y: -ux };

  // Contar proximidad de átomos existentes en ambas direcciones
  let distSum1 = 0;
  let distSum2 = 0;
  for (const node of Object.values(graph.nodes)) {
    if (node.id === atomA.id || node.id === atomB.id) continue;
    const dot1 = (node.x - midX) * normal1.x + (node.y - midY) * normal1.y;
    const dot2 = (node.x - midX) * normal2.x + (node.y - midY) * normal2.y;
    if (dot1 > 0) distSum1 += 1;
    if (dot2 > 0) distSum2 += 1;
  }

  // Escoger la dirección con menos colisiones espaciales
  const chosenNormal = distSum1 <= distSum2 ? normal1 : normal2;

  // Altura del centro del N-gono desde el punto medio del enlace
  // d = L / (2 * tan(pi / N))
  const d = L / (2 * Math.tan(Math.PI / N));
  const centerX = midX + chosenNormal.x * d;
  const centerY = midY + chosenNormal.y * d;

  // Ángulos de los extremos A y B respecto al centro
  const thetaB = Math.atan2(atomB.y - centerY, atomB.x - centerX);
  const thetaA = Math.atan2(atomA.y - centerY, atomA.x - centerX);

  // Determinar sentido de giro de B a A
  let angleSpan = thetaA - thetaB;
  while (angleSpan < 0) angleSpan += 2 * Math.PI;
  while (angleSpan >= 2 * Math.PI) angleSpan -= 2 * Math.PI;

  const step = ((2 * Math.PI - angleSpan) / (N - 1));
  const radius = L / (2 * Math.sin(Math.PI / N));

  // Generar los N - 2 nodos intermedios
  const newNodes: Array<{ element: ElementSymbol; x: number; y: number; formalCharge: number }> = [];
  const intermediateCount = N - 2;

  for (let k = 1; k <= intermediateCount; k++) {
    const angle = thetaB - k * step;
    const x = Math.round(centerX + radius * Math.cos(angle));
    const y = Math.round(centerY + radius * Math.sin(angle));
    const element = preset.heteroAtoms?.[k + 1] || 'C';

    newNodes.push({
      element,
      x,
      y,
      formalCharge: 0,
    });
  }

  // Calcular valencias actuales de Atom A y Atom B
  let valenceA = 0;
  let valenceB = 0;
  for (const e of Object.values(graph.edges)) {
    if (e.sourceId === atomA.id || e.targetId === atomA.id) valenceA += e.order;
    if (e.sourceId === atomB.id || e.targetId === atomB.id) valenceB += e.order;
  }

  const maxValA = getMaxValence(atomA.element, atomA.formalCharge);
  const maxValB = getMaxValence(atomB.element, atomB.formalCharge);

  // Asignar enlaces respetando valencia máxima
  const newEdges: Array<{
    sourceId: string | number;
    targetId: string | number;
    order: BondOrder;
  }> = [];

  const doubleSet = new Set(preset.doubleBondIndices || []);

  // Cadena: Atom B -> newNodes[0] -> newNodes[1] -> ... -> newNodes[N-3] -> Atom A
  // 1. Enlace de B al primer nodo nuevo
  const orderBTo0: BondOrder = doubleSet.has(1) && valenceB + 2 <= maxValB ? 2 : 1;
  newEdges.push({
    sourceId: atomB.id,
    targetId: 0,
    order: orderBTo0,
  });

  // 2. Enlaces entre nodos nuevos consecutivos
  for (let i = 0; i < intermediateCount - 1; i++) {
    const isDouble = doubleSet.has(i + 2);
    newEdges.push({
      sourceId: i,
      targetId: i + 1,
      order: isDouble ? 2 : 1,
    });
  }

  // 3. Enlace del último nodo nuevo a Atom A
  const orderLastToA: BondOrder = doubleSet.has(N - 1) && valenceA + 2 <= maxValA ? 2 : 1;
  newEdges.push({
    sourceId: intermediateCount - 1,
    targetId: atomA.id,
    order: orderLastToA,
  });

  return { newNodes, newEdges };
}

/**
 * Acoplar un anillo a un átomo existente (Sprouting).
 * Coloca el vértice 0 del anillo orientado en la dirección opuesta a los enlaces existentes del átomo.
 */
export function sproutRingOntoAtom(
  graph: MolecularGraph,
  targetAtomId: string,
  preset: RingPreset,
  bondLength: number = STANDARD_BOND_LENGTH
): GeneratedRingData | null {
  const targetAtom = graph.nodes[targetAtomId];
  if (!targetAtom) return null;

  // Calcular vector medio de enlaces conectados a targetAtom
  let avgDx = 0;
  let avgDy = 0;
  let connectedCount = 0;

  for (const e of Object.values(graph.edges)) {
    if (e.sourceId === targetAtomId) {
      const neighbor = graph.nodes[e.targetId];
      if (neighbor) {
        avgDx += neighbor.x - targetAtom.x;
        avgDy += neighbor.y - targetAtom.y;
        connectedCount++;
      }
    } else if (e.targetId === targetAtomId) {
      const neighbor = graph.nodes[e.sourceId];
      if (neighbor) {
        avgDx += neighbor.x - targetAtom.x;
        avgDy += neighbor.y - targetAtom.y;
        connectedCount++;
      }
    }
  }

  // Dirección de crecimiento (opuesta a los enlaces existentes, o a la derecha por defecto)
  let growthAngle = 0;
  if (connectedCount > 0) {
    growthAngle = Math.atan2(-avgDy, -avgDx);
  }

  const N = Math.max(3, Math.min(8, preset.sides));
  const radius = calculateRingRadius(N, bondLength);

  // Centro del nuevo anillo desplazado por bondLength + radius
  const centerDistance = bondLength + radius;
  const centerX = Math.round(targetAtom.x + centerDistance * Math.cos(growthAngle));
  const centerY = Math.round(targetAtom.y + centerDistance * Math.sin(growthAngle));

  // Rotar el anillo para que el nodo 0 quede facing al átomo
  const rotationAngle = growthAngle + Math.PI / 2;

  return generateRing(preset, { x: centerX, y: centerY }, bondLength, rotationAngle);
}
