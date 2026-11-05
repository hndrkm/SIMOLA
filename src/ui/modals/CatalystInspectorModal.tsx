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
          color: 'bg-purple-50 text-purple-700 border-purple-200',
        };
      case 'coenzyme':
        return {
          label: 'Coenzima / Cofactor',
          color: 'bg-sky-50 text-sky-700 border-sky-200',
        };
      case 'functional_group':
        return {
          label: 'Grupo Funcional Reactivo',
          color: 'bg-amber-50 text-amber-800 border-amber-200',
        };
      default:
        return {
          label: 'Esqueleto Molecular Base',
          color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        };
    }
  };

  const badge = getCategoryBadge();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm select-none animate-fadeIn text-slate-800">
      <div className="cad-panel cad-corners-full w-full max-w-2xl rounded-xl border border-slate-300 shadow-2xl overflow-hidden bg-white flex flex-col font-mono">
        {/* Cabecera CAD */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#008477]/10 border border-[#008477]/30 flex items-center justify-center text-[#008477]">
              {template.category === 'holoenzyme' ? (
                <Activity className="w-5 h-5" />
              ) : template.category === 'coenzyme' ? (
                <Zap className="w-5 h-5 text-[#D97706]" />
              ) : (
                <Sparkles className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-slate-900">
                  {template.name}
                </h2>
                <span className={`text-[10px] px-2 py-0.5 rounded border font-bold ${badge.color}`}>
                  {badge.label}
                </span>
              </div>
              <span className="text-xs font-semibold text-[#008477]">
                {template.abbreviation}
                {template.ecNumber && ` • EC ${template.ecNumber}`}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cuerpo del Inspector */}
        <div className="p-5 space-y-3.5 overflow-y-auto max-h-[70vh] text-xs font-sans bg-white">
          {/* Descripción Fisiológica */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5 font-mono">
            <div className="flex items-center gap-2 text-[#D97706] font-bold text-xs uppercase tracking-wider">
              <BookOpen className="w-4 h-4 text-[#D97706]" />
              <span>Descripción y Formulación:</span>
            </div>
            <p className="text-slate-700 leading-relaxed font-sans text-xs">
              {template.description}
            </p>
            {template.molecularFormula && (
              <div className="mt-2 text-[11px] text-slate-600">
                Fórmula Molecular: <strong className="text-slate-900 font-bold">{template.molecularFormula}</strong>
              </div>
            )}
          </div>

          {/* Rol Bioquímico y Mecanismo Catalítico */}
          <div className="p-3.5 rounded-lg bg-emerald-50/60 border border-emerald-200 space-y-2 font-mono">
            <div className="flex items-center gap-2 text-[#008477] font-bold text-xs uppercase tracking-wider">
              <FlaskConical className="w-4 h-4 text-[#008477]" />
              <span>Rol Bioquímico y Enzimático:</span>
            </div>
            <p className="text-slate-800 leading-relaxed font-sans text-xs">
              {template.biochemicalRole}
            </p>
            {template.catalyticMechanism && (
              <div className="mt-2 p-2.5 rounded bg-white border border-emerald-200 space-y-1 shadow-xs">
                <span className="text-[10px] font-bold uppercase text-amber-700 block">
                  Mecanismo Químico Detallado:
                </span>
                <p className="text-[11px] text-slate-700 leading-relaxed font-sans">
                  {template.catalyticMechanism}
                </p>
              </div>
            )}
          </div>

          {/* Desglose de Átomos y Enlaces de la Estructura */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1 font-mono">
            <div className="flex items-center justify-between text-slate-700 font-bold">
              <span className="flex items-center gap-2 text-slate-800 text-xs">
                <Layers className="w-4 h-4 text-sky-600" />
                Arquitectura Molecular:
              </span>
              <span className="text-[10px] text-slate-500 font-bold">
                {template.atoms.length} átomos • {template.bonds.length} enlaces
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed font-sans pt-1">
              Átomo de conexión / brote rápido al acoplarse sobre el lienzo: 
              <span className="font-mono text-slate-900 font-bold ml-1">
                {template.attachmentAtomTempId}
              </span>
            </p>
          </div>
        </div>

        {/* Pie con Acciones */}
        <div className="p-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 border border-slate-300 transition-colors"
          >
            Cerrar
          </button>
          <button
            onClick={handleInsert}
            className="px-4 py-1.5 rounded-lg text-xs font-bold bg-[#008477] hover:bg-[#006e63] text-white transition-all shadow-xs active:scale-95 flex items-center gap-1.5"
          >
            <span>Insertar en Lienzo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
