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
  Activity,
  BookOpen,
} from 'lucide-react';
import {
  TEMPLATES,
  MolecularTemplate,
  TemplateCategory,
} from '../../core/model/templates';
import { useCanvasStore } from '../../store/useCanvasStore';
import { CatalystInspectorModal } from './CatalystInspectorModal';

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
  const [inspectorTemplate, setInspectorTemplate] = useState<MolecularTemplate | null>(null);

  const tabs: Array<{ id: TemplateCategory; label: string; icon: React.ReactNode; count: number }> = [
    {
      id: 'functional_group',
      label: 'Grupos Funcionales',
      icon: <Sparkles className="w-4 h-4 text-amber-500" />,
      count: TEMPLATES.filter((t) => t.category === 'functional_group').length,
    },
    {
      id: 'holoenzyme',
      label: 'Holoenzimas (EC)',
      icon: <Activity className="w-4 h-4 text-purple-500" />,
      count: TEMPLATES.filter((t) => t.category === 'holoenzyme').length,
    },
    {
      id: 'coenzyme',
      label: 'Coenzimas / Cofactores',
      icon: <Zap className="w-4 h-4 text-sky-500" />,
      count: TEMPLATES.filter((t) => t.category === 'coenzyme').length,
    },
    {
      id: 'base_skeleton',
      label: 'Estructuras Base',
      icon: <Layers className="w-4 h-4 text-emerald-500" />,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm select-none animate-fadeIn">
      <div className="cad-panel cad-corners-full w-full max-w-5xl max-h-[90vh] flex flex-col rounded-xl border border-slate-300 shadow-2xl overflow-hidden bg-white font-mono text-slate-800">
        {/* Cabecera del Modal */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#D97706]/10 border border-[#D97706]/30 flex items-center justify-center text-[#D97706]">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                Catálogo de Plantillas Bioquímicas
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-[#D97706] border border-[#D97706]/30 font-mono font-bold">
                  {TEMPLATES.length} Plantillas
                </span>
              </h2>
              <p className="text-xs text-slate-500 font-sans">
                Estampa esqueletos moleculares completos o acóplalos (Sprout) directamente a átomos existentes
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 transition-colors"
            title="Cerrar (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pestañas de Navegación y Buscador */}
        <div className="px-5 py-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 max-w-full">
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
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all border whitespace-nowrap ${
                    isActive
                      ? 'bg-[#008477] text-white border-[#008477] shadow-xs'
                      : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                      isActive ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Buscador */}
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar plantilla..."
              className="w-full bg-white border border-slate-300 rounded-lg pl-8 pr-3 py-1 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#008477] shadow-xs transition-colors font-mono"
            />
          </div>
        </div>

        {/* Cuerpo del Modal: Catálogo + Previsualización */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-3 gap-4 p-4 min-h-0 bg-white">
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
                  onDoubleClick={() => setInspectorTemplate(template)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-[#008477]/10 border-[#008477] shadow-xs scale-[1.005]'
                      : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                  title="Doble clic para inspeccionar formulación y mecanismo bioquímico"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Badge de Abreviatura Química */}
                    <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs font-mono text-slate-800 shadow-xs flex-shrink-0">
                      {template.abbreviation}
                    </div>

                    {/* Información */}
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{template.name}</h4>
                        {isStoreActive && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold shrink-0">
                            Activo
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{template.description}</p>
                      <span className="text-[10px] text-slate-400 font-mono mt-0.5">
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
                      className="p-2 rounded-lg bg-slate-100 hover:bg-[#008477] text-slate-700 hover:text-white border border-slate-200 hover:border-[#008477] transition-all text-xs font-semibold flex items-center gap-1 shadow-xs"
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
                      className="py-1.5 px-3 rounded-lg bg-[#008477] hover:bg-[#006e63] text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1"
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
              <div className="p-8 text-center text-slate-400 text-xs font-mono">
                No se encontraron plantillas coincidentes con "{searchQuery}"
              </div>
            )}
          </div>

          {/* Panel Lateral: Detalle Bioquímico y Mecánica de Acople */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between overflow-y-auto">
            {selectedTemplate && (
              <div className="flex flex-col gap-4">
                <div className="border-b border-slate-200 pb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#008477] font-bold">
                      Detalle Químico
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200 font-mono font-bold shadow-xs">
                      {selectedTemplate.abbreviation}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1">{selectedTemplate.name}</h3>
                  <p className="text-xs text-slate-600 mt-1">{selectedTemplate.description}</p>
                </div>

                {/* Rol Bioquímico Didáctico */}
                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide block mb-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    Relevancia Metabólica
                  </span>
                  <p className="text-xs text-emerald-900 leading-relaxed font-sans">
                    {selectedTemplate.biochemicalRole}
                  </p>
                </div>

                {/* Composición Atómica */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-2 font-mono">
                    Estructura Interna
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedTemplate.atoms.map((atom) => (
                      <span
                        key={atom.tempId}
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-lg border ${
                          atom.tempId === selectedTemplate.attachmentAtomTempId
                            ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
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
                <div className="bg-white p-3 rounded-xl border border-slate-200 text-[11px] text-slate-600 leading-relaxed shadow-xs">
                  <strong className="text-slate-800 block mb-1">Mecánica interactiva:</strong>
                  • <strong>Clic en lienzo vacío:</strong> Estampa la estructura completa.<br />
                  • <strong>Clic sobre un átomo:</strong> Realiza un <em>Sprout</em> (acoplamiento covalente directo respetando valencias).
                </div>

                <div className="space-y-2 mt-2 pt-3 border-t border-slate-200">
                  <button
                    id="btn-use-template"
                    onClick={() => handleActivateStampMode(selectedTemplate)}
                    className="w-full py-2.5 px-4 rounded-xl font-extrabold text-xs bg-[#D97706] hover:bg-[#b45309] text-white shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    <MousePointerClick className="w-4 h-4 text-white fill-current" />
                    <span>Activar Herramienta de Plantilla</span>
                  </button>

                  <button
                    id="btn-stamp-center"
                    onClick={() => handleInsertCenter(selectedTemplate)}
                    className="w-full py-2 px-4 rounded-xl font-bold text-xs bg-[#008477] hover:bg-[#006e63] text-white shadow-xs transition-all flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Estampar al Centro del Lienzo</span>
                  </button>

                  <button
                    id="btn-inspect-template"
                    onClick={() => setInspectorTemplate(selectedTemplate)}
                    className="w-full py-2 px-4 rounded-xl font-semibold text-xs bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-xs"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#008477]" />
                    <span>🔬 Inspeccionar Mecanismo Bioquímico</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Inspector Bioquímico */}
      <CatalystInspectorModal
        isOpen={!!inspectorTemplate}
        onClose={() => setInspectorTemplate(null)}
        template={inspectorTemplate}
      />
    </div>
  );
};
