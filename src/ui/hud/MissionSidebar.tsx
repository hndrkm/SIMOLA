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
  X,
} from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';
import { getMissionsByWorld } from '../../data/missions/progressionMissions';

export const MissionSidebar: React.FC = () => {
  const currentMissionId = useGameStore((state) => state.currentMissionId);
  const getCurrentMission = useGameStore((state) => state.getCurrentMission);
  const resetCurrentMission = useGameStore((state) => state.resetCurrentMission);
  const metaboliteReservoir = useGameStore((state) => state.metaboliteReservoir);

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

  // =========================================================================
  // ESTADO CONTRAÍDO (Pestaña flotante compacta debajo del TopBar)
  // =========================================================================
  if (!isExpanded) {
    return (
      <div className="fixed top-20 right-4 z-30 select-none animate-fadeIn">
        <button
          id="btn-sidebar-expand"
          onClick={() => setIsExpanded(true)}
          className="bg-[#1B2A4A]/95 hover:bg-[#16233e] border border-[#00A896]/60 text-white px-4 py-2.5 rounded-xl shadow-xl hover:shadow-[#00A896]/20 transition-all flex items-center gap-2.5 backdrop-blur-md active:scale-95 group text-xs font-bold"
          title="Expandir panel de misión y fundamentación bioquímica"
        >
          <ChevronLeft className="w-4 h-4 text-[#00A896] group-hover:-translate-x-0.5 transition-transform" />
          <div className="flex items-center gap-1.5">
            <span className="text-[#00c7b2] font-mono">
              🔬 Etapa {stepNumber}/{totalSteps}
            </span>
            <span className="text-slate-400 font-normal hidden sm:inline">—</span>
            <span className="text-slate-200 hidden sm:inline truncate max-w-[160px]">
              {mission.title}
            </span>
          </div>
          <span className="text-[10px] font-mono font-medium text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded-lg border border-white/10 group-hover:border-[#00A896]/40 transition-colors">
            Ver Misión
          </span>
        </button>
      </div>
    );
  }

  // =========================================================================
  // ESTADO EXPANDIDO (Tarjeta flotante controlada w-80 / w-96)
  // =========================================================================
  return (
    <aside
      id="mission-sidebar"
      className="fixed top-20 right-4 z-30 w-80 sm:w-96 max-w-[90vw] max-h-[calc(100vh-6.5rem)] flex flex-col rounded-2xl shadow-2xl border border-slate-700/80 bg-[#1B2A4A]/95 backdrop-blur-md select-none text-slate-100 overflow-hidden animate-fadeIn"
    >
      {/* 1. Encabezado del Módulo y Botón Contraer */}
      <div className="p-4 border-b border-white/10 bg-[#16233e] shrink-0">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#00A896] flex items-center gap-1.5 truncate">
            <Layers className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{moduleTitle}</span>
          </span>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#00A896]/20 text-[#00c7b2] border border-[#00A896]/40">
              {stepNumber}/{totalSteps}
            </span>
            <button
              id="btn-sidebar-collapse"
              onClick={() => setIsExpanded(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Ocultar panel para dibujar en el lienzo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <h2 className="text-sm font-extrabold text-white leading-snug">
          {mission.title}
        </h2>

        {/* Clasificación Enzimática EC y ΔG°' */}
        {(mission.enzymeName || mission.ecNumber || mission.deltaG) && (
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[10px] font-mono font-semibold">
            {mission.ecNumber && (
              <span className="px-2 py-0.5 rounded-lg bg-sky-500/15 text-sky-300 border border-sky-500/30">
                {mission.ecNumber}
              </span>
            )}
            {mission.deltaG && (
              <span className="px-2 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                ΔG°' = {mission.deltaG}
              </span>
            )}
            {mission.enzymeName && !mission.ecNumber && (
              <span className="px-2 py-0.5 rounded-lg bg-purple-500/15 text-purple-300 border border-purple-500/30 truncate max-w-[200px]">
                {mission.enzymeName}
              </span>
            )}
          </div>
        )}
      </div>

      {/* 2. Cuerpo del Panel con Desplazamiento Fluido */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
        {/* Objetivo Académico */}
        <div className="bg-slate-900/70 p-3 rounded-2xl border border-white/10 space-y-1.5">
          <div className="flex items-center gap-1.5 text-slate-300 font-bold">
            <Activity className="w-3.5 h-3.5 text-[#F77F00]" />
            <span>Objetivo Bioquímico:</span>
          </div>
          <p className="text-slate-200 leading-relaxed font-medium text-xs">
            {mission.objectiveDescription}
          </p>
        </div>

        {/* Sección Desplegable: Fundamento Mecanístico (IUPAC / EC) */}
        <div className="bg-slate-900/70 rounded-2xl border border-white/10 overflow-hidden transition-all">
          <button
            onClick={() => setIsMechanismExpanded(!isMechanismExpanded)}
            className="w-full p-3 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-1.5 font-bold text-[#ff941a] text-xs">
              <BookOpen className="w-3.5 h-3.5 text-[#F77F00]" />
              <span>🔬 Fundamento Mecanístico</span>
            </div>
            {isMechanismExpanded ? (
              <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {isMechanismExpanded && (
            <div className="p-3 pt-0 space-y-2 text-slate-300 border-t border-white/5">
              <p className="text-[11px] leading-relaxed text-slate-200">
                {mission.pedagogicalHint}
              </p>
              {mission.biochemicalContext && (
                <div className="p-2 rounded-xl bg-slate-950/70 border border-white/5 text-[11px] text-slate-400 leading-relaxed">
                  <strong className="text-slate-200 block mb-1">
                    Significado Fisiológico:
                  </strong>
                  {mission.biochemicalContext}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Reservorio de Metabolitos y Balance Estequiométrico */}
        <div className="bg-slate-900/70 p-3 rounded-2xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-[#00c7b2] text-xs">
              <FlaskConical className="w-3.5 h-3.5 text-[#00A896]" />
              <span>Reservorio de Metabolitos</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-white/10">
              {metaboliteReservoir.length} {metaboliteReservoir.length === 1 ? 'Especie' : 'Especies'}
            </span>
          </div>

          <p className="text-[11px] text-slate-400">
            Subproductos acumulados durante las transformaciones enzimáticas:
          </p>

          {metaboliteReservoir.length === 0 ? (
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-dashed border-slate-700 text-center text-slate-500 text-[11px]">
              No hay subproductos liberados aún. Utiliza el <strong>⚡ Reactor Catalítico</strong> para ejecutar transformaciones.
            </div>
          ) : (
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {metaboliteReservoir.map((item) => (
                <div
                  key={item.id}
                  className="p-2 rounded-xl bg-slate-950/80 border border-white/5 flex items-center justify-between text-xs hover:border-[#00A896]/30 transition-all"
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
                  <span className="font-mono text-[10px] font-bold text-[#ff941a] bg-[#F77F00]/10 px-2 py-0.5 rounded-md border border-[#F77F00]/20 shrink-0">
                    {item.stoichiometry || `×${item.count}`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 3. Pie de Barra Lateral: Reiniciar Etapa y Ocultar Panel */}
      <div className="p-3 border-t border-white/10 bg-[#16233e] shrink-0 flex items-center gap-2">
        <button
          id="btn-sidebar-reset"
          onClick={resetCurrentMission}
          className="flex-1 py-2 px-3 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-white/10 transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 group"
          title="Restaurar el esqueleto inicial de esta etapa"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-180 transition-transform duration-500" />
          <span>🔄 Reiniciar Etapa</span>
        </button>

        <button
          onClick={() => setIsExpanded(false)}
          className="py-2 px-3 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/10 border border-white/5 transition-all flex items-center gap-1"
          title="Ocultar panel para tener el lienzo completo"
        >
          <ChevronRight className="w-3.5 h-3.5" />
          <span>Ocultar</span>
        </button>
      </div>
    </aside>
  );
};
