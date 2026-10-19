import React, { useEffect } from 'react';
import { MolecularCanvas } from './ui/canvas/MolecularCanvas';
import { ElementToolbar } from './ui/hud/ElementToolbar';
import { CanvasControls } from './ui/hud/CanvasControls';
import { TopBar } from './ui/hud/TopBar';
import { HomeView } from './ui/views/HomeView';
import { useCanvasStore } from './store/useCanvasStore';
import { useGameStore } from './store/useGameStore';
import { ElementSymbol } from './core/model/types';

export const App: React.FC = () => {
  const currentView = useGameStore((state) => state.currentView);

  const setActiveTool = useCanvasStore((state) => state.setActiveTool);
  const setActiveElement = useCanvasStore((state) => state.setActiveElement);
  const setActiveBondOrder = useCanvasStore((state) => state.setActiveBondOrder);
  const undo = useCanvasStore((state) => state.undo);
  const redo = useCanvasStore((state) => state.redo);
  const resetView = useCanvasStore((state) => state.resetView);
  const addAtom = useCanvasStore((state) => state.addAtom);
  const addBond = useCanvasStore((state) => state.addBond);
  const graph = useCanvasStore((state) => state.graph);

  // Precargar una molécula inicial didáctica (Etanol) en el primer render para demostración
  useEffect(() => {
    if (Object.keys(graph.nodes).length === 0) {
      const centerX = Math.round(window.innerWidth / 2) || 500;
      const centerY = Math.round(window.innerHeight / 2) || 350;

      // C1 - C2 - O - H
      const c1 = addAtom('C', centerX - 100, centerY);
      const c2 = addAtom('C', centerX, centerY);
      const o1 = addAtom('O', centerX + 80, centerY - 45);
      const h1 = addAtom('H', centerX + 150, centerY - 25);

      addBond(c1, c2, 1);
      addBond(c2, o1, 1);
      addBond(o1, h1, 1);
    }
  }, []);

  // Escuchador global de atajos de teclado para flujo ergonómico de escritorio
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignorar si estamos en la vista de inicio o escribiendo en un input
      if (
        currentView !== 'workspace' ||
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Atajos de Undo / Redo
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
        return;
      }

      const key = e.key.toUpperCase();

      // Atajos de Herramientas
      if (key === 'V') {
        setActiveTool('select');
      } else if (key === 'A') {
        setActiveTool('atom');
      } else if (key === 'B') {
        setActiveTool('bond');
      } else if (key === 'E') {
        setActiveTool('eraser');
      }
      // Atajos de Orden de Enlace
      else if (key === '1') {
        setActiveBondOrder(1);
        setActiveTool('bond');
      } else if (key === '2') {
        setActiveBondOrder(2);
        setActiveTool('bond');
      } else if (key === '3') {
        setActiveBondOrder(3);
        setActiveTool('bond');
      }
      // Atajos de Elementos Químicos
      else if (['C', 'H', 'O', 'N', 'P', 'S'].includes(key)) {
        setActiveElement(key as ElementSymbol);
        setActiveTool('atom');
      }
      // Restablecer Vista
      else if (key === '0') {
        resetView();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentView, undo, redo, resetView, setActiveTool, setActiveElement, setActiveBondOrder]);

  if (currentView === 'home') {
    return <HomeView />;
  }

  return (
    <main className="w-screen h-screen relative bg-[#0c1424] overflow-hidden font-sans">
      <TopBar />
      <ElementToolbar />
      <MolecularCanvas />
      <CanvasControls />
    </main>
  );
};

export default App;
