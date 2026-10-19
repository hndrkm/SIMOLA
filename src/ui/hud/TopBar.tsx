import React, { useState } from 'react';
import {
  CheckCircle2,
  HelpCircle,
  X,
  Sparkles,
  ArrowLeft,
  Flame,
} from 'lucide-react';
import { useCanvasStore } from '../../store/useCanvasStore';
import { useGameStore } from '../../store/useGameStore';

export const TopBar: React.FC = () => {
  const graph = useCanvasStore((state) => state.graph);
  const activeRoute = useGameStore((state) => state.activeRoute);
  const setView = useGameStore((state) => state.setView);

  const [showHelp, setShowHelp] = useState(false);

  const atomCount = Object.keys(graph.nodes).length;
  const bondCount = Object.keys(graph.edges).length;

  const handleVerify = () => {
    if (atomCount === 0) {
      alert('Lienzo vacío: Coloca átomos y conéctalos con enlaces antes de verificar.');
      return;
    }
    alert(
      `Estructura actual registrada:\n• Átomos: ${atomCount}\n• Enlaces: ${bondCount}\n• Módulo: ${
        activeRoute === 'sandbox' ? 'Laboratorio Libre' : activeRoute.toUpperCase()
      }\n\nEl motor de validación en 2 capas (Capa 1: Validador Local, Capa 2: RDKit.js) se integrará plenamente en las Etapas 3 y 4.`
    );
  };

  const getRouteLabel = () => {
    switch (activeRoute) {
      case 'sandbox':
        return 'Laboratorio Libre (Sandbox)';
      case 'training':
        return 'Entrenamiento Químico';
      case 'glycolysis':
        return 'Ruta de la Glucólisis';
      case 'pdh':
        return 'Complejo PDH';
      default:
        return 'SIMOLA Sandbox';
    }
  };

  return (
    <>
      <header className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between select-none pointer-events-none">
        {/* Identidad de la Aplicación y Botón Menú Principal */}
        <div className="glass-panel px-3.5 py-2 rounded-2xl flex items-center gap-3 border border-white/15 shadow-xl pointer-events-auto bg-[#1B2A4A]/85">
          <button
            id="btn-return-home"
            onClick={() => setView('home')}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition-all text-xs font-semibold group"
            title="Volver al Menú Principal (HomeView)"
          >
            <ArrowLeft className="w-4 h-4 text-[#00A896] group-hover:-translate-x-0.5 transition-transform" />
            <img
              src={`${import.meta.env.BASE_URL}logo.png`}
              alt="SIMOLA Logo"
              className="w-7 h-7 object-contain drop-shadow"
            />
          </button>

          <div className="h-6 w-px bg-white/15" />

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm tracking-tight text-white">
                SIMOLA
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono bg-[#00A896]/20 text-[#00c7b2] border border-[#00A896]/40 rounded-full font-bold">
                {getRouteLabel()}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">
              Interactive Molecular & Metabolic Sandbox
            </span>
          </div>
        </div>

        {/* Resumen del Grafo y Acciones Principales */}
        <div className="flex items-center gap-3 pointer-events-auto">
          {/* Contador de Átomos y Enlaces */}
          <div className="glass-panel px-3.5 py-2 rounded-2xl hidden md:flex items-center gap-3 border border-white/15 text-xs bg-[#1B2A4A]/85">
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-[#00A896] animate-pulse" />
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
            <HelpCircle className="w-5 h-5 text-slate-300" />
          </button>

          {/* Botón de Verificar Reacción (Vibrant Catalytic Teal #00A896) */}
          <button
            id="btn-verify-structure"
            onClick={handleVerify}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#00A896] hover:bg-[#00c7b2] text-slate-950 font-extrabold text-xs transition-all shadow-lg shadow-[#00A896]/30 hover:scale-[1.02] active:scale-95 glow-teal"
            title="Verificar valencias y coherencia bioquímica"
          >
            <CheckCircle2 className="w-4 h-4 text-slate-950 fill-current" />
            <span>Verificar Reacción</span>
          </button>
        </div>
      </header>

      {/* Modal de Ayuda y Atajos de Teclado */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="glass-panel w-full max-w-md rounded-3xl p-6 border border-white/20 shadow-2xl relative bg-[#1B2A4A]/95">
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
                <h3 className="text-base font-bold text-white">Controles Asistidos SIMOLA</h3>
                <p className="text-xs text-slate-400">Guía de interacción molecular ergonómica</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="bg-slate-900/60 p-3 rounded-2xl border border-white/10 space-y-2">
                <p className="font-semibold text-[#00c7b2]">Mecánicas del Editor:</p>
                <ul className="space-y-1 list-disc list-inside text-slate-300">
                  <li><strong>Colocar Átomo:</strong> Clic en el lienzo para añadir el elemento activo. Clic sobre un átomo para transmutarlo.</li>
                  <li><strong>Crear Enlaces:</strong> En modo enlace, arrastra de un átomo a otro con la línea guía magnética.</li>
                  <li><strong>Ciclar Enlaces:</strong> Clic en cualquier enlace alterna entre simple, doble y triple.</li>
                  <li><strong>Anillos y Fusión:</strong> Elige un anillo (3 a 8 lados); haz clic en vacío para estamparlo o sobre un enlace para fusionarlo.</li>
                  <li><strong>Plantillas y Sprout:</strong> Clic en un átomo con una plantilla activa para acoplarla directamente.</li>
                  <li><strong>Carga Formal (+ / −):</strong> Pasa el ratón sobre cualquier átomo para subir o bajar su carga formal.</li>
                </ul>
              </div>

              <div className="bg-slate-900/60 p-3 rounded-2xl border border-white/10">
                <p className="font-semibold text-[#ff941a] mb-2 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-[#F77F00]" />
                  Atajos de Teclado:
                </p>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="flex justify-between items-center"><span className="text-slate-400">Seleccionar:</span> <kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">V</kbd></div>
                  <div className="flex justify-between items-center"><span className="text-slate-400">Átomo:</span> <kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">A</kbd></div>
                  <div className="flex justify-between items-center"><span className="text-slate-400">Enlace:</span> <kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">B</kbd></div>
                  <div className="flex justify-between items-center"><span className="text-slate-400">Borrador:</span> <kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">E</kbd></div>
                  <div className="flex justify-between items-center"><span className="text-slate-400">Deshacer:</span> <kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">Ctrl+Z</kbd></div>
                  <div className="flex justify-between items-center"><span className="text-slate-400">Rehacer:</span> <kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">Ctrl+Y</kbd></div>
                  <div className="flex justify-between items-center"><span className="text-slate-400">Enlaces 1/2/3:</span> <kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">1, 2, 3</kbd></div>
                  <div className="flex justify-between items-center"><span className="text-slate-400">Elementos:</span> <kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">C, H, O...</kbd></div>
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
