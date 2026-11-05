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
import { CPK_COLORS, ELEMENT_NAMES, getMaxValence } from '../../core/model/constants';
import { toSuperscript } from '../../core/model/periodicTable';
import { RING_PRESETS, RingPreset, RingCategory } from '../../core/model/geometry';
import { useCanvasStore } from '../../store/useCanvasStore';
import { PeriodicTableModal } from '../modals/PeriodicTableModal';
import { FunctionalGroupsModal } from '../modals/FunctionalGroupsModal';

function getElementBadgeStyles(elem: ElementSymbol) {
  const cpk = CPK_COLORS[elem] || '#64748B';
  let textColor = '#0F172A';
  if (elem === 'O') textColor = '#B91C1C';
  else if (elem === 'N') textColor = '#1D4ED8';
  else if (elem === 'P') textColor = '#B45309';
  else if (elem === 'S') textColor = '#854D0E';
  else if (elem === 'Cl' || elem === 'F') textColor = '#047857';
  else if (elem === 'H') textColor = '#334155';

  return {
    backgroundColor: '#FFFFFF',
    color: textColor,
    borderColor: cpk === '#FFFFFF' ? '#94A3B8' : cpk,
  };
}

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
        <div className="cad-panel cad-corners rounded-lg p-2.5 flex flex-col gap-2 min-w-[145px] shadow-lg bg-white border border-slate-300 text-slate-800">
          <div className="px-1 pb-1 border-b border-slate-200 flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-[#008477]">
              Recientes
            </span>
            <span className="text-[10px] text-slate-400 font-mono">5 Top</span>
          </div>

          <div className="flex flex-col gap-1">
            {recentElements.map((elem) => {
              const isSelected = activeTool === 'atom' && activeElement === elem;
              const badgeStyle = getElementBadgeStyles(elem);
              const valence = getMaxValence(elem);
              const hasIsotope = isSelected && activeIsotope !== undefined;

              return (
                <button
                  key={elem}
                  id={`btn-element-${elem.toLowerCase()}`}
                  onClick={() => handleSelectElement(elem)}
                  className={`group flex items-center gap-2 px-2 py-1 rounded-md transition-all duration-150 text-left border ${
                    isSelected
                      ? 'bg-[#008477]/10 border-[#008477] shadow-xs'
                      : 'hover:bg-slate-100 border-transparent hover:border-slate-200'
                  }`}
                  title={`${ELEMENT_NAMES[elem] || elem} (Valencia máx: ${valence})`}
                >
                  {/* Badge con código CPK Wireframe */}
                  <div
                    className="w-6 h-6 rounded flex items-center justify-center font-mono font-bold text-xs shadow-xs shrink-0 relative border-2"
                    style={{
                      backgroundColor: badgeStyle.backgroundColor,
                      color: badgeStyle.color,
                      borderColor: badgeStyle.borderColor,
                    }}
                  >
                    {hasIsotope && (
                      <span className="absolute -top-1 -left-1 text-[8px] font-mono text-[#D97706] font-black">
                        {toSuperscript(activeIsotope!)}
                      </span>
                    )}
                    {elem}
                  </div>

                  {/* Nombre y valencia */}
                  <div className="flex flex-col min-w-0">
                    <span className={`text-xs font-mono font-bold truncate ${isSelected ? 'text-[#008477]' : 'text-slate-800'}`}>
                      {hasIsotope ? `${toSuperscript(activeIsotope!)}${elem}` : elem}
                    </span>
                    <span className="text-[9px] font-mono text-slate-500">
                      Val: {valence}
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
            className="mt-0.5 w-full py-1.5 px-2 rounded-md text-[11px] font-mono font-bold bg-white hover:bg-slate-50 text-[#008477] border border-slate-300 hover:border-[#008477] flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-xs"
            title="Abrir Tabla Periódica Completa (118 Elementos e Isótopos)"
          >
            <Table className="w-3.5 h-3.5 text-[#008477]" />
            <span>Tabla Periódica</span>
          </button>
        </div>

        {/* Panel 2: Motor de Anillos (3 a 8 Lados) y Heterociclos */}
        <div className="cad-panel cad-corners rounded-lg p-2.5 flex flex-col gap-1.5 min-w-[145px] shadow-lg bg-white border border-slate-300 text-slate-800 relative">
          <div className="px-1 pb-1 border-b border-slate-200 flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-[#008477]">
              Anillos
            </span>
            <span className="text-[10px] text-slate-400 font-mono">3-8 L</span>
          </div>

          {/* Estado de Anillo Activo */}
          {activeTool === 'ring' && activeRingPreset ? (
            <div className="bg-[#008477]/10 border border-[#008477] p-1.5 rounded-md flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-1.5 overflow-hidden">
                <Hexagon className="w-3.5 h-3.5 text-[#008477] shrink-0 animate-pulse" />
                <span className="text-[10px] font-mono font-bold text-[#008477] truncate">
                  {activeRingPreset.name}
                </span>
              </div>
              <button
                onClick={() => {
                  setActiveRingPreset(null);
                  setActiveTool('atom');
                }}
                className="p-0.5 rounded text-slate-400 hover:text-slate-700"
                title="Desactivar modo anillo"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              id="btn-open-rings-menu"
              onClick={() => setRingMenuOpen(!isRingMenuOpen)}
              className="py-1.5 px-2 rounded-md text-[11px] font-mono font-bold bg-white hover:bg-slate-50 text-[#008477] border border-slate-300 hover:border-[#008477] flex items-center justify-between transition-all shadow-xs"
            >
              <div className="flex items-center gap-1.5">
                <Hexagon className="w-3.5 h-3.5 text-[#008477]" />
                <span>Selector Anillos</span>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
          )}

          {/* Menú Flotante de Anillos */}
          {isRingMenuOpen && (
            <div className="absolute left-[105%] top-0 w-64 cad-panel cad-corners p-3 rounded-lg shadow-2xl bg-white border border-slate-300 flex flex-col gap-2 z-30 animate-fadeIn text-slate-800">
              <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                <span className="text-[11px] font-mono font-bold text-slate-900">Anillos Paramétricos</span>
                <button
                  onClick={() => setRingMenuOpen(false)}
                  className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Sub-tabs de Anillos */}
              <div className="grid grid-cols-3 gap-1 p-0.5 bg-slate-100 rounded-md border border-slate-200">
                {(['saturated', 'unsaturated', 'heterocycle'] as RingCategory[]).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setRingCategoryTab(cat)}
                    className={`py-1 text-[10px] font-mono font-semibold rounded capitalize transition-all ${
                      ringCategoryTab === cat
                        ? 'bg-[#008477] text-white font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
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
                    className="p-2 rounded-md text-left bg-white hover:bg-slate-50 border border-slate-200 hover:border-[#008477] flex flex-col transition-all group shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-slate-800 group-hover:text-[#008477]">
                        {preset.name}
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200 font-bold">
                        {preset.sides}L
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 leading-tight mt-0.5 font-sans">
                      {preset.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Panel 3: Plantillas y Grupos Funcionales */}
        <div className="cad-panel cad-corners rounded-lg p-2.5 flex flex-col gap-1.5 min-w-[145px] shadow-lg bg-white border border-slate-300 text-slate-800">
          <div className="px-1 pb-1 border-b border-slate-200 flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-[#D97706]">
              Plantillas
            </span>
            <span className="text-[10px] text-slate-400 font-mono">CAD</span>
          </div>

          {activeTool === 'template' && activeTemplate ? (
            <div className="bg-amber-50 border border-amber-300 p-1.5 rounded-md flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-1.5 overflow-hidden">
                <Sparkles className="w-3.5 h-3.5 text-[#D97706] shrink-0 animate-pulse" />
                <span className="text-[10px] font-mono font-bold text-[#D97706] truncate">
                  {activeTemplate.abbreviation}
                </span>
              </div>
              <button
                onClick={() => {
                  setActiveTemplate(null);
                  setActiveTool('atom');
                }}
                className="p-0.5 rounded text-slate-400 hover:text-slate-700"
                title="Desactivar modo plantilla"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              id="btn-open-functional-modal"
              onClick={() => setFunctionalModalOpen(true)}
              className="py-1.5 px-2 rounded-md text-[11px] font-mono font-bold bg-white hover:bg-slate-50 text-[#D97706] border border-slate-300 hover:border-[#D97706] flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-xs"
              title="Abrir Grupos Funcionales, Coenzimas y Esqueletos Base"
            >
              <Boxes className="w-3.5 h-3.5 text-[#D97706]" />
              <span>Plantillas / G.F.</span>
            </button>
          )}
        </div>

        {/* Panel 4: Selector de Orden de Enlace por Defecto */}
        <div className="cad-panel cad-corners rounded-lg p-2.5 flex flex-col gap-1.5 min-w-[145px] shadow-lg bg-white border border-slate-300 text-slate-800">
          <div className="px-1 pb-1 border-b border-slate-200">
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-slate-600">
              Tipo Enlace
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1">
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
                  className={`py-1.5 px-1 rounded-md flex flex-col items-center justify-center font-mono font-bold transition-all border ${
                    isSelected
                      ? 'bg-[#008477] text-white border-[#008477] shadow-xs'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-xs'
                  }`}
                  title={`Enlace ${name} (Orden ${order})`}
                >
                  <span className="text-sm leading-none">{label}</span>
                  <span className="text-[8px] opacity-75 mt-0.5">{order}</span>
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
