import React from 'react';
import {
  X,
  Zap,
  Activity,
  Layers,
  Sparkles,
  FlaskConical,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import { MolecularTemplate } from '../../core/model/templates';
import { useCanvasStore } from '../../store/useCanvasStore';

interface CatalystInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: MolecularTemplate | null;
}

export const CatalystInspectorModal: React.FC<CatalystInspectorModalProps> = ({
  isOpen,
  onClose,
  template,
}) => {
  const stageScale = useCanvasStore((state) => state.stageScale);
  const stagePosition = useCanvasStore((state) => state.stagePosition);
  const stampTemplateAt = useCanvasStore((state) => state.stampTemplateAt);

  if (!isOpen || !template) return null;

  const handleInsert = () => {
    const centerX = Math.round((window.innerWidth / 2 - stagePosition.x) / stageScale);
    const centerY = Math.round((window.innerHeight / 2 - stagePosition.y) / stageScale);
    stampTemplateAt(template, { x: centerX, y: centerY });
    onClose();
  };

  const getCategoryBadge = () => {
    switch (template.category) {
      case 'holoenzyme':
        return {
          label: 'Holoenzima Catalítica',
          color: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
        };
      case 'coenzyme':
        return {
          label: 'Coenzima / Cofactor',
          color: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
        };
      case 'functional_group':
        return {
          label: 'Grupo Funcional Reactivo',
          color: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
        };
      default:
        return {
          label: 'Esqueleto Molecular Base',
          color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
        };
    }
  };

  const badge = getCategoryBadge();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md select-none animate-fadeIn text-slate-100">
      <div className="cad-panel cad-corners-full w-full max-w-2xl rounded-xl border border-[#00A896]/50 shadow-2xl overflow-hidden bg-[#1B2A4A] flex flex-col font-mono">
        {/* Cabecera CAD */}
        <div className="p-4 border-b border-[#00A896]/30 bg-[#16233e] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#00A896]/20 border border-[#00A896]/40 flex items-center justify-center text-[#00A896]">
              {template.category === 'holoenzyme' ? (
                <Activity className="w-5 h-5" />
              ) : template.category === 'coenzyme' ? (
                <Zap className="w-5 h-5 text-[#F77F00]" />
              ) : (
                <Sparkles className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white">
                  {template.name}
                </h2>
                <span className={`text-[10px] px-2 py-0.5 rounded border ${badge.color}`}>
                  {badge.label}
                </span>
              </div>
              <span className="text-xs font-semibold text-[#00c7b2]">
                {template.abbreviation}
                {template.ecNumber && ` • EC ${template.ecNumber}`}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cuerpo del Inspector */}
        <div className="p-5 space-y-3.5 overflow-y-auto max-h-[70vh] text-xs font-sans">
          {/* Descripción Fisiológica */}
          <div className="p-3.5 rounded-lg bg-[#0B132B]/80 border border-white/10 space-y-1.5 font-mono">
            <div className="flex items-center gap-2 text-[#ff941a] font-bold text-xs uppercase tracking-wider">
              <BookOpen className="w-4 h-4 text-[#F77F00]" />
              <span>Descripción y Formulación:</span>
            </div>
            <p className="text-slate-200 leading-relaxed font-sans text-xs">
              {template.description}
            </p>
            {template.molecularFormula && (
              <div className="mt-2 text-[11px] text-slate-300">
                Fórmula Molecular: <strong className="text-white">{template.molecularFormula}</strong>
              </div>
            )}
          </div>

          {/* Rol Bioquímico y Mecanismo Catalítico */}
          <div className="p-3.5 rounded-lg bg-[#0B132B]/80 border border-white/10 space-y-2 font-mono">
            <div className="flex items-center gap-2 text-[#00c7b2] font-bold text-xs uppercase tracking-wider">
              <FlaskConical className="w-4 h-4 text-[#00A896]" />
              <span>Rol Bioquímico y Enzimático:</span>
            </div>
            <p className="text-slate-200 leading-relaxed font-sans text-xs">
              {template.biochemicalRole}
            </p>
            {template.catalyticMechanism && (
              <div className="mt-2 p-2.5 rounded bg-slate-950/80 border border-white/5 space-y-1">
                <span className="text-[10px] font-bold uppercase text-amber-300 block">
                  Mecanismo Químico Detallado:
                </span>
                <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                  {template.catalyticMechanism}
                </p>
              </div>
            )}
          </div>

          {/* Desglose de Átomos y Enlaces de la Estructura */}
          <div className="p-3.5 rounded-lg bg-[#0B132B]/80 border border-white/10 space-y-1 font-mono">
            <div className="flex items-center justify-between text-slate-300 font-bold">
              <span className="flex items-center gap-2 text-slate-200 text-xs">
                <Layers className="w-4 h-4 text-sky-400" />
                Arquitectura Molecular:
              </span>
              <span className="text-[10px] text-slate-400">
                {template.atoms.length} átomos • {template.bonds.length} enlaces
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans pt-1">
              Átomo de conexión / brote rápido al acoplarse sobre el lienzo: 
              <span className="font-mono text-white font-bold ml-1">
                {template.attachmentAtomTempId}
              </span>
            </p>
          </div>
        </div>

        {/* Pie con Acciones */}
        <div className="p-3.5 border-t border-[#00A896]/30 bg-[#16233e] flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 border border-white/10 transition-colors"
          >
            Cerrar
          </button>
          <button
            onClick={handleInsert}
            className="px-4 py-1.5 rounded-lg text-xs font-bold bg-[#00A896] hover:bg-[#00c7b2] text-slate-950 transition-all shadow-md active:scale-95 flex items-center gap-1.5"
          >
            <span>Insertar en Lienzo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
