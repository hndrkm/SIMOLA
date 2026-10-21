import React from 'react';
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

  const totalMissions = PROGRESSION_MISSIONS.length;
  const totalCompleted = completedMissionIds.length;
  const progressPercent = Math.round((totalCompleted / totalMissions) * 100);

  const worlds = [
    {
      id: 'training' as MetabolicRouteId,
      worldNum: 1 as const,
      title: 'Mundo 1: Entrenamiento Químico',
      subtitle: 'Fundamentos, Valencias e Isómeros',
      description:
        'Aprende a dominar las valencias físicas, enlaces dobles en alquenos, isomería constitucional y la síntesis de enlaces fosfoéster.',
      badge: '3 Misiones',
      badgeColor: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
      accentColor: '#00A896', // Catalytic Teal
      buttonText: 'Jugar Mundo 1',
      buttonBg: 'bg-[#00A896] hover:bg-[#00c7b2] text-slate-950 font-bold',
      icon: <Atom className="w-6 h-6 text-[#00A896]" />,
      missions: getMissionsByWorld(1),
    },
    {
      id: 'glycolysis' as MetabolicRouteId,
      worldNum: 2 as const,
      title: 'Mundo 2: Ruta de la Glucólisis',
      subtitle: 'Pasos Enzimáticos Clave (HK, GAPDH, PK)',
      description:
        'Resuelve los pasos marcapasos y de conservación energética: fosforilación en C6 (G6P), oxidación-fosforilación (1,3-BPG) y síntesis de Piruvato.',
      badge: '3 Misiones',
      badgeColor: 'border-[#F77F00]/50 bg-[#F77F00]/15 text-[#ff941a]',
      accentColor: '#F77F00', // Phosphate Amber
      buttonText: 'Jugar Glucólisis',
      buttonBg: 'bg-[#F77F00] hover:bg-[#ff941a] text-slate-950 font-bold',
      icon: <Sparkles className="w-6 h-6 text-[#F77F00]" />,
      missions: getMissionsByWorld(2),
    },
    {
      id: 'pdh' as MetabolicRouteId,
      worldNum: 3 as const,
      title: 'Mundo 3: Complejo PDH',
      subtitle: 'Descarboxilación Oxidativa Mitocondrial',
      description:
        'Orquesta la descarboxilación oxidativa del Piruvato y la formación del enlace tioéster de alta energía de la Acetil-Coenzima A.',
      badge: '1 Misión Avanzada',
      badgeColor: 'border-sky-500/40 bg-sky-500/10 text-sky-300',
      accentColor: '#38bdf8',
      buttonText: 'Jugar Complejo PDH',
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

  return (
    <div className="min-h-screen h-screen w-full overflow-y-auto bg-gradient-to-b from-[#1B2A4A] via-[#0f1a30] to-[#080d18] text-slate-100 flex flex-col justify-between select-none">
      {/* 1. Barra de Navegación Superior con Logo de Alto Contraste */}
      <header className="px-6 lg:px-12 py-4 flex items-center justify-between border-b border-white/10 bg-[#1B2A4A]/80 backdrop-blur-md sticky top-0 z-30 shrink-0">
        <div className="flex items-center gap-3.5">
          {/* Contenedor de fondo claro para garantizar contraste nítido de letras oscuras */}
          <div className="bg-slate-100 px-3 py-1.5 rounded-xl shadow-md border border-white/30 flex items-center justify-center">
            <img
              src={`${import.meta.env.BASE_URL}logo.png`}
              alt="SIMOLA Logo"
              className="w-8 h-8 object-contain"
            />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-[#00A896] bg-clip-text text-transparent">
                SIMOLA
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#00A896]/20 text-[#00c7b2] border border-[#00A896]/40">
                v0.5.1
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
              Interactive Molecular & Metabolic Sandbox
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="btn-home-sandbox-nav"
            onClick={startSandbox}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#00A896]/15 hover:bg-[#00A896]/25 text-[#00c7b2] border border-[#00A896]/40 transition-all active:scale-95 shadow-sm"
          >
            <FlaskConical className="w-4 h-4 text-[#00A896]" />
            <span>Modo Sandbox Libre</span>
          </button>

          <button
            id="btn-home-continue-nav"
            onClick={handleContinueNextIncomplete}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#F77F00] hover:bg-[#ff941a] text-slate-950 transition-all active:scale-95 shadow-lg shadow-[#F77F00]/25 glow-amber"
          >
            <Play className="w-4 h-4 fill-current" />
            <span className="hidden sm:inline">Continuar</span> Misión
          </button>
        </div>
      </header>

      {/* 2. SECCIÓN PRINCIPAL SUPERIOR (PRIMER PLANO INMEDIATO SIN NECESIDAD DE SCROLL) */}
      <main className="px-6 lg:px-12 pt-6 pb-8 max-w-6xl mx-auto w-full flex flex-col gap-6">
        {/* Encabezado y barra de progreso de misiones */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-800/90 border border-white/10 shadow-xl">
          <div className="space-y-1">
            <h1 className="text-xl md:text-2xl font-black text-white flex items-center gap-2.5">
              <Layers className="w-6 h-6 text-[#00A896]" />
              Selector de Misiones y Rutas Metabólicas
            </h1>
            <p className="text-xs text-slate-300">
              Selecciona cualquier misión individual para cargar su esqueleto en el lienzo o inicia el recorrido completo.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-center shrink-0">
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/10 flex flex-col gap-1.5 min-w-[200px]">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-400 flex items-center gap-1.5 text-[11px]">
                  <Trophy className="w-3.5 h-3.5 text-[#F77F00]" />
                  Progreso:
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
              title="Continuar siguiente misión"
            >
              <Play className="w-4 h-4 fill-current" />
              <span className="hidden sm:inline">Jugar Siguiente</span>
            </button>
          </div>
        </div>

        {/* Grid de las 3 Tarjetas de Mundos (Mundo 1, Mundo 2 y Mundo 3) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {worlds.map((world) => {
            const worldMissions = world.missions;
            const completedCount = worldMissions.filter((m) =>
              completedMissionIds.includes(m.id)
            ).length;
            const isAllCompleted = completedCount === worldMissions.length;

            return (
              <div
                key={world.id}
                className="bg-slate-800/90 rounded-3xl p-6 border border-white/10 hover:border-white/25 transition-all duration-300 flex flex-col justify-between group hover:shadow-2xl relative overflow-hidden shadow-xl"
              >
                {/* Resplandor decorativo */}
                <div
                  className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl opacity-15 group-hover:opacity-30 transition-opacity pointer-events-none"
                  style={{ backgroundColor: world.accentColor }}
                />

                <div>
                  {/* Cabecera de la Card */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/10 shadow-inner">
                      {world.icon}
                    </div>
                    <span
                      className={`text-[10px] font-bold font-mono px-2.5 py-1 rounded-full border ${world.badgeColor}`}
                    >
                      {completedCount}/{worldMissions.length} Completadas
                    </span>
                  </div>

                  {/* Título y Subtítulo */}
                  <h2 className="text-base font-extrabold text-white group-hover:text-slate-100 transition-colors">
                    {world.title}
                  </h2>
                  <span className="text-xs font-semibold text-slate-400 block mt-0.5 mb-2">
                    {world.subtitle}
                  </span>

                  {/* Descripción */}
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {world.description}
                  </p>

                  {/* Lista Interactiva de Misiones del Mundo */}
                  <div className="space-y-2 mb-6">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Misiones Disponibles:
                    </span>
                    {worldMissions.map((m, idx) => {
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
                          title={`Jugar: ${m.title}`}
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

                {/* Botón de Entrada al Mundo */}
                <button
                  onClick={() => startRoute(world.id)}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 active:scale-95 ${world.buttonBg}`}
                >
                  <span>
                    {isAllCompleted ? 'Repasar Mundo Completo' : world.buttonText}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* 3. SECCIÓN SECUNDARIA INFORMATIVA (VISUALIZABLE AL HACER SCROLL HACIA ABAJO) */}
        <section className="mt-8 pt-8 border-t border-white/10 flex flex-col items-center text-center">
          {/* Logo Central con Contenedor Claro de Alto Contraste */}
          <div className="relative mb-5">
            <div className="bg-slate-100/95 p-4 rounded-3xl shadow-2xl border-2 border-[#00A896]/40 flex items-center justify-center glow-teal">
              <img
                src={`${import.meta.env.BASE_URL}logo.png`}
                alt="SIMOLA"
                className="w-16 h-16 object-contain filter drop-shadow-md"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-[#F77F00] text-slate-950 font-bold flex items-center justify-center shadow-lg border-2 border-[#1B2A4A]">
              <Sparkles className="w-3.5 h-3.5 fill-current" />
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Acerca de <span className="bg-gradient-to-r from-[#00A896] to-[#F77F00] bg-clip-text text-transparent">SIMOLA</span>
          </h2>

          <p className="mt-3 text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
            SIMOLA (<em>Interactive Molecular & Metabolic Sandbox</em>) es una plataforma interactiva de
            construcción molecular 2D y simulación de reacciones bioquímicas. Integra la precisión de
            dibujo asistido estilo <strong>KingDraw</strong> con el motor químico profesional <strong>RDKit.js WebAssembly</strong> y un
            evaluador didáctico que detecta isomería, enlaces enzimáticos y transgresiones físicas en tiempo real.
          </p>

          {/* Tarjetas de Capacidades Métricas */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl w-full text-xs">
            <div className="bg-slate-800/90 border border-white/10 p-3.5 rounded-2xl flex flex-col items-center justify-center text-center shadow-md">
              <span className="font-mono text-lg font-black text-[#00A896]">118</span>
              <span className="text-[11px] text-slate-400 mt-0.5">Elementos e Isótopos</span>
            </div>
            <div className="bg-slate-800/90 border border-white/10 p-3.5 rounded-2xl flex flex-col items-center justify-center text-center shadow-md">
              <span className="font-mono text-lg font-black text-[#F77F00]">3 a 8</span>
              <span className="text-[11px] text-slate-400 mt-0.5">Lados por Anillo</span>
            </div>
            <div className="bg-slate-800/90 border border-white/10 p-3.5 rounded-2xl flex flex-col items-center justify-center text-center shadow-md">
              <span className="font-mono text-lg font-black text-sky-400">120°</span>
              <span className="text-[11px] text-slate-400 mt-0.5">Brote en Zigzag</span>
            </div>
            <div className="bg-slate-800/90 border border-white/10 p-3.5 rounded-2xl flex flex-col items-center justify-center text-center shadow-md">
              <span className="font-mono text-lg font-black text-emerald-400">2 Capas</span>
              <span className="text-[11px] text-slate-400 mt-0.5">Validación Didáctica</span>
            </div>
          </div>

          {/* Callout de información didáctica */}
          <div className="mt-6 p-4 rounded-2xl bg-slate-800/90 border border-white/10 max-w-3xl text-left text-xs text-slate-300 flex items-start gap-3 shadow-md">
            <Info className="w-5 h-5 text-[#00A896] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Diseñado para la enseñanza universitaria de Bioquímica:</strong> Los esqueletos moleculares
              protegen los enlaces estructurales que no deben romperse mediante candados inmutables,
              permitiendo al estudiante concentrarse en la reacción química del centro activo enzimático
              (fosforilación, oxidación, escisión o condensación de tioésteres).
            </p>
          </div>
        </section>
      </main>

      {/* 4. Footer Informativo */}
      <footer className="px-6 lg:px-12 py-5 border-t border-white/10 bg-[#0c1424] text-xs text-slate-400 flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-200">SIMOLA</span>
          <span>— Bioquímica interactiva con retroalimentación en tiempo real</span>
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
    </div>
  );
};
