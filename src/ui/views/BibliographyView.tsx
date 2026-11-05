import React, { useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Award,
  Layers,
  Code2,
  Cpu,
  Atom,
  FlaskConical,
  ExternalLink,
  Copy,
  Check,
  GraduationCap,
} from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';

interface ReferenceItem {
  id: string;
  category: 'languages' | 'frameworks' | 'graphics' | 'chemoinformatics' | 'biochemistry';
  title: string;
  apa: string;
  ieee: string;
  url?: string;
  tags: string[];
}

const REFERENCES: ReferenceItem[] = [
  // 1. Lenguajes y Estándares
  {
    id: 'typescript',
    category: 'languages',
    title: 'TypeScript: Typed JavaScript at Any Scale',
    apa: 'Microsoft. (2024). TypeScript language specification (Version 5.5). Microsoft Corporation. https://www.typescriptlang.org/',
    ieee: 'Microsoft, "TypeScript language specification," v. 5.5, Redmond, WA, USA: Microsoft Corp., 2024. [Online]. Available: https://www.typescriptlang.org/',
    url: 'https://www.typescriptlang.org/',
    tags: ['Lenguaje', 'Tipado Estático', 'Compilación'],
  },
  {
    id: 'webassembly',
    category: 'languages',
    title: 'WebAssembly Core Specification (W3C Recommendation)',
    apa: 'Haas, A., Rossberg, A., Schuff, D. L., Titzer, B. L., Holman, M., Gohman, D., Wagner, L., Zakai, A., & Bastien, J. (2017). Bringing the web up to speed with WebAssembly. Proceedings of the 38th ACM SIGPLAN Conference on Programming Language Design and Implementation (PLDI \'17), 185–200. https://doi.org/10.1145/3062341.3062363',
    ieee: 'A. Haas et al., "Bringing the web up to speed with WebAssembly," in Proc. 38th ACM SIGPLAN Conf. Program. Lang. Des. Implement. (PLDI \'17), Barcelona, Spain, 2017, pp. 185–200. doi: 10.1145/3062341.3062363.',
    url: 'https://webassembly.org/',
    tags: ['W3C Standard', 'Bajo Nivel', 'Rendimiento Cuántico'],
  },
  {
    id: 'canvas2d',
    category: 'languages',
    title: 'HTML Canvas 2D Context (W3C Recommendation)',
    apa: 'World Wide Web Consortium. (2021). HTML Canvas 2D Context (W3C Recommendation 28 January 2021). W3C. https://www.w3.org/TR/2dcontext/',
    ieee: 'World Wide Web Consortium, "HTML Canvas 2D Context," W3C Recommendation, Jan. 2021. [Online]. Available: https://www.w3.org/TR/2dcontext/',
    url: 'https://www.w3.org/TR/2dcontext/',
    tags: ['W3C Standard', 'Renderizado 2D', 'Hardware Acceleration'],
  },

  // 2. Frameworks UI y Gestión de Estado
  {
    id: 'react',
    category: 'frameworks',
    title: 'React 18: A JavaScript Library for Building User Interfaces',
    apa: 'Meta Open Source. (2022). React: The library for web and native user interfaces (Version 18.3). Meta Platforms, Inc. https://react.dev/',
    ieee: 'Meta Open Source, "React: The library for web and native user interfaces," v. 18.3, Menlo Park, CA, USA: Meta Platforms, Inc., 2022. [Online]. Available: https://react.dev/',
    url: 'https://react.dev/',
    tags: ['UI Reactiva', 'Virtual DOM', 'Componentes Modulares'],
  },
  {
    id: 'zustand',
    category: 'frameworks',
    title: 'Zustand: Bear Necessities for State Management in React',
    apa: 'Poimandres. (2024). Zustand: Fast and scalable bearbones state-management solution using simplified flux principles. https://github.com/pmndrs/zustand',
    ieee: 'Poimandres, "Zustand: Fast and scalable bearbones state-management solution," 2024. [Online]. Available: https://github.com/pmndrs/zustand',
    url: 'https://zustand.docs.pmnd.rs/',
    tags: ['Estado Global', 'Flux Reactivo', 'Sincronización O(1)'],
  },
  {
    id: 'vite',
    category: 'frameworks',
    title: 'Vite: Next Generation Frontend Tooling',
    apa: 'You, E., & Vite Contributors. (2024). Vite: Native ESM-powered build tool with Hot Module Replacement. https://vitejs.dev/',
    ieee: 'E. You and Vite Contributors, "Vite: Next Generation Frontend Tooling," 2024. [Online]. Available: https://vitejs.dev/',
    url: 'https://vitejs.dev/',
    tags: ['Bundler ESM', 'HMR', 'Rollup Pipeline'],
  },
  {
    id: 'tailwind',
    category: 'frameworks',
    title: 'Tailwind CSS: Utility-First CSS Framework',
    apa: 'Wathan, A., Schoger, S., & Tailwind Labs. (2024). Tailwind CSS: Rapidly build modern websites without ever leaving your HTML (Version 3.4). https://tailwindcss.com/',
    ieee: 'A. Wathan, S. Schoger, and Tailwind Labs, "Tailwind CSS: Utility-First CSS Framework," v. 3.4, 2024. [Online]. Available: https://tailwindcss.com/',
    url: 'https://tailwindcss.com/',
    tags: ['CSS Utility-First', 'CAD Blueprint Theme', 'Diseño Vectorial'],
  },

  // 3. Motor Gráfico 2D y Renderizado Vectorial
  {
    id: 'konva',
    category: 'graphics',
    title: 'Konva.js & React-Konva: 2D Canvas JavaScript Framework',
    apa: 'Lavrenov, A. (2024). Konva: 2D Canvas JavaScript framework for desktop and mobile applications (Version 9.3). https://konvajs.org/',
    ieee: 'A. Lavrenov, "Konva: 2D Canvas JavaScript framework," v. 9.3, 2024. [Online]. Available: https://konvajs.org/',
    url: 'https://konvajs.org/',
    tags: ['Konva Engine', '60 FPS Pipeline', 'Grafo Escena 2D'],
  },
  {
    id: 'lucide',
    category: 'graphics',
    title: 'Lucide Icons: Beautiful & Consistent Icon Toolkit',
    apa: 'Lucide Contributors. (2024). Lucide: Community-driven icon library (Version 0.380). https://lucide.dev/',
    ieee: 'Lucide Contributors, "Lucide: Community-driven icon library," v. 0.380, 2024. [Online]. Available: https://lucide.dev/',
    url: 'https://lucide.dev/',
    tags: ['Iconografía Vectorial', 'SVG Dinámico', 'Diseño CAD'],
  },

  // 4. Quimioinformática y Validación
  {
    id: 'rdkit',
    category: 'chemoinformatics',
    title: 'RDKit: Open-Source Cheminformatics and Machine Learning',
    apa: 'Landrum, G., Tosco, P., Kelley, B., Srinivas, R., Gedeck, P., Vianello, R., Schneider, N., Savelyev, A., Cosgrove, D., & Cole, J. (2024). RDKit: Open-source cheminformatics (Version 2024.03.1). https://doi.org/10.5281/zenodo.10978934',
    ieee: 'G. Landrum et al., "RDKit: Open-source cheminformatics," Zenodo, 2024. doi: 10.5281/zenodo.10978934.',
    url: 'https://www.rdkit.org/',
    tags: ['RDKit Wasm', 'SMILES Canónico', 'Subestructura SMARTS'],
  },
  {
    id: 'iupac_goldbook',
    category: 'chemoinformatics',
    title: 'IUPAC Compendium of Chemical Terminology (Gold Book)',
    apa: 'International Union of Pure and Applied Chemistry. (2019). Compendium of chemical terminology (Gold Book) (2nd ed.). IUPAC. https://doi.org/10.1351/goldbook',
    ieee: 'IUPAC, Compendium of Chemical Terminology (Gold Book), 2nd ed. Research Triangle Park, NC, USA: IUPAC, 2019. doi: 10.1351/goldbook.',
    url: 'https://goldbook.iupac.org/',
    tags: ['Norma IUPAC', 'Valencias Covalentes', 'Hibridación sp²'],
  },

  // 5. Bioquímica, Enzimología y Rutas Metabólicas
  {
    id: 'lehninger',
    category: 'biochemistry',
    title: 'Lehninger Principles of Biochemistry (8th Edition)',
    apa: 'Nelson, D. L., & Cox, M. M. (2021). Lehninger principles of biochemistry (8th ed.). W. H. Freeman / Macmillan Learning.',
    ieee: 'D. L. Nelson and M. M. Cox, Lehninger Principles of Biochemistry, 8th ed. New York, NY, USA: W. H. Freeman, 2021.',
    tags: ['Glucólisis EMP', 'Complejo PDH', 'ΔG°\' Termodinámico'],
  },
  {
    id: 'voet',
    category: 'biochemistry',
    title: 'Biochemistry (4th Edition)',
    apa: 'Voet, D., & Voet, J. G. (2011). Biochemistry (4th ed.). John Wiley & Sons.',
    ieee: 'D. Voet and J. G. Voet, Biochemistry, 4th ed. Hoboken, NJ, USA: John Wiley & Sons, 2011.',
    tags: ['Mecanismos Catalíticos', 'Enzimología EC', 'Proyecciones Haworth'],
  },
  {
    id: 'iubmb',
    category: 'biochemistry',
    title: 'Enzyme Nomenclature: Recommendations of the Nomenclature Committee of the IUBMB',
    apa: 'International Union of Biochemistry and Molecular Biology. (2023). Enzyme nomenclature recommendations. IUBMB. https://www.qmul.ac.uk/sbcs/iubmb/enzyme/',
    ieee: 'IUBMB, "Enzyme Nomenclature Recommendations," London, UK: Queen Mary University of London, 2023. [Online]. Available: https://www.qmul.ac.uk/sbcs/iubmb/enzyme/',
    url: 'https://www.qmul.ac.uk/sbcs/iubmb/enzyme/',
    tags: ['Clasificación EC', 'Holoenzimas', 'Catálisis E1/E2/E3'],
  },
];

