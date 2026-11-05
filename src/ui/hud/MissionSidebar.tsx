import React, { useState } from 'react';
import {
  RotateCcw,
  BookOpen,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Activity,
  Layers,
  FlaskConical,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Zap,
  CheckCircle2,
  ListOrdered,
} from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';
import { useCanvasStore } from '../../store/useCanvasStore';
import {
  getMissionsByWorld,
} from '../../data/missions/progressionMissions';

export const MissionSidebar: React.FC = () => {
  const currentMissionId = useGameStore((state) => state.currentMissionId);
  const getCurrentMission = useGameStore((state) => state.getCurrentMission);
  const resetCurrentMission = useGameStore((state) => state.resetCurrentMission);
  const loadMission = useGameStore((state) => state.loadMission);
  const isMissionCompleted = useGameStore((state) => state.isMissionCompleted);
  const metaboliteReservoir = useGameStore((state) => state.metaboliteReservoir);
  const assistedMode = useGameStore((state) => state.assistedMode);
  const toggleAssistedMode = useGameStore((state) => state.toggleAssistedMode);
  const isMissionSidebarOpen = useGameStore((state) => state.isMissionSidebarOpen);
  const setMissionSidebarOpen = useGameStore((state) => state.setMissionSidebarOpen);

  const setGraph = useCanvasStore((state) => state.setGraph);
  const clearErrors = useCanvasStore((state) => state.clearErrors);

  const [isMechanismExpanded, setIsMechanismExpanded] = useState<boolean>(true);
  const [showStageSelector, setShowStageSelector] = useState<boolean>(false);

  const mission = getCurrentMission();

  // Determinar Módulo y Etapas
  const worldNum = mission ? mission.world : 2;
  const worldMissions = getMissionsByWorld(worldNum);
  const currentIndex = mission ? worldMissions.findIndex((m) => m.id === currentMissionId) : -1;
  const stepNumber = mission ? (mission.stepNumber || (currentIndex >= 0 ? currentIndex + 1 : 1)) : 1;
  const totalSteps = mission ? (mission.totalSteps || worldMissions.length) : worldMissions.length;

  const moduleTitle = mission
    ? mission.moduleName ||
      (mission.world === 1
        ? 'Módulo I: Estereoquímica y Haworth'
        : mission.world === 2
        ? 'Módulo II: Vía Glucolítica EMP'
        : 'Módulo III: Complejo PDH')
    : 'Catálogo de Misiones y Rutas';

  // Acción de Autoconstruir Producto Final (Modo Asistencia Guiada)
  const handleBuildFinalProduct = () => {
    if (mission && mission.solutionGraph) {
      setGraph(mission.solutionGraph);
      clearErrors();
    }
  };

  // =========================================================================
  // ESTADO CONTRAÍDO (Pestaña Lateral Derecha)
  // =========================================================================
  if (!isMissionSidebarOpen) {
    return (
      <div className="fixed top-24 right-0 z-30 select-none animate-fadeIn">
        <button
          id="btn-sidebar-expand"
          onClick={() => setMissionSidebarOpen(true)}
          className="cad-panel text-slate-800 pl-3.5 pr-2.5 py-2.5 rounded-l-lg border-r-0 border-slate-300 shadow-xl hover:shadow-[#008477]/20 transition-all flex items-center gap-2 active:scale-95 group text-xs font-mono font-bold bg-white"
          title="Abrir panel lateral de misión y descripción bioquímica"
        >
          <ChevronLeft className="w-4 h-4 text-[#008477] group-hover:-translate-x-0.5 transition-transform" />
          <div className="flex flex-col text-left">
            <span className="text-[10px] text-[#008477]">
              {mission ? `ETAPA ${stepNumber}/${totalSteps}` : 'MISIÓN'}
            </span>
            <span className="text-[11px] text-slate-900 truncate max-w-[140px]">
              {mission ? mission.title : 'Ver Misiones'}
            </span>
          </div>
        </button>
      </div>
    );
  }

  // =========================================================================
  // ESTADO EXPANDIDO (Panel Lateral Completo)
  // =========================================================================
  return (
    <aside
      id="mission-sidebar"
      className="fixed top-0 right-0 bottom-0 h-screen w-88 sm:w-96 max-w-[90vw] z-40 flex flex-col bg-white border-l border-slate-200 select-none text-slate-800 overflow-hidden shadow-2xl animate-fadeIn font-mono"
    >
      {/* 1. Encabezado del Módulo y Controles de Panel */}
      <div className="p-3.5 border-b border-slate-200 bg-slate-50 shrink-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#008477] flex items-center gap-1.5 truncate">
            <Layers className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{moduleTitle}</span>
          </span>

          <div className="flex items-center gap-1.5 shrink-0">
            {mission && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#008477]/10 text-[#008477] border border-[#008477]/30">
                {stepNumber}/{totalSteps}
              </span>
            )}
            <button
              id="btn-sidebar-collapse"
              onClick={() => setMissionSidebarOpen(false)}
              className="p-1 rounded text-slate-400 hover:text-slate-800 hover:bg-slate-200 transition-colors"
              title="Ocultar panel lateral"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <h2 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
          {mission ? mission.title : 'Laboratorio Libre — Selecciona una Misión'}
        </h2>

        {/* Clasificación Enzimática EC y ΔG°' */}
        {mission && (mission.enzymeName || mission.ecNumber || mission.deltaG) && (
          <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px] font-semibold">
            {mission.ecNumber && (
              <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200">
                {mission.ecNumber}
              </span>
            )}
            {mission.deltaG && (
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                ΔG°' = {mission.deltaG}
              </span>
            )}
            {mission.enzymeName && !mission.ecNumber && (
              <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 truncate max-w-[200px]">
                {mission.enzymeName}
              </span>
            )}
          </div>
        )}

        {/* Interruptor de Modo Asistencia Guiada */}
        <div className="mt-2.5 pt-2 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700">
            <Sparkles className="w-3.5 h-3.5 text-[#008477]" />
            <span>Guía Asistida:</span>
          </div>

          <button
            type="button"
            id="btn-toggle-assisted-mode"
            onClick={toggleAssistedMode}
            className="flex items-center gap-1 text-[10px] font-bold transition-all"
            title="Activa resaltado en lienzo, pasos de solución y autoconstrucción de producto"
          >
            {assistedMode ? (
              <ToggleRight className="w-5 h-5 text-[#008477]" />
            ) : (
              <ToggleLeft className="w-5 h-5 text-slate-400" />
            )}
            <span className={assistedMode ? 'text-[#008477]' : 'text-slate-500'}>
              {assistedMode ? 'ON' : 'OFF'}
            </span>
          </button>
        </div>
      </div>

      {/* 2. Cuerpo del Panel con Desplazamiento Fluido */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 text-xs">
        {/* DESCRIPCIÓN Y OBJETIVO DE LA MISIÓN (Destacado y claramente visible) */}
        {mission ? (
          <div className="p-3.5 rounded-lg border border-[#008477]/40 space-y-1.5 bg-slate-50 shadow-sm">
            <div className="flex items-center gap-1.5 text-[#008477] font-bold text-xs uppercase tracking-wider">
              <Activity className="w-4 h-4 text-[#D97706]" />
              <span>DESCRIPCIÓN DE LA MISIÓN:</span>
            </div>
            <p className="text-slate-800 leading-relaxed font-sans text-xs sm:text-[13px]">
              {mission.objectiveDescription}
            </p>
          </div>
        ) : (
          <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
            <div className="flex items-center gap-1.5 text-slate-700 font-bold text-xs uppercase tracking-wider">
              <FlaskConical className="w-4 h-4 text-[#008477]" />
              <span>Modo Laboratorio de Síntesis</span>
            </div>
            <p className="text-slate-600 font-sans text-xs leading-relaxed">
              Estás en la pizarra libre. Puedes dibujar cualquier molécula, evaluar su valencia con RDKit o seleccionar una misión del catálogo a continuación:
            </p>
          </div>
        )}

        {/* Guía de Asistencia Guiada y Botón de Auto-Construcción */}
        {assistedMode && mission && (
          <div className="p-3 rounded-lg bg-teal-50 border border-teal-200 space-y-2 animate-fadeIn">
            <div className="flex items-center gap-1.5 text-[#008477] font-bold text-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Solución Paso a Paso:</span>
            </div>

            {mission.guidedInstructions && mission.guidedInstructions.length > 0 ? (
              <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-800">
                {mission.guidedInstructions.map((step, idx) => (
                  <li key={`guide_${idx}`}>{step}</li>
                ))}
              </ol>
            ) : (
              <p className="text-[11px] text-slate-800">
                {mission.pedagogicalHint}
              </p>
            )}

            {mission.solutionGraph && (
              <button
                id="btn-auto-build-product"
                onClick={handleBuildFinalProduct}
                className="w-full mt-2 py-1.5 px-3 rounded-md bg-[#008477] hover:bg-[#006D62] text-white font-bold text-xs transition-all shadow-sm active:scale-95 flex items-center justify-center gap-1.5"
                title="Estampar la estructura molecular validada directamente en el lienzo"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>⚡ Construir Producto Final en Pizarra</span>
              </button>
            )}
          </div>
        )}

        {/* Selector de Etapas del Módulo (Navegación Rápida) */}
        <div className="rounded-lg border border-slate-200 bg-white overflow-hidden shadow-sm">
          <button
            onClick={() => setShowStageSelector(!showStageSelector)}
            className="w-full p-2.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs">
              <ListOrdered className="w-3.5 h-3.5 text-[#008477]" />
              <span>ETAPAS DEL MÓDULO ({worldMissions.length})</span>
            </div>
            {showStageSelector ? (
              <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            )}
          </button>

          {showStageSelector && (
            <div className="p-2 border-t border-slate-200 space-y-1 max-h-48 overflow-y-auto">
              {worldMissions.map((m, idx) => {
                const isCurrent = m.id === currentMissionId;
                const isCompleted = isMissionCompleted(m.id);
                return (
                  <button
                    key={m.id}
                    onClick={() => loadMission(m.id)}
                    className={`w-full p-2 rounded-md text-left text-xs transition-all flex items-center justify-between gap-2 border ${
                      isCurrent
                        ? 'bg-[#008477]/10 border-[#008477] text-[#008477] font-bold'
                        : isCompleted
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {isCompleted ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      ) : (
                        <span className="w-3.5 h-3.5 rounded-full border border-slate-400 flex items-center justify-center text-[9px] font-bold shrink-0">
                          {idx + 1}
                        </span>
                      )}
                      <span className="truncate">{m.title}</span>
                    </div>
                    {isCurrent && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#008477] text-white shrink-0">
                        Actual
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Sección Desplegable: Fundamento Mecanístico (IUPAC / EC) */}
        {mission && (
          <div className="rounded-lg border border-slate-200 bg-white overflow-hidden shadow-sm">
            <button
              onClick={() => setIsMechanismExpanded(!isMechanismExpanded)}
              className="w-full p-2.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-1.5 font-bold text-amber-800 text-xs">
                <BookOpen className="w-3.5 h-3.5 text-[#D97706]" />
                <span>🔬 FUNDAMENTO MECANÍSTICO</span>
              </div>
              {isMechanismExpanded ? (
                <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              )}
            </button>

            {isMechanismExpanded && (
              <div className="p-3 pt-0 space-y-2 text-slate-700 border-t border-slate-100 font-sans">
                <p className="text-[11px] leading-relaxed text-slate-700">
                  {mission.pedagogicalHint}
                </p>
                {mission.biochemicalContext && (
                  <div className="p-2 rounded bg-slate-50 border border-slate-200 text-[11px] text-slate-600 leading-relaxed font-sans">
                    <strong className="text-slate-800 block mb-1 font-mono">
                      Significado Fisiológico:
                    </strong>
                    {mission.biochemicalContext}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Reservorio de Metabolitos y Balance Estequiométrico */}
        <div className="p-3 rounded-lg border border-slate-200 bg-white space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-[#008477] text-xs">
              <FlaskConical className="w-3.5 h-3.5 text-[#008477]" />
              <span>Reservorio de Metabolitos</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
              {metaboliteReservoir.length} {metaboliteReservoir.length === 1 ? 'Especie' : 'Especies'}
            </span>
          </div>

          {metaboliteReservoir.length === 0 ? (
            <div className="p-2.5 rounded bg-slate-50 border border-dashed border-slate-300 text-center text-slate-500 text-[11px]">
              Sin subproductos aún. Usa el <strong>⚡ Reactor Catalítico</strong>.
            </div>
          ) : (
            <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
              {metaboliteReservoir.map((item) => (
                <div
                  key={item.id}
                  className="p-1.5 rounded bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#008477] shrink-0" />
                    <span className="font-semibold text-slate-800 truncate text-xs">
                      {item.name}
                    </span>
                    {item.formula && (
                      <span className="text-[10px] text-slate-500">
                        ({item.formula})
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 shrink-0">
                    {item.stoichiometry || `×${item.count}`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 3. Pie de Barra Lateral */}
      <div className="p-3 border-t border-slate-200 bg-slate-50 shrink-0 flex items-center gap-2">
        {mission && (
          <button
            id="btn-sidebar-reset"
            onClick={resetCurrentMission}
            className="flex-1 py-1.5 px-3 rounded-lg text-xs font-bold bg-white hover:bg-slate-100 text-slate-700 hover:text-black border border-slate-300 transition-all shadow-sm active:scale-95 flex items-center justify-center gap-1.5 group"
            title="Restaurar el esqueleto inicial de esta etapa"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500 group-hover:rotate-180 transition-transform duration-500" />
            <span>🔄 Reiniciar</span>
          </button>
        )}

        <button
          onClick={() => setMissionSidebarOpen(false)}
          className="py-1.5 px-3 rounded-lg text-xs text-slate-600 hover:text-black hover:bg-slate-200 border border-slate-300 transition-all flex items-center gap-1"
          title="Ocultar panel"
        >
          <ChevronRight className="w-3.5 h-3.5" />
          <span>Ocultar</span>
        </button>
      </div>
    </aside>
  );
};

export default MissionSidebar;
