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
    apa: 'Lavrenov, A. (2024). Konva.js: High-performance 2D canvas framework for desktop and mobile applications. https://konvajs.org/',
    ieee: 'A. Lavrenov, "Konva.js: High-performance 2D canvas framework for desktop and mobile applications," 2024. [Online]. Available: https://konvajs.org/',
    url: 'https://konvajs.org/',
    tags: ['Konva Stage', 'Renderizado 60 FPS', 'Grafo de Escena'],
  },

  // 4. Motor Quimioinformático y Notaciones Moleculares
  {
    id: 'rdkit',
    category: 'chemoinformatics',
    title: 'RDKit: Open-Source Cheminformatics and Machine Learning Toolkit',
    apa: 'Landrum, G., Tosco, P., Kelley, B., Srinath, de Marchi, M., Stadler, A., Cole, J., Savelyev, A., Deane, C., & RDKit Contributors. (2024). RDKit: Open-source cheminformatics (Version 2024.03). GitHub. https://doi.org/10.5281/zenodo.10986506',
    ieee: 'G. Landrum et al., "RDKit: Open-source cheminformatics," v. 2024.03, Zenodo, 2024. doi: 10.5281/zenodo.10986506.',
    url: 'https://www.rdkit.org/',
    tags: ['WebAssembly', 'Aromaticidad Huckel', 'Sanitización Estructural'],
  },
  {
    id: 'smiles',
    category: 'chemoinformatics',
    title: 'SMILES, A Chemical Language and Information System',
    apa: 'Weininger, D. (1988). SMILES, a chemical language and information system. 1. Introduction to methodology and encoding rules. Journal of Chemical Information and Computer Sciences, 28(1), 31–36. https://doi.org/10.1021/ci00057a005',
    ieee: 'D. Weininger, "SMILES, a chemical language and information system. 1. Introduction to methodology and encoding rules," J. Chem. Inf. Comput. Sci., vol. 28, no. 1, pp. 31–36, Feb. 1988. doi: 10.1021/ci00057a005.',
    tags: ['Notación Canónica', 'Topología Lineal', 'Quimioinformática'],
  },
  {
    id: 'molfile',
    category: 'chemoinformatics',
    title: 'Description of Several Chemical Structure File Formats (MDL Molfile V2000)',
    apa: 'Dalby, A., Nourse, J. G., Hounshell, W. D., Gushurst, A. K., Grier, D. L., Leland, B. A., & Laufer, J. (1992). Description of several chemical structure file formats based on queries and molecular structures. Journal of Chemical Information and Computer Sciences, 32(3), 244–255. https://doi.org/10.1021/ci00007a012',
    ieee: 'A. Dalby et al., "Description of several chemical structure file formats based on queries and molecular structures," J. Chem. Inf. Comput. Sci., vol. 32, no. 3, pp. 244–255, May 1992. doi: 10.1021/ci00007a012.',
    tags: ['Matriz de Conectividad', 'Molfile V2000', 'Intercambio Molecular'],
  },

  // 5. Referencias Bioquímicas y Rutas Metabólicas
  {
    id: 'lehninger',
    category: 'biochemistry',
    title: 'Lehninger Principles of Biochemistry (8th Edition)',
    apa: 'Nelson, D. L., & Cox, M. M. (2021). Lehninger principles of biochemistry (8th ed.). Macmillan Learning / W. H. Freeman.',
    ieee: 'D. L. Nelson and M. M. Cox, Lehninger Principles of Biochemistry, 8th ed., New York, NY, USA: Macmillan Learning, 2021.',
    tags: ['Glucólisis EMP', 'Complejo PDH', 'Bioenergética Celular'],
  },
  {
    id: 'berg-stryer',
    category: 'biochemistry',
    title: 'Biochemistry (9th Edition)',
    apa: 'Berg, J. M., Tymoczko, J. L., Gatto, G. J., & Stryer, L. (2019). Biochemistry (9th ed.). W. H. Freeman and Company.',
    ieee: 'J. M. Berg, J. L. Tymoczko, G. J. Gatto, and L. Stryer, Biochemistry, 9th ed., New York, NY, USA: W. H. Freeman, 2019.',
    tags: ['Mecanismos Catalíticos', 'Enzimología', 'Cinética Enzimática'],
  },
  {
    id: 'iubmb-ec',
    category: 'biochemistry',
    title: 'Enzyme Nomenclature and Classification (NC-IUBMB / ExplorEnz)',
    apa: 'McDonald, A. G., Boyce, S., & Tipton, K. F. (2009). ExplorEnz: The enzyme database. Nucleic Acids Research, 37(Database issue), D593–D597. https://doi.org/10.1093/nar/gkn822',
    ieee: 'A. G. McDonald, S. Boyce, and K. F. Tipton, "ExplorEnz: the enzyme database," Nucleic Acids Res., vol. 37, no. suppl_1, pp. D593–D597, Jan. 2009. doi: 10.1093/nar/gkn822.',
    url: 'https://www.enzyme-database.org/',
    tags: ['Códigos EC', 'Clasificación Enzimática', 'IUBMB'],
  },
  {
    id: 'kegg',
    category: 'biochemistry',
    title: 'KEGG: Kyoto Encyclopedia of Genes and Genomes',
    apa: 'Kanehisa, M., Furumichi, M., Sato, Y., Kawashima, M., & Ishiguro-Watanabe, M. (2023). KEGG for taxonomy-based analysis of pathways and genomes. Nucleic Acids Research, 51(D1), D587–D592. https://doi.org/10.1093/nar/gkac963',
    ieee: 'M. Kanehisa et al., "KEGG for taxonomy-based analysis of pathways and genomes," Nucleic Acids Res., vol. 51, no. D1, pp. D587–D592, Jan. 2023. doi: 10.1093/nar/gkac963.',
    url: 'https://www.genome.jp/kegg/',
    tags: ['Rutas Metabólicas', 'Mapas de Referencia', 'Metabolómica'],
  },
];

