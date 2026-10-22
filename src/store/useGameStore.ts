import { create } from 'zustand';
import {
  getMissionById,
  getNextMissionId,
  getMissionsByWorld,
} from '../data/missions/progressionMissions';
import { useCanvasStore } from './useCanvasStore';
import { MissionConfig, MetaboliteItem } from '../core/model/types';

export type GameView = 'home' | 'workspace';
export type MetabolicRouteId = 'sandbox' | 'training' | 'glycolysis' | 'pdh';

const STORAGE_KEY = 'simola_completed_missions';

function loadStoredCompletedMissions(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCompletedMissions(ids: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Ignore storage quota or disabled errors in testing environments
  }
}

interface GameState {
  currentView: GameView;
  activeRoute: MetabolicRouteId;
  currentMissionId: string | null;
  completedMissionIds: string[];
  attempts: Record<string, number>;
  activeCofactors: string[];
  isHintOpen: boolean;
  metaboliteReservoir: MetaboliteItem[];

  // Acciones de Navegación y Rutas
  setView: (view: GameView) => void;
  loadMission: (missionId: string) => void;
  loadNextMission: () => boolean;
  resetCurrentMission: () => void;
  completeCurrentMission: () => void;
  startRoute: (route: MetabolicRouteId) => void;
  startSandbox: () => void;
  recordAttempt: (missionId: string) => void;
  toggleHint: (open?: boolean) => void;
  getCurrentMission: () => MissionConfig | undefined;
  isMissionCompleted: (missionId: string) => boolean;
  addMetabolitesToReservoir: (
    items: Array<{ name: string; formula?: string; stoichiometry?: string }>,
    sourceMissionTitle?: string
  ) => void;
  clearProgress: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  currentView: 'home',
  activeRoute: 'sandbox',
  currentMissionId: null,
  completedMissionIds: loadStoredCompletedMissions(),
  attempts: {},
  activeCofactors: ['ATP', 'ADP', 'NAD+', 'NADH', 'Pi'],
  isHintOpen: false,
  metaboliteReservoir: [],

  setView: (view) => set({ currentView: view }),


  loadMission: (missionId: string) => {
    const mission = getMissionById(missionId);
    if (!mission) return;

    let route: MetabolicRouteId = 'training';
    if (mission.world === 2) route = 'glycolysis';
    else if (mission.world === 3) route = 'pdh';

    // Incrementar intentos
    const attempts = { ...get().attempts };
    attempts[missionId] = (attempts[missionId] || 0) + 1;

    // Cargar automáticamente initialGraph en useCanvasStore
    const canvasStore = useCanvasStore.getState();
    if (mission.initialGraph) {
      canvasStore.setGraph(mission.initialGraph);
    } else {
      canvasStore.clearGraph();
    }
    canvasStore.clearErrors();

    set({
      currentView: 'workspace',
      activeRoute: route,
      currentMissionId: missionId,
      attempts,
      isHintOpen: false,
    });
  },

  loadNextMission: () => {
    const { currentMissionId } = get();
    if (!currentMissionId) return false;
    const nextId = getNextMissionId(currentMissionId);
    if (nextId) {
      get().loadMission(nextId);
      return true;
    }
    return false;
  },

  resetCurrentMission: () => {
    const { currentMissionId } = get();
    if (!currentMissionId) {
      useCanvasStore.getState().clearGraph();
      return;
    }
    const mission = getMissionById(currentMissionId);
    const canvasStore = useCanvasStore.getState();
    if (mission?.initialGraph) {
      canvasStore.setGraph(mission.initialGraph);
    } else {
      canvasStore.clearGraph();
    }
    canvasStore.clearErrors();
  },

  completeCurrentMission: () => {
    const { currentMissionId, completedMissionIds } = get();
    if (!currentMissionId) return;

    if (!completedMissionIds.includes(currentMissionId)) {
      const updated = [...completedMissionIds, currentMissionId];
      saveCompletedMissions(updated);
      set({ completedMissionIds: updated });
    }
  },

  startRoute: (route) => {
    if (route === 'sandbox') {
      get().startSandbox();
      return;
    }

    let world: 1 | 2 | 3 = 1;
    if (route === 'glycolysis') world = 2;
    else if (route === 'pdh') world = 3;

    const worldMissions = getMissionsByWorld(world);
    if (worldMissions.length === 0) return;

    const completed = get().completedMissionIds;
    const firstIncomplete = worldMissions.find((m) => !completed.includes(m.id));
    const targetMission = firstIncomplete || worldMissions[0];

    get().loadMission(targetMission.id);
  },

  startSandbox: () => {
    // Al entrar al Laboratorio de Síntesis y Modelado, limpieza obligatoria total
    useCanvasStore.getState().clearCanvas();
    set({
      currentView: 'workspace',
      activeRoute: 'sandbox',
      currentMissionId: null,
      isHintOpen: false,
    });
  },

  recordAttempt: (missionId: string) => {
    const attempts = { ...get().attempts };
    attempts[missionId] = (attempts[missionId] || 0) + 1;
    set({ attempts });
  },

  toggleHint: (open) => {
    set((state) => ({
      isHintOpen: open !== undefined ? open : !state.isHintOpen,
    }));
  },

  getCurrentMission: () => {
    const { currentMissionId } = get();
    return currentMissionId ? getMissionById(currentMissionId) : undefined;
  },

  isMissionCompleted: (missionId: string) => {
    return get().completedMissionIds.includes(missionId);
  },

  addMetabolitesToReservoir: (items, sourceMissionTitle) => {
    const currentList = [...get().metaboliteReservoir];
    for (const item of items) {
      const existing = currentList.find((m) => m.name === item.name);
      if (existing) {
        existing.count += 1;
        if (item.stoichiometry) existing.stoichiometry = item.stoichiometry;
      } else {
        currentList.push({
          id: `metab_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          name: item.name,
          formula: item.formula,
          count: 1,
          stoichiometry: item.stoichiometry,
          sourceMissionTitle,
        });
      }
    }
    set({ metaboliteReservoir: currentList });
  },

  clearProgress: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignorar errores de sandbox
    }
    set({
      completedMissionIds: [],
      attempts: {},
      metaboliteReservoir: [],
    });
  },
}));

