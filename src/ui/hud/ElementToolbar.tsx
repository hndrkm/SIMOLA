import React, { useState } from 'react';
import {
  Table,
  Hexagon,
  Boxes,
  X,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { ElementSymbol, BondOrder } from '../../core/model/types';
import { CPK_COLORS, CPK_TEXT_COLORS, ELEMENT_NAMES, getMaxValence } from '../../core/model/constants';
import { toSuperscript } from '../../core/model/periodicTable';
import { RING_PRESETS, RingPreset, RingCategory } from '../../core/model/geometry';
import { useCanvasStore } from '../../store/useCanvasStore';
import { PeriodicTableModal } from '../modals/PeriodicTableModal';
import { FunctionalGroupsModal } from '../modals/FunctionalGroupsModal';

export const ElementToolbar: React.FC = () => {
  const activeTool = useCanvasStore((state) => state.activeTool);
  const activeElement = useCanvasStore((state) => state.activeElement);
  const activeIsotope = useCanvasStore((state) => state.activeIsotope);
  const recentElements = useCanvasStore((state) => state.recentElements);
  const activeBondOrder = useCanvasStore((state) => state.activeBondOrder);
  const activeRingPreset = useCanvasStore((state) => state.activeRingPreset);
  const activeTemplate = useCanvasStore((state) => state.activeTemplate);

  const setActiveElement = useCanvasStore((state) => state.setActiveElement);
  const setActiveTool = useCanvasStore((state) => state.setActiveTool);
  const setActiveBondOrder = useCanvasStore((state) => state.setActiveBondOrder);
  const setActiveRingPreset = useCanvasStore((state) => state.setActiveRingPreset);
  const setActiveTemplate = useCanvasStore((state) => state.setActiveTemplate);

  const [isPeriodicModalOpen, setPeriodicModalOpen] = useState(false);
  const [isFunctionalModalOpen, setFunctionalModalOpen] = useState(false);
  const [isRingMenuOpen, setRingMenuOpen] = useState(false);
  const [ringCategoryTab, setRingCategoryTab] = useState<RingCategory>('saturated');

  const handleSelectElement = (element: ElementSymbol) => {
    setActiveElement(element);
    setActiveTool('atom');
  };

  const handleSelectRingPreset = (preset: RingPreset) => {
    setActiveRingPreset(preset);
    setRingMenuOpen(false);
  };

  const filteredRings = RING_PRESETS.filter((r) => r.category === ringCategoryTab);

  return (
    <>
      <aside className="absolute left-4 top-20 z-20 flex flex-col gap-3 select-none">
        {/* Panel 1: Elementos Químicos Rápidos (Top 5) + Tabla Periódica */}
        <div className="glass-panel rounded-2xl p-3 flex flex-col gap-2 min-w-[145px] border border-slate-700/60 shadow-2xl">
          <div className="px-1 pb-1 border-b border-slate-700/50 flex items-center justify-between">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-400">
              Recientes
            </span>
            <span className="text-[10px] text-slate-500 font-mono">5 Rápidos</span>
          </div>

          <div className="flex flex-col gap-1.5">
            {recentElements.map((elem) => {
              const isSelected = activeTool === 'atom' && activeElement === elem;
              const cpk = CPK_COLORS[elem] || '#475569';
              const textCpk = CPK_TEXT_COLORS[elem] || '#ffffff';
              const valence = getMaxValence(elem);
              const hasIsotope = isSelected && activeIsotope !== undefined;

              return (
                <button
                  key={elem}
                  id={`btn-element-${elem.toLowerCase()}`}
                  onClick={() => handleSelectElement(elem)}
                  className={`group flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl transition-all duration-200 text-left ${
                    isSelected
                      ? 'bg-[#00A896]/20 border border-[#00A896]/60 shadow-md shadow-[#00A896]/20 scale-[1.02]'
                      : 'hover:bg-slate-800/60 border border-transparent hover:border-slate-700/60'
                  }`}
                  title={`${ELEMENT_NAMES[elem] || elem} (Valencia máx: ${valence})`}
                >
                  {/* Badge con color CPK */}
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shadow-inner flex-shrink-0 transition-transform group-hover:scale-110 relative"
                    style={{
                      backgroundColor: cpk,
                      color: textCpk,
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                  >
                    {hasIsotope && (
                      <span className="absolute -top-1 -left-1 text-[9px] font-mono text-[#F77F00] font-black">
                        {toSuperscript(activeIsotope!)}
                      </span>
                    )}
                    {elem}
                  </div>

                  {/* Nombre y valencia */}
                  <div className="flex flex-col">
                    <span className={`text-xs font-semibold ${isSelected ? 'text-[#00c7b2]' : 'text-slate-200'}`}>
                      {hasIsotope ? `${toSuperscript(activeIsotope!)}${elem}` : ELEMENT_NAMES[elem] || elem}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Val. máx: <strong className="text-slate-300">{valence}</strong>
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Botón Abrir Tabla Periódica */}
          <button
            id="btn-open-periodic-table"
            onClick={() => setPeriodicModalOpen(true)}
            className="mt-1 w-full py-2 px-2.5 rounded-xl text-xs font-semibold bg-slate-900/80 hover:bg-slate-800 text-[#00c7b2] border border-[#00A896]/30 hover:border-[#00A896]/70 flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
            title="Abrir Tabla Periódica Completa (118 Elementos e Isótopos)"
          >
            <Table className="w-3.5 h-3.5 text-[#00A896]" />
            <span>Tabla Periódica</span>
          </button>
        </div>

        {/* Panel 2: Motor de Anillos (3 a 8 Lados) y Heterociclos */}
        <div className="glass-panel rounded-2xl p-2.5 flex flex-col gap-2 min-w-[145px] border border-slate-700/60 shadow-2xl relative">
          <div className="px-1 pb-1 border-b border-slate-700/50 flex items-center justify-between">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-400">
              Anillos
            </span>
            <span className="text-[10px] text-slate-500 font-mono">3-8</span>
          </div>

          {/* Estado de Anillo Activo */}
          {activeTool === 'ring' && activeRingPreset ? (
            <div className="bg-[#00A896]/20 border border-[#00A896]/60 p-2 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-1.5 overflow-hidden">
                <Hexagon className="w-4 h-4 text-[#00A896] flex-shrink-0 animate-pulse" />
                <span className="text-[11px] font-bold text-[#00c7b2] truncate">
                  {activeRingPreset.name}
                </span>
              </div>
              <button
                onClick={() => {
                  setActiveRingPreset(null);
                  setActiveTool('atom');
                }}
                className="p-1 rounded text-slate-400 hover:text-white"
                title="Desactivar modo anillo"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              id="btn-open-rings-menu"
              onClick={() => setRingMenuOpen(!isRingMenuOpen)}
              className="py-2 px-2.5 rounded-xl text-xs font-semibold bg-slate-900/80 hover:bg-slate-800 text-[#00c7b2] border border-[#00A896]/30 hover:border-[#00A896]/70 flex items-center justify-between transition-all"
            >
              <div className="flex items-center gap-2">
                <Hexagon className="w-3.5 h-3.5 text-[#00A896]" />
                <span>Selector Anillos</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
          )}

          {/* Menú Flotante de Anillos */}
          {isRingMenuOpen && (
            <div className="absolute left-[105%] top-0 w-64 glass-panel p-3 rounded-2xl border border-slate-700 shadow-2xl bg-slate-900/95 flex flex-col gap-2 z-30 animate-fadeIn">
              <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                <span className="text-[11px] font-bold text-slate-200">Anillos Paramétricos</span>
                <button
                  onClick={() => setRingMenuOpen(false)}
                  className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Sub-tabs de Anillos */}
              <div className="grid grid-cols-3 gap-1 p-0.5 bg-slate-950/60 rounded-xl">
                {(['saturated', 'unsaturated', 'heterocycle'] as RingCategory[]).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setRingCategoryTab(cat)}
                    className={`py-1 text-[10px] font-semibold rounded-lg capitalize transition-all ${
                      ringCategoryTab === cat
                        ? 'bg-emerald-500 text-white shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cat === 'saturated' ? 'Simples' : cat === 'unsaturated' ? 'Dobles' : 'Hetero'}
                  </button>
                ))}
              </div>

              {/* Lista de presets */}
              <div className="max-h-56 overflow-y-auto flex flex-col gap-1 pr-1">
                {filteredRings.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectRingPreset(preset)}
                    className="p-2 rounded-xl text-left bg-slate-800/40 hover:bg-emerald-500/20 border border-slate-700/40 hover:border-emerald-400/50 flex flex-col transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200 group-hover:text-emerald-300">
                        {preset.name}
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-700/60 text-slate-400">
                        {preset.sides}L
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 leading-tight mt-0.5">
                      {preset.description}
                    </span>
                  </button>
                ))}
              </div>

              <span className="text-[9px] text-slate-500 italic text-center pt-1 border-t border-slate-800">
                Clic en lienzo para estampar o sobre un enlace para fusionar
              </span>
            </div>
          )}
        </div>

        {/* Panel 3: Plantillas y Grupos Funcionales */}
        <div className="glass-panel rounded-2xl p-2.5 flex flex-col gap-2 min-w-[145px] border border-slate-700/60 shadow-2xl">
          <div className="px-1 pb-1 border-b border-slate-700/50 flex items-center justify-between">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-400">
              Plantillas
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Modales</span>
          </div>

          {activeTool === 'template' && activeTemplate ? (
            <div className="bg-[#F77F00]/20 border border-[#F77F00]/60 p-2 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-1.5 overflow-hidden">
                <Sparkles className="w-4 h-4 text-[#F77F00] flex-shrink-0 animate-pulse" />
                <span className="text-[11px] font-bold text-[#ff941a] truncate">
                  {activeTemplate.abbreviation}
                </span>
              </div>
              <button
                onClick={() => {
                  setActiveTemplate(null);
                  setActiveTool('atom');
                }}
                className="p-1 rounded text-slate-400 hover:text-white"
                title="Desactivar modo plantilla"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              id="btn-open-functional-modal"
              onClick={() => setFunctionalModalOpen(true)}
              className="py-2 px-2.5 rounded-xl text-xs font-semibold bg-slate-900/80 hover:bg-slate-800 text-[#ff941a] border border-[#F77F00]/30 hover:border-[#F77F00]/70 flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
              title="Abrir Grupos Funcionales, Coenzimas y Esqueletos Base"
            >
              <Boxes className="w-3.5 h-3.5 text-[#F77F00]" />
              <span>Plantillas / G.F.</span>
            </button>
          )}
        </div>

        {/* Panel 4: Selector de Orden de Enlace por Defecto */}
        <div className="glass-panel rounded-2xl p-2.5 flex flex-col gap-2 min-w-[145px] border border-slate-700/60 shadow-2xl">
          <div className="px-1 pb-1 border-b border-slate-700/50">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-400">
              Tipo Enlace
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {([1, 2, 3] as BondOrder[]).map((order) => {
              const isSelected = activeBondOrder === order && activeTool === 'bond';
              const label = order === 1 ? '—' : order === 2 ? '═' : '≡';
              const name = order === 1 ? 'Simple' : order === 2 ? 'Doble' : 'Triple';

              return (
                <button
                  key={order}
                  id={`btn-bond-order-${order}`}
                  onClick={() => {
                    setActiveBondOrder(order);
                    setActiveTool('bond');
                  }}
                  className={`py-2 px-1 rounded-xl flex flex-col items-center justify-center font-mono font-bold transition-all ${
                    isSelected
                      ? 'bg-[#00A896]/25 border border-[#00A896]/60 text-[#00c7b2] shadow-md shadow-[#00A896]/30'
                      : 'bg-slate-900/60 hover:bg-slate-800 border border-slate-700/40 text-slate-300'
                  }`}
                  title={`Enlace ${name} (Orden ${order})`}
                >
                  <span className="text-base leading-none">{label}</span>
                  <span className="text-[9px] text-slate-400 mt-1 font-sans">{name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      {/* Modales */}
      <PeriodicTableModal
        isOpen={isPeriodicModalOpen}
        onClose={() => setPeriodicModalOpen(false)}
      />

      <FunctionalGroupsModal
        isOpen={isFunctionalModalOpen}
        onClose={() => setFunctionalModalOpen(false)}
      />
    </>
  );
};
