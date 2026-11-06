import React, { useMemo } from 'react';
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
  Sparkles,
  ShieldAlert,
  X,
} from 'lucide-react';
import { ToolType, ElementSymbol } from '../../core/model/types';
import { ELEMENT_NAMES } from '../../core/model/constants';
import { getElement, toSuperscript } from '../../core/model/periodicTable';
import { useCanvasStore } from '../../store/useCanvasStore';

const ISOTOPE_OPTIONS: Partial<Record<ElementSymbol, Array<{ mass: number; label: string; desc: string }>>> = {
  C: [
    { mass: 12, label: '¹²C', desc: 'Isótopo natural estable (98.9%)' },
    { mass: 13, label: '¹³C', desc: 'RMN y trazado isotópico' },
    { mass: 14, label: '¹⁴C', desc: 'Radiomarcaje metabólico (β⁻)' },
  ],
  H: [
    { mass: 1, label: '¹H', desc: 'Protio (> 99.9%)' },
    { mass: 2, label: '²H (D)', desc: 'Deuterio' },
    { mass: 3, label: '³H (T)', desc: 'Tritio (β⁻)' },
  ],
  P: [
    { mass: 31, label: '³¹P', desc: 'Fósforo natural (100%)' },
    { mass: 32, label: '³²P', desc: 'Radiomarcaje ATP (β⁻)' },
  ],
  O: [
    { mass: 16, label: '¹⁶O', desc: 'Oxígeno natural (99.7%)' },
    { mass: 18, label: '¹⁸O', desc: 'Trazador isotópico' },
  ],
  N: [
    { mass: 14, label: '¹⁴N', desc: 'Nitrógeno natural (99.6%)' },
    { mass: 15, label: '¹⁵N', desc: 'Marcaje RMN' },
  ],
  S: [
    { mass: 32, label: '³²S', desc: 'Azufre natural (95%)' },
    { mass: 35, label: '³⁵S', desc: 'Radiomarcaje Cys/Met' },
  ],
};

