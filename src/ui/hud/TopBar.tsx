import React, { useState } from 'react';
import {
  CheckCircle2,
  HelpCircle,
  X,
  Sparkles,
  ArrowLeft,
  Loader2,
  Zap,
  Compass,
} from 'lucide-react';
import { useCanvasStore } from '../../store/useCanvasStore';
import { useGameStore } from '../../store/useGameStore';
import { validateLocalGraph, validateWithRDKit } from '../../core/chemistry';
import { evaluateMission } from '../../core/missions/missionEvaluator';
import { getNextMissionId } from '../../data/missions/progressionMissions';
import { ValidationResult } from '../../core/model/types';
import { FeedbackModal } from '../modals/FeedbackModal';
import { CatalyticReactorModal } from '../modals/CatalyticReactorModal';

export const TopBar: React.FC = () => {
  const graph = useCanvasStore((state) => state.graph);
  const setAtomErrors = useCanvasStore((state) => state.setAtomErrors);
  const clearErrors = useCanvasStore((state) => state.clearErrors);
  const snapAngleDeg = useCanvasStore((state) => state.snapAngleDeg);
  const setSnapAngleDeg = useCanvasStore((state) => state.setSnapAngleDeg);

  const activeRoute = useGameStore((state) => state.activeRoute);
  const currentMissionId = useGameStore((state) => state.currentMissionId);
  const getCurrentMission = useGameStore((state) => state.getCurrentMission);
  const loadNextMission = useGameStore((state) => state.loadNextMission);
  const completeCurrentMission = useGameStore((state) => state.completeCurrentMission);
  const setView = useGameStore((state) => state.setView);

  const [showHelp, setShowHelp] = useState(false);
  const [showReactorModal, setShowReactorModal] = useState(false);
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
            message: 'El lienzo está vacío. Construye o ajusta la molécula antes de evaluar su estructura y estereoquímica.',
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
        // MODO LABORATORIO LIBRE: Validación de valencias y RDKit
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
      console.error('Error durante la evaluación química:', error);
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
      return (
        mission.moduleName ||
        (mission.world === 1
          ? 'Módulo I: Estereoquímica y Haworth'
          : mission.world === 2
          ? 'Módulo II: Vía Glucolítica'
          : 'Módulo III: Complejo PDH')
      );
    }
    switch (activeRoute) {
      case 'sandbox':
        return 'Laboratorio de Síntesis y Modelado Estructural';
      case 'training':
        return 'Módulo I: Estereoquímica y Proyecciones de Haworth';
      case 'glycolysis':
        return 'Módulo II: Vía Glucolítica de Embden-Meyerhof-Parnas';
      case 'pdh':
        return 'Módulo III: Complejo Multienzimático Piruvato Deshidrogenasa';
      default:
        return 'Laboratorio de Modelado';
    }
  };

  return (
    <>
      <header
        className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 select-none pointer-events-none transition-all"
      >
        {/* Identidad de la Aplicación y Botón Menú Principal */}
        <div className="glass-panel px-3.5 py-2 rounded-2xl flex items-center gap-3 border border-white/15 shadow-xl pointer-events-auto bg-[#1B2A4A]/90 max-w-full">
          <button
            id="btn-return-home"
            onClick={() => setView('home')}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition-all text-xs font-semibold group shrink-0"
            title="Volver al Menú Principal (HomeView)"
          >
            <ArrowLeft className="w-4 h-4 text-[#00A896] group-hover:-translate-x-0.5 transition-transform" />
            <div className="bg-slate-100 px-3 py-1 rounded-xl shadow-md border border-white/20 flex items-center justify-center">
              <img
                src={`${import.meta.env.BASE_URL}logo.png`}
                alt="SIMOLA"
                className="h-10 w-auto object-contain"
              />
            </div>
          </button>

          <div className="h-6 w-px bg-white/15 shrink-0" />

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-mono bg-[#00A896]/20 text-[#00c7b2] border border-[#00A896]/40 rounded-full font-bold truncate">
                {getRouteLabel()}
              </span>
            </div>
            {mission ? (
              <span className="text-[10px] text-amber-200/90 font-medium truncate max-w-[200px] sm:max-w-xs">
                {mission.title}
              </span>
            ) : (
              <span className="text-[10px] text-slate-400 font-medium">
                Laboratorio de Síntesis y Modelado Estructural
              </span>
            )}
          </div>
        </div>

        {/* Centro: Selector de Guías Angulares (30°, 45°, 90°, 120°, Libre) */}
        <div className="glass-panel px-2.5 py-1.5 rounded-2xl flex items-center gap-1 border border-white/15 bg-[#1B2A4A]/90 shadow-xl pointer-events-auto">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1 hidden sm:flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-[#00A896]" />
            Guías:
          </span>
          {([30, 45, 90, 120, null] as const).map((deg) => {
            const isSelected = snapAngleDeg === deg;
            return (
              <button
                key={deg === null ? 'free' : `${deg}deg`}
                onClick={() => setSnapAngleDeg(deg)}
                className={`px-2 py-1 rounded-xl text-[10px] font-mono font-bold transition-all border ${
                  isSelected
                    ? 'bg-[#00A896] text-slate-950 border-[#00c7b2] shadow-sm'
                    : 'bg-slate-900/70 text-slate-300 border-white/5 hover:border-white/20 hover:bg-slate-800'
                }`}
                title={deg === null ? 'Movimiento y trazo libre' : `Restricción angular cada ${deg}°`}
              >
                {deg === null ? 'Libre' : `${deg}°`}
              </button>
            );
          })}
        </div>

        {/* Acciones de Catálisis y Evaluación */}
        <div className="flex items-center gap-2 pointer-events-auto self-end md:self-center">
          {/* Contador de Átomos y Enlaces */}
          <div className="glass-panel px-3 py-2 rounded-2xl hidden xl:flex items-center gap-2.5 border border-white/15 text-xs bg-[#1B2A4A]/85">
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

          {/* Botón Centro Activo / Reactor Catalítico */}
          <button
            id="btn-catalytic-reactor"
            onClick={() => setShowReactorModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-[#F77F00] hover:bg-[#ff941a] text-slate-950 font-black text-xs transition-all shadow-lg shadow-[#F77F00]/25 glow-amber active:scale-95"
            title="Abrir Centro Activo / Reactor Catalítico para acoplar holoenzimas y cofactores"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span className="hidden sm:inline">⚡ Reactor Catalítico</span>
          </button>

          {/* Botón Evaluar Estructura y Estereoquímica */}
          <button
            id="btn-verify-structure"
            onClick={handleVerify}
            disabled={isVerifying}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl ${
              isVerifying
                ? 'bg-slate-700 text-slate-400 cursor-wait'
                : 'bg-[#00A896] hover:bg-[#00c7b2] text-slate-950 glow-teal hover:scale-[1.02] active:scale-95'
            } font-black text-xs transition-all shadow-lg shadow-[#00A896]/30`}
            title="Evaluar estructura y estereoquímica contra los criterios bioquímicos"
          >
            {isVerifying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#00A896]" />
                <span>Evaluando...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-slate-950 fill-current" />
                <span>Evaluar Estructura</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Modal del Centro Activo / Reactor Catalítico */}
      <CatalyticReactorModal
        isOpen={showReactorModal}
        onClose={() => setShowReactorModal(false)}
      />

      {/* Modal de Diagnóstico Bioquímico (FeedbackModal) */}
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        result={validationResult}
        moduleName={getRouteLabel()}
        mission={mission}
        onNextMission={() => loadNextMission()}
        hasNextMission={hasNextMission}
      />

      {/* Modal de Ayuda y Atajos de Teclado */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="glass-panel w-full max-w-md rounded-3xl p-6 border border-white/20 shadow-2xl relative bg-[#1B2A4A]/98 text-slate-100">
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
                <h3 className="text-base font-bold text-white">Guía y Controles SIMOLA</h3>
                <p className="text-xs text-slate-400">Modelado molecular y simulación metabólica</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="bg-slate-900/60 p-3 rounded-2xl border border-white/10 space-y-2">
                <p className="font-semibold text-[#00c7b2]">Mecánicas del Modelado:</p>
                <ul className="space-y-1 list-disc list-inside text-slate-300 text-[11px]">
                  <li><strong>Clic Derecho en Átomo:</strong> Abre el menú contextual de Carga Formal (-2 a +2) y Marcaje Isotópico.</li>
                  <li><strong>Hidrógenos Satélite:</strong> Se calculan según la valencia y disminuyen automáticamente al conectar enlaces.</li>
                  <li><strong>Guías Angulares:</strong> Selecciona 30°, 45°, 90° (Haworth axial) o Libre en la barra superior.</li>
                  <li><strong>⚡ Reactor Catalítico:</strong> Configura sustrato, enzima y cofactores para avanzar etapas metabólicas.</li>
                  <li><strong>Librería Química:</strong> Explora grupos funcionales, holoenzimas con código EC y cofactores con doble clic.</li>
                </ul>
              </div>

              <div className="bg-slate-900/60 p-3 rounded-2xl border border-white/10">
                <p className="font-semibold text-[#ff941a] mb-2 flex items-center gap-1.5 text-[11px]">
                  Atajos de Teclado:
                </p>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="flex justify-between items-center"><span className="text-slate-400">Seleccionar:</span> <kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">V</kbd></div>
                  <div className="flex justify-between items-center"><span className="text-slate-400">Átomo:</span> <kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">A</kbd></div>
                  <div className="flex justify-between items-center"><span className="text-slate-400">Enlace:</span> <kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">B</kbd></div>
                  <div className="flex justify-between items-center"><span className="text-slate-400">Borrador:</span> <kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">E</kbd></div>
                  <div className="flex justify-between items-center"><span className="text-slate-400">Deshacer:</span> <kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">Ctrl+Z</kbd></div>
                  <div className="flex justify-between items-center"><span className="text-slate-400">Rehacer:</span> <kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">Ctrl+Y</kbd></div>
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
