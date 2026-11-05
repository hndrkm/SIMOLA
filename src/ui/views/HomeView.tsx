import React, { useState } from 'react';
import {
  Play,
  FlaskConical,
  Atom,
  Sparkles,
  Zap,
  Layers,
  ChevronRight,
  CheckCircle2,
  Trophy,
  Info,
  RotateCcw,
  AlertTriangle,
  BookOpen,
  ToggleLeft,
  ToggleRight,
  ArrowRight,
} from 'lucide-react';
import { useGameStore, MetabolicRouteId } from '../../store/useGameStore';
import {
  getMissionsByWorld,
  PROGRESSION_MISSIONS,
} from '../../data/missions/progressionMissions';

export const HomeView: React.FC = () => {
  const startRoute = useGameStore((state) => state.startRoute);
  const startSandbox = useGameStore((state) => state.startSandbox);
  const loadMission = useGameStore((state) => state.loadMission);
  const completedMissionIds = useGameStore((state) => state.completedMissionIds);
  const isMissionCompleted = useGameStore((state) => state.isMissionCompleted);
  const clearProgress = useGameStore((state) => state.clearProgress);
  const setView = useGameStore((state) => state.setView);
  const assistedMode = useGameStore((state) => state.assistedMode);
  const toggleAssistedMode = useGameStore((state) => state.toggleAssistedMode);

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const totalMissions = PROGRESSION_MISSIONS.length;
  const totalCompleted = completedMissionIds.length;
  const progressPercent = Math.round((totalCompleted / totalMissions) * 100);

  const modules = [
    {
      id: 'training' as MetabolicRouteId,
      worldNum: 1 as const,
      title: 'Módulo I: Estereoquímica y Proyecciones de Haworth',
      subtitle: 'Fundamentos, Ionización a pH 7.4 y Heterociclos',
      description:
        'Estudio de hibridación sp², estados iónicos (-COO⁻, -NH₃⁺), marcaje isotópico con ¹⁴C, heterociclos piranósico/furanósico y la proyección de Haworth de la α-D-glucopiranosa.',
      badge: '4 Prácticas',
      badgeColor: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
      accentColor: '#00A896', // Catalytic Teal
      buttonText: 'Ingresar a Módulo I',
      buttonBg: 'bg-[#00A896] hover:bg-[#00c7b2] text-slate-950 font-bold',
      icon: <Atom className="w-5 h-5 text-[#00A896]" />,
      missions: getMissionsByWorld(1),
    },
    {
      id: 'glycolysis' as MetabolicRouteId,
      worldNum: 2 as const,
      title: 'Módulo II: Vía Glucolítica de Embden-Meyerhof-Parnas',
      subtitle: 'Los 10 Pasos Enzimáticos y Balance Energético',
      description:
        'Recorrido integral de los 10 pasos desde α-D-Glucosa hasta Piruvato, utilizando el Reactor Catalítico para registrar el balance estequiométrico de ATP y NADH.',
      badge: '10 Etapas Acopladas',
      badgeColor: 'border-[#F77F00]/50 bg-[#F77F00]/15 text-[#ff941a]',
      accentColor: '#F77F00', // Phosphate Amber
      buttonText: 'Ingresar a Vía Glucolítica',
      buttonBg: 'bg-[#F77F00] hover:bg-[#ff941a] text-slate-950 font-bold',
      icon: <Sparkles className="w-5 h-5 text-[#F77F00]" />,
      missions: getMissionsByWorld(2),
    },
    {
      id: 'pdh' as MetabolicRouteId,
      worldNum: 3 as const,
      title: 'Módulo III: Complejo Multienzimático Piruvato Deshidrogenasa',
      subtitle: '5 Etapas Catalíticas Acopladas (E1, E2, E3)',
      description:
        'Orquesta la descarboxilación oxidativa del Piruvato mediante las 3 holoenzimas y 5 coenzimas (TPP, Lipoamida, CoA-SH, FAD, NAD⁺), acumulando HCO₃⁻, Acetil-CoA y NADH.',
      badge: '5 Etapas Acopladas',
      badgeColor: 'border-sky-500/40 bg-sky-500/10 text-sky-300',
      accentColor: '#38bdf8',
      buttonText: 'Ingresar a Complejo PDH',
      buttonBg: 'bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold',
      icon: <Zap className="w-5 h-5 text-sky-400" />,
      missions: getMissionsByWorld(3),
    },
  ];

  const handleContinueNextIncomplete = () => {
    const firstIncomplete = PROGRESSION_MISSIONS.find(
      (m) => !completedMissionIds.includes(m.id)
    );
    if (firstIncomplete) {
      loadMission(firstIncomplete.id);
    } else {
      loadMission(PROGRESSION_MISSIONS[0].id);
    }
  };

  const handleConfirmReset = () => {
    clearProgress();
    setShowResetConfirm(false);
  };

  return (
    <div className="min-h-screen w-full bg-[#0B132B] text-slate-100 flex flex-col justify-between select-none font-sans overflow-y-auto">
      {/* CONTENEDOR PRINCIPAL */}
      <main className="max-w-5xl mx-auto w-full px-6 py-10 flex flex-col gap-10">
        {/* 1. SECCIÓN DE LOGO CENTRADO Y DESCRIPCIÓN BREVE */}
        <header className="flex flex-col items-center text-center gap-3 pt-2">
          <div className="bg-slate-100 px-6 py-3 rounded-2xl shadow-2xl border-2 border-[#00A896]/40 flex items-center justify-center glow-teal">
            <img
              src={`${import.meta.env.BASE_URL}logo.png`}
              alt="SIMOLA"
              className="h-16 sm:h-20 w-auto object-contain filter drop-shadow-md"
            />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00A896]/15 border border-[#00A896]/40 text-[#00c7b2] text-xs font-mono font-bold mt-2">
            SIMOLA v2.0 • Blueprint CAD Edition
          </div>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Simulador Molecular y Rutas Metabólicas Interactivas con Precisión Quimioinformática y Enzimología RDKit.
          </p>
        </header>

        {/* 2. SECCIÓN DE CONFIGURACIÓN DE MISIONES Y CONTROL DE ESTADO */}
        <section className="cad-panel cad-corners p-5 rounded-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#1B2A4A]/80 border border-[#00A896]/40 shadow-xl">
          {/* Progreso y Asistencia */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Medidor de Progreso */}
            <div className="flex items-center gap-2 text-xs font-mono">
              <Trophy className="w-4 h-4 text-[#F77F00]" />
              <span className="text-slate-400">Progreso:</span>
              <strong className="text-[#00c7b2]">
                {totalCompleted}/{totalMissions} ({progressPercent}%)
              </strong>
            </div>

            <div className="h-4 w-px bg-white/10 hidden sm:block" />

            {/* Switch de Asistencia Guiada */}
            <div className="flex items-center gap-2 text-xs font-mono">
              <Sparkles className="w-4 h-4 text-[#00A896]" />
              <span className="text-slate-300">Guía Asistida:</span>
              <button
                type="button"
                id="btn-home-toggle-assisted"
                onClick={toggleAssistedMode}
                className="flex items-center gap-1 font-mono font-bold transition-all text-[#00c7b2]"
                title="Activar / Desactivar Modo Asistencia Guiada con autocompletado y solución directa"
              >
                {assistedMode ? (
                  <ToggleRight className="w-5 h-5 text-[#00A896]" />
                ) : (
                  <ToggleLeft className="w-5 h-5 text-slate-500" />
                )}
                <span>{assistedMode ? 'ON' : 'OFF'}</span>
              </button>
            </div>
          </div>

          {/* Acciones Rápidas */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Botón Laboratorio Libre */}
            <button
              id="btn-home-sandbox-nav"
              onClick={startSandbox}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-[#16233e] hover:bg-[#22355c] text-slate-200 border border-white/10 hover:border-[#00A896]/50 transition-all active:scale-95 shadow-sm"
              title="Abrir pizarra vacía sin restricciones de misión"
            >
              <FlaskConical className="w-3.5 h-3.5 text-[#00A896]" />
              <span>Laboratorio</span>
            </button>

            {/* Botón Continuar */}
            <button
              id="btn-home-continue-nav"
              onClick={handleContinueNextIncomplete}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-[#F77F00] hover:bg-[#ff941a] text-slate-950 transition-all active:scale-95 shadow-md shadow-[#F77F00]/25"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Continuar</span>
            </button>

            {/* Botón Reiniciar Progreso */}
            <button
              id="btn-home-reset-progress"
              onClick={() => setShowResetConfirm(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 border border-white/5 transition-all text-xs"
              title="Reiniciar Progreso Académico guardado"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* 3. SECCIÓN DE SELECCIÓN DE MISIONES EN LISTA VERTICAL */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b border-[#00A896]/30 pb-3">
            <Layers className="w-5 h-5 text-[#00A896]" />
            <h2 className="text-base sm:text-lg font-mono font-black text-white uppercase tracking-wider">
              Módulos Bioquímicos y Rutas Metabólicas
            </h2>
          </div>

          <div className="flex flex-col gap-6">
            {modules.map((mod) => {
              const completedInMod = mod.missions.filter((m) =>
                completedMissionIds.includes(m.id)
              ).length;
              const isAllCompleted = completedInMod === mod.missions.length;

              return (
                <div
                  key={mod.id}
                  className="cad-panel cad-corners p-5 sm:p-6 rounded-xl flex flex-col gap-4 bg-[#1B2A4A]/70 border border-[#00A896]/30 hover:border-[#00A896]/60 transition-all shadow-xl"
                >
                  {/* Encabezado del Módulo */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start sm:items-center gap-3">
                      <div className="p-2.5 rounded-lg bg-[#0B132B] border border-[#00A896]/40 shrink-0">
                        {mod.icon}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm sm:text-base font-mono font-bold text-white">
                            {mod.title}
                          </h3>
                          <span
                            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${mod.badgeColor}`}
                          >
                            {mod.badge}
                          </span>
                        </div>
                        <p className="text-xs text-[#00c7b2] font-mono mt-0.5">
                          {mod.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Estado de Avance */}
                    <div className="flex items-center gap-3 self-start sm:self-center shrink-0">
                      <span className="text-xs font-mono font-bold text-slate-300">
                        Avance: <strong className="text-white">{completedInMod}/{mod.missions.length}</strong>
                      </span>
                      <button
                        onClick={() => startRoute(mod.id)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all shadow-md flex items-center gap-1.5 active:scale-95 ${mod.buttonBg}`}
                      >
                        <span>{isAllCompleted ? 'Repasar Módulo' : 'Ingresar'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Descripción del Módulo */}
                  <p className="text-xs text-slate-300 leading-relaxed font-sans bg-[#0B132B]/60 p-3 rounded-lg border border-white/5">
                    {mod.description}
                  </p>

                  {/* Lista de Etapas del Módulo */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                      Etapas del Módulo:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {mod.missions.map((m, idx) => {
                        const done = isMissionCompleted(m.id);
                        return (
                          <button
                            key={m.id}
                            onClick={() => loadMission(m.id)}
                            className={`p-2.5 rounded-lg text-left text-xs font-mono transition-all border flex items-center justify-between gap-2 group ${
                              done
                                ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/40'
                                : 'bg-[#0B132B]/80 border-white/5 text-slate-300 hover:border-[#00A896]/50 hover:bg-[#16233e]'
                            }`}
                            title={`Ingresar a: ${m.title}`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              {done ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              ) : (
                                <span className="w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center text-[9px] font-mono font-bold text-slate-400 shrink-0">
                                  {idx + 1}
                                </span>
                              )}
                              <span className="truncate group-hover:text-white">
                                {m.title}
                              </span>
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#00c7b2] group-hover:translate-x-0.5 transition-all shrink-0" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. SECCIÓN DE INFORMACIÓN DEL SOFTWARE Y BIBLIOGRAFÍA */}
        <section className="cad-panel cad-corners p-6 sm:p-8 rounded-xl bg-[#1B2A4A]/80 border border-[#00A896]/40 flex flex-col gap-6 shadow-2xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#00A896] uppercase tracking-wider">
                <Info className="w-4 h-4 text-[#00A896]" />
                Acerca de SIMOLA
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Plataforma de Simulación Quimioinformática Universitaria
              </h3>
            </div>

            {/* Botón Saber Más / Bibliografía */}
            <button
              id="btn-home-bibliography-cta"
              onClick={() => setView('bibliography')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono font-bold bg-[#00A896] hover:bg-[#00c7b2] text-slate-950 transition-all active:scale-95 shadow-lg shadow-[#00A896]/20 shrink-0"
              title="Abrir vista formal de bibliografía, referencias académicas y créditos"
            >
              <BookOpen className="w-4 h-4" />
              <span>Saber Más y Bibliografía</span>
            </button>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            <strong>SIMOLA</strong> integra dibujo molecular en tiempo real optimizado a 60 FPS mediante <strong>Konva 2D</strong> con el motor quimioinformático profesional <strong>RDKit.js WebAssembly</strong>. Permite a los estudiantes resolver mecanismos enzimáticos paso a paso, ionizar grupos carboxilato y amino a pH 7.4, modelar estados de transición con holoenzimas clasificadas según la <em>IUBMB</em> y balancear estequiométricamente cofactores celulares de alta energía (ATP, NADH, TPP, CoA-SH).
          </p>

          {/* Métricas Técnicas */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="bg-[#0B132B]/80 border border-white/10 p-3 rounded-lg flex flex-col items-center justify-center text-center">
              <span className="text-base font-bold text-[#00A896]">3 Módulos</span>
              <span className="text-[10px] text-slate-400 mt-0.5">Glucólisis, Haworth y PDH</span>
            </div>
            <div className="bg-[#0B132B]/80 border border-white/10 p-3 rounded-lg flex flex-col items-center justify-center text-center">
              <span className="text-base font-bold text-[#F77F00]">13 Enzimas</span>
              <span className="text-[10px] text-slate-400 mt-0.5">Clasificación Internacional EC</span>
            </div>
            <div className="bg-[#0B132B]/80 border border-white/10 p-3 rounded-lg flex flex-col items-center justify-center text-center">
              <span className="text-base font-bold text-sky-400">90° / 120°</span>
              <span className="text-[10px] text-slate-400 mt-0.5">Guías Angulares Axiales</span>
            </div>
            <div className="bg-[#0B132B]/80 border border-white/10 p-3 rounded-lg flex flex-col items-center justify-center text-center">
              <span className="text-base font-bold text-emerald-400">pH 7.4</span>
              <span className="text-[10px] text-slate-400 mt-0.5">Ionización Fisiológica</span>
            </div>
          </div>
        </section>
      </main>

      {/* 5. FOOT BAR (PIE DE PÁGINA MINIMALISTA) */}
      <footer className="w-full py-4 border-t border-[#00A896]/20 bg-[#0B132B] text-center text-xs font-mono text-slate-400 shrink-0">
        SIMOLA v2.0 • Blueprint CAD Edition
      </footer>

      {/* Modal de Confirmación para Reiniciar Progreso Académico */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="cad-panel cad-corners-full w-full max-w-sm rounded-xl p-6 border border-[#00A896]/40 shadow-2xl bg-[#1B2A4A] text-slate-100">
            <div className="flex items-center gap-3 mb-3 text-rose-400">
              <div className="p-2 rounded-lg bg-rose-500/20 border border-rose-500/30">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
              </div>
              <h3 className="text-sm font-mono font-bold text-white">¿Reiniciar Progreso Académico?</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-5">
              Esta acción borrará todas las etapas completadas y el historial de intentos guardados en el navegador. Volverás al inicio del plan de estudios.
            </p>
            <div className="flex items-center justify-end gap-2.5 font-mono">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 border border-white/10 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white transition-all shadow-md active:scale-95"
              >
                Sí, Reiniciar Progreso
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeView;
