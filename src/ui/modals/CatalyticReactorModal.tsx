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

  // Autocompletar pedagógico en Modo Asistencia Guiada
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
        'La etapa actual es una modelización estructural básica y no requiere configuración en el Reactor Catalítico.'
      );
      return;
    }

    if (nodeCount === 0) {
      setErrorMsg('No hay sustrato en el lienzo. Dibuja o carga el reactivo inicial antes de iniciar la catálisis.');
      return;
    }

    // 0. Validación de Sitio Reactivo Seleccionado (Fase de Predicción)
    if (mission?.reactiveSiteAtomId && selectedAtomId !== mission.reactiveSiteAtomId) {
      const atomTarget = graph.nodes[mission.reactiveSiteAtomId];
      const atomLabel = atomTarget ? `${atomTarget.element}${mission.reactiveSiteAtomId}` : 'el átomo objetivo';
      setErrorMsg(
        `Predicción de sitio reactivo: Antes de activar la enzima, utiliza la herramienta "Seleccionar" (V) para señalar ${atomLabel} donde ocurrirá el ataque nucleofílico o transferencia.`
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md select-none animate-fadeIn text-slate-100">
      <div className="cad-panel cad-corners w-full max-w-3xl rounded-lg border border-[#00A896]/60 shadow-2xl overflow-hidden bg-[#0B132B]/98 flex flex-col">
        {/* Cabecera CAD */}
        <div className="p-4 border-b border-[#00A896]/30 bg-[#16233e] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-[#F77F00]/20 border border-[#F77F00]/40 flex items-center justify-center text-[#F77F00]">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-sm font-mono font-black text-white flex items-center gap-2">
                ⚡ CENTRO ACTIVO & REACTOR CATALÍTICO
              </h2>
              <p className="text-[11px] font-mono text-slate-400">
                Acoplamiento cinético, catálisis enzimática y balance de cofactores
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {assistedMode && (
              <button
                onClick={handleAutocompleteParameters}
                className="px-2.5 py-1 rounded bg-[#00A896]/20 hover:bg-[#00A896]/30 border border-[#00A896] text-[#00c7b2] font-mono text-[10px] font-bold flex items-center gap-1 transition-all"
                title="Autocompletar enzima, cofactores y termodinámica según el paso actual"
              >
                <Sparkles className="w-3 h-3 text-[#00A896]" />
                <span>Autocompletar Parámetros</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-5 space-y-3.5 overflow-y-auto max-h-[70vh] text-xs">
          {/* 1. Sustrato detectado del lienzo */}
          <div className="p-3 rounded-md bg-[#132038] border border-[#00A896]/20 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <FlaskConical className="w-4 h-4 text-[#00A896]" />
              <div>
                <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider block">
                  1. Sustrato Molecular en el Lienzo (S):
                </span>
                <span className="font-mono text-white text-xs font-bold">
                  {reaction ? reaction.substrateName : `${nodeCount} átomos conectados en pizarra`}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              Detectado
            </span>
          </div>

          {/* 2. Selección de Enzima Catalizadora (E) */}
          <div className="p-3.5 rounded-md bg-[#132038] border border-[#00A896]/20 space-y-2">
            <label className="text-[10px] font-mono font-bold text-slate-300 uppercase tracking-wider block flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#00A896]" />
              2. Holoenzima / Subunidad Catalítica (E):
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-40 overflow-y-auto pr-1">
              {AVAILABLE_ENZYMES.map((enz) => {
                const isSelected = selectedEnzymeId === enz.id;
                return (
                  <button
                    key={enz.id}
                    onClick={() => setSelectedEnzymeId(enz.id)}
                    className={`p-2 rounded-md border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#00A896]/20 border-[#00A896] text-white shadow-sm'
                        : 'bg-slate-900/60 border-white/5 text-slate-300 hover:border-white/20 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-mono font-bold text-xs truncate">{enz.name}</span>
                      <span className="text-[9px] font-mono text-[#00c7b2]">{enz.ec}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{enz.type}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Selección de Cofactores y Cosustratos entrantes */}
          <div className="p-3.5 rounded-md bg-[#132038] border border-[#00A896]/20 space-y-2">
            <label className="text-[10px] font-mono font-bold text-slate-300 uppercase tracking-wider block flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#F77F00]" />
              3. Cofactores, Coenzimas y Cosustratos Requeridos:
            </label>

            <div className="flex flex-wrap gap-1">
              {AVAILABLE_COFACTORS.map((cof) => {
                const isSelected = selectedCofactors.includes(cof.id);
                return (
                  <button
                    key={cof.id}
                    onClick={() => toggleCofactor(cof.id)}
                    className={`px-2.5 py-1 rounded text-xs font-mono font-semibold transition-all border ${
                      isSelected
                        ? 'bg-[#F77F00] text-slate-950 border-[#ff941a] font-bold shadow-sm'
                        : 'bg-slate-900/70 border-white/5 text-slate-300 hover:border-white/20'
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
            <div className="p-3.5 rounded-md bg-amber-500/10 border border-amber-500/30 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-amber-300 text-xs">
                    4. Empuje Termodinámico (ΔG°' = {mission?.deltaG} &gt; 0):
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setLeChatelierCoupled(!leChatelierCoupled)}
                  className="flex items-center gap-1 text-xs font-mono font-bold transition-all text-amber-200"
                >
                  {leChatelierCoupled ? (
                    <ToggleRight className="w-6 h-6 text-[#00A896]" />
                  ) : (
                    <ToggleLeft className="w-6 h-6 text-slate-500" />
                  )}
                  <span>{leChatelierCoupled ? 'ACOPLADO' : 'DESACOPLADO'}</span>
                </button>
              </div>

              <p className="text-[11px] text-amber-200/80 leading-relaxed font-mono">
                Acoplar consumo celular continuo de productos (Principio de Le Chatelier). En el citosol celular, la remoción inmediata de productos por los pasos subsecuentes desplaza el equilibrio hacia adelante (ΔG_real &lt; 0).
              </p>
            </div>
          )}

          {/* Alertas de Error o Éxito */}
          {errorMsg && (
            <div className="p-3 rounded-md bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed font-mono">{errorMsg}</p>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 text-xs flex items-start gap-2.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed font-mono">{successMsg}</p>
            </div>
          )}
        </div>

        {/* Pie CAD */}
        <div className="p-3.5 border-t border-[#00A896]/30 bg-[#16233e] flex items-center justify-between">
          <span className="text-[10px] font-mono text-slate-400 truncate max-w-sm">
            {reaction ? reaction.explanation : 'Reacción estructural no acoplada'}
          </span>

          <button
            id="btn-execute-catalysis"
            onClick={handleExecuteReaction}
            className="px-4 py-2 rounded-md font-mono font-black text-xs bg-[#F77F00] hover:bg-[#ff941a] text-slate-950 transition-all shadow-md active:scale-95 flex items-center gap-1.5 glow-amber"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>⚡ Ejecutar Catálisis Enzimática</span>
          </button>
        </div>
      </div>
    </div>
  );
};
