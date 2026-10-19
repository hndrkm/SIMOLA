import { create } from 'zustand';
import {
  AtomNode,
  BondEdge,
  BondOrder,
  ElementSymbol,
  MolecularGraph,
  ToolType,
} from '../core/model/types';
import {
  RingPreset,
  fuseRingOntoBond,
  generateRing,
  sproutRingOntoAtom,
} from '../core/model/geometry';
import {
  MolecularTemplate,
  sproutTemplate,
  stampTemplate,
} from '../core/model/templates';

interface CanvasState {
  // Estado del Grafo Molecular
  graph: MolecularGraph;

  // Herramientas y Parámetros Activos
  activeTool: ToolType;
  activeElement: ElementSymbol;
  recentElements: ElementSymbol[];
  activeIsotope?: number;
  activeBondOrder: BondOrder;
  activeRingPreset: RingPreset | null;
  activeTemplate: MolecularTemplate | null;

  // Navegación del Lienzo (Zoom y Paneo)
  stageScale: number;
  stagePosition: { x: number; y: number };

  // Interacción en Progreso
  pendingBondSourceId: string | null;
  cursorPosition: { x: number; y: number } | null;
  hoveredAtomId: string | null;
  hoveredBondId: string | null;

  // Historial de Estados (Undo / Redo)
  past: MolecularGraph[];
  future: MolecularGraph[];

  // Acciones de Selección de Herramienta
  setActiveTool: (tool: ToolType) => void;
  setActiveElement: (element: ElementSymbol, isotope?: number) => void;
  setRecentElements: (elements: ElementSymbol[]) => void;
  setActiveIsotope: (isotope?: number) => void;
  setActiveBondOrder: (order: BondOrder) => void;
  setActiveRingPreset: (preset: RingPreset | null) => void;
  setActiveTemplate: (template: MolecularTemplate | null) => void;

  // Acciones de Navegación del Lienzo
  setStageScale: (scale: number) => void;
  setStagePosition: (pos: { x: number; y: number }) => void;
  zoomBy: (factor: number, center?: { x: number; y: number }) => void;
  resetView: () => void;

  // Acciones de Hover
  setHoveredAtom: (atomId: string | null) => void;
  setHoveredBond: (bondId: string | null) => void;

  // Acciones de Enlace Temporal
  startPendingBond: (sourceId: string, initialCursor: { x: number; y: number }) => void;
  updateCursorPosition: (pos: { x: number; y: number } | null) => void;
  finishPendingBond: (targetId?: string) => void;
  cancelPendingBond: () => void;

  // Operaciones CRUD del Grafo Molecular (O(1))
  addAtom: (element: ElementSymbol, x: number, y: number, isotope?: number) => string;
  transmuteAtom: (atomId: string, newElement: ElementSymbol, isotope?: number) => void;
  modifyAtomFormalCharge: (atomId: string, delta: number) => void;
  setAtomFormalCharge: (atomId: string, charge: number) => void;
  setAtomIsotope: (atomId: string, isotope?: number) => void;
  startAtomMove: () => void;
  moveAtom: (atomId: string, x: number, y: number) => void;
  removeAtom: (atomId: string) => void;

  addBond: (sourceId: string, targetId: string, order?: BondOrder) => string | null;
  cycleBondOrder: (bondId: string) => void;
  removeBond: (bondId: string) => void;

  // Operaciones de Anillos y Plantillas
  stampRing: (preset: RingPreset, center: { x: number; y: number }) => string[];
  fuseRing: (bondId: string, preset: RingPreset) => string[] | null;
  sproutRing: (atomId: string, preset: RingPreset) => string[] | null;
  stampTemplateAt: (template: MolecularTemplate, center: { x: number; y: number }) => string[];
  sproutTemplateAt: (targetAtomId: string, template: MolecularTemplate) => string[] | null;

  // Gestión Global del Grafo
  setGraph: (graph: MolecularGraph) => void;
  clearGraph: () => void;

  // Historial
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  // Gestión de Errores Visuales
  setAtomErrors: (affectedAtomIds: string[]) => void;
  clearErrors: () => void;
}

