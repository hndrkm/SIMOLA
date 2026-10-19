import React, { useState, useMemo } from 'react';
import {
  X,
  Boxes,
  Sparkles,
  Zap,
  Layers,
  Search,
  MousePointerClick,
  Maximize2,
} from 'lucide-react';
import {
  TEMPLATES,
  MolecularTemplate,
  TemplateCategory,
} from '../../core/model/templates';
import { useCanvasStore } from '../../store/useCanvasStore';

interface FunctionalGroupsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FunctionalGroupsModal: React.FC<FunctionalGroupsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const activeTemplate = useCanvasStore((state) => state.activeTemplate);
  const stageScale = useCanvasStore((state) => state.stageScale);
  const stagePosition = useCanvasStore((state) => state.stagePosition);
  const setActiveTemplate = useCanvasStore((state) => state.setActiveTemplate);
  const stampTemplateAt = useCanvasStore((state) => state.stampTemplateAt);

  const [activeTab, setActiveTab] = useState<TemplateCategory>('functional_group');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<MolecularTemplate>(TEMPLATES[0]);

  const tabs: Array<{ id: TemplateCategory; label: string; icon: React.ReactNode; count: number }> = [
    {
      id: 'functional_group',
      label: 'Grupos Funcionales',
      icon: <Sparkles className="w-4 h-4 text-amber-400" />,
      count: TEMPLATES.filter((t) => t.category === 'functional_group').length,
    },
    {
      id: 'coenzyme',
      label: 'Coenzimas y Mediadores',
      icon: <Zap className="w-4 h-4 text-sky-400" />,
      count: TEMPLATES.filter((t) => t.category === 'coenzyme').length,
    },
    {
      id: 'base_skeleton',
      label: 'Estructuras Base',
      icon: <Layers className="w-4 h-4 text-emerald-400" />,
      count: TEMPLATES.filter((t) => t.category === 'base_skeleton').length,
    },
  ];

  const filteredTemplates = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return TEMPLATES.filter((t) => {
      if (t.category !== activeTab) return false;
      if (!query) return true;
      return (
        t.name.toLowerCase().includes(query) ||
        t.abbreviation.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        t.biochemicalRole.toLowerCase().includes(query)
      );
    });
  }, [activeTab, searchQuery]);

  if (!isOpen) return null;

  // Insertar directamente en el centro del lienzo actual
  const handleInsertCenter = (template: MolecularTemplate) => {
    const centerX = Math.round((window.innerWidth / 2 - stagePosition.x) / stageScale);
    const centerY = Math.round((window.innerHeight / 2 - stagePosition.y) / stageScale);
    stampTemplateAt(template, { x: centerX, y: centerY });
    onClose();
  };

  // Activar modo plantilla para estampar con clic o hacer sprout sobre un átomo
  const handleActivateStampMode = (template: MolecularTemplate) => {
    setActiveTemplate(template);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md select-none animate-fadeIn">
      <div className="glass-panel w-full max-w-5xl max-h-[90vh] flex flex-col rounded-3xl border border-white/15 shadow-2xl overflow-hidden bg-[#1B2A4A]/95">
        {/* Cabecera del Modal */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#1B2A4A]/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F77F00]/20 border border-[#F77F00]/40 flex items-center justify-center text-[#F77F00]">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                Catálogo de Plantillas Bioquímicas
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-[#ff941a] border border-[#F77F00]/30 font-mono">
                  {TEMPLATES.length} Plantillas
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Estampa esqueletos moleculares completos o acóplalos (Sprout) directamente a átomos existentes
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Cerrar (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pestañas de Navegación y Buscador */}
        <div className="px-6 py-3 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 bg-slate-950/40">
          {/* Tabs */}
          <div className="flex items-center gap-2">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`tab-${tab.id}`}
                  onClick={() => {
                    setActiveTab(tab.id);
                    const firstOfTab = TEMPLATES.find((t) => t.category === tab.id);
                    if (firstOfTab) setSelectedTemplate(firstOfTab);
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#00A896] text-slate-950 font-bold shadow-md shadow-[#00A896]/30 scale-[1.02]'
                      : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-sky-600 text-white' : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Buscador */}
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar plantilla o función..."
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-400/60 transition-colors"
            />
          </div>
        </div>

        {/* Cuerpo del Modal: Catálogo + Previsualización */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-3 gap-4 p-4 min-h-0">
          {/* Lista de Tarjetas (2 Columnas) */}
          <div className="md:col-span-2 overflow-y-auto pr-2 flex flex-col gap-2">
            {filteredTemplates.map((template) => {
              const isSelected = selectedTemplate?.id === template.id;
              const isStoreActive = activeTemplate?.id === template.id;

              return (
                <div
                  key={template.id}
                  id={`template-card-${template.id}`}
                  onClick={() => setSelectedTemplate(template)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-sky-500/15 border-sky-400/70 shadow-lg shadow-sky-950/40 scale-[1.01]'
                      : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/70 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Badge de Abreviatura Química */}
                    <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs font-mono text-sky-300 shadow-inner flex-shrink-0">
                      {template.abbreviation}
                    </div>

                    {/* Información */}
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-slate-200">{template.name}</h4>
                        {isStoreActive && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Activo
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{template.description}</p>
                      <span className="text-[10px] text-slate-500 font-mono mt-0.5">
                        {template.atoms.length} átomos · {template.bonds.length} enlaces
                      </span>
                    </div>
                  </div>

                  {/* Acciones directas */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleInsertCenter(template);
                      }}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-sky-500 text-slate-300 hover:text-white border border-slate-700/60 hover:border-sky-400 transition-all text-xs font-semibold flex items-center gap-1"
                      title="Insertar en el centro del lienzo"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Centro</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleActivateStampMode(template);
                      }}
                      className="py-1.5 px-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs shadow-md shadow-sky-500/20 transition-all flex items-center gap-1"
                      title="Estampar en lienzo o acoplar (Sprout) en átomo"
                    >
                      <MousePointerClick className="w-3.5 h-3.5" />
                      <span>Usar</span>
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredTemplates.length === 0 && (
              <div className="p-8 text-center text-slate-500 text-xs">
                No se encontraron plantillas coincidentes con "{searchQuery}"
              </div>
            )}
          </div>

          {/* Panel Lateral: Detalle Bioquímico y Mecánica de Acople */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-700/80 bg-slate-900/90 flex flex-col justify-between overflow-y-auto">
            {selectedTemplate && (
              <div className="flex flex-col gap-4">
                <div className="border-b border-slate-800 pb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-sky-400 font-semibold">
                      Detalle Químico
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 font-mono">
                      {selectedTemplate.abbreviation}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-100 mt-1">{selectedTemplate.name}</h3>
                  <p className="text-xs text-slate-300 mt-1">{selectedTemplate.description}</p>
                </div>

                {/* Rol Bioquímico Didáctico */}
                <div className="bg-sky-950/30 border border-sky-500/20 p-3 rounded-xl">
                  <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wide block mb-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-sky-400" />
                    Relevancia Metabólica
                  </span>
                  <p className="text-xs text-sky-200/90 leading-relaxed">
                    {selectedTemplate.biochemicalRole}
                  </p>
                </div>

                {/* Composición Atómica */}
                <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/50">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-2">
                    Estructura Interna
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedTemplate.atoms.map((atom) => (
                      <span
                        key={atom.tempId}
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-lg border ${
                          atom.tempId === selectedTemplate.attachmentAtomTempId
                            ? 'bg-amber-500/20 text-amber-300 border-amber-400/50 font-bold'
                            : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                        title={
                          atom.tempId === selectedTemplate.attachmentAtomTempId
                            ? 'Punto de acoplamiento (Sprout)'
                            : undefined
                        }
                      >
                        {atom.element}
                        {atom.formalCharge ? (atom.formalCharge > 0 ? `⁺` : `⁻`) : ''}
                        {atom.tempId === selectedTemplate.attachmentAtomTempId && ' (Acople)'}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Guía didáctica de uso */}
                <div className="bg-slate-800/20 p-3 rounded-xl border border-slate-700/30 text-[11px] text-slate-400 leading-relaxed">
                  <strong className="text-slate-300 block mb-1">Mecánica interactiva:</strong>
                  • <strong>Clic en lienzo vacío:</strong> Estampa la estructura completa.<br />
                  • <strong>Clic sobre un átomo:</strong> Realiza un <em>Sprout</em> (acoplamiento covalente directo respetando valencias).
                </div>
              </div>
            )}

            {/* Botones de Acción */}
            <div className="flex flex-col gap-2 mt-4">
              <button
                id="btn-use-template"
                onClick={() => handleActivateStampMode(selectedTemplate)}
                className="w-full py-2.5 px-4 rounded-xl font-extrabold text-xs bg-[#F77F00] hover:bg-[#ff941a] text-slate-950 shadow-lg shadow-[#F77F00]/30 flex items-center justify-center gap-2 transition-all active:scale-95 glow-amber"
              >
                <MousePointerClick className="w-4 h-4 text-slate-950 fill-current" />
                <span>Activar Herramienta de Plantilla</span>
              </button>

              <button
                id="btn-stamp-center"
                onClick={() => handleInsertCenter(selectedTemplate)}
                className="w-full py-2 px-4 rounded-xl font-bold text-xs bg-[#00A896] hover:bg-[#00c7b2] text-slate-950 shadow-md shadow-[#00A896]/20 transition-all flex items-center justify-center gap-1.5 active:scale-95 glow-teal"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Estampar al Centro del Lienzo</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
