import React, { useState } from 'react';
import {
  X,
  Zap,
  Activity,
  CheckCircle2,
  AlertCircle,
  FlaskConical,
  Sparkles,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { useCanvasStore } from '../../store/useCanvasStore';
import { useGameStore } from '../../store/useGameStore';

interface CatalyticReactorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AVAILABLE_ENZYMES = [
  { id: 'hexokinase', name: 'Hexoquinasa', ec: 'EC 2.7.1.1', type: 'Transferasa' },
  { id: 'phosphoglucose_isomerase', name: 'Fosfoglucosa Isomerasa', ec: 'EC 5.3.1.9', type: 'Isomerasa' },
  { id: 'pfk1', name: 'Fosfofructoquinasa-1 (PFK-1)', ec: 'EC 2.7.1.11', type: 'Transferasa' },
  { id: 'aldolase', name: 'Fructosa-bisfosfato Aldolasa', ec: 'EC 4.1.2.13', type: 'Liasa' },
  { id: 'tim', name: 'Triosa Fosfato Isomerasa (TIM)', ec: 'EC 5.3.1.1', type: 'Isomerasa' },
  { id: 'gapdh', name: 'GAPDH (Gliceraldehído-3-P Deshidrogenasa)', ec: 'EC 1.2.1.12', type: 'Oxidorreductasa' },
  { id: 'pgk', name: 'Fosfoglicerato Quinasa', ec: 'EC 2.7.2.3', type: 'Transferasa' },
  { id: 'pgm', name: 'Fosfoglicerato Mutasa', ec: 'EC 5.4.2.11', type: 'Isomerasa' },
  { id: 'enolase', name: 'Enolasa', ec: 'EC 4.2.1.11', type: 'Liasa' },
  { id: 'pyruvate_kinase', name: 'Piruvato Quinasa', ec: 'EC 2.7.1.40', type: 'Transferasa' },
  { id: 'pdh_e1', name: 'E1 Piruvato Deshidrogenasa', ec: 'EC 1.2.4.1', type: 'Oxidorreductasa' },
  { id: 'pdh_e2', name: 'E2 Dihidrolipoil Transacetilasa', ec: 'EC 2.3.1.12', type: 'Transferasa' },
  { id: 'pdh_e3', name: 'E3 Dihidrolipoil Deshidrogenasa', ec: 'EC 1.8.1.4', type: 'Oxidorreductasa' },
];

const AVAILABLE_COFACTORS = [
  { id: 'ATP', name: 'ATP (Adenosín Trifosfato)' },
  { id: 'ADP', name: 'ADP (Adenosín Difosfato)' },
  { id: 'NAD+', name: 'NAD⁺ (Oxidado)' },
  { id: 'NADH', name: 'NADH + H⁺ (Reducido)' },
  { id: 'FAD', name: 'FAD (Flavina oxidada)' },
  { id: 'FADH2', name: 'FADH₂ (Flavina reducida)' },
  { id: 'TPP', name: 'TPP (Pirofosfato de Tiamina)' },
  { id: 'Lipoamida', name: 'Lipoamida (Brazo oscilante)' },
  { id: 'CoA-SH', name: 'CoA-SH (Coenzima A libre)' },
  { id: 'Pi', name: 'Pi (Ortofosfato inorgánico)' },
  { id: 'Mg2+', name: 'Mg²⁺ (Cofactor bivalente)' },
];

export const CatalyticReactorModal: React.FC<CatalyticReactorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const graph = useCanvasStore((state) => state.graph);
  const setGraph = useCanvasStore((state) => state.setGraph);
  const selectedAtomId = useCanvasStore((state) => state.selectedAtomId);
  const selectedBondId = useCanvasStore((state) => state.selectedBondId);
  const getCurrentMission = useGameStore((state) => state.getCurrentMission);
  const addMetabolitesToReservoir = useGameStore((state) => state.addMetabolitesToReservoir);
  const assistedMode = useGameStore((state) => state.assistedMode);

  const mission = getCurrentMission();

  const [selectedEnzymeId, setSelectedEnzymeId] = useState<string>('');
  const [selectedCofactors, setSelectedCofactors] = useState<string[]>([]);
  const [leChatelierCoupled, setLeChatelierCoupled] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const nodeCount = Object.keys(graph.nodes).length;
  const reaction = mission?.catalyticReaction;
  const isEndergonic = mission?.deltaG ? mission.deltaG.includes('+') : false;

  const toggleCofactor = (id: string) => {
    if (selectedCofactors.includes(id)) {
      setSelectedCofactors(selectedCofactors.filter((c) => c !== id));
    } else {
      setSelectedCofactors([...selectedCofactors, id]);
    }
  };

  // Autocompletado didáctico si el usuario tiene activado el Modo Asistido
  const handleAutocompleteParameters = () => {
    if (!reaction) return;
    setSelectedEnzymeId(reaction.expectedEnzymeId);
    setSelectedCofactors([...reaction.expectedCofactors]);
    if (isEndergonic) {
      setLeChatelierCoupled(true);
    }
    setErrorMsg(null);
  };

  const handleExecuteReaction = () => {
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!reaction) {
      setErrorMsg(
        'Esta etapa metabólica no cuenta con una reacción catalítica programada para el reactor.'
      );
      return;
    }

    // 0. Comprobar selección del sitio activo si la misión lo exige
    if (mission?.reactiveSiteAtomId && selectedAtomId !== mission.reactiveSiteAtomId) {
      setErrorMsg(
        `Sitio activo no seleccionado: Haz clic sobre el átomo reactivo correspondiente con la herramienta "Seleccionar" (V) antes de ejecutar el reactor.`
      );
      return;
    }

    if (mission?.reactiveSiteBondId && selectedBondId !== mission.reactiveSiteBondId) {
      setErrorMsg(
        `Predicción de enlace reactivo: La enzima actúa sobre un enlace covalente específico. Utiliza la herramienta "Seleccionar" (V) y haz clic sobre el enlace que sufrirá la escisión o isomerización.`
      );
      return;
    }

    // 1. Validar Enzima
    if (!selectedEnzymeId) {
      setErrorMsg('Selecciona la holoenzima catalítica correspondiente a este paso metabólico.');
      return;
    }

    if (selectedEnzymeId !== reaction.expectedEnzymeId) {
      setErrorMsg(
        `Catálisis impedida: La enzima seleccionada no cataliza esta reacción. Para este paso se requiere: ${reaction.enzymeName}.`
      );
      return;
    }

    // 2. Validar Cofactores requeridos
    const missingCofactors = reaction.expectedCofactors.filter(
      (req) => !selectedCofactors.includes(req)
    );

    if (missingCofactors.length > 0) {
      setErrorMsg(
        `Acoplamiento estequiométrico incompleto: Falta incluir el cofactor o cosustrato: ${missingCofactors.join(', ')}.`
      );
      return;
    }

    // 3. Validar Principio de Le Chatelier en etapas endergónicas (ΔG°' > 0)
    if (isEndergonic && !leChatelierCoupled) {
      setErrorMsg(
        `Principio de Le Chatelier requerido: Esta reacción presenta ΔG°' = ${mission?.deltaG} (> 0). En condiciones celulares, solo avanza hacia adelante si se acopla el consumo continuo de productos (drenaje metabólico). Activa el interruptor termodinámico.`
      );
      return;
    }

    // 4. Éxito: Depositar subproductos en el Reservorio de Metabolitos
    addMetabolitesToReservoir(reaction.releasedByproducts, mission.title);

    // 5. Cargar el Estado de Transición / Intermediario Incompleto en el Lienzo
    setGraph(reaction.intermediateGraph);

    setSuccessMsg(
      `¡Catálisis Enzimática Ejecutada con Éxito! Se han liberado y reservado: ${reaction.releasedByproducts
        .map((p) => p.name)
        .join(', ')}. El estado de transición incompleto ha sido cargado en el lienzo con los sitios reactivos resaltados.`
    );

    setTimeout(() => {
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm select-none animate-fadeIn text-slate-800">
      <div className="cad-panel cad-corners w-full max-w-3xl rounded-xl border border-slate-300 shadow-2xl overflow-hidden bg-white flex flex-col font-mono">
        {/* Cabecera CAD */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#D97706]/10 border border-[#D97706]/30 flex items-center justify-center text-[#D97706]">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-sm font-mono font-black text-slate-900 flex items-center gap-2">
                ⚡ CENTRO ACTIVO & REACTOR CATALÍTICO
              </h2>
              <p className="text-[11px] font-mono text-slate-500">
                Acoplamiento cinético, catálisis enzimática y balance de cofactores
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {assistedMode && (
              <button
                onClick={handleAutocompleteParameters}
                className="px-2.5 py-1 rounded bg-[#008477]/10 hover:bg-[#008477]/20 border border-[#008477] text-[#008477] font-mono text-[10px] font-bold flex items-center gap-1 transition-all shadow-xs"
                title="Autocompletar enzima, cofactores y termodinámica según el paso actual"
              >
                <Sparkles className="w-3 h-3 text-[#008477]" />
                <span>Autocompletar Parámetros</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-5 space-y-3.5 overflow-y-auto max-h-[70vh] text-xs bg-white">
          {/* 1. Sustrato detectado del lienzo */}
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <FlaskConical className="w-4 h-4 text-[#008477]" />
              <div>
                <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wider block">
                  1. Sustrato Molecular en el Lienzo (S):
                </span>
                <span className="font-mono text-slate-900 text-xs font-bold">
                  {reaction ? reaction.substrateName : `${nodeCount} átomos conectados en pizarra`}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold">
              Detectado
            </span>
          </div>

          {/* 2. Selección de Enzima Catalizadora (E) */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
            <label className="text-[10px] font-mono font-bold text-slate-700 uppercase tracking-wider block flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#008477]" />
              2. Holoenzima / Subunidad Catalítica (E):
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-40 overflow-y-auto pr-1">
              {AVAILABLE_ENZYMES.map((enz) => {
                const isSelected = selectedEnzymeId === enz.id;
                return (
                  <button
                    key={enz.id}
                    onClick={() => setSelectedEnzymeId(enz.id)}
                    className={`p-2 rounded-lg border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#008477]/10 border-[#008477] text-[#008477] shadow-xs font-bold'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-mono font-bold text-xs truncate text-slate-900">{enz.name}</span>
                      <span className="text-[9px] font-mono text-[#008477] font-semibold">{enz.ec}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">{enz.type}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Selección de Cofactores y Cosustratos entrantes */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
            <label className="text-[10px] font-mono font-bold text-slate-700 uppercase tracking-wider block flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
              3. Cofactores, Coenzimas y Cosustratos Requeridos:
            </label>

            <div className="flex flex-wrap gap-1">
              {AVAILABLE_COFACTORS.map((cof) => {
                const isSelected = selectedCofactors.includes(cof.id);
                return (
                  <button
                    key={cof.id}
                    onClick={() => toggleCofactor(cof.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all border ${
                      isSelected
                        ? 'bg-[#D97706] text-white border-[#D97706] font-bold shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {cof.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Interruptor de Empuje Termodinámico (Principio de Le Chatelier) */}
          {isEndergonic && (
            <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-amber-900 text-xs">
                    4. Empuje Termodinámico (ΔG°' = {mission?.deltaG} &gt; 0):
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setLeChatelierCoupled(!leChatelierCoupled)}
                  className="flex items-center gap-1 text-xs font-mono font-bold transition-all text-amber-900"
                >
                  {leChatelierCoupled ? (
                    <ToggleRight className="w-6 h-6 text-[#008477]" />
                  ) : (
                    <ToggleLeft className="w-6 h-6 text-slate-400" />
                  )}
                  <span>{leChatelierCoupled ? 'ACOPLADO' : 'DESACOPLADO'}</span>
                </button>
              </div>

              <p className="text-[11px] text-amber-800 leading-relaxed font-mono">
                Acoplar consumo celular continuo de productos (Principio de Le Chatelier). En el citosol celular, la remoción inmediata de productos por los pasos subsecuentes desplaza el equilibrio hacia adelante (ΔG_real &lt; 0).
              </p>
            </div>
          )}

          {/* Alertas de Error o Éxito */}
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed font-mono font-semibold">{errorMsg}</p>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed font-mono font-semibold">{successMsg}</p>
            </div>
          )}
        </div>

        {/* Pie CAD */}
        <div className="p-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-[10px] font-mono text-slate-500 truncate max-w-sm">
            {reaction ? reaction.explanation : 'Reacción estructural no acoplada'}
          </span>

          <button
            id="btn-execute-catalysis"
            onClick={handleExecuteReaction}
            className="px-4 py-2 rounded-lg font-mono font-bold text-xs bg-[#D97706] hover:bg-[#b45309] text-white transition-all shadow-xs active:scale-95 flex items-center gap-1.5"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>⚡ Ejecutar Catálisis Enzimática</span>
          </button>
        </div>
      </div>
    </div>
  );
};