const MAX_HISTORY_STEPS = 50;

/**
 * Clona profundamente el grafo para preservar la inmutabilidad del historial.
 */
function cloneGraph(graph: MolecularGraph): MolecularGraph {
  const nodes: Record<string, AtomNode> = {};
  for (const key of Object.keys(graph.nodes)) {
    nodes[key] = { ...graph.nodes[key] };
  }
  const edges: Record<string, BondEdge> = {};
  for (const key of Object.keys(graph.edges)) {
    edges[key] = { ...graph.edges[key] };
  }
  return { nodes, edges };
}

/**
 * Busca si ya existe un enlace entre dos átomos (en cualquier dirección).
 */
function findExistingEdge(edges: Record<string, BondEdge>, idA: string, idB: string): BondEdge | undefined {
  return Object.values(edges).find(
    (e) => (e.sourceId === idA && e.targetId === idB) || (e.sourceId === idB && e.targetId === idA)
  );
}

let atomIdCounter = 1;
let bondIdCounter = 1;

export const useCanvasStore = create<CanvasState>((set, get) => ({
  graph: {
    nodes: {},
    edges: {},
  },
  activeTool: 'atom',
  activeElement: 'C',
  recentElements: ['C', 'H', 'O', 'N', 'P'],
  activeIsotope: undefined,
  activeBondOrder: 1,
  activeRingPreset: null,
  activeTemplate: null,

  stageScale: 1,
  stagePosition: { x: 0, y: 0 },

  pendingBondSourceId: null,
  cursorPosition: null,
  hoveredAtomId: null,
  hoveredBondId: null,

  past: [],
  future: [],

  setActiveTool: (tool) => {
    // Al cambiar de herramienta, limpiar cualquier enlace temporal pendiente
    set({
      activeTool: tool,
      pendingBondSourceId: null,
      cursorPosition: null,
    });
  },

  setActiveElement: (element, isotope) => {
    const { recentElements } = get();
    const filtered = recentElements.filter((e) => e !== element);
    const updatedRecent = [element, ...filtered].slice(0, 5);

    set({
      activeElement: element,
      activeIsotope: isotope,
      recentElements: updatedRecent,
    });
  },

  setRecentElements: (recentElements) => set({ recentElements: recentElements.slice(0, 5) }),
  setActiveIsotope: (activeIsotope) => set({ activeIsotope }),
  setActiveBondOrder: (order) => set({ activeBondOrder: order }),
  setActiveRingPreset: (activeRingPreset) =>
    set({
      activeRingPreset,
      activeTool: activeRingPreset ? 'ring' : 'atom',
      pendingBondSourceId: null,
      cursorPosition: null,
    }),
  setActiveTemplate: (activeTemplate) =>
    set({
      activeTemplate,
      activeTool: activeTemplate ? 'template' : 'atom',
      pendingBondSourceId: null,
      cursorPosition: null,
    }),

  setStageScale: (stageScale) => set({ stageScale: Math.max(0.2, Math.min(4, stageScale)) }),
  setStagePosition: (stagePosition) => set({ stagePosition }),

  zoomBy: (factor, center) => {
    const { stageScale, stagePosition } = get();
    const newScale = Math.max(0.2, Math.min(4, stageScale * factor));

    if (!center) {
      set({ stageScale: newScale });
      return;
    }

    // Zoom centrado en el punto del cursor
    const mousePointTo = {
      x: (center.x - stagePosition.x) / stageScale,
      y: (center.y - stagePosition.y) / stageScale,
    };

    const newPosition = {
      x: center.x - mousePointTo.x * newScale,
      y: center.y - mousePointTo.y * newScale,
    };

    set({ stageScale: newScale, stagePosition: newPosition });
  },

  resetView: () => set({ stageScale: 1, stagePosition: { x: 0, y: 0 } }),

  setHoveredAtom: (atomId) => set({ hoveredAtomId: atomId }),
  setHoveredBond: (bondId) => set({ hoveredBondId: bondId }),

  startPendingBond: (sourceId, initialCursor) => {
    const { graph } = get();
    if (!graph.nodes[sourceId]) return;
    set({
      pendingBondSourceId: sourceId,
      cursorPosition: initialCursor,
    });
  },

  updateCursorPosition: (pos) => set({ cursorPosition: pos }),

  finishPendingBond: (targetId) => {
    const { pendingBondSourceId, activeBondOrder } = get();
    if (pendingBondSourceId && targetId && pendingBondSourceId !== targetId) {
      get().addBond(pendingBondSourceId, targetId, activeBondOrder);
    }
    // Limpieza garantizada del estado temporal (Auditoría A3.3)
    set({
      pendingBondSourceId: null,
      cursorPosition: null,
    });
  },

  cancelPendingBond: () => {
    // Limpieza de eventos temporales (Auditoría A3.3)
    set({
      pendingBondSourceId: null,
      cursorPosition: null,
    });
  },

  addAtom: (element, x, y, isotope) => {
    const { graph, past, activeIsotope } = get();
    const newId = `atom_${Date.now()}_${atomIdCounter++}`;

    const newAtom: AtomNode = {
      id: newId,
      element,
      formalCharge: 0,
      x,
      y,
      isotope: isotope !== undefined ? isotope : activeIsotope,
    };

    const nextGraph: MolecularGraph = {
      nodes: {
        ...graph.nodes,
        [newId]: newAtom,
      },
      edges: { ...graph.edges },
    };

    set({
      graph: nextGraph,
      past: [...past.slice(-(MAX_HISTORY_STEPS - 1)), cloneGraph(graph)],
      future: [],
    });

    return newId;
  },

  transmuteAtom: (atomId, newElement, isotope) => {
    const { graph, past, activeIsotope } = get();
    const targetNode = graph.nodes[atomId];
    if (!targetNode) return;

    // Regla A2.3: Inmutabilidad de nodos bloqueados
    if (targetNode.isLocked) return;

    const targetIsotope = isotope !== undefined ? isotope : activeIsotope;
    if (targetNode.element === newElement && targetNode.isotope === targetIsotope) return;

    const nextGraph: MolecularGraph = {
      nodes: {
        ...graph.nodes,
        [atomId]: {
          ...targetNode,
          element: newElement,
          isotope: targetIsotope,
          hasError: false, // Limpiar error al modificar
        },
      },
      edges: { ...graph.edges },
    };

    set({
      graph: nextGraph,
      past: [...past.slice(-(MAX_HISTORY_STEPS - 1)), cloneGraph(graph)],
      future: [],
    });
  },

  modifyAtomFormalCharge: (atomId, delta) => {
    const { graph, past } = get();
    const targetNode = graph.nodes[atomId];
    if (!targetNode || targetNode.isLocked) return;

    const nextCharge = Math.max(-4, Math.min(4, targetNode.formalCharge + delta));
    if (nextCharge === targetNode.formalCharge) return;

    const nextGraph: MolecularGraph = {
      nodes: {
        ...graph.nodes,
        [atomId]: {
          ...targetNode,
          formalCharge: nextCharge,
          hasError: false,
        },
      },
      edges: { ...graph.edges },
    };

    set({
      graph: nextGraph,
      past: [...past.slice(-(MAX_HISTORY_STEPS - 1)), cloneGraph(graph)],
      future: [],
    });
  },

  setAtomFormalCharge: (atomId, charge) => {
    const { graph, past } = get();
    const targetNode = graph.nodes[atomId];
    if (!targetNode || targetNode.isLocked) return;

    const nextCharge = Math.max(-4, Math.min(4, charge));
    if (nextCharge === targetNode.formalCharge) return;

    const nextGraph: MolecularGraph = {
      nodes: {
        ...graph.nodes,
        [atomId]: {
          ...targetNode,
          formalCharge: nextCharge,
          hasError: false,
        },
      },
      edges: { ...graph.edges },
    };

    set({
      graph: nextGraph,
      past: [...past.slice(-(MAX_HISTORY_STEPS - 1)), cloneGraph(graph)],
      future: [],
    });
  },

  setAtomIsotope: (atomId, isotope) => {
    const { graph, past } = get();
    const targetNode = graph.nodes[atomId];
    if (!targetNode || targetNode.isLocked) return;

    const nextGraph: MolecularGraph = {
      nodes: {
        ...graph.nodes,
        [atomId]: {
          ...targetNode,
          isotope,
          hasError: false,
        },
      },
      edges: { ...graph.edges },
    };

    set({
      graph: nextGraph,
      past: [...past.slice(-(MAX_HISTORY_STEPS - 1)), cloneGraph(graph)],
      future: [],
    });
  },

  startAtomMove: () => {
    const { graph, past } = get();
    set({
      past: [...past.slice(-(MAX_HISTORY_STEPS - 1)), cloneGraph(graph)],
      future: [],
    });
  },

  moveAtom: (atomId, x, y) => {
    const { graph } = get();
    const targetNode = graph.nodes[atomId];
    if (!targetNode) return;

    // Actualización directa a 60 FPS (permitido incluso si isLocked para reacomodar lienzo)
    set({
      graph: {
        nodes: {
          ...graph.nodes,
          [atomId]: {
            ...targetNode,
            x,
            y,
          },
        },
        edges: graph.edges,
      },
    });
  },

  removeAtom: (atomId) => {
    const { graph, past } = get();
    const targetNode = graph.nodes[atomId];
    if (!targetNode) return;

    // Regla A2.3: Inmutabilidad de nodos bloqueados
    if (targetNode.isLocked) return;

    // Regla A2.1: Cero aristas huérfanas (Borrado en cascada en O(E))
    const nextNodes = { ...graph.nodes };
    delete nextNodes[atomId];

    const nextEdges: Record<string, BondEdge> = {};
    for (const [edgeId, edge] of Object.entries(graph.edges)) {
      if (edge.sourceId !== atomId && edge.targetId !== atomId) {
        nextEdges[edgeId] = edge;
      }
    }

    const nextGraph: MolecularGraph = {
      nodes: nextNodes,
      edges: nextEdges,
    };

    set({
      graph: nextGraph,
      past: [...past.slice(-(MAX_HISTORY_STEPS - 1)), cloneGraph(graph)],
      future: [],
    });
  },

  addBond: (sourceId, targetId, order = 1) => {
    const { graph, past } = get();

    // Regla A2.2: Cero bucles (source !== target)
    if (sourceId === targetId) return null;

    // Verificar existencia de ambos nodos
    if (!graph.nodes[sourceId] || !graph.nodes[targetId]) return null;

    // Regla A2.2: Cero duplicados (verificar si ya existe enlace A-B o B-A)
    const existingEdge = findExistingEdge(graph.edges, sourceId, targetId);
    if (existingEdge) {
      // Si ya existe y está bloqueado, no mutar
      if (existingEdge.isLocked) return existingEdge.id;

      // Ciclar o actualizar orden
      const nextGraph: MolecularGraph = {
        nodes: { ...graph.nodes },
        edges: {
          ...graph.edges,
          [existingEdge.id]: {
            ...existingEdge,
            order,
          },
        },
      };

      set({
        graph: nextGraph,
        past: [...past.slice(-(MAX_HISTORY_STEPS - 1)), cloneGraph(graph)],
        future: [],
      });

      return existingEdge.id;
    }

    // Crear nuevo enlace
    const newBondId = `bond_${Date.now()}_${bondIdCounter++}`;
    const newEdge: BondEdge = {
      id: newBondId,
      sourceId,
      targetId,
      order,
    };

    const nextGraph: MolecularGraph = {
      nodes: { ...graph.nodes },
      edges: {
        ...graph.edges,
        [newBondId]: newEdge,
      },
    };

    set({
      graph: nextGraph,
      past: [...past.slice(-(MAX_HISTORY_STEPS - 1)), cloneGraph(graph)],
      future: [],
    });

    return newBondId;
  },

  cycleBondOrder: (bondId) => {
    const { graph, past } = get();
    const existingEdge = graph.edges[bondId];
    if (!existingEdge) return;

    // Regla A2.3: Inmutabilidad si está bloqueado
    if (existingEdge.isLocked) return;

    // Ciclo determinista: 1 -> 2 -> 3 -> 1
    const nextOrder: BondOrder = existingEdge.order === 1 ? 2 : existingEdge.order === 2 ? 3 : 1;

    const nextGraph: MolecularGraph = {
      nodes: { ...graph.nodes },
      edges: {
        ...graph.edges,
        [bondId]: {
          ...existingEdge,
          order: nextOrder,
        },
      },
    };

    set({
      graph: nextGraph,
      past: [...past.slice(-(MAX_HISTORY_STEPS - 1)), cloneGraph(graph)],
      future: [],
    });
  },

  removeBond: (bondId) => {
    const { graph, past } = get();
    const existingEdge = graph.edges[bondId];
    if (!existingEdge) return;

    // Regla A2.3: Inmutabilidad si está bloqueado
    if (existingEdge.isLocked) return;

    const nextEdges = { ...graph.edges };
    delete nextEdges[bondId];

    const nextGraph: MolecularGraph = {
      nodes: { ...graph.nodes },
      edges: nextEdges,
    };

    set({
      graph: nextGraph,
      past: [...past.slice(-(MAX_HISTORY_STEPS - 1)), cloneGraph(graph)],
      future: [],
    });
  },

  stampRing: (preset, center) => {
    const { graph, past } = get();
    const ringData = generateRing(preset, center);
    const nextNodes = { ...graph.nodes };
    const nextEdges = { ...graph.edges };
    const tempToRealId: Record<string, string> = {};

    for (const node of ringData.nodes) {
      const realId = `atom_${Date.now()}_${atomIdCounter++}`;
      tempToRealId[node.tempId] = realId;
      nextNodes[realId] = {
        id: realId,
        element: node.element,
        formalCharge: node.formalCharge,
        x: node.x,
        y: node.y,
      };
    }

    for (const edge of ringData.edges) {
      const realEdgeId = `bond_${Date.now()}_${bondIdCounter++}`;
      const sId = tempToRealId[edge.sourceTempId];
      const tId = tempToRealId[edge.targetTempId];
      nextEdges[realEdgeId] = {
        id: realEdgeId,
        sourceId: sId,
        targetId: tId,
        order: edge.order,
      };
    }

    set({
      graph: { nodes: nextNodes, edges: nextEdges },
      past: [...past.slice(-(MAX_HISTORY_STEPS - 1)), cloneGraph(graph)],
      future: [],
    });

    return Object.values(tempToRealId);
  },

  fuseRing: (bondId, preset) => {
    const { graph, past } = get();
    const fusion = fuseRingOntoBond(graph, bondId, preset);
    if (!fusion) return null;

    const nextNodes = { ...graph.nodes };
    const nextEdges = { ...graph.edges };
    const newCreatedIds: string[] = [];
    const tempIdxToRealId: Record<number, string> = {};

    fusion.newNodes.forEach((node, idx) => {
      const realId = `atom_${Date.now()}_${atomIdCounter++}`;
      tempIdxToRealId[idx] = realId;
      newCreatedIds.push(realId);
      nextNodes[realId] = {
        id: realId,
        element: node.element,
        formalCharge: node.formalCharge,
        x: node.x,
        y: node.y,
      };
    });

    for (const edge of fusion.newEdges) {
      const sId = typeof edge.sourceId === 'number' ? tempIdxToRealId[edge.sourceId] : edge.sourceId;
      const tId = typeof edge.targetId === 'number' ? tempIdxToRealId[edge.targetId] : edge.targetId;

      if (!findExistingEdge(nextEdges, sId, tId)) {
        const realEdgeId = `bond_${Date.now()}_${bondIdCounter++}`;
        nextEdges[realEdgeId] = {
          id: realEdgeId,
          sourceId: sId,
          targetId: tId,
          order: edge.order,
        };
      }
    }

    set({
      graph: { nodes: nextNodes, edges: nextEdges },
      past: [...past.slice(-(MAX_HISTORY_STEPS - 1)), cloneGraph(graph)],
      future: [],
    });

    return newCreatedIds;
  },

  sproutRing: (atomId, preset) => {
    const { graph, past } = get();
    const targetAtom = graph.nodes[atomId];
    if (!targetAtom) return null;

    const sprouted = sproutRingOntoAtom(graph, atomId, preset);
    if (!sprouted) return null;

    const nextNodes = { ...graph.nodes };
    const nextEdges = { ...graph.edges };
    const tempToRealId: Record<string, string> = {};
    const newCreatedIds: string[] = [];

    for (const node of sprouted.nodes) {
      const realId = `atom_${Date.now()}_${atomIdCounter++}`;
      tempToRealId[node.tempId] = realId;
      newCreatedIds.push(realId);
      nextNodes[realId] = {
        id: realId,
        element: node.element,
        formalCharge: node.formalCharge,
        x: node.x,
        y: node.y,
      };
    }

    for (const edge of sprouted.edges) {
      const realEdgeId = `bond_${Date.now()}_${bondIdCounter++}`;
      const sId = tempToRealId[edge.sourceTempId];
      const tId = tempToRealId[edge.targetTempId];
      nextEdges[realEdgeId] = {
        id: realEdgeId,
        sourceId: sId,
        targetId: tId,
        order: edge.order,
      };
    }

    const connectId = `bond_${Date.now()}_${bondIdCounter++}`;
    nextEdges[connectId] = {
      id: connectId,
      sourceId: atomId,
      targetId: tempToRealId['node_0'],
      order: 1,
    };

    set({
      graph: { nodes: nextNodes, edges: nextEdges },
      past: [...past.slice(-(MAX_HISTORY_STEPS - 1)), cloneGraph(graph)],
      future: [],
    });

    return newCreatedIds;
  },

  stampTemplateAt: (template, center) => {
    const { graph, past } = get();
    const stamped = stampTemplate(template, center);
    const nextNodes = { ...graph.nodes };
    const nextEdges = { ...graph.edges };
    const tempToRealId: Record<string, string> = {};
    const newCreatedIds: string[] = [];

    for (const node of stamped.nodes) {
      const realId = `atom_${Date.now()}_${atomIdCounter++}`;
      tempToRealId[node.tempId] = realId;
      newCreatedIds.push(realId);
      nextNodes[realId] = {
        id: realId,
        element: node.element,
        formalCharge: node.formalCharge,
        x: node.x,
        y: node.y,
      };
    }

    for (const edge of stamped.edges) {
      const realEdgeId = `bond_${Date.now()}_${bondIdCounter++}`;
      const sId = tempToRealId[edge.sourceTempId];
      const tId = tempToRealId[edge.targetTempId];
      nextEdges[realEdgeId] = {
        id: realEdgeId,
        sourceId: sId,
        targetId: tId,
        order: edge.order,
      };
    }

    set({
      graph: { nodes: nextNodes, edges: nextEdges },
      past: [...past.slice(-(MAX_HISTORY_STEPS - 1)), cloneGraph(graph)],
      future: [],
    });

    return newCreatedIds;
  },

  sproutTemplateAt: (targetAtomId, template) => {
    const { graph, past } = get();
    const sprouted = sproutTemplate(graph, targetAtomId, template);
    if (!sprouted) return null;

    const nextNodes = { ...graph.nodes };
    const nextEdges = { ...graph.edges };
    const tempToRealId: Record<string, string> = {};
    const newCreatedIds: string[] = [];

    for (const node of sprouted.nodes) {
      const realId = `atom_${Date.now()}_${atomIdCounter++}`;
      tempToRealId[node.tempId] = realId;
      newCreatedIds.push(realId);
      nextNodes[realId] = {
        id: realId,
        element: node.element,
        formalCharge: node.formalCharge,
        x: node.x,
        y: node.y,
      };
    }

    for (const edge of sprouted.edges) {
      const realEdgeId = `bond_${Date.now()}_${bondIdCounter++}`;
      const sId = tempToRealId[edge.sourceTempId];
      const tId = tempToRealId[edge.targetTempId];
      nextEdges[realEdgeId] = {
        id: realEdgeId,
        sourceId: sId,
        targetId: tId,
        order: edge.order,
      };
    }

    const connectEdgeId = `bond_${Date.now()}_${bondIdCounter++}`;
    const attachRealId = tempToRealId[sprouted.connectingEdge.targetTempId];
    nextEdges[connectEdgeId] = {
      id: connectEdgeId,
      sourceId: targetAtomId,
      targetId: attachRealId,
      order: sprouted.connectingEdge.order,
    };

    set({
      graph: { nodes: nextNodes, edges: nextEdges },
      past: [...past.slice(-(MAX_HISTORY_STEPS - 1)), cloneGraph(graph)],
      future: [],
    });

    return newCreatedIds;
  },

  setGraph: (newGraph) => {
    const { graph, past } = get();
    set({
      graph: cloneGraph(newGraph),
      past: [...past.slice(-(MAX_HISTORY_STEPS - 1)), cloneGraph(graph)],
      future: [],
    });
  },

  clearGraph: () => {
    const { graph, past } = get();
    // Respetar nodos o enlaces bloqueados si los hay
    const retainedNodes: Record<string, AtomNode> = {};
    for (const [id, node] of Object.entries(graph.nodes)) {
      if (node.isLocked) retainedNodes[id] = node;
    }
    const retainedEdges: Record<string, BondEdge> = {};
    for (const [id, edge] of Object.entries(graph.edges)) {
      if (edge.isLocked && retainedNodes[edge.sourceId] && retainedNodes[edge.targetId]) {
        retainedEdges[id] = edge;
      }
    }

    set({
      graph: {
        nodes: retainedNodes,
        edges: retainedEdges,
      },
      past: [...past.slice(-(MAX_HISTORY_STEPS - 1)), cloneGraph(graph)],
      future: [],
    });
  },

  undo: () => {
    const { past, future, graph } = get();
    if (past.length === 0) return;

    const previousGraph = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);

    set({
      graph: previousGraph,
      past: newPast,
      future: [cloneGraph(graph), ...future.slice(0, MAX_HISTORY_STEPS - 1)],
    });
  },

  redo: () => {
    const { past, future, graph } = get();
    if (future.length === 0) return;

    const nextGraph = future[0];
    const newFuture = future.slice(1);

    set({
      graph: nextGraph,
      past: [...past.slice(-(MAX_HISTORY_STEPS - 1)), cloneGraph(graph)],
      future: newFuture,
    });
  },

  canUndo: () => get().past.length > 0,
  canRedo: () => get().future.length > 0,

  setAtomErrors: (affectedAtomIds) => {
    const { graph } = get();
    const errorSet = new Set(affectedAtomIds);
    let changed = false;

    const newNodes: Record<string, AtomNode> = {};
    for (const [id, node] of Object.entries(graph.nodes)) {
      const shouldHaveError = errorSet.has(id);
      if (node.hasError !== shouldHaveError) {
        changed = true;
        newNodes[id] = { ...node, hasError: shouldHaveError };
      } else {
        newNodes[id] = node;
      }
    }

    if (changed) {
      set({
        graph: {
          nodes: newNodes,
          edges: graph.edges,
        },
      });
    }
  },

  clearErrors: () => {
    const { graph } = get();
    let hasAnyError = false;
    for (const node of Object.values(graph.nodes)) {
      if (node.hasError) {
        hasAnyError = true;
        break;
      }
    }

    if (!hasAnyError) return;

    const newNodes: Record<string, AtomNode> = {};
    for (const [id, node] of Object.entries(graph.nodes)) {
      newNodes[id] = { ...node, hasError: false };
    }

    set({
      graph: {
        nodes: newNodes,
        edges: graph.edges,
      },
    });
  },
}));
