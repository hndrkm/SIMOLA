import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Stage, Layer, Line, Rect } from 'react-konva';
import Konva from 'konva';
import { useCanvasStore } from '../../store/useCanvasStore';
import { ATOM_RADII } from '../../core/model/constants';
import { AtomShape } from './AtomShape';
import { BondShape } from './BondShape';
import { AtomContextMenu } from './AtomContextMenu';

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
  const setSelectedAtom = useCanvasStore((state) => state.setSelectedAtom);
  const setSelectedBond = useCanvasStore((state) => state.setSelectedBond);
  const setContextMenuAtom = useCanvasStore((state) => state.setContextMenuAtom);

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
    if (e.target === e.target.getStage() || e.target.name() === 'canvas-background') {
      const stage = stageRef.current;
      if (!stage) return;

      const pointer = stage.getPointerPosition();
      if (!pointer) return;

      const worldX = (pointer.x - stagePosition.x) / stageScale;
      const worldY = (pointer.y - stagePosition.y) / stageScale;

      if (activeTool === 'select') {
        setSelectedAtom(null);
        setSelectedBond(null);
      } else if (activeTool === 'atom') {
        addAtom(activeElement, Math.round(worldX), Math.round(worldY));
      } else if (activeTool === 'ring' && activeRingPreset) {
        stampRing(activeRingPreset, { x: Math.round(worldX), y: Math.round(worldY) });
      } else if (activeTool === 'template' && activeTemplate) {
        stampTemplateAt(activeTemplate, { x: Math.round(worldX), y: Math.round(worldY) });
      } else if (activeTool === 'bond' && pendingBondSourceId) {
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

  // Pre-cálculo O(E) de órdenes de enlace y ángulos vecinos por átomo
  const { bondOrderMap, neighborAnglesMap } = useMemo(() => {
    const orders: Record<string, number> = {};
    const angles: Record<string, number[]> = {};

    for (const edge of Object.values(graph.edges)) {
      orders[edge.sourceId] = (orders[edge.sourceId] || 0) + edge.order;
      orders[edge.targetId] = (orders[edge.targetId] || 0) + edge.order;

      const src = graph.nodes[edge.sourceId];
      const tgt = graph.nodes[edge.targetId];
      if (src && tgt) {
        if (!angles[edge.sourceId]) angles[edge.sourceId] = [];
        angles[edge.sourceId].push(Math.atan2(tgt.y - src.y, tgt.x - src.x));

        if (!angles[edge.targetId]) angles[edge.targetId] = [];
        angles[edge.targetId].push(Math.atan2(src.y - tgt.y, src.x - tgt.x));
      }
    }

    return { bondOrderMap: orders, neighborAnglesMap: angles };
  }, [graph.edges, graph.nodes]);

  // Interceptor infalible de clic derecho en el contenedor del lienzo
  const handleCanvasContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const clientX = e.clientX;
    const clientY = e.clientY;
    const canvasX = clientX - rect.left;
    const canvasY = clientY - rect.top;

    // Proyectar coordenadas del cursor al plano molecular teniendo en cuenta escala y traslación
    const worldX = (canvasX - stagePosition.x) / stageScale;
    const worldY = (canvasY - stagePosition.y) / stageScale;

    let closestAtom = null;
    let minDistance = Infinity;

    for (const atom of Object.values(graph.nodes)) {
      const dx = atom.x - worldX;
      const dy = atom.y - worldY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const hitRadius = (ATOM_RADII[atom.element] || 17) + 16;

      if (dist <= hitRadius && dist < minDistance) {
        minDistance = dist;
        closestAtom = atom;
      }
    }

    if (closestAtom) {
      setSelectedAtom(closestAtom.id);
      setSelectedBond(null);
      setContextMenuAtom({
        atomId: closestAtom.id,
        clientX,
        clientY,
      });
    } else {
      setContextMenuAtom(null);
    }
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative overflow-hidden bg-[#F8FAFC] select-none"
      onContextMenu={handleCanvasContextMenu}
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
        onContextMenu={(e) => {
          e.evt.preventDefault();
        }}
        onDragEnd={(e) => {
          if (e.target === stageRef.current) {
            setStagePosition({ x: e.target.x(), y: e.target.y() });
          }
        }}
      >
        {/* Capa de fondo invisible para atrapar eventos de clic en el lienzo sin dibujar píxeles */}
        <Layer>
          <Rect
            name="canvas-background"
            x={-100000}
            y={-100000}
            width={200000}
            height={200000}
            fill="transparent"
            listening={true}
          />
        </Layer>

        {/* Capa Molecular e Interactiva */}
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
              stroke="#00A896"
              strokeWidth={2}
              dash={[6, 4]}
              lineCap="round"
              listening={false}
              perfectDrawEnabled={false}
            />
          )}

          {/* 3. Átomos (por encima de los enlaces) */}
          {Object.values(graph.nodes).map((atom) => (
            <AtomShape
              key={atom.id}
              atom={atom}
              bondOrderSum={bondOrderMap[atom.id] || 0}
              neighborAngles={neighborAnglesMap[atom.id] || []}
            />
          ))}
        </Layer>
      </Stage>

      {/* Popover Menú Contextual de Clic Derecho encima del Canvas */}
      <AtomContextMenu
        canvasWidth={dimensions.width}
        canvasHeight={dimensions.height}
      />
    </div>
  );
};
