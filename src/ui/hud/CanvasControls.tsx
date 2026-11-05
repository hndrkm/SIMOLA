import React from 'react';
import {
  MousePointer2,
  Atom,
  Link2,
  Eraser,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Trash2,
  Zap,
} from 'lucide-react';
import { ToolType } from '../../core/model/types';
import { useCanvasStore } from '../../store/useCanvasStore';

export const CanvasControls: React.FC = () => {
  const activeTool = useCanvasStore((state) => state.activeTool);
  const stageScale = useCanvasStore((state) => state.stageScale);
  const past = useCanvasStore((state) => state.past);
  const future = useCanvasStore((state) => state.future);

  const setActiveTool = useCanvasStore((state) => state.setActiveTool);
  const undo = useCanvasStore((state) => state.undo);
  const redo = useCanvasStore((state) => state.redo);
  const zoomBy = useCanvasStore((state) => state.zoomBy);
  const resetView = useCanvasStore((state) => state.resetView);
  const clearGraph = useCanvasStore((state) => state.clearGraph);
  const selectedAtomId = useCanvasStore((state) => state.selectedAtomId);
  const graph = useCanvasStore((state) => state.graph);
  const setContextMenuAtom = useCanvasStore((state) => state.setContextMenuAtom);

  const selectedAtom = selectedAtomId ? graph.nodes[selectedAtomId] : null;

  const canUndo = past.length > 0;
  const canRedo = future.length > 0;

  const tools: Array<{ id: ToolType; label: string; icon: React.ReactNode; shortcut: string }> = [
    { id: 'select', label: 'Seleccionar / Mover', icon: <MousePointer2 className="w-4 h-4" />, shortcut: 'V' },
    { id: 'atom', label: 'Colocar Átomo', icon: <Atom className="w-4 h-4" />, shortcut: 'A' },
    { id: 'bond', label: 'Conectar Enlace', icon: <Link2 className="w-4 h-4" />, shortcut: 'B' },
    { id: 'eraser', label: 'Borrador', icon: <Eraser className="w-4 h-4" />, shortcut: 'E' },
  ];

  const handleClear = () => {
    if (window.confirm('¿Estás seguro de que deseas limpiar el lienzo? (Se conservarán los átomos bloqueados)')) {
      clearGraph();
    }
  };

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 select-none">
      <div className="cad-panel cad-corners px-3 py-2 rounded-lg flex items-center gap-1.5 shadow-lg bg-white border border-slate-300 text-slate-700">
        {/* Selector de Herramientas Principales */}
        <div className="flex items-center gap-1 pr-2 border-r border-slate-200">
          {tools.map((tool) => {
            const isActive = activeTool === tool.id;
            return (
              <button
                key={tool.id}
                id={`btn-tool-${tool.id}`}
                onClick={() => setActiveTool(tool.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition-all ${
                  isActive
                    ? 'bg-[#008477] text-white font-bold shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
                title={`${tool.label} [${tool.shortcut}]`}
              >
                {tool.icon}
                <span className="hidden sm:inline">{tool.label}</span>
                <span className="text-[10px] opacity-60 hidden md:inline">[{tool.shortcut}]</span>
              </button>
            );
          })}
        </div>

        {/* Acciones de Historial (Undo / Redo) */}
        <div className="flex items-center gap-1 px-2 border-r border-slate-200">
          <button
            id="btn-undo"
            onClick={undo}
            disabled={!canUndo}
            className={`p-1.5 rounded-md transition-all ${
              canUndo
                ? 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 active:scale-95'
                : 'text-slate-300 cursor-not-allowed'
            }`}
            title="Deshacer (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            id="btn-redo"
            onClick={redo}
            disabled={!canRedo}
            className={`p-1.5 rounded-md transition-all ${
              canRedo
                ? 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 active:scale-95'
                : 'text-slate-300 cursor-not-allowed'
            }`}
            title="Rehacer (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        {/* Acciones de Navegación (Zoom / Reset) */}
        <div className="flex items-center gap-1 px-2 border-r border-slate-200">
          <button
            id="btn-zoom-in"
            onClick={() => zoomBy(1.15)}
            className="p-1.5 rounded-md text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all active:scale-95"
            title="Acercar Zoom"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <span className="text-[10px] font-mono text-[#008477] min-w-[36px] text-center font-bold">
            {Math.round(stageScale * 100)}%
          </span>
          <button
            id="btn-zoom-out"
            onClick={() => zoomBy(0.85)}
            className="p-1.5 rounded-md text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all active:scale-95"
            title="Alejar Zoom"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            id="btn-reset-view"
            onClick={resetView}
            className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all"
            title="Restablecer vista a escala 100% (0)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Limpiar Lienzo */}
        <button
          id="btn-clear-canvas"
          onClick={handleClear}
          className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
          title="Limpiar lienzo (Conserva átomos bloqueados)"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        {/* Acceso Rápido al Átomo Seleccionado (Carga / Isótopos) */}
        {selectedAtom && (
          <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
            <button
              id="btn-edit-selected-atom"
              onClick={() => {
                setContextMenuAtom({
                  atomId: selectedAtom.id,
                  clientX: Math.min(window.innerWidth - 300, Math.max(20, Math.round(window.innerWidth / 2) - 140)),
                  clientY: Math.min(window.innerHeight - 380, Math.max(20, Math.round(window.innerHeight / 2) - 180)),
                });
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-[#008477]/10 hover:bg-[#008477]/20 text-[#008477] border border-[#008477]/30 transition-all active:scale-95 shadow-xs"
              title="Modificar carga formal o isótopos del átomo seleccionado"
            >
              <Zap className="w-3.5 h-3.5 text-[#D97706]" />
              <span>
                {selectedAtom.element}
                {selectedAtom.formalCharge !== 0 && (selectedAtom.formalCharge > 0 ? `⁺${selectedAtom.formalCharge}` : `⁻${Math.abs(selectedAtom.formalCharge)}`)}
                : Carga/Isótopo
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