export const BibliographyView: React.FC = () => {
  const setView = useGameStore((state) => state.setView);
  const currentMissionId = useGameStore((state) => state.currentMissionId);

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedFormat, setSelectedFormat] = useState<'apa' | 'ieee'>('apa');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyCitation = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filteredReferences =
    activeCategory === 'all'
      ? REFERENCES
      : REFERENCES.filter((r) => r.category === activeCategory);

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] text-slate-800 overflow-y-auto flex flex-col font-sans select-text">
      {/* 1. Header de Telemetría y Navegación */}
      <header className="px-6 lg:px-12 py-3.5 flex items-center justify-between gap-4 border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-30 shrink-0 shadow-xs">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setView(currentMissionId ? 'workspace' : 'home')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-slate-50 hover:bg-slate-100 text-[#008477] border border-slate-300 transition-all active:scale-95 shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a {currentMissionId ? 'la Pizarra' : 'Inicio'}</span>
          </button>

          <div className="h-5 w-[1px] bg-slate-200 hidden sm:block" />

          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-[#008477]" />
            <h1 className="text-base sm:text-lg font-black tracking-wide text-slate-900 flex items-center gap-2">
              SIMOLA <span className="text-[#008477] text-xs font-mono px-2 py-0.5 rounded border border-[#008477]/30 bg-[#008477]/10 font-bold">v2.0 CAD</span>
            </h1>
          </div>
        </div>

        {/* Selector de Formato de Cita (APA 7ª vs IEEE) */}
        <div className="cad-panel cad-corners px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-mono bg-slate-50 border border-slate-200">
          <span className="text-slate-500 font-bold hidden sm:inline mr-1 text-[11px]">Estilo:</span>
          <button
            onClick={() => setSelectedFormat('apa')}
            className={`px-2.5 py-1 rounded font-bold text-[11px] transition-all ${
              selectedFormat === 'apa'
                ? 'bg-[#008477] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            APA 7.ª Ed.
          </button>
          <button
            onClick={() => setSelectedFormat('ieee')}
            className={`px-2.5 py-1 rounded font-bold text-[11px] transition-all ${
              selectedFormat === 'ieee'
                ? 'bg-[#008477] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            IEEE
          </button>
        </div>
      </header>

      {/* 2. Contenido Principal */}
      <main className="max-w-6xl w-full mx-auto px-6 lg:px-12 py-8 flex flex-col gap-8 flex-1">
        {/* TARJETA DESTACADA: Autoría, Arquitectura e Ingeniería del Proyecto */}
        <section className="cad-panel cad-corners-full p-6 sm:p-8 rounded-2xl relative overflow-hidden bg-white border border-slate-300 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#008477]/10 border border-[#008477]/30 text-[#008477] text-xs font-mono font-bold">
                <Award className="w-3.5 h-3.5 text-[#008477]" />
                AUTORÍA Y DESARROLLO DEL PROYECTO
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Frak Abel
              </h2>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs font-mono text-slate-600">
                <span className="flex items-center gap-1.5 text-[#008477] font-bold">
                  <GraduationCap className="w-4 h-4" />
                  Carrera de Bioquímica
                </span>
                <span className="text-slate-300 hidden sm:inline">•</span>
                <span className="text-slate-700 font-medium">
                  Universidad Mayor de San Andrés (UMSA)
                </span>
                <span className="text-slate-300 hidden sm:inline">•</span>
                <span className="text-slate-500">
                  La Paz, Bolivia
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed pt-1 font-sans">
                Arquitectura de software, modelado quimioinformático interactivo, motor de validación mecanística a 60 FPS y diseño de la estación visual de ingeniería bioquímica <strong>SIMOLA</strong> (<em>Interactive Molecular & Metabolic Sandbox</em>).
              </p>
            </div>

            <div className="cad-panel p-4 rounded-xl border border-slate-200 bg-slate-50 shrink-0 flex flex-col gap-2 min-w-[220px] shadow-xs">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                Especificaciones del Sistema
              </span>
              <div className="text-xs font-mono flex items-center justify-between text-slate-700">
                <span>Versión:</span>
                <strong className="text-[#008477]">v2.0 CAD Edition</strong>
              </div>
              <div className="text-xs font-mono flex items-center justify-between text-slate-700">
                <span>Pipeline Gráfico:</span>
                <strong className="text-slate-900">Konva 2D (60 FPS)</strong>
              </div>
              <div className="text-xs font-mono flex items-center justify-between text-slate-700">
                <span>Motor Químico:</span>
                <strong className="text-amber-700">RDKit Wasm</strong>
              </div>
              <div className="text-xs font-mono flex items-center justify-between text-slate-700">
                <span>Rutas Modeladas:</span>
                <strong className="text-[#008477]">Glucólisis EMP (10/10)</strong>
              </div>
            </div>
          </div>
        </section>

        {/* Filtros de Categoría */}
        <section className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
          <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mr-2 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#008477]" />
            Categoría:
          </span>
          {[
            { id: 'all', label: 'Todas las Referencias' },
            { id: 'languages', label: 'Lenguajes y Estándares' },
            { id: 'frameworks', label: 'Frameworks UI y Estado' },
            { id: 'graphics', label: 'Motor Gráfico 2D' },
            { id: 'chemoinformatics', label: 'Quimioinformática' },
            { id: 'biochemistry', label: 'Bioquímica y Enzimología' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
                activeCategory === cat.id
                  ? 'bg-[#008477] text-white border-[#008477] shadow-xs'
                  : 'bg-white text-slate-700 hover:text-slate-900 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </section>

        {/* LISTADO DE REFERENCIAS */}
        <section className="grid grid-cols-1 gap-4">
          {filteredReferences.map((ref) => {
            const citationText = selectedFormat === 'apa' ? ref.apa : ref.ieee;
            const isCopied = copiedId === ref.id;

            return (
              <article
                key={ref.id}
                className="cad-panel cad-corners p-5 rounded-xl border border-slate-200 hover:border-slate-300 transition-all bg-white shadow-xs flex flex-col gap-3 group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#008477] transition-colors flex items-center gap-2">
                      {ref.category === 'languages' && <Code2 className="w-4 h-4 text-[#008477]" />}
                      {ref.category === 'frameworks' && <Cpu className="w-4 h-4 text-sky-600" />}
                      {ref.category === 'graphics' && <Layers className="w-4 h-4 text-emerald-600" />}
                      {ref.category === 'chemoinformatics' && <Atom className="w-4 h-4 text-amber-600" />}
                      {ref.category === 'biochemistry' && <FlaskConical className="w-4 h-4 text-purple-600" />}
                      {ref.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {ref.url && (
                      <a
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-[#008477] border border-slate-200 transition-all"
                        title="Abrir enlace oficial"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <button
                      onClick={() => handleCopyCitation(ref.id, citationText)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono font-bold transition-all border ${
                        isCopied
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border-slate-300'
                      }`}
                      title="Copiar cita formal al portapapeles"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>¡Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copiar ({selectedFormat.toUpperCase()})</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Texto de la Cita */}
                <p className="text-xs font-mono text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed selection:bg-[#008477] selection:text-white">
                  {citationText}
                </p>

                {/* Etiquetas Técnicas */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {ref.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-600 border border-slate-200"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </article>
            );
          })}
        </section>
      </main>

      {/* 3. Footer */}
      <footer className="px-6 lg:px-12 py-4 border-t border-slate-200 bg-white text-center text-xs font-mono text-slate-500">
        SIMOLA v2.0 • Desarrollado por Hendrik Michael Ramos Suarez • UMSA • 2026
      </footer>
    </div>
  );
};

export default BibliographyView;