const FORMAL_CHARGES = [
  { value: -2, label: '−2', sub: 'Dianión / Fosfato (-PO₃²⁻)' },
  { value: -1, label: '−1', sub: 'Carboxilato (-COO⁻)' },
  { value: 0, label: '0', sub: 'Estado Neutro' },
  { value: 1, label: '+1', sub: 'Amonio (-NH₃⁺)' },
  { value: 2, label: '+2', sub: 'Catión Divalente (+2)' },
];

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
  const setSelectedAtom = useCanvasStore((state) => state.setSelectedAtom);
  const setAtomFormalCharge = useCanvasStore((state) => state.setAtomFormalCharge);
  const setAtomIsotope = useCanvasStore((state) => state.setAtomIsotope);

  const selectedAtom = selectedAtomId ? graph.nodes[selectedAtomId] : null;

  const isotopeList = useMemo(() => {
    if (!selectedAtom) return [];
    if (ISOTOPE_OPTIONS[selectedAtom.element]) {
      return ISOTOPE_OPTIONS[selectedAtom.element]!;
    }
    const elemData = getElement(selectedAtom.element);
    if (elemData?.keyIsotopes && elemData.keyIsotopes.length > 0) {
      return elemData.keyIsotopes.map((iso) => ({
        mass: iso.massNumber,
        label: iso.symbol || `${toSuperscript(iso.massNumber)}${selectedAtom.element}`,
        desc: iso.description || iso.name,
      }));
    }
    return [];
  }, [selectedAtom?.element]);

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
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 select-none max-w-[96vw]">
      {/* 1. Panel Dinámico Superior: Propiedades del Átomo Seleccionado (Carga Formal e Isótopos) */}
      {selectedAtom && (
        <div
          id="selected-atom-toolbar"
          className="cad-panel cad-corners px-3 py-1.5 rounded-lg flex flex-wrap items-center justify-center gap-2 sm:gap-3 shadow-xl bg-white border border-[#008477] text-slate-800 animate-fadeIn font-mono text-xs max-w-full"
        >
          {/* Identidad del Átomo */}
          <div className="flex items-center gap-2 pr-2 border-r border-slate-200">
            <div className="w-6 h-6 rounded bg-[#008477]/10 border border-[#008477]/30 flex items-center justify-center font-bold text-[#008477] text-xs shrink-0">
              {selectedAtom.element}
              {selectedAtom.isotope ? <sup className="text-[9px]">{selectedAtom.isotope}</sup> : null}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900 text-xs">
                {ELEMENT_NAMES[selectedAtom.element] || selectedAtom.element}
              </span>
              {selectedAtom.formalCharge !== 0 && (
                <span
                  className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                    selectedAtom.formalCharge < 0
                      ? 'bg-rose-100 text-rose-700 border border-rose-200'
                      : 'bg-sky-100 text-sky-700 border border-sky-200'
                  }`}
                >
                  {selectedAtom.formalCharge > 0 ? `+${selectedAtom.formalCharge}` : selectedAtom.formalCharge}
                </span>
              )}
              {selectedAtom.isLocked && (
                <span className="text-[10px] text-amber-700 bg-amber-50 px-1 py-0.2 rounded border border-amber-200 font-sans flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3 text-amber-600" />
                  Fijo
                </span>
              )}
            </div>
          </div>

          {/* Carga Formal Fisiológica (pH 7.4) */}
          <div className="flex items-center gap-1.5 pr-2 border-r border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 shrink-0">
              <Zap className="w-3.5 h-3.5 text-[#D97706]" />
              Carga (pH 7.4):
            </span>
            <div className="flex items-center gap-1">
              {FORMAL_CHARGES.map((ch) => {
                const isSelected = selectedAtom.formalCharge === ch.value;
                return (
                  <button
                    key={ch.value}
                    id={`btn-charge-${ch.value < 0 ? `neg${Math.abs(ch.value)}` : ch.value > 0 ? `pos${ch.value}` : 'zero'}`}
                    disabled={selectedAtom.isLocked}
                    onClick={() => setAtomFormalCharge(selectedAtom.id, ch.value)}
                    className={`px-2 py-0.5 rounded text-xs font-mono font-bold transition-all border ${
                      isSelected
                        ? ch.value < 0
                          ? 'bg-rose-500 text-white border-rose-600 shadow-xs'
                          : ch.value > 0
                          ? 'bg-sky-500 text-white border-sky-600 shadow-xs'
                          : 'bg-[#008477] text-white border-[#008477] shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                    } ${selectedAtom.isLocked ? 'opacity-40 cursor-not-allowed' : 'active:scale-95'}`}
                    title={ch.sub}
                  >
                    {ch.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Marcaje Isotópico */}
          <div className="flex items-center gap-1.5 pr-2 border-r border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-[#008477]" />
              Isótopo:
            </span>
            <div className="flex items-center gap-1">
              {/* Opción Natural Estándar */}
              <button
                disabled={selectedAtom.isLocked}
                onClick={() => setAtomIsotope(selectedAtom.id, undefined)}
                className={`px-2 py-0.5 rounded text-xs font-mono font-bold transition-all border ${
                  !selectedAtom.isotope
                    ? 'bg-[#008477] text-white border-[#008477] shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                } ${selectedAtom.isLocked ? 'opacity-40 cursor-not-allowed' : 'active:scale-95'}`}
                title="Abundancia natural estándar terrestre"
              >
                {selectedAtom.element} (Nat)
              </button>

              {/* Variantes Isotópicas Específicas */}
              {isotopeList.map((iso) => {
                const isSelected = selectedAtom.isotope === iso.mass;
                return (
                  <button
                    key={iso.mass}
                    id={`btn-isotope-${iso.mass}`}
                    disabled={selectedAtom.isLocked}
                    onClick={() => setAtomIsotope(selectedAtom.id, iso.mass)}
                    className={`px-2 py-0.5 rounded text-xs font-mono font-bold transition-all border ${
                      isSelected
                        ? 'bg-[#008477] text-white border-[#008477] shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                    } ${selectedAtom.isLocked ? 'opacity-40 cursor-not-allowed' : 'active:scale-95'}`}
                    title={`${iso.label}: ${iso.desc}`}
                  >
                    {iso.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Botón Cerrar Panel de Átomo */}
          <button
            onClick={() => setSelectedAtom(null)}
            className="p-1 rounded text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors shrink-0"
            title="Deseleccionar átomo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. Barra de Herramientas y Navegación Principal */}
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
      </div>
    </div>
  );
};
