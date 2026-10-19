import { create } from 'zustand';

export type GameView = 'home' | 'workspace';
export type MetabolicRouteId = 'sandbox' | 'training' | 'glycolysis' | 'pdh';

interface GameState {
  currentView: GameView;
  activeRoute: MetabolicRouteId;
  activeMissionId: string | null;

  // Acciones de Navegación y Rutas
  setView: (view: GameView) => void;
  startRoute: (route: MetabolicRouteId) => void;
}

export const useGameStore = create<GameState>((set) => ({
  currentView: 'home',
  activeRoute: 'sandbox',
  activeMissionId: null,

  setView: (view) => set({ currentView: view }),

  startRoute: (route) =>
    set({
      currentView: 'workspace',
      activeRoute: route,
      activeMissionId: route === 'sandbox' ? null : `${route}_step_1`,
    }),
}));
