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
} from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';
import { useCanvasStore } from '../../store/useCanvasStore';
import { getMissionsByWorld } from '../../data/missions/progressionMissions';

export const MissionSidebar: React.FC = () => {
  const currentMissionId = useGameStore((state) => state.currentMissionId);
  const getCurrentMission = useGameStore((state) => state.getCurrentMission);
  const resetCurrentMission = useGameStore((state) => state.resetCurrentMission);
  const metaboliteReservoir = useGameStore((state) => state.metaboliteReservoir);
  const assistedMode = useGameStore((state) => state.assistedMode);
  const toggleAssistedMode = useGameStore((state) => state.toggleAssistedMode);

  const setGraph = useCanvasStore((state) => state.setGraph);
  const clearErrors = useCanvasStore((state) => state.clearErrors);

  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [isMechanismExpanded, setIsMechanismExpanded] = useState<boolean>(true);

  const mission = getCurrentMission();
  if (!mission || !currentMissionId) return null;

  // Determinar Módulo y Etapa
  const worldMissions = getMissionsByWorld(mission.world);
  const currentIndex = worldMissions.findIndex((m) => m.id === currentMissionId);
  const stepNumber = mission.stepNumber || (currentIndex >= 0 ? currentIndex + 1 : 1);
  const totalSteps = mission.totalSteps || worldMissions.length;

  const moduleTitle =
    mission.moduleName ||
    (mission.world === 1
      ? 'Módulo I: Estereoquímica y Proyecciones de Haworth'
      : mission.world === 2
      ? 'Módulo II: Vía Glucolítica de Embden-Meyerhof-Parnas'
      : 'Módulo III: Complejo Multienzimático Piruvato Deshidrogenasa');

  // Acción de Autoconstruir Producto Final (Modo Asistencia Guiada)
  const handleBuildFinalProduct = () => {
    if (mission.solutionGraph) {
      setGraph(mission.solutionGraph);
      clearErrors();
    }
  };

  // =========================================================================
  // ESTADO CONTRAÍDO (Pestaña Lateral Derecha)
  // =========================================================================
  if (!isExpanded) {
    return (
      <div className="fixed top-24 right-0 z-30 select-none animate-fadeIn">
        <button
          id="btn-sidebar-expand"
          onClick={() => setIsExpanded(true)}
          className="cad-panel text-white pl-3.5 pr-2.5 py-2.5 rounded-l-lg border-r-0 border-[#00A896]/40 shadow-2xl hover:shadow-[#00A896]/20 transition-all flex items-center gap-2 active:scale-95 group text-xs font-mono font-bold bg-[#16233e]"
          title="Expandir panel lateral de misión y descripción bioquímica"
        >
          <ChevronLeft className="w-4 h-4 text-[#00A896] group-hover:-translate-x-0.5 transition-transform" />
          <div className="flex flex-col text-left">
            <span className="text-[10px] text-[#00c7b2]">
              🔬 ETAPA {stepNumber}/{totalSteps}
            </span>
            <span className="text-[11px] text-slate-200 truncate max-w-[140px]">
              {mission.title}
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
      className="fixed top-0 right-0 bottom-0 h-screen w-80 sm:w-96 max-w-[90vw] z-30 flex flex-col cad-panel border-l border-[#00A896]/40 select-none text-slate-100 overflow-hidden shadow-2xl backdrop-blur-md animate-fadeIn"
    >
      {/* 1. Encabezado del Módulo y Controles de Panel */}
      <div className="p-3.5 border-b border-[#00A896]/30 bg-[#16233e] shrink-0">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-[10px] font-mono font-black uppercase tracking-wider text-[#00A896] flex items-center gap-1.5 truncate">
            <Layers className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{moduleTitle}</span>
          </span>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#00A896]/20 text-[#00c7b2] border border-[#00A896]/40">
              {stepNumber}/{totalSteps}
            </span>
            <button
              id="btn-sidebar-collapse"
              onClick={() => setIsExpanded(false)}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Ocultar panel lateral para despejar el lienzo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <h2 className="text-xs sm:text-sm font-mono font-bold text-white leading-snug">
          {mission.title}
        </h2>

        {/* Clasificación Enzimática EC y ΔG°' */}
        {(mission.enzymeName || mission.ecNumber || mission.deltaG) && (
          <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px] font-mono font-semibold">
            {mission.ecNumber && (
              <span className="px-2 py-0.5 rounded bg-sky-500/15 text-sky-300 border border-sky-500/30">
                {mission.ecNumber}
              </span>
            )}
            {mission.deltaG && (
              <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                ΔG°' = {mission.deltaG}
              </span>
            )}
            {mission.enzymeName && !mission.ecNumber && (
              <span className="px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30 truncate max-w-[200px]">
                {mission.enzymeName}
              </span>
            )}
          </div>
        )}

        {/* Interruptor de Modo Asistencia Guiada */}
        <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-[#00A896]" />
            <span>Modo Asistencia Guiada:</span>
          </div>

          <button
            type="button"
            id="btn-toggle-assisted-mode"
            onClick={toggleAssistedMode}
            className="flex items-center gap-1 text-[10px] font-mono font-bold transition-all"
            title="Activa resaltado en lienzo, pasos de solución y autoconstrucción de producto"
          >
            {assistedMode ? (
              <ToggleRight className="w-5 h-5 text-[#00A896]" />
            ) : (
              <ToggleLeft className="w-5 h-5 text-slate-500" />
            )}
            <span className={assistedMode ? 'text-[#00c7b2]' : 'text-slate-400'}>
              {assistedMode ? 'ON' : 'OFF'}
            </span>
          </button>
        </div>
      </div>

      {/* 2. Cuerpo del Panel con Desplazamiento Fluido */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 text-xs">
        {/* DESCRIPCIÓN Y OBJETIVO DE LA MISIÓN (Destacado y claramente visible) */}
        <div className="cad-panel p-3.5 rounded-lg border border-[#00A896]/40 space-y-1.5 bg-[#16233e]/80">
          <div className="flex items-center gap-1.5 text-[#00c7b2] font-mono font-bold text-xs uppercase tracking-wider">
            <Activity className="w-4 h-4 text-[#F77F00]" />
            <span>DESCRIPCIÓN DE LA MISIÓN:</span>
          </div>
          <p className="text-slate-100 leading-relaxed font-sans text-xs sm:text-[13px]">
            {mission.objectiveDescription}
          </p>
        </div>

        {/* Guía de Asistencia Guiada y Botón de Auto-Construcción */}
        {assistedMode && (
          <div className="p-3 rounded-md bg-[#00A896]/15 border border-[#00A896]/50 space-y-2 animate-fadeIn">
            <div className="flex items-center gap-1.5 text-[#00c7b2] font-mono font-bold text-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Solución Paso a Paso:</span>
            </div>

            {mission.guidedInstructions && mission.guidedInstructions.length > 0 ? (
              <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-200 font-mono">
                {mission.guidedInstructions.map((step, idx) => (
                  <li key={`guide_${idx}`}>{step}</li>
                ))}
              </ol>
            ) : (
              <p className="text-[11px] text-slate-200 font-mono">
                {mission.pedagogicalHint}
              </p>
            )}

            {mission.solutionGraph && (
              <button
                id="btn-auto-build-product"
                onClick={handleBuildFinalProduct}
                className="w-full mt-2 py-1.5 px-3 rounded-md bg-[#00A896] hover:bg-[#00c7b2] text-slate-950 font-mono font-black text-xs transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
                title="Estampar la estructura molecular validada directamente en el lienzo"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>⚡ Construir Producto Final en Pizarra</span>
              </button>
            )}
          </div>
        )}

        {/* Sección Desplegable: Fundamento Mecanístico (IUPAC / EC) */}
        <div className="bg-slate-900/80 rounded-md border border-[#00A896]/20 overflow-hidden transition-all">
          <button
            onClick={() => setIsMechanismExpanded(!isMechanismExpanded)}
            className="w-full p-2.5 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-1.5 font-mono font-bold text-[#ff941a] text-xs">
              <BookOpen className="w-3.5 h-3.5 text-[#F77F00]" />
              <span>🔬 FUNDAMENTO MECANÍSTICO</span>
            </div>
            {isMechanismExpanded ? (
              <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {isMechanismExpanded && (
            <div className="p-3 pt-0 space-y-2 text-slate-300 border-t border-white/5 font-sans">
              <p className="text-[11px] leading-relaxed text-slate-200">
                {mission.pedagogicalHint}
              </p>
              {mission.biochemicalContext && (
                <div className="p-2 rounded bg-slate-950/70 border border-white/5 text-[11px] text-slate-400 leading-relaxed">
                  <strong className="text-slate-200 block mb-1 font-mono">
                    Significado Fisiológico:
                  </strong>
                  {mission.biochemicalContext}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Reservorio de Metabolitos y Balance Estequiométrico */}
        <div className="bg-slate-900/80 p-3 rounded-md border border-[#00A896]/20 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-mono font-bold text-[#00c7b2] text-xs">
              <FlaskConical className="w-3.5 h-3.5 text-[#00A896]" />
              <span>Reservorio de Metabolitos</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-white/10">
              {metaboliteReservoir.length} {metaboliteReservoir.length === 1 ? 'Especie' : 'Especies'}
            </span>
          </div>

          {metaboliteReservoir.length === 0 ? (
            <div className="p-2.5 rounded bg-slate-950/60 border border-dashed border-slate-700 text-center text-slate-500 text-[11px] font-mono">
              Sin subproductos aún. Usa el <strong>⚡ Reactor Catalítico</strong>.
            </div>
          ) : (
            <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
              {metaboliteReservoir.map((item) => (
                <div
                  key={item.id}
                  className="p-1.5 rounded bg-slate-950/80 border border-white/5 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00A896] shrink-0" />
                    <span className="font-semibold text-white truncate text-xs">
                      {item.name}
                    </span>
                    {item.formula && (
                      <span className="text-[10px] font-mono text-slate-400">
                        ({item.formula})
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-[10px] font-bold text-[#ff941a] bg-[#F77F00]/10 px-2 py-0.5 rounded border border-[#F77F00]/20 shrink-0">
                    {item.stoichiometry || `×${item.count}`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 3. Pie de Barra Lateral */}
      <div className="p-2.5 border-t border-[#00A896]/30 bg-[#16233e] shrink-0 flex items-center gap-2">
        <button
          id="btn-sidebar-reset"
          onClick={resetCurrentMission}
          className="flex-1 py-1.5 px-3 rounded-md text-xs font-mono font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-white/10 transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 group"
          title="Restaurar el esqueleto inicial de esta etapa"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-180 transition-transform duration-500" />
          <span>🔄 Reiniciar</span>
        </button>

        <button
          onClick={() => setIsExpanded(false)}
          className="py-1.5 px-2.5 rounded-md text-xs font-mono text-slate-400 hover:text-white hover:bg-white/10 border border-white/5 transition-all flex items-center gap-1"
          title="Ocultar panel"
        >
          <ChevronRight className="w-3.5 h-3.5" />
          <span>Ocultar</span>
        </button>
      </div>
    </aside>
  );
};
