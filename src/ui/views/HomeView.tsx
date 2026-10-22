import React, { useState } from 'react';
import {
  Play,
  FlaskConical,
  Atom,
  Sparkles,
  Zap,
  ShieldCheck,
  Cpu,
  Layers,
  ChevronRight,
  CheckCircle2,
  Trophy,
  Info,
  RotateCcw,
  AlertTriangle,
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
      icon: <Atom className="w-6 h-6 text-[#00A896]" />,
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
      icon: <Sparkles className="w-6 h-6 text-[#F77F00]" />,
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
      icon: <Zap className="w-6 h-6 text-sky-400" />,
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
    <div className="min-h-screen h-screen w-full overflow-y-auto bg-gradient-to-b from-[#1B2A4A] via-[#0f1a30] to-[#080d18] text-slate-100 flex flex-col justify-between select-none font-sans">
      {/* 1. Barra de Navegación Superior con Logo Horizontal */}
      <header className="px-6 lg:px-12 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 bg-[#1B2A4A]/80 backdrop-blur-md sticky top-0 z-30 shrink-0">
        <div className="flex items-center gap-3">
          {/* Placa clara que contiene el logo horizontal sin texto SIMOLA redundante */}
          <div className="bg-slate-100 px-4 py-1.5 rounded-xl shadow-md border border-white/30 flex items-center justify-center">
            <img
              src={`${import.meta.env.BASE_URL}logo.png`}
              alt="SIMOLA"
              className="h-10 w-auto object-contain"
            />
          </div>

          <div className="flex flex-col">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#00A896]/20 text-[#00c7b2] border border-[#00A896]/40 self-start">
              SIMOLA • Rigor Bioquímico Universitario
            </span>
            <span className="text-[11px] text-slate-400 font-medium hidden sm:inline mt-0.5">
              Simulador Molecular y Rutas Metabólicas Interactivas
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Botón Laboratorio de Síntesis y Modelado Estructural */}
          <button
            id="btn-home-sandbox-nav"
            onClick={startSandbox}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#00A896]/15 hover:bg-[#00A896]/25 text-[#00c7b2] border border-[#00A896]/40 transition-all active:scale-95 shadow-sm"
            title="Abrir pizarra vacía sin restricciones de misión"
          >
            <FlaskConical className="w-4 h-4 text-[#00A896]" />
            <span>Laboratorio de Síntesis y Modelado</span>
          </button>

          {/* Botón Continuar Misión */}
          <button
            id="btn-home-continue-nav"
            onClick={handleContinueNextIncomplete}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#F77F00] hover:bg-[#ff941a] text-slate-950 transition-all active:scale-95 shadow-lg shadow-[#F77F00]/25 glow-amber"
          >
            <Play className="w-4 h-4 fill-current" />
            <span className="hidden sm:inline">Continuar</span> Itinerario
          </button>

          {/* Botón Reiniciar Progreso Académico */}
          <button
            id="btn-home-reset-progress"
            onClick={() => setShowResetConfirm(true)}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 border border-white/5 transition-all text-xs"
            title="Reiniciar Progreso Académico guardado"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. SECCIÓN PRINCIPAL: SELECTOR DE MÓDULOS BIOQUÍMICOS */}
      <main className="px-6 lg:px-12 pt-6 pb-8 max-w-6xl mx-auto w-full flex flex-col gap-6">
        {/* Encabezado y barra de progreso de módulos */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-800/90 border border-white/10 shadow-xl">
          <div className="space-y-1">
            <h1 className="text-xl md:text-2xl font-black text-white flex items-center gap-2.5">
              <Layers className="w-6 h-6 text-[#00A896]" />
              Módulos Bioquímicos y Rutas Metabólicas
            </h1>
            <p className="text-xs text-slate-300">
              Selecciona una etapa individual para modelar su mecanismo en la pizarra o recorre los módulos de forma secuencial.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-center shrink-0">
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/10 flex flex-col gap-1.5 min-w-[200px]">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-400 flex items-center gap-1.5 text-[11px]">
                  <Trophy className="w-3.5 h-3.5 text-[#F77F00]" />
                  Progreso Académico:
                </span>
                <span className="font-mono font-bold text-[#00c7b2] text-[11px]">
                  {totalCompleted} / {totalMissions} ({progressPercent}%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-white/5">
                <div
                  className="h-full bg-gradient-to-r from-[#00A896] to-[#F77F00] transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <button
              onClick={handleContinueNextIncomplete}
              className="p-3 rounded-2xl bg-[#F77F00] hover:bg-[#ff941a] text-slate-950 font-black text-xs transition-all shadow-md active:scale-95 glow-amber flex items-center gap-1.5 shrink-0"
              title="Continuar siguiente etapa"
            >
              <Play className="w-4 h-4 fill-current" />
              <span className="hidden sm:inline">Siguiente Etapa</span>
            </button>
          </div>
        </div>

        {/* Grid de las 3 Tarjetas de Módulos Bioquímicos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {modules.map((mod) => {
            const moduleMissions = mod.missions;
            const completedCount = moduleMissions.filter((m) =>
              completedMissionIds.includes(m.id)
            ).length;
            const isAllCompleted = completedCount === moduleMissions.length;

            return (
              <div
                key={mod.id}
                className="bg-slate-800/90 rounded-3xl p-6 border border-white/10 hover:border-white/25 transition-all duration-300 flex flex-col justify-between group hover:shadow-2xl relative overflow-hidden shadow-xl"
              >
                {/* Resplandor decorativo */}
                <div
                  className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl opacity-15 group-hover:opacity-30 transition-opacity pointer-events-none"
                  style={{ backgroundColor: mod.accentColor }}
                />

                <div>
                  {/* Cabecera de la Card */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/10 shadow-inner">
                      {mod.icon}
                    </div>
                    <span
                      className={`text-[10px] font-bold font-mono px-2.5 py-1 rounded-full border ${mod.badgeColor}`}
                    >
                      {completedCount}/{moduleMissions.length} Completadas
                    </span>
                  </div>

                  {/* Título y Subtítulo */}
                  <h2 className="text-base font-extrabold text-white group-hover:text-slate-100 transition-colors">
                    {mod.title}
                  </h2>
                  <span className="text-xs font-semibold text-slate-400 block mt-0.5 mb-2">
                    {mod.subtitle}
                  </span>

                  {/* Descripción */}
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {mod.description}
                  </p>

                  {/* Lista Interactiva de Misiones del Módulo */}
                  <div className="space-y-2 mb-6 max-h-56 overflow-y-auto pr-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Etapas del Módulo:
                    </span>
                    {moduleMissions.map((m, idx) => {
                      const done = isMissionCompleted(m.id);
                      return (
                        <button
                          key={m.id}
                          onClick={() => loadMission(m.id)}
                          className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between gap-2.5 transition-all text-xs group/btn ${
                            done
                              ? 'bg-emerald-950/40 border-emerald-500/35 text-emerald-200 hover:bg-emerald-900/50'
                              : 'bg-slate-900/70 border-white/5 text-slate-300 hover:border-white/20 hover:bg-slate-700/60'
                          }`}
                          title={`Modelar: ${m.title}`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            {done ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            ) : (
                              <span className="w-4 h-4 rounded-full border border-slate-500 flex items-center justify-center text-[9px] font-mono font-bold text-slate-400 shrink-0">
                                {idx + 1}
                              </span>
                            )}
                            <span className="font-medium truncate group-hover/btn:text-white">
                              {m.title}
                            </span>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover/btn:text-white group-hover/btn:translate-x-0.5 transition-all shrink-0" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Botón de Entrada al Módulo */}
                <button
                  onClick={() => startRoute(mod.id)}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 active:scale-95 ${mod.buttonBg}`}
                >
                  <span>
                    {isAllCompleted ? 'Repasar Módulo Completo' : mod.buttonText}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* 3. SECCIÓN SECUNDARIA INFORMATIVA */}
        <section className="mt-8 pt-8 border-t border-white/10 flex flex-col items-center text-center">
          {/* Logo Central con Placa Clara y Proporción Horizontal (h-20) */}
          <div className="relative mb-5">
            <div className="bg-slate-100 px-6 py-3 rounded-2xl shadow-2xl border-2 border-[#00A896]/40 flex items-center justify-center glow-teal">
              <img
                src={`${import.meta.env.BASE_URL}logo.png`}
                alt="SIMOLA"
                className="h-20 w-auto object-contain filter drop-shadow-md"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-[#F77F00] text-slate-950 font-bold flex items-center justify-center shadow-lg border-2 border-[#1B2A4A]">
              <Sparkles className="w-3.5 h-3.5 fill-current" />
            </div>
          </div>

          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
            Plataforma Universitaria de Simulación Bioquímica
          </h2>

          <p className="mt-3 text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
            SIMOLA integra la precisión geométrica de dibujo asistido con el motor quimioinformático profesional <strong>RDKit.js WebAssembly</strong> y un evaluador didáctico que analiza isomería, conformación espacial en Haworth, estados de ionización a pH 7.4 y balances estequiométricos de cofactores de alta energía.
          </p>

          {/* Tarjetas Métricas */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl w-full text-xs">
            <div className="bg-slate-800/90 border border-white/10 p-3.5 rounded-2xl flex flex-col items-center justify-center text-center shadow-md">
              <span className="font-mono text-lg font-black text-[#00A896]">3 Módulos</span>
              <span className="text-[11px] text-slate-400 mt-0.5">Glucólisis, Haworth y PDH</span>
            </div>
            <div className="bg-slate-800/90 border border-white/10 p-3.5 rounded-2xl flex flex-col items-center justify-center text-center shadow-md">
              <span className="font-mono text-lg font-black text-[#F77F00]">13 Enzimas</span>
              <span className="text-[11px] text-slate-400 mt-0.5">Clasificación Internacional EC</span>
            </div>
            <div className="bg-slate-800/90 border border-white/10 p-3.5 rounded-2xl flex flex-col items-center justify-center text-center shadow-md">
              <span className="font-mono text-lg font-black text-sky-400">90° / 120°</span>
              <span className="text-[11px] text-slate-400 mt-0.5">Guías Angulares Axiales</span>
            </div>
            <div className="bg-slate-800/90 border border-white/10 p-3.5 rounded-2xl flex flex-col items-center justify-center text-center shadow-md">
              <span className="font-mono text-lg font-black text-emerald-400">pH 7.4</span>
              <span className="text-[11px] text-slate-400 mt-0.5">Ionización Fisiológica</span>
            </div>
          </div>

          {/* Callout de información didáctica */}
          <div className="mt-6 p-4 rounded-2xl bg-slate-800/90 border border-white/10 max-w-3xl text-left text-xs text-slate-300 flex items-start gap-3 shadow-md">
            <Info className="w-5 h-5 text-[#00A896] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Centro Activo y Reactor Catalítico:</strong> Durante las etapas metabólicas, los estudiantes acoplan el sustrato con su holoenzima catalizadora y cofactores (ATP, NAD⁺, TPP, CoA-SH) para liberar subproductos en el reservorio estequiométrico y resolver el estado de transición directamente en la pizarra.
            </p>
          </div>
        </section>
      </main>

      {/* 4. Footer Informativo */}
      <footer className="px-6 lg:px-12 py-5 border-t border-white/10 bg-[#0c1424] text-xs text-slate-400 flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-200">SIMOLA</span>
          <span>— Interactive Molecular & Metabolic Sandbox</span>
        </div>

        <div className="flex items-center gap-4 font-mono text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00A896]" />
            Clean Architecture
          </span>
          <span className="flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 text-[#F77F00]" />
            RDKit.js & Konva 2D
          </span>
        </div>
      </footer>

      {/* Modal de Confirmación para Reiniciar Progreso Académico */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="glass-panel w-full max-w-sm rounded-3xl p-6 border border-white/20 shadow-2xl bg-[#1B2A4A]/98 text-slate-100">
            <div className="flex items-center gap-3 mb-3 text-rose-400">
              <div className="p-2.5 rounded-2xl bg-rose-500/20 border border-rose-500/30">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
              </div>
              <h3 className="text-sm font-bold text-white">¿Reiniciar Progreso Académico?</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-5">
              Esta acción borrará todas las etapas completadas y el historial de intentos guardados en el navegador. Volverás al inicio del plan de estudios.
            </p>
            <div className="flex items-center justify-end gap-2.5">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white transition-all shadow-md active:scale-95"
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
