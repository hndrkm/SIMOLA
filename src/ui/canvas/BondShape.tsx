import React from 'react';
import { Group, Line } from 'react-konva';
import { AtomNode, BondEdge } from '../../core/model/types';
import { useCanvasStore } from '../../store/useCanvasStore';

interface BondShapeProps {
  bond: BondEdge;
  sourceAtom?: AtomNode;
  targetAtom?: AtomNode;
}

export const BondShape: React.FC<BondShapeProps> = ({ bond, sourceAtom, targetAtom }) => {
  const activeTool = useCanvasStore((state) => state.activeTool);
  const activeRingPreset = useCanvasStore((state) => state.activeRingPreset);
  const cycleBondOrder = useCanvasStore((state) => state.cycleBondOrder);
  const removeBond = useCanvasStore((state) => state.removeBond);
  const fuseRing = useCanvasStore((state) => state.fuseRing);
  const hoveredBondId = useCanvasStore((state) => state.hoveredBondId);
  const setHoveredBond = useCanvasStore((state) => state.setHoveredBond);

  if (!sourceAtom || !targetAtom) return null;

  const x1 = sourceAtom.x;
  const y1 = sourceAtom.y;
  const x2 = targetAtom.x;
  const y2 = targetAtom.y;

  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.hypot(dx, dy);

  // Evitar división por cero si dos átomos colisionan exactamente en el mismo punto
  if (length === 0) return null;

  // Vector normal unitario perpendicular: nx = -dy / L, ny = dx / L (Auditoría A3.1 y 03_KONVA_AND_RDKIT_SPECS.md)
  const nx = -dy / length;
  const ny = dx / length;

  const isHovered = hoveredBondId === bond.id;
  const isEraser = activeTool === 'eraser';
  const isRing = activeTool === 'ring';

  // Color de enlace dinámico según estado
  let strokeColor = '#94a3b8'; // Slate-400 estándar
  if (bond.isLocked) {
    strokeColor = '#64748b'; // Atenuado si está bloqueado
  }
  if (isHovered) {
    strokeColor = isEraser ? '#f43f5e' : isRing ? '#10b981' : '#38bdf8';
  }

  const baseStrokeWidth = 3;

  const handleClick = (e: any) => {
    e.cancelBubble = true;
    if (activeTool === 'eraser') {
      removeBond(bond.id);
    } else if (activeTool === 'ring' && activeRingPreset) {
      fuseRing(bond.id, activeRingPreset);
    } else {
      cycleBondOrder(bond.id);
    }
  };

  return (
    <Group>
      {/* Área de clic invisible ergonómica: hitStrokeWidth=22 (Auditoría A3.2) */}
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

      {/* Renderizado vectorial pasivo con listening={false} (Auditoría A3.1) */}
      {bond.order === 1 && (
        <Line
          points={[x1, y1, x2, y2]}
          stroke={strokeColor}
          strokeWidth={baseStrokeWidth}
          lineCap="round"
          listening={false}
        />
      )}

      {bond.order === 2 && (
        <>
          <Line
            points={[
              x1 + nx * 4,
              y1 + ny * 4,
              x2 + nx * 4,
              y2 + ny * 4,
            ]}
            stroke={strokeColor}
            strokeWidth={baseStrokeWidth}
            lineCap="round"
            listening={false}
          />
          <Line
            points={[
              x1 - nx * 4,
              y1 - ny * 4,
              x2 - nx * 4,
              y2 - ny * 4,
            ]}
            stroke={strokeColor}
            strokeWidth={baseStrokeWidth}
            lineCap="round"
            listening={false}
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
          />
          <Line
            points={[
              x1 + nx * 6,
              y1 + ny * 6,
              x2 + nx * 6,
              y2 + ny * 6,
            ]}
            stroke={strokeColor}
            strokeWidth={baseStrokeWidth}
            lineCap="round"
            listening={false}
          />
          <Line
            points={[
              x1 - nx * 6,
              y1 - ny * 6,
              x2 - nx * 6,
              y2 - ny * 6,
            ]}
            stroke={strokeColor}
            strokeWidth={baseStrokeWidth}
            lineCap="round"
            listening={false}
          />
        </>
      )}
    </Group>
  );
};
