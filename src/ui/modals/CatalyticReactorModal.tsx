import React, { useState } from 'react';
import {
  X,
  Zap,
  Activity,
  CheckCircle2,
  AlertCircle,
  FlaskConical,
  Sparkles,
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
  const getCurrentMission = useGameStore((state) => state.getCurrentMission);
  const addMetabolitesToReservoir = useGameStore((state) => state.addMetabolitesToReservoir);

  const mission = getCurrentMission();

  const [selectedEnzymeId, setSelectedEnzymeId] = useState<string>('');
  const [selectedCofactors, setSelectedCofactors] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const nodeCount = Object.keys(graph.nodes).length;
  const reaction = mission?.catalyticReaction;

  const toggleCofactor = (id: string) => {
    if (selectedCofactors.includes(id)) {
      setSelectedCofactors(selectedCofactors.filter((c) => c !== id));
    } else {
      setSelectedCofactors([...selectedCofactors, id]);
    }
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

    if (!selectedEnzymeId) {
      setErrorMsg('Selecciona la holoenzima catalítica correspondiente a este paso metabólico.');
      return;
    }

    // 1. Validar Enzima
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

    // 3. Éxito: Depositar subproductos en el Reservorio de Metabolitos
    addMetabolitesToReservoir(reaction.releasedByproducts, mission.title);

    // 4. Cargar el Estado de Transición / Intermediario Incompleto en el Lienzo
    setGraph(reaction.intermediateGraph);

    setSuccessMsg(
      `¡Catálisis Enzimática Ejecutada con Éxito! Se han liberado y reservado: ${reaction.releasedByproducts
        .map((p) => p.name)
        .join(', ')}. El estado de transición incompleto ha sido cargado en el lienzo para que completes los enlaces finales del producto.`
    );

    setTimeout(() => {
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md select-none animate-fadeIn text-slate-100">
      <div className="glass-panel w-full max-w-3xl rounded-3xl border-2 border-[#00A896]/60 shadow-2xl overflow-hidden bg-[#1B2A4A]/98 flex flex-col">
        {/* Cabecera */}
        <div className="p-5 border-b border-white/10 bg-[#16233e] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F77F00]/20 border border-[#F77F00]/40 flex items-center justify-center text-[#F77F00]">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                ⚡ Centro Activo / Reactor Catalítico
              </h2>
              <p className="text-xs text-slate-400">
                Simulación del acoplamiento sustrato-enzima y transferencia de grupos
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-4 overflow-y-auto max-h-[70vh] text-xs">
          {/* 1. Sustrato detectado del lienzo */}
          <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <FlaskConical className="w-4 h-4 text-[#00A896]" />
              <div>
                <span className="font-bold text-slate-300 block text-[11px]">
                  1. Sustrato Molecular en el Lienzo (S):
                </span>
                <span className="font-mono text-white text-xs font-semibold">
                  {reaction ? reaction.substrateName : `${nodeCount} átomos conectados en pizarra`}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              Detectado
            </span>
          </div>

          {/* 2. Selección de Enzima Catalizadora (E) */}
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-white/10 space-y-2.5">
            <label className="text-[11px] font-bold text-slate-300 block flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#00A896]" />
              2. Holoenzima / Subunidad Catalítica (E):
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-44 overflow-y-auto pr-1">
              {AVAILABLE_ENZYMES.map((enz) => {
                const isSelected = selectedEnzymeId === enz.id;
                return (
                  <button
                    key={enz.id}
                    onClick={() => setSelectedEnzymeId(enz.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#00A896]/20 border-[#00A896] text-white shadow-md'
                        : 'bg-slate-950/60 border-white/5 text-slate-300 hover:border-white/20 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs truncate">{enz.name}</span>
                      <span className="text-[9px] font-mono text-[#00c7b2]">{enz.ec}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">{enz.type}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Selección de Cofactores y Cosustratos entrantes */}
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-white/10 space-y-2.5">
            <label className="text-[11px] font-bold text-slate-300 block flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#F77F00]" />
              3. Cofactores, Coenzimas y Cosustratos Requeridos:
            </label>

            <div className="flex flex-wrap gap-1.5">
              {AVAILABLE_COFACTORS.map((cof) => {
                const isSelected = selectedCofactors.includes(cof.id);
                return (
                  <button
                    key={cof.id}
                    onClick={() => toggleCofactor(cof.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-mono transition-all border ${
                      isSelected
                        ? 'bg-[#F77F00] text-slate-950 border-[#ff941a] font-bold shadow-md shadow-[#F77F00]/25'
                        : 'bg-slate-950/60 border-white/5 text-slate-300 hover:border-white/20'
                    }`}
                  >
                    {cof.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Alertas de Error o Éxito */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed font-medium">{errorMsg}</p>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 text-xs flex items-start gap-2.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed font-medium">{successMsg}</p>
            </div>
          )}
        </div>

        {/* Pie */}
        <div className="p-4 border-t border-white/10 bg-[#16233e] flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            {reaction ? reaction.explanation : 'Reacción estructural no acoplada'}
          </span>

          <button
            id="btn-execute-catalysis"
            onClick={handleExecuteReaction}
            className="px-5 py-2.5 rounded-xl text-xs font-black bg-[#F77F00] hover:bg-[#ff941a] text-slate-950 transition-all shadow-md active:scale-95 flex items-center gap-2 glow-amber"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>⚡ Ejecutar Catálisis Enzimática</span>
          </button>
        </div>
      </div>
    </div>
  );
};
