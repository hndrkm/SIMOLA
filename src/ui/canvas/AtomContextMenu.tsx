import React, { useEffect, useRef, useMemo } from 'react';
import {
  X,
  Zap,
  Atom,
  Sparkles,
  ShieldAlert,
  Check,
} from 'lucide-react';
import { useCanvasStore } from '../../store/useCanvasStore';
import { ElementSymbol } from '../../core/model/types';
import { getElement, toSuperscript } from '../../core/model/periodicTable';

const ISOTOPE_OPTIONS: Partial<Record<ElementSymbol, Array<{ mass: number; label: string; desc: string }>>> = {
  C: [
    { mass: 12, label: '¹²C', desc: 'Isótopo natural estable (98.9%)' },
    { mass: 13, label: '¹³C', desc: 'RMN y trazado isotópico estable' },
    { mass: 14, label: '¹⁴C', desc: 'Radiomarcaje metabólico (β⁻)' },
  ],
  H: [
    { mass: 1, label: '¹H', desc: 'Protio (abundancia > 99.9%)' },
    { mass: 2, label: '²H (D)', desc: 'Deuterio (efecto cinético isotópico)' },
    { mass: 3, label: '³H (T)', desc: 'Tritio (radiomarcaje emisor β⁻)' },
  ],
  P: [
    { mass: 31, label: '³¹P', desc: 'Fósforo natural estable (100%)' },
    { mass: 32, label: '³²P', desc: 'Radiomarcaje de ácidos nucleicos y ATP (β⁻)' },
  ],
  O: [
    { mass: 16, label: '¹⁶O', desc: 'Oxígeno natural estable (99.7%)' },
    { mass: 18, label: '¹⁸O', desc: 'Trazador de deshidrataciones e hidrólisis' },
  ],
  N: [
    { mass: 14, label: '¹⁴N', desc: 'Nitrógeno natural estable (99.6%)' },
    { mass: 15, label: '¹⁵N', desc: 'RMN y marcaje de asimilación proteica' },
  ],
  S: [
    { mass: 32, label: '³²S', desc: 'Azufre natural estable (95%)' },
    { mass: 35, label: '³⁵S', desc: 'Radiomarcaje de residuos Cys y Met' },
  ],
};

const FORMAL_CHARGES = [
  { value: -2, label: '−2', sub: 'Dianión / Fosfato (-PO₃²⁻)' },
  { value: -1, label: '−1', sub: 'Carboxilato (-COO⁻)' },
  { value: 0, label: '0', sub: 'Estado Neutro' },
  { value: 1, label: '+1', sub: 'Amonio (-NH₃⁺)' },
  { value: 2, label: '+2', sub: 'Catión Divalente (+2)' },
];

