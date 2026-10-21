import React, { useState } from 'react';
import {
  CheckCircle2,
  HelpCircle,
  X,
  Sparkles,
  ArrowLeft,
  Flame,
  Loader2,
  RotateCcw,
  Lightbulb,
} from 'lucide-react';
import { useCanvasStore } from '../../store/useCanvasStore';
import { useGameStore } from '../../store/useGameStore';
import { validateLocalGraph, validateWithRDKit } from '../../core/chemistry';
import { evaluateMission } from '../../core/missions/missionEvaluator';
import { getNextMissionId } from '../../data/missions/progressionMissions';
import { ValidationResult } from '../../core/model/types';
import { FeedbackModal } from '../modals/FeedbackModal';

export const TopBar: React.FC = () => {
  const graph = useCanvasStore((state) => state.graph);
  const setAtomErrors = useCanvasStore((state) => state.setAtomErrors);
  const clearErrors = useCanvasStore((state) => state.clearErrors);

  const activeRoute = useGameStore((state) => state.activeRoute);
  const currentMissionId = useGameStore((state) => state.currentMissionId);
  const getCurrentMission = useGameStore((state) => state.getCurrentMission);
  const loadNextMission = useGameStore((state) => state.loadNextMission);
  const resetCurrentMission = useGameStore((state) => state.resetCurrentMission);
  const completeCurrentMission = useGameStore((state) => state.completeCurrentMission);
  const isHintOpen = useGameStore((state) => state.isHintOpen);
  const toggleHint = useGameStore((state) => state.toggleHint);
  const setView = useGameStore((state) => state.setView);

  const [showHelp, setShowHelp] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const mission = getCurrentMission();
  const atomCount = Object.keys(graph.nodes).length;
  const bondCount = Object.keys(graph.edges).length;
  const hasNextMission = currentMissionId ? !!getNextMissionId(currentMissionId) : false;

  const handleVerify = async () => {
    if (isVerifying) return;

    if (atomCount === 0) {
      setValidationResult({
        isValid: false,
        passedLayer1: false,
        passedMission: false,
        issues: [
          {
            code: 'INVALID_CHEMISTRY',
            message: 'El lienzo está vacío. Coloca átomos y conéctalos con enlaces antes de verificar.',
            affectedAtomIds: [],
          },
        ],
      });
      setShowFeedbackModal(true);
      return;
    }

    setIsVerifying(true);

    try {
      if (mission) {
        // MODO MISIÓN: Orquestador evaluador de misión y diagnóstico diferencial
        const result = await evaluateMission(graph, mission);
        setValidationResult(result);

        if (result.passedMission) {
          clearErrors();
          completeCurrentMission();
        } else {
          const affectedIds = result.issues.flatMap((issue) => issue.affectedAtomIds);
          if (affectedIds.length > 0) {
            setAtomErrors(affectedIds);
          }
        }

        setShowFeedbackModal(true);
      } else {
        // MODO SANDBOX: Validación clásica de dos capas
        const localResult = validateLocalGraph(graph, {
          mustBeConnected: activeRoute !== 'sandbox',
        });

        if (!localResult.isValid) {
          const affectedIds = localResult.issues.flatMap((issue) => issue.affectedAtomIds);
          setAtomErrors(affectedIds);
          setValidationResult(localResult);
          setShowFeedbackModal(true);
          return;
        }

        clearErrors();
        const rdkitResult = await validateWithRDKit(graph);
        setValidationResult(rdkitResult);

        if (!rdkitResult.isValid) {
          const affectedIds = rdkitResult.issues.flatMap((issue) => issue.affectedAtomIds);
          if (affectedIds.length > 0) {
            setAtomErrors(affectedIds);
          }
        }

        setShowFeedbackModal(true);
      }
    } catch (error) {
      console.error('Error durante la verificación:', error);
      setValidationResult({
        isValid: false,
        passedLayer1: true,
        passedMission: false,
        issues: [
          {
            code: 'INVALID_CHEMISTRY',
            message: 'Ocurrió un error inesperado al procesar la estructura con el motor químico RDKit.',
            affectedAtomIds: [],
          },
        ],
      });
      setShowFeedbackModal(true);
    } finally {
      setIsVerifying(false);
    }
  };

  const getRouteLabel = () => {
    if (mission) {
      return mission.enzymeName || mission.title;
    }
    switch (activeRoute) {
      case 'sandbox':
        return 'Laboratorio Libre (Sandbox)';
      case 'training':
        return 'Entrenamiento Químico';
      case 'glycolysis':
        return 'Ruta de la Glucólisis';
      case 'pdh':
        return 'Complejo PDH';
      default:
        return 'SIMOLA Sandbox';
    }
  };

  return (
    <>
      <header className="absolute top-4 left-4 right-4 z-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 select-none pointer-events-none">
        {/* Identidad de la Aplicación y Botón Menú Principal */}
        <div className="glass-panel px-3.5 py-2 rounded-2xl flex items-center gap-3 border border-white/15 shadow-xl pointer-events-auto bg-[#1B2A4A]/90 max-w-full">
          <button
            id="btn-return-home"
            onClick={() => setView('home')}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition-all text-xs font-semibold group shrink-0"
            title="Volver al Menú Principal (HomeView)"
          >
            <ArrowLeft className="w-4 h-4 text-[#00A896] group-hover:-translate-x-0.5 transition-transform" />
            <div className="bg-slate-100/95 px-2 py-1 rounded-xl shadow-md border border-white/20 flex items-center justify-center">
              <img
                src={`${import.meta.env.BASE_URL}logo.png`}
                alt="SIMOLA Logo"
                className="w-6 h-6 object-contain"
              />
            </div>
          </button>

          <div className="h-6 w-px bg-white/15 shrink-0" />

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm tracking-tight text-white shrink-0">
                SIMOLA
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono bg-[#00A896]/20 text-[#00c7b2] border border-[#00A896]/40 rounded-full font-bold truncate">
                {getRouteLabel()}
              </span>
            </div>
            {mission ? (
              <span className="text-[10px] text-amber-200/90 font-medium truncate max-w-[280px] sm:max-w-md">
                {mission.objectiveDescription}
              </span>
            ) : (
              <span className="text-[10px] text-slate-400 font-medium">
                Pizarra Molecular y Metabólica Libre
              </span>
            )}
          </div>
        </div>

        {/* Acciones de Misión y Controles Principales */}
        <div className="flex items-center gap-2.5 pointer-events-auto self-end md:self-center">
          {/* BOTÓN PISTA ENZIMÁTICA (Phosphate Amber #F77F00) cuando hay misión activa */}
          {mission && (
            <button
              id="btn-mission-hint"
              onClick={() => toggleHint()}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold transition-all border shadow-md active:scale-95 ${
                isHintOpen
                  ? 'bg-[#F77F00] text-slate-950 border-[#ff941a] glow-amber'
                  : 'bg-[#F77F00]/15 hover:bg-[#F77F00]/25 text-[#ff941a] border-[#F77F00]/40'
              }`}
              title="Ver pista pedagógica de la reacción"
            >
              <Lightbulb className="w-4 h-4 fill-current" />
              <span className="hidden sm:inline">Pista Enzimática</span>
            </button>
          )}

          {/* BOTÓN REINICIAR ESQUELETO (cuando hay misión activa) */}
          {mission && (
            <button
              id="btn-reset-mission"
              onClick={resetCurrentMission}
              className="glass-panel p-2.5 rounded-2xl text-slate-300 hover:text-white hover:bg-white/10 transition-all border border-white/15 shadow-lg bg-[#1B2A4A]/85 active:scale-95"
              title="Reiniciar al esqueleto inicial de la misión"
            >
              <RotateCcw className="w-4 h-4 text-slate-300" />
            </button>
          )}

          {/* Contador de Átomos y Enlaces */}
          <div className="glass-panel px-3 py-2 rounded-2xl hidden lg:flex items-center gap-2.5 border border-white/15 text-xs bg-[#1B2A4A]/85">
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-[#00A896]" />
              <span>
                Átomos: <strong className="font-mono text-white">{atomCount}</strong>
              </span>
            </div>
            <span className="text-slate-600">|</span>
            <div className="flex items-center gap-1.5 text-slate-300">
              <span>
                Enlaces: <strong className="font-mono text-white">{bondCount}</strong>
              </span>
            </div>
          </div>

          {/* Botón de Ayuda / Atajos */}
          <button
            id="btn-help-shortcuts"
            onClick={() => setShowHelp(true)}
            className="glass-panel p-2.5 rounded-2xl text-slate-300 hover:text-white hover:bg-white/10 transition-all border border-white/15 shadow-lg bg-[#1B2A4A]/85"
            title="Atajos de teclado y ayuda"
          >
            <HelpCircle className="w-4 h-4 text-slate-300" />
          </button>

          {/* Botón de Verificar Reacción (Vibrant Catalytic Teal #00A896) */}
          <button
            id="btn-verify-structure"
            onClick={handleVerify}
            disabled={isVerifying}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl ${
              isVerifying
                ? 'bg-slate-700 text-slate-400 cursor-wait'
                : 'bg-[#00A896] hover:bg-[#00c7b2] text-slate-950 glow-teal hover:scale-[1.02] active:scale-95'
            } font-black text-xs transition-all shadow-lg shadow-[#00A896]/30`}
            title="Verificar reacción contra las condiciones de victoria de la enzima"
          >
            {isVerifying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#00A896]" />
                <span>Analizando...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-slate-950 fill-current" />
                <span>Verificar Reacción</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* BANNER DESPLEGABLE DE PISTA ENZIMÁTICA */}
      {isHintOpen && mission && (
        <div className="absolute top-20 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:max-w-xl z-20 pointer-events-auto animate-fadeIn">
          <div className="glass-panel p-4 rounded-3xl bg-[#1B2A4A]/95 border-2 border-[#F77F00]/50 shadow-2xl text-slate-100 flex items-start gap-3">
            <div className="p-2 rounded-2xl bg-[#F77F00]/20 text-[#ff941a] shrink-0 border border-[#F77F00]/30">
              <Flame className="w-5 h-5" />
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-[#ff941a]">
                  Pista Enzimática — {mission.enzymeName || mission.title}
                </span>
                <button
                  onClick={() => toggleHint(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {mission.pedagogicalHint}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Diagnóstico Bioquímico (FeedbackModal) */}
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        result={validationResult}
        moduleName={getRouteLabel()}
        mission={mission}
        onNextMission={handleNextMissionWrapper(loadNextMission)}
        hasNextMission={hasNextMission}
      />

      {/* Modal de Ayuda y Atajos de Teclado */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="glass-panel w-full max-w-md rounded-3xl p-6 border border-white/20 shadow-2xl relative bg-[#1B2A4A]/95">
            <button
              onClick={() => setShowHelp(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2 rounded-xl bg-[#00A896]/20 text-[#00A896]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Controles Asistidos SIMOLA</h3>
                <p className="text-xs text-slate-400">Guía de interacción molecular ergonómica</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="bg-slate-900/60 p-3 rounded-2xl border border-white/10 space-y-2">
                <p className="font-semibold text-[#00c7b2]">Mecánicas del Editor:</p>
                <ul className="space-y-1 list-disc list-inside text-slate-300">
                  <li><strong>Colocar Átomo:</strong> Clic en el lienzo para añadir el elemento activo. Clic sobre un átomo para transmutarlo.</li>
                  <li><strong>Crear Enlaces:</strong> En modo enlace, arrastra de un átomo a otro con la línea guía magnética.</li>
                  <li><strong>Ciclar Enlaces:</strong> Clic en cualquier enlace alterna entre simple, doble y triple.</li>
                  <li><strong>Anillos y Fusión:</strong> Elige un anillo (3 a 8 lados); haz clic en vacío para estamparlo o sobre un enlace para fusionarlo.</li>
                  <li><strong>Plantillas y Sprout:</strong> Clic en un átomo con una plantilla activa para acoplarla directamente.</li>
                  <li><strong>Carga Formal (+ / −):</strong> Pasa el ratón sobre cualquier átomo para subir o bajar su carga formal.</li>
                </ul>
              </div>

              <div className="bg-slate-900/60 p-3 rounded-2xl border border-white/10">
                <p className="font-semibold text-[#ff941a] mb-2 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-[#F77F00]" />
                  Atajos de Teclado:
                </p>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="flex justify-between items-center"><span className="text-slate-400">Seleccionar:</span> <kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">V</kbd></div>
                  <div className="flex justify-between items-center"><span className="text-slate-400">Átomo:</span> <kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">A</kbd></div>
                  <div className="flex justify-between items-center"><span className="text-slate-400">Enlace:</span> <kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">B</kbd></div>
                  <div className="flex justify-between items-center"><span className="text-slate-400">Borrador:</span> <kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">E</kbd></div>
                  <div className="flex justify-between items-center"><span className="text-slate-400">Deshacer:</span> <kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">Ctrl+Z</kbd></div>
                  <div className="flex justify-between items-center"><span className="text-slate-400">Rehacer:</span> <kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">Ctrl+Y</kbd></div>
                  <div className="flex justify-between items-center"><span className="text-slate-400">Enlaces 1/2/3:</span> <kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">1, 2, 3</kbd></div>
                  <div className="flex justify-between items-center"><span className="text-slate-400">Elementos:</span> <kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">C, H, O...</kbd></div>
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setShowHelp(false)}
                className="px-4 py-2 rounded-xl bg-[#00A896] hover:bg-[#00c7b2] text-slate-950 font-bold text-xs transition-all shadow-md"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

function handleNextMissionWrapper(loadNextMission: () => boolean) {
  return () => {
    loadNextMission();
  };
}
