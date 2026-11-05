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
  hasNextMission = false,
}) => {
  const [copiedFormula, setCopiedFormula] = useState(false);
  const [copiedSmiles, setCopiedSmiles] = useState(false);
  const clearErrors = useCanvasStore((state) => state.clearErrors);

  if (!isOpen || !result) return null;

  const isSuccess = result.isValid;
  const isLayer1Error = !isSuccess && result.issues.some(
    (i) => i.code === 'VALENCE_EXCEEDED' || i.code === 'DISCONNECTED_GRAPH'
  );

  const handleCopyFormula = () => {
    if (!result.descriptors?.formula) return;
    navigator.clipboard.writeText(result.descriptors.formula);
    setCopiedFormula(true);
    setTimeout(() => setCopiedFormula(false), 2000);
  };

  const handleCopySmiles = () => {
    if (!result.descriptors?.canonicalSmiles) return;
    navigator.clipboard.writeText(result.descriptors.canonicalSmiles);
    setCopiedSmiles(true);
    setTimeout(() => setCopiedSmiles(false), 2000);
  };

  const handleDismiss = () => {
    onClose();
  };

  const handleClearErrorsAndClose = () => {
    clearErrors();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm select-none animate-fadeIn text-slate-800">
      <div className="cad-panel cad-corners-full relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-xl bg-white border border-slate-300 shadow-2xl text-slate-800 overflow-hidden font-mono">
        {/* Header con gradiente contextual */}
        <div
          className={`px-5 py-3.5 flex items-center justify-between border-b ${
            isSuccess
              ? 'bg-emerald-50 border-emerald-200'
              : isLayer1Error
              ? 'bg-rose-50 border-rose-200'
              : 'bg-amber-50 border-amber-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg flex items-center justify-center ${
                isSuccess
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                  : isLayer1Error
                  ? 'bg-rose-100 text-rose-700 border border-rose-300'
                  : 'bg-amber-100 text-amber-700 border border-amber-300'
              }`}
            >
              {isSuccess ? (
                <Sparkles className="w-5 h-5 text-emerald-600" />
              ) : isLayer1Error ? (
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              ) : (
                <FlaskConical className="w-5 h-5 text-[#D97706]" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold tracking-tight text-slate-900">
                  {isSuccess
                    ? '¡Reacción Bioquímica Exitosa!'
                    : isLayer1Error
                    ? 'Inconsistencia de Valencias o Conectividad'
                    : 'Diagnóstico Enzimático y Estructural'}
                </h3>
                <span
                  className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${
                    isSuccess
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : isLayer1Error
                      ? 'bg-rose-100 text-rose-800 border-rose-300'
                      : 'bg-amber-100 text-amber-900 border-amber-300'
                  }`}
                >
                  {isSuccess ? 'Validado ✓' : isLayer1Error ? 'Físico' : 'RDKit'}
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                {mission?.enzymeName || mission?.title || moduleName}
              </p>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="p-1 rounded hover:bg-slate-200/60 text-slate-400 hover:text-slate-800 transition-colors"
            title="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido Scrolleable */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm bg-white">
          {/* ESTADO ÉXITO */}
          {isSuccess && (
            <div className="space-y-5">
              {/* Explicación bioquímica de lo que hace la enzima real en la célula */}
              {mission?.biochemicalContext && (
                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-3 shadow-xs">
                  <BookOpen className="w-5 h-5 text-[#008477] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-[#008477] text-xs uppercase tracking-wider flex items-center gap-1.5">
                      Mecanismo Celular y Rol Bioquímico:
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed font-sans">
                      {mission.biochemicalContext}
                    </p>
                  </div>
                </div>
              )}

              {/* Tarjetas Principales: Fórmula y SMILES */}
              {result.descriptors && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {/* Fórmula Molecular */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                        <Atom className="w-3.5 h-3.5 text-[#008477]" />
                        Fórmula Molecular
                      </span>
                      <button
                        onClick={handleCopyFormula}
                        className="p-1 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
                        title="Copiar fórmula"
                      >
                        {copiedFormula ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black font-mono tracking-wide text-slate-900">
                        {formatFormulaSubscripts(result.descriptors.formula)}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        (con hidrógenos)
                      </span>
                    </div>
                  </div>

                  {/* SMILES Canónico */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-[#008477]" />
                        SMILES Canónico (RDKit)
                      </span>
                      <button
                        onClick={handleCopySmiles}
                        className="p-1 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
                        title="Copiar SMILES"
                      >
                        {copiedSmiles ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <div className="p-2 rounded-lg bg-white border border-slate-200 font-mono text-xs text-[#008477] truncate font-bold shadow-xs">
                      {result.descriptors.canonicalSmiles || '(Vacío)'}
                    </div>
                  </div>
                </div>
              )}

              {/* Estadísticas Topológicas */}
              {result.descriptors && (
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center shadow-xs">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">
                      Átomos
                    </span>
                    <p className="text-lg font-black text-slate-900 font-mono mt-0.5">
                      {result.descriptors.atomCount}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center shadow-xs">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">
                      Enlaces
                    </span>
                    <p className="text-lg font-black text-slate-900 font-mono mt-0.5">
                      {result.descriptors.bondCount}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center shadow-xs">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">
                      Anillos
                    </span>
                    <p className="text-lg font-black text-slate-900 font-mono mt-0.5">
                      {result.descriptors.ringCount}
                    </p>
                  </div>
                </div>
              )}

              {/* Grupos Funcionales Identificados */}
              {result.detectedFunctionalGroups && result.detectedFunctionalGroups.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                    <FlaskConical className="w-3.5 h-3.5 text-[#008477]" />
                    Grupos Funcionales Identificados (SMARTS)
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {result.detectedFunctionalGroups.map((fg, idx) => (
                      <div
                        key={idx}
                        className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2 shadow-xs text-xs"
                      >
                        <span className="w-2 h-2 rounded-full bg-[#008477]" />
                        <span className="font-bold text-slate-800">{fg.name}</span>
                        {fg.count > 1 && (
                          <span className="px-1.5 py-0.2 rounded-md bg-[#008477]/10 text-[#008477] font-mono font-bold text-[10px]">
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
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3 shadow-xs">
                  <Flame className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-amber-900 text-xs uppercase tracking-wider">
                      Diagnóstico Diferencial Educativo:
                    </h4>
                    <p className="text-xs text-amber-950 font-medium leading-relaxed font-sans">
                      {result.differentialDiagnosis}
                    </p>
                  </div>
                </div>
              )}

              {/* Lista completa de problemas detectados */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Inconsistencias a Resolver ({result.issues.length}):
                </span>
                {result.issues.map((issue, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border flex items-start gap-3 shadow-xs ${
                      issue.code === 'VALENCE_EXCEEDED' || issue.code === 'DISCONNECTED_GRAPH'
                        ? 'bg-rose-50/60 border-rose-200'
                        : 'bg-amber-50/60 border-amber-200'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-lg font-mono text-xs font-bold flex items-center justify-center shrink-0 border ${
                        issue.code === 'VALENCE_EXCEEDED' || issue.code === 'DISCONNECTED_GRAPH'
                          ? 'bg-rose-100 text-rose-800 border-rose-300'
                          : 'bg-amber-100 text-amber-800 border-amber-300'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <div className="space-y-1">
                      <p className="text-xs text-slate-800 font-semibold leading-relaxed font-sans">
                        {issue.message}
                      </p>
                      {issue.affectedAtomIds.length > 0 && (
                        <div className="flex items-center gap-1.5 pt-1">
                          <span className="text-[10px] text-slate-500 font-medium">
                            Átomos infractores resaltados:
                          </span>
                          {issue.affectedAtomIds.map((id) => (
                            <span
                              key={id}
                              className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 font-mono text-[10px] border border-rose-300 font-bold"
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
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3 shadow-xs">
                  <Info className="w-5 h-5 text-[#008477] shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <h5 className="text-[11px] font-bold text-[#008477] uppercase tracking-wider">
                      Pista Enzimática para este Nivel:
                    </h5>
                    <p className="text-xs text-slate-700 leading-relaxed font-sans">
                      {mission.pedagogicalHint}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer con Acciones */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          {isSuccess ? (
            <>
              <button
                onClick={handleDismiss}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-200/60 border border-slate-300 transition-colors"
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
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#008477] hover:bg-[#006e63] text-white font-bold text-xs transition-all shadow-xs active:scale-95"
                >
                  <span>Siguiente Misión</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleDismiss}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#D97706] hover:bg-[#b45309] text-white font-bold text-xs transition-all shadow-xs active:scale-95"
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
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 border border-slate-300 transition-colors"
                >
                  Apagar halos de error
                </button>
              ) : (
                <span className="text-[11px] text-slate-500 font-mono">
                  Modifica los enlaces o átomos para cumplir la reacción.
                </span>
              )}

              <button
                onClick={handleDismiss}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs transition-all shadow-xs active:scale-95 flex items-center gap-1.5"
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
