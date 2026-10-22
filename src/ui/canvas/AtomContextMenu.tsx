import React, { useEffect, useRef } from 'react';
import {
  X,
  Zap,
  Atom,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import { useCanvasStore } from '../../store/useCanvasStore';
import { ElementSymbol } from '../../core/model/types';

const ISOTOPE_OPTIONS: Partial<Record<ElementSymbol, Array<{ mass: number; label: string; desc: string }>>> = {
  C: [
    { mass: 12, label: '¹²C', desc: 'Isótopo natural estable (98.9%)' },
    { mass: 13, label: '¹³C', desc: 'RMN y trazado isotópico' },
    { mass: 14, label: '¹⁴C', desc: 'Radiomarcaje metabólico (β⁻)' },
  ],
  H: [
    { mass: 1, label: '¹H', desc: 'Protio (abundancia > 99.9%)' },
    { mass: 2, label: '²H (D)', desc: 'Deuterio (efecto cinético isotópico)' },
  ],
  P: [
    { mass: 31, label: '³¹P', desc: 'Fósforo natural estable (100%)' },
    { mass: 32, label: '³²P', desc: 'Radiomarcaje de ácidos nucleicos y fosforilaciones (β⁻)' },
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
    { mass: 35, label: '³⁵S', desc: 'Radiomarcaje de residuos de Cisteína y Metionina' },
  ],
};

const FORMAL_CHARGES = [
  { value: -2, label: '−2', sub: 'Fosfato (-PO₃²⁻)' },
  { value: -1, label: '−1', sub: 'Carboxilato (-COO⁻)' },
  { value: 0, label: '0', sub: 'Estado Neutro' },
  { value: 1, label: '+1', sub: 'Amonio (-NH₃⁺)' },
  { value: 2, label: '+2', sub: 'Catión Divalente' },
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

  if (!contextMenuAtom) return null;

  const atom = graph.nodes[contextMenuAtom.atomId];
  if (!atom) return null;

  // Ajustar coordenadas para que no se salga de la pantalla
  const menuWidth = 280;
  const menuHeight = 360;
  const posX = Math.min(window.innerWidth - menuWidth - 20, Math.max(10, contextMenuAtom.clientX));
  const posY = Math.min(window.innerHeight - menuHeight - 20, Math.max(10, contextMenuAtom.clientY));

  const isotopeList = ISOTOPE_OPTIONS[atom.element] || [];

  return (
    <div
      ref={menuRef}
      style={{ left: posX, top: posY }}
      className="fixed z-50 w-72 glass-panel p-4 rounded-3xl bg-[#1B2A4A]/98 border-2 border-[#00A896]/60 shadow-2xl backdrop-blur-xl select-none animate-fadeIn text-slate-100"
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Cabecera del Popover */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-[#00A896]/20 border border-[#00A896]/40 flex items-center justify-center text-[#00A896]">
            <Atom className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-black text-white flex items-center gap-1.5">
              Átomo de {atom.element}
              {atom.isotope && (
                <span className="font-mono text-[10px] text-[#00c7b2] bg-[#00A896]/20 px-1.5 py-0.2 rounded">
                  ^{atom.isotope}
                </span>
              )}
            </h3>
            <p className="text-[10px] text-slate-400">Edición Iónica e Isotópica</p>
          </div>
        </div>
        <button
          onClick={() => setContextMenuAtom(null)}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {atom.isLocked && (
        <div className="mb-3 p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] flex items-center gap-1.5 font-medium">
          <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
          <span>Este átomo estructural está protegido por la misión.</span>
        </div>
      )}

      {/* 1. Selector de Carga Formal (Ionización Fisiológica a pH 7.4) */}
      <div className="mb-3.5">
        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5 flex items-center gap-1">
          <Zap className="w-3 h-3 text-[#F77F00]" />
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
                className={`py-1.5 rounded-xl text-xs font-mono font-bold transition-all border ${
                  isSelected
                    ? ch.value < 0
                      ? 'bg-rose-500 text-white border-rose-400 shadow-md shadow-rose-500/30'
                      : ch.value > 0
                      ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-md shadow-sky-500/30'
                      : 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/30'
                    : 'bg-slate-900/80 text-slate-300 border-white/5 hover:border-white/20 hover:bg-slate-800'
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
        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-sky-400" />
          Marcaje Isotópico ({atom.element}):
        </label>

        {isotopeList.length === 0 ? (
          <div className="p-2.5 rounded-xl bg-slate-900/60 text-slate-400 text-[10px] text-center border border-white/5">
            Elemento sin variantes de trazado isotópico preconfiguradas.
          </div>
        ) : (
          <div className="space-y-1.5">
            {isotopeList.map((iso) => {
              const isSelected =
                atom.isotope === iso.mass || (!atom.isotope && iso.mass === isotopeList[0].mass);

              return (
                <button
                  key={iso.mass}
                  disabled={atom.isLocked}
                  onClick={() => {
                    const newIso = iso.mass === isotopeList[0].mass ? undefined : iso.mass;
                    setAtomIsotope(atom.id, newIso);
                  }}
                  className={`w-full p-2 rounded-xl text-left border flex items-center justify-between text-xs transition-all ${
                    isSelected
                      ? 'bg-[#00A896]/20 border-[#00A896]/60 text-white shadow-sm'
                      : 'bg-slate-900/70 border-white/5 text-slate-300 hover:border-white/20 hover:bg-slate-800'
                  } ${atom.isLocked ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}
                >
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-white font-mono text-[11px]">
                      {iso.label}
                    </span>
                    <span className="text-[9px] text-slate-400 truncate">
                      {iso.desc}
                    </span>
                  </div>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-[#00A896] shrink-0" />
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
