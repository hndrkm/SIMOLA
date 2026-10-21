import { MolecularGraph } from '../model/types';

/**
 * Traduce los nodos y aristas de un MolecularGraph al formato estándar
 * de columnas fijas MDL / Symyx CTAB MOL V2000.
 *
 * Características:
 * - Escala coordenadas (x, y) de píxeles a Ångströms aproximados (/ 50) e invierte el eje Y (-y).
 * - Genera líneas M  CHG para átomos con carga formal !== 0 (máx 8 pares por línea).
 * - Genera líneas M  ISO para átomos con isótopos definidos (máx 8 pares por línea).
 * - Termina con M  END.
 */
export function graphToMol(graph: MolecularGraph): string {
  const nodes = Object.values(graph.nodes);
  const edges = Object.values(graph.edges);

  const numAtoms = nodes.length;
  const numBonds = edges.length;

  // Mapa de ID de nodo a índice 1-based en el bloque de átomos
  const nodeIndexMap = new Map<string, number>();
  nodes.forEach((node, idx) => {
    nodeIndexMap.set(node.id, idx + 1);
  });

  const lines: string[] = [];

  // Línea 1: Nombre de la molécula
  lines.push('SIMOLA');
  // Línea 2: Información de creador y fecha (estilo CTAB)
  lines.push('  BioQuim  1019262D');
  // Línea 3: Comentarios
  lines.push('');

  // Línea 4: Counts line (V2000 estricto de columnas fijas)
  // aaabbblllfffcccsssxxxrrrpppiiimmmvvvvvv
  const pad3 = (num: number) => num.toString().padStart(3, ' ');
  const countsLine = `${pad3(numAtoms)}${pad3(numBonds)}  0  0  0  0  0  0  0  0999 V2000`;
  lines.push(countsLine);

  // Bloque de Átomos:
  // xxxxx.xxxxyyyyy.yyyyzzzzz.zzzz aaaabbcccsssfffjjjmmmgggpppcceee
  for (const node of nodes) {
    const x = (node.x / 50).toFixed(4).padStart(10, ' ');
    const y = (-node.y / 50).toFixed(4).padStart(10, ' ');
    const z = (0).toFixed(4).padStart(10, ' ');
    const sym = node.element.padEnd(3, ' ');

    const atomLine = `${x}${y}${z} ${sym} 0  0  0  0  0  0  0  0  0  0  0  0`;
    lines.push(atomLine);
  }

  // Bloque de Enlaces:
  // 111222tttsssxxxrrrccc
  for (const edge of edges) {
    const srcIdx = nodeIndexMap.get(edge.sourceId);
    const tgtIdx = nodeIndexMap.get(edge.targetId);

    if (srcIdx !== undefined && tgtIdx !== undefined) {
      const bSrc = pad3(srcIdx);
      const bTgt = pad3(tgtIdx);
      const bOrder = pad3(edge.order);

      const bondLine = `${bSrc}${bTgt}${bOrder}  0  0  0  0`;
      lines.push(bondLine);
    }
  }

  // Bloque de Propiedades:
  // 1. Líneas M  CHG para átomos con formalCharge !== 0
  const chargedAtoms: { index: number; charge: number }[] = [];
  nodes.forEach((node, idx) => {
    if (node.formalCharge !== 0) {
      chargedAtoms.push({ index: idx + 1, charge: node.formalCharge });
    }
  });

  if (chargedAtoms.length > 0) {
    // Máximo 8 pares por línea M  CHG
    for (let i = 0; i < chargedAtoms.length; i += 8) {
      const chunk = chargedAtoms.slice(i, i + 8);
      const countStr = chunk.length.toString().padStart(3, ' ');
      let line = `M  CHG${countStr}`;
      for (const item of chunk) {
        const atomIdx = item.index.toString().padStart(4, ' ');
        const chargeStr = item.charge.toString().padStart(4, ' ');
        line += `${atomIdx}${chargeStr}`;
      }
      lines.push(line);
    }
  }

  // 2. Líneas M  ISO para átomos con isótopo definido
  const isotopeAtoms: { index: number; isotope: number }[] = [];
  nodes.forEach((node, idx) => {
    if (node.isotope !== undefined && node.isotope > 0) {
      isotopeAtoms.push({ index: idx + 1, isotope: node.isotope });
    }
  });

  if (isotopeAtoms.length > 0) {
    // Máximo 8 pares por línea M  ISO
    for (let i = 0; i < isotopeAtoms.length; i += 8) {
      const chunk = isotopeAtoms.slice(i, i + 8);
      const countStr = chunk.length.toString().padStart(3, ' ');
      let line = `M  ISO${countStr}`;
      for (const item of chunk) {
        const atomIdx = item.index.toString().padStart(4, ' ');
        const isoStr = item.isotope.toString().padStart(4, ' ');
        line += `${atomIdx}${isoStr}`;
      }
      lines.push(line);
    }
  }

  // Cierre estricto de MOL V2000
  lines.push('M  END');

  return lines.join('\n');
}