export const BibliographyView: React.FC = () => {
  const setView = useGameStore((state) => state.setView);
  const currentMissionId = useGameStore((state) => state.currentMissionId);
  const [selectedFormat, setSelectedFormat] = useState<'apa' | 'ieee'>('apa');
  const [activeCategory, setActiveCategory] = useState<string>('all');
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
    <div className="min-h-screen w-full bg-[#0B132B] text-slate-100 blueprint-grid overflow-y-auto flex flex-col font-sans select-text">
      {/* 1. Header de Telemetría y Navegación */}
      <header className="px-6 lg:px-12 py-4 flex items-center justify-between gap-4 border-b border-[#00A896]/30 bg-[#0B132B]/95 backdrop-blur-md sticky top-0 z-30 shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setView(currentMissionId ? 'workspace' : 'home')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-[#1B2A4A] hover:bg-[#22355c] text-[#00c7b2] border border-[#00A896]/40 transition-all active:scale-95 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a {currentMissionId ? 'la Pizarra' : 'Inicio'}</span>
          </button>

          <div className="h-5 w-[1px] bg-[#00A896]/30 hidden sm:block" />

          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-[#00A896]" />
            <h1 className="text-base sm:text-lg font-black tracking-wide text-white flex items-center gap-2">
              SIMOLA <span className="text-[#00A896] text-xs font-mono px-2 py-0.5 rounded border border-[#00A896]/40 bg-[#00A896]/10">v2.0 CAD</span>
            </h1>
          </div>
        </div>

        {/* Selector de Formato de Cita (APA 7ª vs IEEE) */}
        <div className="cad-panel cad-corners px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-mono">
          <span className="text-slate-400 font-bold hidden sm:inline mr-1 text-[11px]">Estilo:</span>
          <button
            onClick={() => setSelectedFormat('apa')}
            className={`px-2.5 py-1 rounded font-bold text-[11px] transition-all ${selectedFormat === 'apa'
                ? 'bg-[#00A896] text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
              }`}
          >
            APA 7.ª Ed.
          </button>
          <button
            onClick={() => setSelectedFormat('ieee')}
            className={`px-2.5 py-1 rounded font-bold text-[11px] transition-all ${selectedFormat === 'ieee'
                ? 'bg-[#00A896] text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
              }`}
          >
            IEEE
          </button>
        </div>
      </header>

      {/* 2. Contenido Principal */}
      <main className="max-w-6xl w-full mx-auto px-6 lg:px-12 py-8 flex flex-col gap-8 flex-1">
        {/* TARJETA DESTACADA: Autoría, Arquitectura e Ingeniería del Proyecto */}
        <section className="cad-panel cad-corners-full p-6 sm:p-8 rounded-2xl relative overflow-hidden bg-gradient-to-br from-[#1B2A4A] via-[#101b33] to-[#0B132B] border border-[#00A896]/40 shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#00A896]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00A896]/15 border border-[#00A896]/40 text-[#00c7b2] text-xs font-mono font-bold">
                <Award className="w-3.5 h-3.5 text-[#00A896]" />
                AUTORÍA Y DESARROLLO DEL PROYECTO
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Frak Abel
              </h2>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs font-mono text-slate-300">
                <span className="flex items-center gap-1.5 text-[#00c7b2]">
                  <GraduationCap className="w-4 h-4" />
                  Carrera de Bioquímica
                </span>
                <span className="text-slate-600 hidden sm:inline">•</span>
                <span className="text-slate-300">
                  Universidad Mayor de San Andrés (UMSA)
                </span>
                <span className="text-slate-600 hidden sm:inline">•</span>
                <span className="text-slate-400">
                  La Paz, Bolivia
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed pt-1">
                Arquitectura de software, modelado quimioinformático interactivo, motor de validación mecanística a 60 FPS y diseño de la estación visual de ingeniería bioquímica <strong>SIMOLA</strong> (<em>Interactive Molecular & Metabolic Sandbox</em>).
              </p>
            </div>

            <div className="cad-panel p-4 rounded-xl border border-white/10 bg-slate-900/80 shrink-0 flex flex-col gap-2 min-w-[220px]">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                Especificaciones del Sistema
              </span>
              <div className="text-xs font-mono flex items-center justify-between text-slate-200">
                <span>Versión:</span>
                <strong className="text-[#00c7b2]">v2.0 CAD Edition</strong>
              </div>
              <div className="text-xs font-mono flex items-center justify-between text-slate-200">
                <span>Pipeline Gráfico:</span>
                <strong className="text-white">Konva 2D (60 FPS)</strong>
              </div>
              <div className="text-xs font-mono flex items-center justify-between text-slate-200">
                <span>Motor Químico:</span>
                <strong className="text-amber-400">RDKit Wasm</strong>
              </div>
              <div className="text-xs font-mono flex items-center justify-between text-slate-200">
                <span>Rutas Modeladas:</span>
                <strong className="text-[#00c7b2]">Glucólisis EMP (10/10)</strong>
              </div>
            </div>
          </div>
        </section>

        {/* Filtros de Categoría */}
        <section className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mr-2 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#00A896]" />
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
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${activeCategory === cat.id
                  ? 'bg-[#00A896] text-slate-950 border-[#00c7b2] shadow-sm'
                  : 'cad-panel text-slate-300 hover:text-white border-white/10 hover:border-[#00A896]/50'
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
                className="cad-panel cad-corners p-5 rounded-xl border border-white/10 hover:border-[#00A896]/40 transition-all bg-[#1B2A4A]/60 flex flex-col gap-3 group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-bold text-white group-hover:text-[#00c7b2] transition-colors flex items-center gap-2">
                      {ref.category === 'languages' && <Code2 className="w-4 h-4 text-[#00A896]" />}
                      {ref.category === 'frameworks' && <Cpu className="w-4 h-4 text-sky-400" />}
                      {ref.category === 'graphics' && <Layers className="w-4 h-4 text-emerald-400" />}
                      {ref.category === 'chemoinformatics' && <Atom className="w-4 h-4 text-amber-400" />}
                      {ref.category === 'biochemistry' && <FlaskConical className="w-4 h-4 text-purple-400" />}
                      {ref.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {ref.url && (
                      <a
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-[#00c7b2] border border-white/5 transition-all"
                        title="Abrir enlace oficial"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <button
                      onClick={() => handleCopyCitation(ref.id, citationText)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono font-bold transition-all border ${isCopied
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white border-white/10'
                        }`}
                      title="Copiar cita formal al portapapeles"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
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
                <p className="text-xs font-mono text-slate-300 bg-[#0B132B]/80 p-3 rounded-lg border border-white/5 leading-relaxed selection:bg-[#00A896] selection:text-slate-950">
                  {citationText}
                </p>

                {/* Etiquetas Técnicas */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {ref.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 text-slate-400 border border-white/5"
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
      <footer className="px-6 lg:px-12 py-4 border-t border-[#00A896]/20 bg-[#0B132B]/95 text-center text-xs font-mono text-slate-500">
        SIMOLA v2.0 • Desarrollado por Hendrik Michael Ramos Suarez • UMSA • 2026
      </footer>
    </div>
  );
};

export default BibliographyView;

