import React from 'react';
import {
  Play,
  FlaskConical,
  Atom,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { useGameStore, MetabolicRouteId } from '../../store/useGameStore';
import { useCanvasStore } from '../../store/useCanvasStore';

export const HomeView: React.FC = () => {
  const startRoute = useGameStore((state) => state.startRoute);
  const clearGraph = useCanvasStore((state) => state.clearGraph);

  const handleLaunchRoute = (route: MetabolicRouteId) => {
    if (route === 'sandbox') {
      clearGraph();
    }
    startRoute(route);
  };

  const routes = [
    {
      id: 'training' as MetabolicRouteId,
      title: 'Entrenamiento Químico',
      subtitle: 'Fundamentos y Mecánicas Asistidas',
      description:
        'Aprende a dominar las valencias físicas, enlaces múltiples, anillos de 3 a 8 lados, isótopos y el catálogo completo de grupos funcionales.',
      tags: ['C, H, O, N, P, S', 'Benceno', 'Isótopos', 'KingDraw 120°'],
      badge: 'Básico a Avanzado',
      badgeColor: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
      accentColor: '#00A896', // Catalytic Teal
      buttonText: 'Comenzar Entrenamiento',
      buttonBg: 'bg-[#00A896] hover:bg-[#00c7b2] text-slate-950',
      icon: <Atom className="w-6 h-6 text-[#00A896]" />,
    },
    {
      id: 'glycolysis' as MetabolicRouteId,
      title: 'Ruta de la Glucólisis',
      subtitle: 'Fase de Preparación y Rendimiento (10 Pasos)',
      description:
        'Transforma la D-Glucosa en dos moléculas de Piruvato. Utiliza cofactores ATP/ADP y NAD⁺/NADH para regular las enzimas marcapasos.',
      tags: ['10 Pasos Enzimáticos', 'ATP / ADP', 'NAD⁺ / NADH', 'G3P'],
      badge: 'Ruta Central',
      badgeColor: 'border-[#F77F00]/50 bg-[#F77F00]/15 text-[#ff941a]',
      accentColor: '#F77F00', // Phosphate Amber
      buttonText: 'Comenzar Glucólisis',
      buttonBg: 'bg-[#F77F00] hover:bg-[#ff941a] text-slate-950 font-bold',
      icon: <Sparkles className="w-6 h-6 text-[#F77F00]" />,
    },
    {
      id: 'pdh' as MetabolicRouteId,
      title: 'Complejo Piruvato Deshidrogenasa',
      subtitle: 'Descarboxilación Oxidativa Mitocondrial',
      description:
        'Orquesta los tres componentes enzimáticos (E1, E2, E3) acoplando el brazo oscilante de Lipoamida y la síntesis de Acetil-CoA.',
      tags: ['Complejo E1-E2-E3', 'CoA-SH', 'Lipoamida Redox', 'TPP'],
      badge: 'Avanzado',
      badgeColor: 'border-sky-500/40 bg-sky-500/10 text-sky-300',
      accentColor: '#38bdf8',
      buttonText: 'Comenzar Complejo PDH',
      buttonBg: 'bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold',
      icon: <Zap className="w-6 h-6 text-sky-400" />,
    },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#1B2A4A] via-[#0f1a30] to-[#080d18] text-slate-100 flex flex-col justify-between overflow-x-hidden select-none">
      {/* Barra de Navegación Superior de Marca */}
      <header className="px-6 lg:px-12 py-5 flex items-center justify-between border-b border-white/10 bg-[#1B2A4A]/60 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-3.5">
          <img
            src={`${import.meta.env.BASE_URL}logo.png`}
            alt="SIMOLA Logo"
            className="w-10 h-10 object-contain drop-shadow-md rounded-xl"
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-[#00A896] bg-clip-text text-transparent">
                SIMOLA
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#F77F00]/20 text-[#ff941a] border border-[#F77F00]/40">
                v0.2.0 (Etapa 2)
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">
              Interactive Molecular & Metabolic Sandbox
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleLaunchRoute('sandbox')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/15 text-slate-200 border border-white/15 transition-all active:scale-95 shadow-sm"
          >
            <FlaskConical className="w-4 h-4 text-[#00A896]" />
            <span className="hidden sm:inline">Pizarra Libre</span>
          </button>

          <button
            onClick={() => handleLaunchRoute('glycolysis')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#F77F00] hover:bg-[#ff941a] text-slate-950 transition-all active:scale-95 shadow-lg shadow-[#F77F00]/25 glow-amber"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Continuar Misión</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 lg:px-12 pt-12 pb-8 max-w-6xl mx-auto flex flex-col items-center text-center relative">
        {/* Glow de Fondo Decorativo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00A896]/15 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#F77F00]/10 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Logo Central de Gran Impacto */}
        <div className="relative mb-6">
          <div className="w-28 h-28 rounded-3xl bg-gradient-to-b from-[#1B2A4A] to-[#0c1424] p-3 border-2 border-[#00A896]/40 shadow-2xl flex items-center justify-center glow-teal">
            <img
              src={`${import.meta.env.BASE_URL}logo.png`}
              alt="SIMOLA"
              className="w-full h-full object-contain filter drop-shadow-lg"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#F77F00] text-slate-950 font-bold flex items-center justify-center shadow-lg border-2 border-[#1B2A4A]">
            <Sparkles className="w-4 h-4 fill-current" />
          </div>
        </div>

        {/* Título Principal y Subtítulo */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-3xl leading-tight">
          Pizarra Molecular 2D y{' '}
          <span className="bg-gradient-to-r from-[#00A896] via-teal-300 to-[#F77F00] bg-clip-text text-transparent">
            Rutas Metabólicas
          </span>
        </h1>

        <p className="mt-4 text-sm md:text-base text-slate-300 max-w-2xl leading-relaxed">
          Combina la precisión de dibujo químico asistido estilo <strong>KingDraw</strong> (ángulos en zigzag a 120°, 
          anillos 3-8, tabla periódica completa y 118 elementos) con la resolución interactiva de rutas metabólicas como la 
          <strong> Glucólisis</strong> y el <strong>Complejo PDH</strong>.
        </p>

        {/* Botones de Acción Primaria (CTA) */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            id="btn-home-start-route"
            onClick={() => handleLaunchRoute('glycolysis')}
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl text-sm font-extrabold bg-[#F77F00] hover:bg-[#ff941a] text-slate-950 transition-all duration-200 shadow-xl shadow-[#F77F00]/30 hover:scale-105 active:scale-95 glow-amber"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Iniciar / Continuar Ruta</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            id="btn-home-sandbox"
            onClick={() => handleLaunchRoute('sandbox')}
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl text-sm font-bold bg-[#00A896] hover:bg-[#00c7b2] text-slate-950 border border-teal-300/30 transition-all duration-200 shadow-xl shadow-[#00A896]/20 hover:scale-105 active:scale-95 glow-teal"
          >
            <FlaskConical className="w-5 h-5" />
            <span>Laboratorio Libre (Sandbox)</span>
          </button>
        </div>

        {/* Métricas e Indicadores de Capacidad */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl w-full text-xs">
          <div className="glass-panel p-3 rounded-2xl flex flex-col items-center justify-center text-center">
            <span className="font-mono text-lg font-black text-[#00A896]">118</span>
            <span className="text-[11px] text-slate-400 mt-0.5">Elementos e Isótopos</span>
          </div>
          <div className="glass-panel p-3 rounded-2xl flex flex-col items-center justify-center text-center">
            <span className="font-mono text-lg font-black text-[#F77F00]">3 a 8</span>
            <span className="text-[11px] text-slate-400 mt-0.5">Lados por Anillo</span>
          </div>
          <div className="glass-panel p-3 rounded-2xl flex flex-col items-center justify-center text-center">
            <span className="font-mono text-lg font-black text-sky-400">120°</span>
            <span className="text-[11px] text-slate-400 mt-0.5">Brote en Zigzag</span>
          </div>
          <div className="glass-panel p-3 rounded-2xl flex flex-col items-center justify-center text-center">
            <span className="font-mono text-lg font-black text-emerald-400">2 Capas</span>
            <span className="text-[11px] text-slate-400 mt-0.5">Validación Didáctica</span>
          </div>
        </div>
      </section>

      {/* Selector de Rutas Metabólicas (Grid de 3 Cards) */}
      <section className="px-6 lg:px-12 py-10 max-w-6xl mx-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2.5">
              <Layers className="w-5 h-5 text-[#00A896]" />
              Selector de Rutas y Módulos
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Elige un módulo para avanzar progresivamente o practica en la pizarra libre
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {routes.map((route) => (
            <div
              key={route.id}
              className="glass-panel rounded-3xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 flex flex-col justify-between group hover:shadow-2xl relative overflow-hidden bg-[#1B2A4A]/80"
            >
              {/* Resplandor sutil en hover */}
              <div
                className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl opacity-15 group-hover:opacity-30 transition-opacity pointer-events-none"
                style={{ backgroundColor: route.accentColor }}
              />

              <div>
                {/* Cabecera de la Card */}
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/10 shadow-inner">
                    {route.icon}
                  </div>
                  <span
                    className={`text-[10px] font-bold font-mono px-2.5 py-1 rounded-full border ${route.badgeColor}`}
                  >
                    {route.badge}
                  </span>
                </div>

                {/* Título y Subtítulo */}
                <h3 className="text-lg font-bold text-white group-hover:text-slate-100 transition-colors">
                  {route.title}
                </h3>
                <span className="text-xs font-semibold text-slate-400 block mt-0.5 mb-2.5">
                  {route.subtitle}
                </span>

                {/* Descripción */}
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {route.description}
                </p>

                {/* Etiquetas de Contenido */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {route.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-slate-900/60 text-slate-300 border border-slate-700/50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Botón de Entrada */}
              <button
                onClick={() => handleLaunchRoute(route.id)}
                className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 active:scale-95 ${route.buttonBg}`}
              >
                <span>{route.buttonText}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Informativo */}
      <footer className="px-6 lg:px-12 py-6 border-t border-white/10 bg-[#0f172a]/80 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-4 mt-8">
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
