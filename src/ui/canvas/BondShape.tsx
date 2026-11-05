import React from 'react';
import { Group, Line } from 'react-konva';
import { AtomNode, BondEdge } from '../../core/model/types';
import { useCanvasStore } from '../../store/useCanvasStore';

interface BondShapeProps {
  bond: BondEdge;
  sourceAtom?: AtomNode;
  targetAtom?: AtomNode;
}

export const BondShape: React.FC<BondShapeProps> = React.memo(({ bond, sourceAtom, targetAtom }) => {
  const activeTool = useCanvasStore((state) => state.activeTool);
  const activeRingPreset = useCanvasStore((state) => state.activeRingPreset);
  const cycleBondOrder = useCanvasStore((state) => state.cycleBondOrder);
  const removeBond = useCanvasStore((state) => state.removeBond);
  const fuseRing = useCanvasStore((state) => state.fuseRing);
  const hoveredBondId = useCanvasStore((state) => state.hoveredBondId);
  const setHoveredBond = useCanvasStore((state) => state.setHoveredBond);
  const selectedBondId = useCanvasStore((state) => state.selectedBondId);
  const setSelectedBond = useCanvasStore((state) => state.setSelectedBond);
  const setSelectedAtom = useCanvasStore((state) => state.setSelectedAtom);

  if (!sourceAtom || !targetAtom) return null;

  const x1 = sourceAtom.x;
  const y1 = sourceAtom.y;
  const x2 = targetAtom.x;
  const y2 = targetAtom.y;

  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.hypot(dx, dy);

  // Evitar división por cero si dos átomos colisionan
  if (length === 0) return null;

  // Vector normal unitario perpendicular: nx = -dy / L, ny = dx / L
  const nx = -dy / length;
  const ny = dx / length;

  const isHovered = hoveredBondId === bond.id;
  const isSelected = selectedBondId === bond.id;
  const isHighlighted = !!bond.isHighlighted;
  const isEraser = activeTool === 'eraser';
  const isRing = activeTool === 'ring';
  const isSelect = activeTool === 'select';

  // Color de trazo técnico CAD:
  let strokeColor = '#64748b'; // Slate-500 base wireframe
  if (bond.isLocked) {
    strokeColor = '#475569'; // Atenuado si está bloqueado
  }
  if (isHighlighted) {
    strokeColor = '#F77F00'; // Ámbar reactivo post-catálisis / asistencia guiada
  }
  if (isSelected) {
    strokeColor = '#00A896'; // Verde azulado catalítico de selección
  }
  if (isHovered && !isSelected && !isHighlighted) {
    strokeColor = isEraser ? '#f43f5e' : isRing ? '#10b981' : '#00A896';
  }

  const baseStrokeWidth = 2.5;

  const handleClick = (e: any) => {
    e.cancelBubble = true;
    if (isSelect) {
      setSelectedBond(bond.id);
      setSelectedAtom(null);
    } else if (isEraser) {
      removeBond(bond.id);
    } else if (isRing && activeRingPreset) {
      fuseRing(bond.id, activeRingPreset);
    } else {
      cycleBondOrder(bond.id);
    }
  };

  return (
    <Group>
      {/* Retícula reactiva o de selección (anillo / trazo punteado CAD sin sombras) */}
      {(isSelected || isHighlighted) && (
        <Line
          points={[x1, y1, x2, y2]}
          stroke={isSelected ? '#00A896' : '#F77F00'}
          strokeWidth={baseStrokeWidth + 6}
          dash={[6, 3]}
          lineCap="round"
          opacity={0.65}
          listening={false}
          perfectDrawEnabled={false}
        />
      )}

      {/* Área de clic invisible ergonómica: hitStrokeWidth=22 */}
      <Line
        points={[x1, y1, x2, y2]}
        stroke="transparent"
        strokeWidth={4}
        hitStrokeWidth={22}
        listening={true}
        onClick={handleClick}
        onTap={handleClick}
        onMouseEnter={(e) => {
          setHoveredBond(bond.id);
          const stage = e.target.getStage();
          if (stage) {
            stage.container().style.cursor = isEraser ? 'not-allowed' : 'pointer';
          }
        }}
        onMouseLeave={(e) => {
          setHoveredBond(null);
          const stage = e.target.getStage();
          if (stage) {
            stage.container().style.cursor = 'default';
          }
        }}
      />

      {/* Renderizado vectorial pasivo con listening={false} y perfectDrawEnabled={false} */}
      {bond.order === 1 && (
        <Line
          points={[x1, y1, x2, y2]}
          stroke={strokeColor}
          strokeWidth={baseStrokeWidth}
          lineCap="round"
          listening={false}
          perfectDrawEnabled={false}
        />
      )}

      {bond.order === 2 && (
        <>
          <Line
            points={[
              x1 + nx * 3.5,
              y1 + ny * 3.5,
              x2 + nx * 3.5,
              y2 + ny * 3.5,
            ]}
            stroke={strokeColor}
            strokeWidth={baseStrokeWidth}
            lineCap="round"
            listening={false}
            perfectDrawEnabled={false}
          />
          <Line
            points={[
              x1 - nx * 3.5,
              y1 - ny * 3.5,
              x2 - nx * 3.5,
              y2 - ny * 3.5,
            ]}
            stroke={strokeColor}
            strokeWidth={baseStrokeWidth}
            lineCap="round"
            listening={false}
            perfectDrawEnabled={false}
          />
        </>
      )}

      {bond.order === 3 && (
        <>
          <Line
            points={[x1, y1, x2, y2]}
            stroke={strokeColor}
            strokeWidth={baseStrokeWidth}
            lineCap="round"
            listening={false}
            perfectDrawEnabled={false}
          />
          <Line
            points={[
              x1 + nx * 5,
              y1 + ny * 5,
              x2 + nx * 5,
              y2 + ny * 5,
            ]}
            stroke={strokeColor}
            strokeWidth={baseStrokeWidth}
            lineCap="round"
            listening={false}
            perfectDrawEnabled={false}
          />
          <Line
            points={[
              x1 - nx * 5,
              y1 - ny * 5,
              x2 - nx * 5,
              y2 - ny * 5,
            ]}
            stroke={strokeColor}
            strokeWidth={baseStrokeWidth}
            lineCap="round"
            listening={false}
            perfectDrawEnabled={false}
          />
        </>
      )}
    </Group>
  );
});

BondShape.displayName = 'BondShape';
