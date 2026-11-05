import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  Atom,
  Sparkles,
  Info,
  Check,
} from 'lucide-react';
import {
  PERIODIC_TABLE,
  ElementData,
  ElementCategory,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
} from '../../core/model/periodicTable';
import { useCanvasStore } from '../../store/useCanvasStore';

interface PeriodicTableModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PeriodicTableModal: React.FC<PeriodicTableModalProps> = ({ isOpen, onClose }) => {
  const activeElement = useCanvasStore((state) => state.activeElement);
  const activeIsotope = useCanvasStore((state) => state.activeIsotope);
  const setActiveElement = useCanvasStore((state) => state.setActiveElement);
  const setActiveTool = useCanvasStore((state) => state.setActiveTool);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ElementCategory | 'all'>('all');
  const [selectedElem, setSelectedElem] = useState<ElementData>(() => {
    return PERIODIC_TABLE.find((e) => e.symbol === activeElement) || PERIODIC_TABLE[5]; // Default: Carbono
  });
  const [chosenIsotope, setChosenIsotope] = useState<number | undefined>(activeIsotope);

  // Filtrado de elementos
  const filteredElements = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return PERIODIC_TABLE.filter((elem) => {
      const matchesCategory = selectedCategory === 'all' || elem.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!query) return true;
      return (
        elem.symbol.toLowerCase().includes(query) ||
        elem.name.toLowerCase().includes(query) ||
        elem.atomicNumber.toString() === query
      );
    });
  }, [searchQuery, selectedCategory]);

  if (!isOpen) return null;

  const handleSelectElement = (elem: ElementData, isotope?: number) => {
    setActiveElement(elem.symbol, isotope);
    setActiveTool('atom');
    onClose();
  };

  const categories: Array<{ id: ElementCategory | 'all'; label: string }> = [
    { id: 'all', label: 'Todos' },
    { id: 'nonmetal', label: 'No metales' },
    { id: 'noble-gas', label: 'Gases nobles' },
    { id: 'halogen', label: 'Halógenos' },
    { id: 'alkali-metal', label: 'Alcalinos' },
    { id: 'alkaline-earth', label: 'Alcalinotérreos' },
    { id: 'transition-metal', label: 'Metales transición' },
    { id: 'metalloid', label: 'Metaloides' },
    { id: 'post-transition-metal', label: 'Post-transición' },
    { id: 'lanthanide', label: 'Lantánidos' },
    { id: 'actinide', label: 'Actínidos' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm select-none animate-fadeIn">
      <div className="cad-panel cad-corners-full w-full max-w-6xl max-h-[92vh] flex flex-col rounded-xl border border-slate-300 shadow-2xl overflow-hidden bg-white font-mono text-slate-800">
        {/* Cabecera del Modal */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#008477]/10 border border-[#008477]/30 flex items-center justify-center text-[#008477]">
              <Atom className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                Tabla Periódica Completa
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-[#008477] border border-[#008477]/30 font-mono font-bold">
                  118 Elementos
                </span>
              </h2>
              <p className="text-xs text-slate-500 font-sans">
                Selecciona cualquier elemento químico o isótopo para incorporarlo al editor molecular
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 transition-colors"
            title="Cerrar (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barra de Filtros y Búsqueda */}
        <div className="px-6 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70">
          {/* Buscador */}
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por símbolo, nombre o número atómico (ej. C, Carbono, 6)..."
              className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-8 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#008477] shadow-xs transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Categorías */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full text-xs">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const color = cat.id !== 'all' ? CATEGORY_COLORS[cat.id] : undefined;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all border ${
                    isSelected
                      ? 'bg-[#008477] text-white font-bold border-[#008477] shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {color && (
                    <span
                      className="inline-block w-2 h-2 rounded-full mr-1.5 border border-slate-300"
                      style={{ backgroundColor: color }}
                    />
                  )}
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Contenido Principal: Rejilla Periódica + Tarjeta de Detalle */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-4 gap-4 p-4 min-h-0 bg-white">
          {/* Rejilla de la Tabla Periódica (3 columnas de ancho en desktop) */}
          <div className="lg:col-span-3 overflow-auto pr-1 flex flex-col justify-start">
            <div
              className="grid gap-1 min-w-[760px] pb-4"
              style={{
                gridTemplateColumns: 'repeat(18, minmax(0, 1fr))',
              }}
            >
              {PERIODIC_TABLE.map((elem) => {
                let row = elem.period;
                let col = elem.group;

                // Lantánidos (57 a 71) en fila 8
                if (elem.atomicNumber >= 57 && elem.atomicNumber <= 71) {
                  row = 8;
                  col = elem.atomicNumber - 57 + 3;
                }
                // Actínidos (89 a 103) en fila 9
                else if (elem.atomicNumber >= 89 && elem.atomicNumber <= 103) {
                  row = 9;
                  col = elem.atomicNumber - 89 + 3;
                }

                const isSelected = selectedElem?.atomicNumber === elem.atomicNumber;
                const isFilteredOut = !filteredElements.some((e) => e.atomicNumber === elem.atomicNumber);
                const categoryColor = CATEGORY_COLORS[elem.category];

                return (
                  <button
                    key={elem.symbol}
                    id={`elem-cell-${elem.symbol.toLowerCase()}`}
                    onClick={() => {
                      setSelectedElem(elem);
                      setChosenIsotope(undefined);
                    }}
                    onDoubleClick={() => handleSelectElement(elem)}
                    style={{
                      gridRow: row,
                      gridColumn: col,
                    }}
                    className={`relative p-0.5 rounded-lg flex flex-col items-center justify-center transition-all ${
                      isFilteredOut
                        ? 'opacity-20 pointer-events-none scale-95'
                        : isSelected
                        ? 'ring-2 ring-[#008477] shadow-md scale-105 z-10'
                        : 'hover:scale-105 hover:z-10'
                    }`}
                  >
                    <div
                      className="w-full h-11 rounded-md flex flex-col items-center justify-center shadow-xs relative overflow-hidden transition-shadow"
                      style={{
                        backgroundColor: elem.cpkColor === '#FFFFFF' ? '#F8FAFC' : elem.cpkColor,
                        color: elem.textColor,
                        border: `1.5px solid ${isSelected ? '#008477' : categoryColor}`,
                      }}
                    >
                      <span className="text-[8px] absolute top-0.5 left-1 font-mono font-bold opacity-75">
                        {elem.atomicNumber}
                      </span>
                      <span className="text-xs font-black leading-none tracking-tight">
                        {elem.symbol}
                      </span>
                      <span className="text-[7.5px] font-semibold truncate max-w-[90%] leading-tight opacity-90">
                        {elem.name}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Panel Lateral de Detalle del Elemento Seleccionado */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between overflow-y-auto">
            {selectedElem ? (
              <div className="flex flex-col gap-4">
                {/* Elemento Destacado */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-16 h-16 rounded-xl flex flex-col items-center justify-center shadow-md border border-slate-300 flex-shrink-0"
                    style={{
                      backgroundColor: selectedElem.cpkColor === '#FFFFFF' ? '#F8FAFC' : selectedElem.cpkColor,
                      color: selectedElem.textColor,
                    }}
                  >
                    <span className="text-[10px] font-mono leading-none opacity-80 font-bold">
                      {selectedElem.atomicNumber}
                    </span>
                    <span className="text-2xl font-black leading-tight">
                      {selectedElem.symbol}
                    </span>
                    <span className="text-[9px] font-mono opacity-80 leading-none font-semibold">
                      {selectedElem.atomicMass.toFixed(2)}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900">{selectedElem.name}</h3>
                    <span
                      className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1 border"
                      style={{
                        color: CATEGORY_COLORS[selectedElem.category],
                        borderColor: `${CATEGORY_COLORS[selectedElem.category]}40`,
                        backgroundColor: `${CATEGORY_COLORS[selectedElem.category]}15`,
                      }}
                    >
                      {CATEGORY_LABELS[selectedElem.category]}
                    </span>
                  </div>
                </div>

                {/* Parámetros Fisicoquímicos */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-xs">
                    <span className="text-[10px] text-slate-500 block font-mono">Valencias Permitidas</span>
                    <span className="font-bold text-slate-800">
                      {selectedElem.allowedValences.length > 0
                        ? selectedElem.allowedValences.join(', ')
                        : '0 (Inerte)'}
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-xs">
                    <span className="text-[10px] text-slate-500 block font-mono">Periodo / Grupo</span>
                    <span className="font-bold text-slate-800">
                      P: {selectedElem.period} | G: {selectedElem.group}
                    </span>
                  </div>
                </div>

                {/* Selector de Isótopos Clave */}
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-xs font-bold text-slate-700">Isótopos Clave</span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    {/* Opción Estándar (Sin marcar) */}
                    <button
                      onClick={() => setChosenIsotope(undefined)}
                      className={`flex items-center justify-between p-2 rounded-lg text-left border text-xs transition-all ${
                        chosenIsotope === undefined
                          ? 'bg-[#008477]/10 border-[#008477] text-[#008477] font-bold shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span>Natural / Estándar ({selectedElem.symbol})</span>
                      {chosenIsotope === undefined && <Check className="w-3.5 h-3.5 text-[#008477]" />}
                    </button>

                    {/* Lista de Isótopos */}
                    {selectedElem.keyIsotopes && selectedElem.keyIsotopes.length > 0 ? (
                      selectedElem.keyIsotopes.map((iso) => {
                        const isIsoSelected = chosenIsotope === iso.massNumber;
                        return (
                          <button
                            key={iso.massNumber}
                            onClick={() => setChosenIsotope(iso.massNumber)}
                            className={`p-2 rounded-lg text-left border text-xs flex flex-col gap-0.5 transition-all ${
                              isIsoSelected
                                ? 'bg-amber-50 border-amber-400 text-amber-900 font-bold shadow-xs'
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold flex items-center gap-1.5">
                                {iso.symbol}
                                <span className="font-normal text-[11px] text-slate-500">
                                  ({iso.name})
                                </span>
                              </span>
                              {iso.isRadioactive && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-50 text-rose-700 border border-rose-300 font-bold">
                                  Radiactivo
                                </span>
                              )}
                              {isIsoSelected && <Check className="w-3.5 h-3.5 text-amber-600" />}
                            </div>
                            {iso.description && (
                              <span className="text-[10px] text-slate-500 leading-tight">
                                {iso.description}
                              </span>
                            )}
                          </button>
                        );
                      })
                    ) : (
                      <span className="text-[11px] text-slate-400 italic p-1">
                        Sin variantes isotópicas destacadas registradas
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs">
                <Info className="w-6 h-6 mb-2 opacity-50" />
                Haz clic en cualquier elemento de la tabla para ver sus detalles
              </div>
            )}

            {/* Botón de Acción Principal */}
            {selectedElem && (
              <button
                id="btn-confirm-element-selection"
                onClick={() => handleSelectElement(selectedElem, chosenIsotope)}
                className="w-full mt-4 py-2.5 px-4 rounded-xl font-bold text-xs bg-[#008477] hover:bg-[#006e63] text-white shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <span>Usar en Lienzo:</span>
                <span className="font-mono text-sm bg-white text-slate-900 px-2 py-0.5 rounded-lg border border-slate-200 font-black shadow-xs">
                  {chosenIsotope ? `${chosenIsotope}${selectedElem.symbol}` : selectedElem.symbol}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
