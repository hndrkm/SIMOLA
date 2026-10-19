import React, { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Line, Circle, Rect } from 'react-konva';
import Konva from 'konva';
import { useCanvasStore } from '../../store/useCanvasStore';
import { AtomShape } from './AtomShape';
import { BondShape } from './BondShape';

export const MolecularCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

  const graph = useCanvasStore((state) => state.graph);
  const activeTool = useCanvasStore((state) => state.activeTool);
  const activeElement = useCanvasStore((state) => state.activeElement);
  const activeRingPreset = useCanvasStore((state) => state.activeRingPreset);
  const activeTemplate = useCanvasStore((state) => state.activeTemplate);
  const stageScale = useCanvasStore((state) => state.stageScale);
  const stagePosition = useCanvasStore((state) => state.stagePosition);
  const pendingBondSourceId = useCanvasStore((state) => state.pendingBondSourceId);
  const cursorPosition = useCanvasStore((state) => state.cursorPosition);

  const setStageScale = useCanvasStore((state) => state.setStageScale);
  const setStagePosition = useCanvasStore((state) => state.setStagePosition);
  const addAtom = useCanvasStore((state) => state.addAtom);
  const stampRing = useCanvasStore((state) => state.stampRing);
  const stampTemplateAt = useCanvasStore((state) => state.stampTemplateAt);
  const updateCursorPosition = useCanvasStore((state) => state.updateCursorPosition);
  const cancelPendingBond = useCanvasStore((state) => state.cancelPendingBond);

  // ResizeObserver para dimensiones reactivas
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Zoom ergonómico centrado en el cursor con rueda del ratón
  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;

    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const oldScale = stageScale;
    const zoomFactor = e.evt.deltaY < 0 ? 1.08 : 0.92;
    const newScale = Math.max(0.3, Math.min(3, oldScale * zoomFactor));

    const mousePointTo = {
      x: (pointer.x - stagePosition.x) / oldScale,
      y: (pointer.y - stagePosition.y) / oldScale,
    };

    const newPosition = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };

    setStageScale(newScale);
    setStagePosition(newPosition);
  };

  // Clic en fondo vacío (deselección, colocación de átomo, estampe de anillos/plantillas o cancelación)
  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // Si el clic fue directamente en el Stage o en el fondo decorativo
    if (e.target === e.target.getStage() || e.target.name() === 'canvas-background') {
      const stage = stageRef.current;
      if (!stage) return;

      const pointer = stage.getPointerPosition();
      if (!pointer) return;

      // Transformar coordenadas de pantalla a espacio de mundo del lienzo
      const worldX = (pointer.x - stagePosition.x) / stageScale;
      const worldY = (pointer.y - stagePosition.y) / stageScale;

      if (activeTool === 'atom') {
        addAtom(activeElement, Math.round(worldX), Math.round(worldY));
      } else if (activeTool === 'ring' && activeRingPreset) {
        stampRing(activeRingPreset, { x: Math.round(worldX), y: Math.round(worldY) });
      } else if (activeTool === 'template' && activeTemplate) {
        stampTemplateAt(activeTemplate, { x: Math.round(worldX), y: Math.round(worldY) });
      } else if (activeTool === 'bond' && pendingBondSourceId) {
        // Cancelar enlace temporal si se hizo clic en espacio vacío (Auditoría A3.3)
        cancelPendingBond();
      }
    }
  };

  // Seguimiento del cursor para enlace temporal en progreso
  const handleMouseMove = (_e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!pendingBondSourceId) return;

    const stage = stageRef.current;
    if (!stage) return;

    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const worldX = (pointer.x - stagePosition.x) / stageScale;
    const worldY = (pointer.y - stagePosition.y) / stageScale;

    updateCursorPosition({ x: worldX, y: worldY });
  };

  // Al soltar el botón fuera de un átomo mientras se creaba un enlace
  const handleMouseUp = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (pendingBondSourceId && e.target === e.target.getStage()) {
      cancelPendingBond();
    }
  };

  // Obtener átomo fuente para línea guía temporal
  const pendingSourceAtom = pendingBondSourceId ? graph.nodes[pendingBondSourceId] : null;

  // Cuadrícula decorativa pasiva de puntos
  const gridSpacing = 40;
  const startX = Math.floor((-stagePosition.x / stageScale) / gridSpacing) * gridSpacing - gridSpacing;
  const endX = startX + (dimensions.width / stageScale) + gridSpacing * 2;
  const startY = Math.floor((-stagePosition.y / stageScale) / gridSpacing) * gridSpacing - gridSpacing;
  const endY = startY + (dimensions.height / stageScale) + gridSpacing * 2;

  const gridDots: Array<{ x: number; y: number }> = [];
  for (let x = startX; x <= endX; x += gridSpacing) {
    for (let y = startY; y <= endY; y += gridSpacing) {
      gridDots.push({ x, y });
    }
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative overflow-hidden bg-slate-950 select-none"
    >
      <Stage
        ref={stageRef}
        width={dimensions.width}
        height={dimensions.height}
        scaleX={stageScale}
        scaleY={stageScale}
        x={stagePosition.x}
        y={stagePosition.y}
        draggable={activeTool === 'select'}
        onWheel={handleWheel}
        onClick={handleStageClick}
        onTap={handleStageClick}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onDragEnd={(e) => {
          if (e.target === stageRef.current) {
            setStagePosition({ x: e.target.x(), y: e.target.y() });
          }
        }}
      >
        {/* Capa 1: Base / Fondo (No interactiva, listening={false} - Auditoría A3.1) */}
        <Layer listening={false}>
          {/* Fondo oscuro receptor */}
          <Rect
            name="canvas-background"
            x={startX - 500}
            y={startY - 500}
            width={endX - startX + 1000}
            height={endY - startY + 1000}
            fill="#090d16"
          />

          {/* Cuadrícula de referencia sutil */}
          {gridDots.map((dot, idx) => (
            <Circle
              key={`grid_${idx}`}
              x={dot.x}
              y={dot.y}
              radius={1}
              fill="rgba(148, 163, 184, 0.15)"
            />
          ))}
        </Layer>

        {/* Capa 2: Molecular e Interactiva */}
        <Layer>
          {/* 1. Enlaces existentes (por debajo de los átomos) */}
          {Object.values(graph.edges).map((bond) => (
            <BondShape
              key={bond.id}
              bond={bond}
              sourceAtom={graph.nodes[bond.sourceId]}
              targetAtom={graph.nodes[bond.targetId]}
            />
          ))}

          {/* 2. Línea guía temporal para creación interactiva de enlaces */}
          {pendingSourceAtom && cursorPosition && (
            <Line
              points={[
                pendingSourceAtom.x,
                pendingSourceAtom.y,
                cursorPosition.x,
                cursorPosition.y,
              ]}
              stroke="#38bdf8"
              strokeWidth={2.5}
              dash={[8, 5]}
              lineCap="round"
              listening={false} // Auditoría A3.1
            />
          )}

          {/* 3. Átomos (por encima de los enlaces) */}
          {Object.values(graph.nodes).map((atom) => (
            <AtomShape key={atom.id} atom={atom} />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};
