import React, { useState } from 'react';
import {
  AlertTriangle,
  X,
  Copy,
  Check,
  Sparkles,
  Info,
  Atom,
  Layers,
  FlaskConical,
  Flame,
  ArrowRight,
  RotateCcw,
  BookOpen,
} from 'lucide-react';
import { MissionConfig, ValidationResult } from '../../core/model/types';
import { useCanvasStore } from '../../store/useCanvasStore';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: ValidationResult | null;
  moduleName?: string;
  mission?: MissionConfig | null;
  onNextMission?: () => void;
  hasNextMission?: boolean;
}

/**
 * Convierte números normales en subíndices unicode para una presentación química impecable
 * (ej. C2H6O -> C₂H₆O)
 */
function formatFormulaSubscripts(formula: string): string {
  const subscripts: Record<string, string> = {
    '0': '₀',
    '1': '₁',
    '2': '₂',
    '3': '₃',
    '4': '₄',
    '5': '₅',
    '6': '₆',
    '7': '₇',
    '8': '₈',
    '9': '₉',
  };
  return formula.replace(/\d+/g, (match) =>
    match
      .split('')
      .map((c) => subscripts[c] || c)
      .join('')
  );
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  result,
  moduleName = 'Laboratorio Libre',
  mission,
  onNextMission,
  hasNextMission,
}) => {
  const [copiedSmiles, setCopiedSmiles] = useState(false);
  const [copiedFormula, setCopiedFormula] = useState(false);
  const clearErrors = useCanvasStore((state) => state.clearErrors);

  if (!isOpen || !result) return null;

  const handleCopySmiles = () => {
    if (result.descriptors?.canonicalSmiles) {
      navigator.clipboard.writeText(result.descriptors.canonicalSmiles);
      setCopiedSmiles(true);
      setTimeout(() => setCopiedSmiles(false), 2000);
    }
  };

  const handleCopyFormula = () => {
    if (result.descriptors?.formula) {
      navigator.clipboard.writeText(result.descriptors.formula);
      setCopiedFormula(true);
      setTimeout(() => setCopiedFormula(false), 2000);
    }
  };

  const handleDismiss = () => {
    onClose();
  };

  const handleClearErrorsAndClose = () => {
    clearErrors();
    onClose();
  };

  const isLayer1Error = !result.passedLayer1;
  const isSuccess = mission ? result.passedMission : result.isValid;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-[#131d31] border border-white/15 shadow-2xl text-slate-100 overflow-hidden">
        {/* Header con gradiente contextual */}
        <div
          className={`px-6 py-4.5 flex items-center justify-between border-b ${
            isSuccess
              ? 'bg-emerald-950/40 border-emerald-500/30'
              : isLayer1Error
              ? 'bg-rose-950/40 border-rose-500/30'
              : 'bg-amber-950/40 border-amber-500/30'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-2xl flex items-center justify-center ${
                isSuccess
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : isLayer1Error
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
              }`}
            >
              {isSuccess ? (
                <Sparkles className="w-5 h-5 text-emerald-400 animate-bounce" />
              ) : isLayer1Error ? (
                <AlertTriangle className="w-5 h-5 text-rose-400 animate-pulse" />
              ) : (
                <FlaskConical className="w-5 h-5 text-[#ff941a]" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold tracking-tight text-white">
                  {isSuccess
                    ? '¡Reacción Bioquímica Exitosa!'
                    : isLayer1Error
                    ? 'Inconsistencia de Valencias o Conectividad'
                    : 'Diagnóstico Enzimático y Estructural'}
                </h3>
                <span
                  className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border ${
                    isSuccess
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : isLayer1Error
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : 'bg-[#F77F00]/20 text-[#ff941a] border-[#F77F00]/40'
                  }`}
                >
                  {isSuccess ? 'Validado ✓' : isLayer1Error ? 'Capa 1: Físico' : 'Capa 2: RDKit'}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                {mission?.enzymeName || mission?.title || moduleName}
              </p>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            title="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido Scrolleable */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* ESTADO ÉXITO */}
          {isSuccess && (
            <div className="space-y-5">
              {/* Explicación bioquímica de lo que hace la enzima real en la célula */}
              {mission?.biochemicalContext && (
                <div className="p-4 rounded-2xl bg-[#00A896]/15 border border-[#00A896]/35 flex items-start gap-3 shadow-lg shadow-[#00A896]/5">
                  <BookOpen className="w-5 h-5 text-[#00c7b2] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-[#00c7b2] text-xs uppercase tracking-wider flex items-center gap-1.5">
                      Mecanismo Celular y Rol Bioquímico:
                    </h4>
                    <p className="text-xs text-slate-200 leading-relaxed font-normal">
                      {mission.biochemicalContext}
                    </p>
                  </div>
                </div>
              )}

              {/* Tarjetas Principales: Fórmula y SMILES */}
              {result.descriptors && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {/* Fórmula Molecular */}
                  <div className="p-4 rounded-2xl bg-slate-900/70 border border-white/10 flex flex-col justify-between shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Atom className="w-3.5 h-3.5 text-[#00A896]" />
                        Fórmula Molecular
                      </span>
                      <button
                        onClick={handleCopyFormula}
                        className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                        title="Copiar fórmula"
                      >
                        {copiedFormula ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black font-mono tracking-wide text-white drop-shadow">
                        {formatFormulaSubscripts(result.descriptors.formula)}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        (con hidrógenos)
                      </span>
                    </div>
                  </div>

                  {/* SMILES Canónico */}
                  <div className="p-4 rounded-2xl bg-slate-900/70 border border-white/10 flex flex-col justify-between shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-[#00A896]" />
                        SMILES Canónico (RDKit)
                      </span>
                      <button
                        onClick={handleCopySmiles}
                        className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                        title="Copiar SMILES"
                      >
                        {copiedSmiles ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-950/70 border border-white/5 font-mono text-xs text-[#00c7b2] truncate">
                      {result.descriptors.canonicalSmiles || '(Vacío)'}
                    </div>
                  </div>
                </div>
              )}

              {/* Estadísticas Topológicas */}
              {result.descriptors && (
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-2xl bg-slate-900/50 border border-white/10 text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">
                      Átomos
                    </span>
                    <p className="text-lg font-black text-white font-mono mt-0.5">
                      {result.descriptors.atomCount}
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-900/50 border border-white/10 text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">
                      Enlaces
                    </span>
                    <p className="text-lg font-black text-white font-mono mt-0.5">
                      {result.descriptors.bondCount}
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-900/50 border border-white/10 text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">
                      Anillos
                    </span>
                    <p className="text-lg font-black text-white font-mono mt-0.5">
                      {result.descriptors.ringCount}
                    </p>
                  </div>
                </div>
              )}

              {/* Grupos Funcionales Identificados */}
              {result.detectedFunctionalGroups && result.detectedFunctionalGroups.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <FlaskConical className="w-3.5 h-3.5 text-[#00A896]" />
                    Grupos Funcionales Identificados (SMARTS)
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {result.detectedFunctionalGroups.map((fg, idx) => (
                      <div
                        key={idx}
                        className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-[#00A896]/30 flex items-center gap-2 shadow-sm text-xs"
                      >
                        <span className="w-2 h-2 rounded-full bg-[#00A896]" />
                        <span className="font-bold text-white">{fg.name}</span>
                        {fg.count > 1 && (
                          <span className="px-1.5 py-0.2 rounded-md bg-[#00A896]/20 text-[#00c7b2] font-mono font-bold text-[10px]">
                            ×{fg.count}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ESTADO ERROR: CAPA 1 O CAPA 2 */}
          {!isSuccess && (
            <div className="space-y-4">
              {/* Diagnóstico Diferencial Educativo Destacado */}
              {result.differentialDiagnosis && (
                <div className="p-4 rounded-2xl bg-[#F77F00]/15 border border-[#F77F00]/40 flex items-start gap-3 shadow-lg shadow-[#F77F00]/5">
                  <Flame className="w-5 h-5 text-[#ff941a] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-[#ff941a] text-xs uppercase tracking-wider">
                      Diagnóstico Diferencial Educativo:
                    </h4>
                    <p className="text-xs text-amber-100 font-medium leading-relaxed">
                      {result.differentialDiagnosis}
                    </p>
                  </div>
                </div>
              )}

              {/* Lista completa de problemas detectados */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Inconsistencias a Resolver ({result.issues.length}):
                </span>
                {result.issues.map((issue, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-2xl bg-slate-900/70 border flex items-start gap-3 shadow-inner ${
                      issue.code === 'VALENCE_EXCEEDED' || issue.code === 'DISCONNECTED_GRAPH'
                        ? 'border-rose-500/25'
                        : 'border-amber-500/25'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-xl font-mono text-xs font-bold flex items-center justify-center shrink-0 border ${
                        issue.code === 'VALENCE_EXCEEDED' || issue.code === 'DISCONNECTED_GRAPH'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <div className="space-y-1">
                      <p className="text-xs text-slate-200 font-medium leading-relaxed">
                        {issue.message}
                      </p>
                      {issue.affectedAtomIds.length > 0 && (
                        <div className="flex items-center gap-1.5 pt-1">
                          <span className="text-[10px] text-slate-400 font-medium">
                            Átomos infractores resaltados:
                          </span>
                          {issue.affectedAtomIds.map((id) => (
                            <span
                              key={id}
                              className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono text-[10px] border border-rose-500/30"
                            >
                              {id}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pista Pedagógica del Nivel */}
              {mission?.pedagogicalHint && (
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 flex items-start gap-3">
                  <Info className="w-5 h-5 text-[#00A896] shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <h5 className="text-[11px] font-bold text-[#00c7b2] uppercase tracking-wider">
                      Pista Enzimática para este Nivel:
                    </h5>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {mission.pedagogicalHint}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer con Acciones */}
        <div className="px-6 py-4 bg-slate-950/70 border-t border-white/10 flex items-center justify-between gap-3">
          {isSuccess ? (
            <>
              <button
                onClick={handleDismiss}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                Permanecer en el Lienzo
              </button>

              {hasNextMission && onNextMission ? (
                <button
                  id="btn-next-mission"
                  onClick={() => {
                    onNextMission();
                    onClose();
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00A896] hover:bg-[#00c7b2] text-slate-950 font-black text-xs transition-all shadow-lg shadow-[#00A896]/30 hover:scale-[1.03] active:scale-95 glow-teal"
                >
                  <span>Siguiente Misión</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleDismiss}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F77F00] hover:bg-[#ff941a] text-slate-950 font-black text-xs transition-all shadow-lg shadow-[#F77F00]/30 hover:scale-[1.03] active:scale-95 glow-amber"
                >
                  <Sparkles className="w-4 h-4 fill-current" />
                  <span>¡Ruta Completada con Éxito!</span>
                </button>
              )}
            </>
          ) : (
            <>
              {isLayer1Error ? (
                <button
                  onClick={handleClearErrorsAndClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  Apagar halos de error
                </button>
              ) : (
                <span className="text-[11px] text-slate-400 font-medium">
                  Modifica los enlaces o átomos para cumplir la reacción.
                </span>
              )}

              <button
                onClick={handleDismiss}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all border border-white/15 shadow-md active:scale-95 flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reintentar en el Lienzo</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
