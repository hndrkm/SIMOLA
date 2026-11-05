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
      badgeColor: 'border-emerald-300 bg-emerald-50 text-emerald-800',
      accentColor: '#008477',
      buttonText: 'Ingresar a Módulo I',
      buttonBg: 'bg-[#008477] hover:bg-[#006e63] text-white font-bold',
      icon: <Atom className="w-5 h-5 text-[#008477]" />,
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
      badgeColor: 'border-amber-300 bg-amber-50 text-amber-800',
      accentColor: '#D97706',
      buttonText: 'Ingresar a Vía Glucolítica',
      buttonBg: 'bg-[#D97706] hover:bg-[#b45309] text-white font-bold',
      icon: <Sparkles className="w-5 h-5 text-[#D97706]" />,
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
      badgeColor: 'border-sky-300 bg-sky-50 text-sky-800',
      accentColor: '#0284c7',
      buttonText: 'Ingresar a Complejo PDH',
      buttonBg: 'bg-sky-600 hover:bg-sky-700 text-white font-bold',
      icon: <Zap className="w-5 h-5 text-sky-600" />,
      missions: getMissionsByWorld(3),
    },
  ];

  // Identificar la siguiente misión no completada para continuar
  const handleContinueNextIncomplete = () => {
    const nextMission = PROGRESSION_MISSIONS.find((m) => !isMissionCompleted(m.id));
    if (nextMission) {
      loadMission(nextMission.id);
    } else {
      loadMission(PROGRESSION_MISSIONS[0].id);
    }
  };

  const handleConfirmReset = () => {
    clearProgress();
    setShowResetConfirm(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-between font-mono text-slate-800 select-none relative overflow-x-hidden">
      {/* 1. HERO HEADER */}
      <main className="max-w-6xl w-full px-6 lg:px-12 py-10 flex flex-col gap-10">
        <header className="flex flex-col items-center text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-white border border-slate-300 shadow-md flex items-center justify-center text-[#008477]">
            <Atom className="w-8 h-8" />
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            SIMOLA
          </h1>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#008477]/10 border border-[#008477]/30 text-[#008477] text-xs font-mono font-bold mt-2 shadow-xs">
            SIMOLA v2.0 • Blueprint CAD Edition
          </div>

          <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed font-sans">
            Simulador Molecular y Rutas Metabólicas Interactivas con Precisión Quimioinformática y Enzimología RDKit.
          </p>
        </header>

        {/* 2. SECCIÓN DE CONFIGURACIÓN DE MISIONES Y CONTROL DE ESTADO */}
        <section className="cad-panel cad-corners p-5 rounded-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white border border-slate-300 shadow-sm text-slate-800">
          {/* Progreso y Asistencia */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Medidor de Progreso */}
            <div className="flex items-center gap-2 text-xs font-mono">
              <Trophy className="w-4 h-4 text-[#D97706]" />
              <span className="text-slate-500">Progreso:</span>
              <strong className="text-[#008477]">
                {totalCompleted}/{totalMissions} ({progressPercent}%)
              </strong>
            </div>

            <div className="h-4 w-px bg-slate-200 hidden sm:block" />

            {/* Switch de Asistencia Guiada */}
            <div className="flex items-center gap-2 text-xs font-mono">
              <Sparkles className="w-4 h-4 text-[#008477]" />
              <span className="text-slate-700">Guía Asistida:</span>
              <button
                type="button"
                id="btn-home-toggle-assisted"
                onClick={toggleAssistedMode}
                className="flex items-center gap-1 font-mono font-bold transition-all text-[#008477]"
                title="Activar / Desactivar Modo Asistencia Guiada con autocompletado y solución directa"
              >
                {assistedMode ? (
                  <ToggleRight className="w-5 h-5 text-[#008477]" />
                ) : (
                  <ToggleLeft className="w-5 h-5 text-slate-400" />
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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition-all active:scale-95 shadow-xs"
              title="Abrir pizarra vacía sin restricciones de misión"
            >
              <FlaskConical className="w-3.5 h-3.5 text-[#008477]" />
              <span>Laboratorio</span>
            </button>

            {/* Botón Continuar */}
            <button
              id="btn-home-continue-nav"
              onClick={handleContinueNextIncomplete}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-[#D97706] hover:bg-[#b45309] text-white transition-all active:scale-95 shadow-xs"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Continuar</span>
            </button>

            {/* Botón Reiniciar Progreso */}
            <button
              id="btn-home-reset-progress"
              onClick={() => setShowResetConfirm(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-all text-xs"
              title="Reiniciar Progreso Académico guardado"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* 3. SECCIÓN DE SELECCIÓN DE MISIONES EN LISTA VERTICAL */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <Layers className="w-5 h-5 text-[#008477]" />
            <h2 className="text-base sm:text-lg font-mono font-black text-slate-900 uppercase tracking-wider">
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
                  className="cad-panel cad-corners p-5 sm:p-6 rounded-xl flex flex-col gap-4 bg-white border border-slate-200 hover:border-slate-300 transition-all shadow-sm"
                >
                  {/* Encabezado del Módulo */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start sm:items-center gap-3">
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 shrink-0">
                        {mod.icon}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm sm:text-base font-mono font-bold text-slate-900">
                            {mod.title}
                          </h3>
                          <span
                            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${mod.badgeColor}`}
                          >
                            {mod.badge}
                          </span>
                        </div>
                        <p className="text-xs text-[#008477] font-mono font-bold mt-0.5">
                          {mod.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Estado de Avance */}
                    <div className="flex items-center gap-3 self-start sm:self-center shrink-0">
                      <span className="text-xs font-mono font-bold text-slate-600">
                        Avance: <strong className="text-slate-900">{completedInMod}/{mod.missions.length}</strong>
                      </span>
                      <button
                        onClick={() => startRoute(mod.id)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all shadow-xs flex items-center gap-1.5 active:scale-95 ${mod.buttonBg}`}
                      >
                        <span>{isAllCompleted ? 'Repasar Módulo' : 'Ingresar'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Descripción del Módulo */}
                  <p className="text-xs text-slate-600 leading-relaxed font-sans bg-slate-50 p-3 rounded-lg border border-slate-200">
                    {mod.description}
                  </p>

                  {/* Lista de Etapas del Módulo */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                      Etapas del Módulo:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {mod.missions.map((m, idx) => {
                        const done = isMissionCompleted(m.id);
                        return (
                          <button
                            key={m.id}
                            onClick={() => loadMission(m.id)}
                            className={`p-2.5 rounded-lg text-left text-xs font-mono transition-all border flex items-center justify-between gap-2 group shadow-xs ${
                              done
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-900 hover:bg-emerald-100'
                                : 'bg-white border-slate-200 text-slate-700 hover:border-[#008477] hover:bg-slate-50'
                            }`}
                            title={`Ingresar a: ${m.title}`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              {done ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              ) : (
                                <span className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[9px] font-mono font-bold text-slate-500 shrink-0 bg-slate-50">
                                  {idx + 1}
                                </span>
                              )}
                              <span className="truncate group-hover:text-slate-950 font-medium">
                                {m.title}
                              </span>
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#008477] group-hover:translate-x-0.5 transition-all shrink-0" />
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
        <section className="cad-panel cad-corners p-6 sm:p-8 rounded-xl bg-white border border-slate-300 flex flex-col gap-6 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#008477] uppercase tracking-wider">
                <Info className="w-4 h-4 text-[#008477]" />
                Acerca de SIMOLA
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Plataforma de Simulación Quimioinformática Universitaria
              </h3>
            </div>

            {/* Botón Saber Más / Bibliografía */}
            <button
              id="btn-home-bibliography-cta"
              onClick={() => setView('bibliography')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono font-bold bg-[#008477] hover:bg-[#006e63] text-white transition-all active:scale-95 shadow-xs shrink-0"
              title="Abrir vista formal de bibliografía, referencias académicas y créditos"
            >
              <BookOpen className="w-4 h-4" />
              <span>Saber Más y Bibliografía</span>
            </button>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
            <strong>SIMOLA</strong> integra dibujo molecular en tiempo real optimizado a 60 FPS mediante <strong>Konva 2D</strong> con el motor quimioinformático profesional <strong>RDKit.js WebAssembly</strong>. Permite a los estudiantes resolver mecanismos enzimáticos paso a paso, ionizar grupos carboxilato y amino a pH 7.4, modelar estados de transición con holoenzimas clasificadas según la <em>IUBMB</em> y balancear estequiométricamente cofactores celulares de alta energía (ATP, NADH, TPP, CoA-SH).
          </p>

          {/* Métricas Técnicas */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex flex-col items-center justify-center text-center shadow-xs">
              <span className="text-base font-bold text-[#008477]">3 Módulos</span>
              <span className="text-[10px] text-slate-500 mt-0.5 font-sans">Glucólisis, Haworth y PDH</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex flex-col items-center justify-center text-center shadow-xs">
              <span className="text-base font-bold text-[#D97706]">13 Enzimas</span>
              <span className="text-[10px] text-slate-500 mt-0.5 font-sans">Clasificación Internacional EC</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex flex-col items-center justify-center text-center shadow-xs">
              <span className="text-base font-bold text-sky-600">90° / 120°</span>
              <span className="text-[10px] text-slate-500 mt-0.5 font-sans">Guías Angulares Axiales</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex flex-col items-center justify-center text-center shadow-xs">
              <span className="text-base font-bold text-emerald-600">pH 7.4</span>
              <span className="text-[10px] text-slate-500 mt-0.5 font-sans">Ionización Fisiológica</span>
            </div>
          </div>
        </section>
      </main>

      {/* 5. FOOT BAR (PIE DE PÁGINA MINIMALISTA) */}
      <footer className="w-full py-4 border-t border-slate-200 bg-white text-center text-xs font-mono text-slate-500 shrink-0">
        SIMOLA v2.0 • Blueprint CAD Edition
      </footer>

      {/* Modal de Confirmación para Reiniciar Progreso Académico */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="cad-panel cad-corners-full w-full max-w-sm rounded-xl p-6 border border-slate-300 shadow-2xl bg-white text-slate-800">
            <div className="flex items-center gap-3 mb-3 text-rose-600">
              <div className="p-2 rounded-lg bg-rose-50 border border-rose-200">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <h3 className="text-sm font-mono font-bold text-slate-900">¿Reiniciar Progreso Académico?</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-5 font-sans">
              Esta acción borrará todas las etapas completadas y el historial de intentos guardados en el navegador. Volverás al inicio del plan de estudios.
            </p>
            <div className="flex items-center justify-end gap-2.5 font-mono">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white transition-all shadow-xs active:scale-95"
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
