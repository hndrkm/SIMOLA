import React, { useMemo } from 'react';
import { Circle, Group, Text } from 'react-konva';
import { AtomNode } from '../../core/model/types';
import { ATOM_RADII, CPK_COLORS, CPK_TEXT_COLORS, getMaxValence } from '../../core/model/constants';
import { toSuperscript } from '../../core/model/periodicTable';
import { useCanvasStore } from '../../store/useCanvasStore';

interface AtomShapeProps {
  atom: AtomNode;
  bondOrderSum?: number;
  neighborAngles?: number[];
}

export const AtomShape: React.FC<AtomShapeProps> = React.memo(({ atom, bondOrderSum, neighborAngles }) => {
  const activeTool = useCanvasStore((state) => state.activeTool);
  const activeElement = useCanvasStore((state) => state.activeElement);
  const activeIsotope = useCanvasStore((state) => state.activeIsotope);
  const activeRingPreset = useCanvasStore((state) => state.activeRingPreset);
  const activeTemplate = useCanvasStore((state) => state.activeTemplate);
  const hoveredAtomId = useCanvasStore((state) => state.hoveredAtomId);
  const selectedAtomId = useCanvasStore((state) => state.selectedAtomId);
  const pendingBondSourceId = useCanvasStore((state) => state.pendingBondSourceId);
  const setContextMenuAtom = useCanvasStore((state) => state.setContextMenuAtom);

  const startAtomMove = useCanvasStore((state) => state.startAtomMove);
  const moveAtom = useCanvasStore((state) => state.moveAtom);
  const removeAtom = useCanvasStore((state) => state.removeAtom);
  const transmuteAtom = useCanvasStore((state) => state.transmuteAtom);
  const sproutRing = useCanvasStore((state) => state.sproutRing);
  const sproutTemplateAt = useCanvasStore((state) => state.sproutTemplateAt);
  const startPendingBond = useCanvasStore((state) => state.startPendingBond);
  const finishPendingBond = useCanvasStore((state) => state.finishPendingBond);
  const setHoveredAtom = useCanvasStore((state) => state.setHoveredAtom);
  const setSelectedAtom = useCanvasStore((state) => state.setSelectedAtom);
  const setSelectedBond = useCanvasStore((state) => state.setSelectedBond);

  const radius = ATOM_RADII[atom.element] || 22;
  const cpkColor = CPK_COLORS[atom.element] || '#475569';
  const textColor = CPK_TEXT_COLORS[atom.element] || '#ffffff';

  const isHovered = hoveredAtomId === atom.id;
  const isSelected = selectedAtomId === atom.id;
  const isHighlighted = !!atom.isHighlighted;
  const isPendingSource = pendingBondSourceId === atom.id;
  const isSelectTool = activeTool === 'select';
  const isBondTool = activeTool === 'bond';
  const isEraserTool = activeTool === 'eraser';
  const isAtomTool = activeTool === 'atom';
  const isRingTool = activeTool === 'ring';
  const isTemplateTool = activeTool === 'template';

  const handleClick = (e: any) => {
    e.cancelBubble = true;

    if (isSelectTool) {
      setSelectedAtom(atom.id);
      setSelectedBond(null);
    } else if (isEraserTool) {
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

  // Cálculo O(1) de hidrógenos satélite
  const currentBondOrderSum = bondOrderSum ?? 0;
  const angles = neighborAngles ?? [];

  const maxValence = getMaxValence(atom.element, atom.formalCharge);
  const implicitHCount =
    atom.element === 'H' ? 0 : Math.max(0, maxValence - currentBondOrderSum);

  const satellitePositions = useMemo(() => {
    if (implicitHCount <= 0) return [];

    const positions: Array<{ x: number; y: number }> = [];
    const satDistance = radius - 1; // "Medio cuerpo" en el borde

    if (angles.length === 0) {
      const step = (2 * Math.PI) / implicitHCount;
      const startAngle = -Math.PI / 2;
      for (let i = 0; i < implicitHCount; i++) {
        const ang = startAngle + i * step;
        positions.push({
          x: Math.round(satDistance * Math.cos(ang)),
          y: Math.round(satDistance * Math.sin(ang)),
        });
      }
    } else {
      let sumDx = 0;
      let sumDy = 0;
      for (const ang of angles) {
        sumDx += Math.cos(ang);
        sumDy += Math.sin(ang);
      }
      const oppositeAngle = Math.atan2(-sumDy, -sumDx);

      if (implicitHCount === 1) {
        positions.push({
          x: Math.round(satDistance * Math.cos(oppositeAngle)),
          y: Math.round(satDistance * Math.sin(oppositeAngle)),
        });
      } else if (implicitHCount === 2) {
        const spread = Math.PI / 4;
        positions.push({
          x: Math.round(satDistance * Math.cos(oppositeAngle - spread)),
          y: Math.round(satDistance * Math.sin(oppositeAngle - spread)),
        });
        positions.push({
          x: Math.round(satDistance * Math.cos(oppositeAngle + spread)),
          y: Math.round(satDistance * Math.sin(oppositeAngle + spread)),
        });
      } else {
        const spread = Math.PI / (implicitHCount + 1);
        for (let i = 0; i < implicitHCount; i++) {
          const ang = oppositeAngle - ((implicitHCount - 1) / 2) * spread + i * spread;
          positions.push({
            x: Math.round(satDistance * Math.cos(ang)),
            y: Math.round(satDistance * Math.sin(ang)),
          });
        }
      }
    }

    return positions;
  }, [implicitHCount, radius, angles.join(',')]);

  // Texto con isótopo opcional como superíndice (ej. ¹⁴C o ¹³C)
  const isotopePrefix = atom.isotope ? toSuperscript(atom.isotope) : '';
  const displaySymbol = `${isotopePrefix}${atom.element}`;

  // Formateo de carga formal
  const chargeStr =
    atom.formalCharge === 0
      ? ''
      : atom.formalCharge === 1
      ? '⊕'
      : atom.formalCharge === -1
      ? '⊖'
      : atom.formalCharge > 1
      ? `${atom.formalCharge}⊕`
      : `${Math.abs(atom.formalCharge)}⊖`;

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
      onContextMenu={(e: any) => {
        e.evt.preventDefault();
        e.cancelBubble = true;
        setContextMenuAtom({
          atomId: atom.id,
          clientX: e.evt.clientX,
          clientY: e.evt.clientY,
        });
      }}
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
      {/* 1. Retícula Segmentada de Sitio Reactivo Post-Catálisis (Ámbar Fosfato CAD) */}
      {isHighlighted && (
        <Circle
          radius={radius + 8}
          stroke="#F77F00"
          strokeWidth={2.5}
          dash={[6, 3]}
          listening={false}
          perfectDrawEnabled={false}
        />
      )}

      {/* 2. Anillo de Selección Técnica CAD (Verde Azulado Catalítico) */}
      {isSelected && (
        <Circle
          radius={radius + 6}
          stroke="#00A896"
          strokeWidth={2}
          dash={[6, 3]}
          listening={false}
          perfectDrawEnabled={false}
        />
      )}

      {/* 3. Halo Vectorial de Error de Valencia o Conectividad */}
      {atom.hasError && (
        <Circle
          radius={radius + 8}
          stroke="#ef4444"
          strokeWidth={2.5}
          dash={[6, 3]}
          fill="rgba(239, 68, 68, 0.15)"
          listening={false}
          perfectDrawEnabled={false}
        />
      )}

      {/* 4. Halo de Átomo Origen de Enlace en progreso */}
      {isPendingSource && (
        <Circle
          radius={radius + 6}
          stroke="#38bdf8"
          strokeWidth={2}
          dash={[4, 2]}
          fill="rgba(56, 189, 248, 0.15)"
          listening={false}
          perfectDrawEnabled={false}
        />
      )}

      {/* 5. Indicador de Hover */}
      {isHovered && !atom.hasError && !isPendingSource && !isSelected && !isHighlighted && (
        <Circle
          radius={radius + 5}
          stroke={isEraserTool ? '#f43f5e' : isRingTool || isTemplateTool ? '#10b981' : '#00A896'}
          strokeWidth={1.5}
          dash={[5, 3]}
          listening={false}
          perfectDrawEnabled={false}
        />
      )}

      {/* 6. Anillo de Bloqueo (Átomo no editable) */}
      {atom.isLocked && (
        <Circle
          radius={radius + 3}
          stroke="#eab308"
          strokeWidth={1.5}
          dash={[4, 3]}
          listening={false}
          perfectDrawEnabled={false}
        />
      )}

      {/* 7. Cuerpo principal Wireframe CAD: Núcleo oscuro (#0B132B) + Anillo perimetral CPK */}
      <Circle
        radius={radius}
        fill="#0B132B"
        stroke={cpkColor}
        strokeWidth={2}
        listening={true}
        perfectDrawEnabled={false}
      />

      {/* 8. Satélites de Hidrógeno Implícito (Nodos orbitales de trazo fino 1px sin sombras) */}
      {satellitePositions.map((sat, idx) => (
        <Group key={`sat_h_${idx}`} x={sat.x} y={sat.y} listening={false}>
          <Circle
            radius={6}
            fill="#0B132B"
            stroke="#94a3b8"
            strokeWidth={1}
            listening={false}
            perfectDrawEnabled={false}
          />
          <Text
            text="H"
            fontSize={7}
            fontStyle="bold"
            fontFamily="monospace"
            fill="#94a3b8"
            align="center"
            verticalAlign="middle"
            offsetX={3}
            offsetY={4}
            listening={false}
            perfectDrawEnabled={false}
          />
        </Group>
      ))}

      {/* 9. Símbolo químico del elemento */}
      <Text
        text={displaySymbol}
        fontSize={atom.element.length > 1 || atom.isotope ? 11 : 13}
        fontStyle="bold"
        fontFamily="monospace"
        fill={textColor}
        align="center"
        verticalAlign="middle"
        offsetX={displaySymbol.length * 3.5}
        offsetY={6}
        listening={false}
        perfectDrawEnabled={false}
      />

      {/* 10. Carga formal superíndice */}
      {chargeStr !== '' && (
        <Text
          text={chargeStr}
          fontSize={10}
          fontStyle="bold"
          fontFamily="monospace"
          fill={atom.formalCharge > 0 ? '#38bdf8' : '#f87171'}
          offsetX={-radius * 0.45}
          offsetY={radius * 0.75}
          listening={false}
          perfectDrawEnabled={false}
        />
      )}
    </Group>
  );
});

AtomShape.displayName = 'AtomShape';