export const AtomContextMenu: React.FC = () => {
  const contextMenuAtom = useCanvasStore((state) => state.contextMenuAtom);
  const setContextMenuAtom = useCanvasStore((state) => state.setContextMenuAtom);
  const graph = useCanvasStore((state) => state.graph);
  const setAtomFormalCharge = useCanvasStore((state) => state.setAtomFormalCharge);
  const setAtomIsotope = useCanvasStore((state) => state.setAtomIsotope);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // Ignorar clic derecho para no cerrar el menú inmediatamente cuando el usuario abre el menú
      if (e.button === 2) return;
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setContextMenuAtom(null);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setContextMenuAtom(null);
      }
    };

    window.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [setContextMenuAtom]);

  const atom = contextMenuAtom ? graph.nodes[contextMenuAtom.atomId] : null;

  const isotopeList = useMemo(() => {
    if (!atom) return [];
    if (ISOTOPE_OPTIONS[atom.element]) {
      return ISOTOPE_OPTIONS[atom.element]!;
    }
    const elemData = getElement(atom.element);
    if (elemData?.keyIsotopes && elemData.keyIsotopes.length > 0) {
      return elemData.keyIsotopes.map((iso) => ({
        mass: iso.massNumber,
        label: iso.symbol || `${toSuperscript(iso.massNumber)}${atom.element}`,
        desc: iso.description || iso.name,
      }));
    }
    return [];
  }, [atom?.element]);

  if (!contextMenuAtom || !atom) return null;

  // Ajustar coordenadas para que no se salga de la pantalla
  const menuWidth = 280;
  const menuHeight = 360;
  const posX = Math.min(window.innerWidth - menuWidth - 20, Math.max(10, contextMenuAtom.clientX));
  const posY = Math.min(window.innerHeight - menuHeight - 20, Math.max(10, contextMenuAtom.clientY));

  return (
    <div
      ref={menuRef}
      style={{ left: posX, top: posY }}
      className="fixed z-50 w-72 cad-panel cad-corners p-4 rounded-xl bg-white border border-slate-300 shadow-2xl backdrop-blur-xl select-none animate-fadeIn text-slate-800 font-mono"
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Cabecera del Popover */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#008477]/10 border border-[#008477]/30 flex items-center justify-center text-[#008477]">
            <Atom className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              Átomo de {atom.element}
              {atom.isotope && (
                <span className="font-mono text-[10px] text-[#008477] bg-[#008477]/10 border border-[#008477]/30 px-1.5 py-0.2 rounded font-bold">
                  ^{atom.isotope}
                </span>
              )}
            </h3>
            <p className="text-[10px] text-slate-500 font-sans">Edición Iónica e Isotópica</p>
          </div>
        </div>
        <button
          onClick={() => setContextMenuAtom(null)}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          title="Cerrar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {atom.isLocked && (
        <div className="mb-3 p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[10px] flex items-center gap-1.5 font-medium">
          <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
          <span>Este átomo estructural está protegido por la misión.</span>
        </div>
      )}

      {/* 1. Selector de Carga Formal (Ionización Fisiológica a pH 7.4) */}
      <div className="mb-3.5">
        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5 flex items-center gap-1 font-mono">
          <Zap className="w-3 h-3 text-[#D97706]" />
          Carga Formal Fisiológica (pH 7.4):
        </label>
        <div className="grid grid-cols-5 gap-1.5">
          {FORMAL_CHARGES.map((ch) => {
            const isSelected = atom.formalCharge === ch.value;
            return (
              <button
                key={ch.value}
                disabled={atom.isLocked}
                onClick={() => {
                  setAtomFormalCharge(atom.id, ch.value);
                }}
                className={`py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
                  isSelected
                    ? ch.value < 0
                      ? 'bg-rose-500 text-white border-rose-600 shadow-xs'
                      : ch.value > 0
                      ? 'bg-sky-500 text-white border-sky-600 shadow-xs'
                      : 'bg-[#008477] text-white border-[#008477] shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                } ${atom.isLocked ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}
                title={ch.sub}
              >
                {ch.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Selector de Isótopos */}
      <div>
        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5 flex items-center gap-1 font-mono">
          <Sparkles className="w-3 h-3 text-[#008477]" />
          Marcaje Isotópico ({atom.element}):
        </label>

        {/* Opción Natural / Sin Isótopo específico */}
        <div className="mb-1.5">
          <button
            disabled={atom.isLocked}
            onClick={() => setAtomIsotope(atom.id, undefined)}
            className={`w-full p-2 rounded-lg text-left border flex items-center justify-between text-xs transition-all ${
              !atom.isotope
                ? 'bg-[#008477]/10 border-[#008477] text-slate-900 font-bold shadow-xs'
                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
            } ${atom.isLocked ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}
          >
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-slate-900 font-mono text-[11px]">
                {atom.element} (Natural / Estándar)
              </span>
              <span className="text-[9px] text-slate-500 truncate">
                Abundancia natural terrestre estándar
              </span>
            </div>
            {!atom.isotope && (
              <Check className="w-3.5 h-3.5 text-[#008477] shrink-0" />
            )}
          </button>
        </div>

        {isotopeList.length === 0 ? (
          <div className="p-2.5 rounded-lg bg-slate-50 text-slate-500 text-[10px] text-center border border-slate-200 font-sans">
            Sin variantes adicionales registradas para este elemento.
          </div>
        ) : (
          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-0.5">
            {isotopeList.map((iso) => {
              const isSelected = atom.isotope === iso.mass;

              return (
                <button
                  key={iso.mass}
                  disabled={atom.isLocked}
                  onClick={() => {
                    setAtomIsotope(atom.id, iso.mass);
                  }}
                  className={`w-full p-2 rounded-lg text-left border flex items-center justify-between text-xs transition-all ${
                    isSelected
                      ? 'bg-[#008477]/10 border-[#008477] text-slate-900 font-bold shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  } ${atom.isLocked ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}
                >
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-slate-900 font-mono text-[11px]">
                      {iso.label}
                    </span>
                    <span className="text-[9px] text-slate-500 truncate font-sans">
                      {iso.desc}
                    </span>
                  </div>
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-[#008477] shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
