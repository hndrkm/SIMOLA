import React, { useState } from 'react';
import {
  RotateCcw,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Activity,
  Layers,
  FlaskConical,
} from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';
import { getMissionsByWorld } from '../../data/missions/progressionMissions';

export const MissionSidebar: React.FC = () => {
  const currentMissionId = useGameStore((state) => state.currentMissionId);
  const getCurrentMission = useGameStore((state) => state.getCurrentMission);
  const resetCurrentMission = useGameStore((state) => state.resetCurrentMission);
  const metaboliteReservoir = useGameStore((state) => state.metaboliteReservoir);

  const [isMechanismExpanded, setIsMechanismExpanded] = useState(true);

  const mission = getCurrentMission();
  if (!mission || !currentMissionId) return null;

  // Determinar Módulo
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

  return (
    <aside
      id="mission-sidebar"
      className="fixed right-0 top-0 bottom-0 w-88 bg-[#1B2A4A]/95 border-l border-slate-700/80 flex flex-col z-20 shadow-2xl backdrop-blur-md select-none text-slate-100"
    >
      {/* 1. Encabezado del Módulo y Etapa */}
      <div className="p-4 border-b border-white/10 bg-[#16233e] shrink-0">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#00A896] flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            {moduleTitle}
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#00A896]/20 text-[#00c7b2] border border-[#00A896]/40 shrink-0">
            Etapa {stepNumber} de {totalSteps}
          </span>
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
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {/* Objetivo Académico y Rigor Químico */}
        <div className="bg-slate-900/70 p-3.5 rounded-2xl border border-white/10 space-y-2">
          <div className="flex items-center gap-2 text-slate-300 font-bold">
            <Activity className="w-4 h-4 text-[#F77F00]" />
            <span>Objetivo Bioquímico:</span>
          </div>
          <p className="text-slate-200 leading-relaxed font-medium">
            {mission.objectiveDescription}
          </p>
        </div>

        {/* Sección Desplegable: Fundamento Mecanístico (IUPAC / EC) */}
        <div className="bg-slate-900/70 rounded-2xl border border-white/10 overflow-hidden transition-all">
          <button
            onClick={() => setIsMechanismExpanded(!isMechanismExpanded)}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-2 font-bold text-[#ff941a]">
              <BookOpen className="w-4 h-4 text-[#F77F00]" />
              <span>🔬 Fundamento Mecanístico (IUPAC / EC)</span>
            </div>
            {isMechanismExpanded ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {isMechanismExpanded && (
            <div className="p-3.5 pt-0 space-y-2.5 text-slate-300 border-t border-white/5">
              <p className="text-[11px] leading-relaxed text-slate-200">
                {mission.pedagogicalHint}
              </p>
              {mission.biochemicalContext && (
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-white/5 text-[11px] text-slate-400 leading-relaxed">
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
        <div className="bg-slate-900/70 p-3.5 rounded-2xl border border-white/10 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-[#00c7b2]">
              <FlaskConical className="w-4 h-4 text-[#00A896]" />
              <span>Reservorio de Metabolitos</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-white/10">
              {metaboliteReservoir.length} {metaboliteReservoir.length === 1 ? 'Especie' : 'Especies'}
            </span>
          </div>

          <p className="text-[11px] text-slate-400">
            Productos y coenzimas acumuladas durante las transformaciones enzimáticas:
          </p>

          {metaboliteReservoir.length === 0 ? (
            <div className="p-3 rounded-xl bg-slate-950/60 border border-dashed border-slate-700 text-center text-slate-500 text-[11px]">
              No hay subproductos liberados aún. Utiliza el <strong>⚡ Reactor Catalítico</strong> para ejecutar transformaciones acopladas.
            </div>
          ) : (
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {metaboliteReservoir.map((item) => (
                <div
                  key={item.id}
                  className="p-2 rounded-xl bg-slate-950/80 border border-white/5 flex items-center justify-between text-xs hover:border-[#00A896]/30 transition-all"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2 h-2 rounded-full bg-[#00A896]" />
                    <span className="font-semibold text-white truncate">
                      {item.name}
                    </span>
                    {item.formula && (
                      <span className="text-[10px] font-mono text-slate-400">
                        ({item.formula})
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-[11px] font-bold text-[#ff941a] bg-[#F77F00]/10 px-2 py-0.5 rounded-md border border-[#F77F00]/20 shrink-0">
                    {item.stoichiometry || `×${item.count}`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 3. Pie de Barra Lateral: Reiniciar Etapa */}
      <div className="p-4 border-t border-white/10 bg-[#16233e] shrink-0">
        <button
          id="btn-sidebar-reset"
          onClick={resetCurrentMission}
          className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-white/10 transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 group"
          title="Restaurar el esqueleto inicial de esta etapa"
        >
          <RotateCcw className="w-4 h-4 text-slate-400 group-hover:rotate-180 transition-transform duration-500" />
          <span>🔄 Reiniciar Etapa</span>
        </button>
      </div>
    </aside>
  );
};
