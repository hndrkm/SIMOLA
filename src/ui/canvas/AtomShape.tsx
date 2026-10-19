import React from 'react';
import { Circle, Group, Text } from 'react-konva';
import { AtomNode } from '../../core/model/types';
import { ATOM_RADII, CPK_COLORS, CPK_TEXT_COLORS } from '../../core/model/constants';
import { toSuperscript } from '../../core/model/periodicTable';
import { useCanvasStore } from '../../store/useCanvasStore';

interface AtomShapeProps {
  atom: AtomNode;
}

export const AtomShape: React.FC<AtomShapeProps> = ({ atom }) => {
  const activeTool = useCanvasStore((state) => state.activeTool);
  const activeElement = useCanvasStore((state) => state.activeElement);
  const activeIsotope = useCanvasStore((state) => state.activeIsotope);
  const activeRingPreset = useCanvasStore((state) => state.activeRingPreset);
  const activeTemplate = useCanvasStore((state) => state.activeTemplate);
  const hoveredAtomId = useCanvasStore((state) => state.hoveredAtomId);
  const pendingBondSourceId = useCanvasStore((state) => state.pendingBondSourceId);

  const startAtomMove = useCanvasStore((state) => state.startAtomMove);
  const moveAtom = useCanvasStore((state) => state.moveAtom);
  const removeAtom = useCanvasStore((state) => state.removeAtom);
  const transmuteAtom = useCanvasStore((state) => state.transmuteAtom);
  const modifyAtomFormalCharge = useCanvasStore((state) => state.modifyAtomFormalCharge);
  const sproutRing = useCanvasStore((state) => state.sproutRing);
  const sproutTemplateAt = useCanvasStore((state) => state.sproutTemplateAt);
  const startPendingBond = useCanvasStore((state) => state.startPendingBond);
  const finishPendingBond = useCanvasStore((state) => state.finishPendingBond);
  const setHoveredAtom = useCanvasStore((state) => state.setHoveredAtom);

  const radius = ATOM_RADII[atom.element] || 22;
  const fillColor = CPK_COLORS[atom.element] || '#475569';
  const textColor = CPK_TEXT_COLORS[atom.element] || '#ffffff';

  const isHovered = hoveredAtomId === atom.id;
  const isPendingSource = pendingBondSourceId === atom.id;
  const isSelectTool = activeTool === 'select';
  const isBondTool = activeTool === 'bond';
  const isEraserTool = activeTool === 'eraser';
  const isAtomTool = activeTool === 'atom';
  const isRingTool = activeTool === 'ring';
  const isTemplateTool = activeTool === 'template';

  const handleClick = (e: any) => {
    e.cancelBubble = true;

    if (isEraserTool) {
      removeAtom(atom.id);
    } else if (isRingTool && activeRingPreset) {
      sproutRing(atom.id, activeRingPreset);
    } else if (isTemplateTool && activeTemplate) {
      sproutTemplateAt(atom.id, activeTemplate);
    } else if (isAtomTool) {
      transmuteAtom(atom.id, activeElement, activeIsotope);
    }
  };

  const handleMouseDown = (e: any) => {
    if (isBondTool) {
      e.cancelBubble = true;
      startPendingBond(atom.id, { x: atom.x, y: atom.y });
    }
  };

  const handleMouseUp = (e: any) => {
    if (isBondTool && pendingBondSourceId) {
      e.cancelBubble = true;
      finishPendingBond(atom.id);
    }
  };

  // Texto con isótopo opcional como superíndice (ej. ¹⁴C o ¹³C)
  const isotopePrefix = atom.isotope ? toSuperscript(atom.isotope) : '';
  const displaySymbol = `${isotopePrefix}${atom.element}`;

  // Formateo de carga formal: +, -, 2+, 2-, etc.
  const chargeStr =
    atom.formalCharge === 0
      ? ''
      : atom.formalCharge === 1
      ? '+'
      : atom.formalCharge === -1
      ? '−'
      : atom.formalCharge > 1
      ? `${atom.formalCharge}+`
      : `${Math.abs(atom.formalCharge)}−`;

  return (
    <Group
      x={atom.x}
      y={atom.y}
      draggable={isSelectTool}
      onDragStart={() => {
        startAtomMove();
      }}
      onDragMove={(e) => {
        moveAtom(atom.id, e.target.x(), e.target.y());
      }}
      onClick={handleClick}
      onTap={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseEnter={(e) => {
        setHoveredAtom(atom.id);
        const stage = e.target.getStage();
        if (stage) {
          if (isSelectTool) stage.container().style.cursor = 'grab';
          else if (isEraserTool) stage.container().style.cursor = atom.isLocked ? 'not-allowed' : 'pointer';
          else if (isBondTool) stage.container().style.cursor = 'crosshair';
          else if (isRingTool || isTemplateTool) stage.container().style.cursor = 'copy';
          else stage.container().style.cursor = 'pointer';
        }
      }}
      onMouseLeave={(e) => {
        setHoveredAtom(null);
        const stage = e.target.getStage();
        if (stage) {
          stage.container().style.cursor = 'default';
        }
      }}
    >
      {/* Halo de Error de Valencia o Conectividad (Capa 1) */}
      {atom.hasError && (
        <Circle
          radius={radius + 8}
          stroke="#ef4444"
          strokeWidth={3}
          fill="rgba(239, 68, 68, 0.2)"
          dash={[5, 3]}
          listening={false}
        />
      )}

      {/* Halo de Átomo Origen de Enlace en progreso */}
      {isPendingSource && (
        <Circle
          radius={radius + 6}
          stroke="#38bdf8"
          strokeWidth={2.5}
          fill="rgba(56, 189, 248, 0.2)"
          listening={false}
        />
      )}

      {/* Indicador de Hover */}
      {isHovered && !atom.hasError && !isPendingSource && (
        <Circle
          radius={radius + 5}
          stroke={isEraserTool ? '#f43f5e' : isRingTool || isTemplateTool ? '#10b981' : '#38bdf8'}
          strokeWidth={2}
          fill="rgba(255, 255, 255, 0.08)"
          listening={false}
        />
      )}

      {/* Anillo de Bloqueo (Átomo no editable) */}
      {atom.isLocked && (
        <Circle
          radius={radius + 3}
          stroke="#eab308"
          strokeWidth={2}
          dash={[4, 3]}
          listening={false}
        />
      )}

      {/* Cuerpo principal del átomo */}
      <Circle
        radius={radius}
        fill={fillColor}
        stroke={atom.isLocked ? '#ca8a04' : 'rgba(255, 255, 255, 0.3)'}
        strokeWidth={1.5}
        shadowColor="rgba(0, 0, 0, 0.45)"
        shadowBlur={8}
        shadowOffset={{ x: 0, y: 3 }}
        shadowOpacity={0.5}
      />

      {/* Símbolo químico del elemento con isótopo opcional */}
      <Text
        text={displaySymbol}
        fontSize={atom.element.length > 1 || atom.isotope ? 13 : 15}
        fontStyle="bold"
        fontFamily="Inter, -apple-system, BlinkMacSystemFont, sans-serif"
        fill={textColor}
        align="center"
        verticalAlign="middle"
        offsetX={displaySymbol.length * 4}
        offsetY={7}
        listening={false}
      />

      {/* Carga formal superíndice */}
      {chargeStr !== '' && (
        <Text
          text={chargeStr}
          fontSize={11}
          fontStyle="bold"
          fontFamily="Inter, sans-serif"
          fill={atom.formalCharge > 0 ? '#38bdf8' : '#f87171'}
          offsetX={-radius * 0.45}
          offsetY={radius * 0.75}
          listening={false}
        />
      )}

      {/* Controles Rápidos de Carga Formal (+ / -) al hacer Hover */}
      {isHovered && !atom.isLocked && !isEraserTool && (
        <Group x={radius + 12} y={0}>
          {/* Botón Incrementar Carga (+) */}
          <Group
            y={-10}
            onClick={(e) => {
              e.cancelBubble = true;
              modifyAtomFormalCharge(atom.id, 1);
            }}
            onTap={(e) => {
              e.cancelBubble = true;
              modifyAtomFormalCharge(atom.id, 1);
            }}
          >
            <Circle
              radius={8}
              fill="#0284c7"
              stroke="#38bdf8"
              strokeWidth={1}
              shadowBlur={4}
              shadowColor="rgba(0,0,0,0.5)"
            />
            <Text
              text="+"
              fontSize={11}
              fontStyle="bold"
              fill="#ffffff"
              align="center"
              verticalAlign="middle"
              offsetX={3.5}
              offsetY={5}
              listening={false}
            />
          </Group>

          {/* Botón Decrementar Carga (-) */}
          <Group
            y={10}
            onClick={(e) => {
              e.cancelBubble = true;
              modifyAtomFormalCharge(atom.id, -1);
            }}
            onTap={(e) => {
              e.cancelBubble = true;
              modifyAtomFormalCharge(atom.id, -1);
            }}
          >
            <Circle
              radius={8}
              fill="#e11d48"
              stroke="#fb7185"
              strokeWidth={1}
              shadowBlur={4}
              shadowColor="rgba(0,0,0,0.5)"
            />
            <Text
              text="−"
              fontSize={11}
              fontStyle="bold"
              fill="#ffffff"
              align="center"
              verticalAlign="middle"
              offsetX={4}
              offsetY={5}
              listening={false}
            />
          </Group>
        </Group>
      )}
    </Group>
  );
};
