import type { CSSProperties } from 'react';
import type { Project } from '../../mc/types';
import { ItemSprite } from './ItemSprite';
import { Slot } from './Slot';

/**
 * El slot de resultado de esta textura es un rectangulo de 18x26 en (119, 30),
 * no un cuadrado. El item va de 16x16 centrado dentro: 1px a los lados, 5 arriba.
 */
const RESULT_X = 120;
const RESULT_Y = 35;

interface ResultSlotProps {
  project: Project;
  isReady: boolean;
  hoveredSlotId: string | null;
  hoverPosition: { x: number; y: number } | null;
  onHover: (id: string | null, position?: { x: number; y: number }) => void;
  onTake: () => void;
}

export function ResultSlot({
  project,
  isReady,
  hoveredSlotId,
  hoverPosition,
  onHover,
  onTake,
}: ResultSlotProps) {
  const slotId = `result-${project.meta.id}`;
  const isHovered = hoveredSlotId === slotId;
  const style: CSSProperties = {
    left: `calc(${RESULT_X} * var(--px))`,
    top: `calc(${RESULT_Y} * var(--px))`,
  };

  return (
    <Slot
      id={slotId}
      className={`mc-result-slot${isReady ? ' mc-result-slot-ready' : ''}`}
      style={style}
      isHovered={isHovered}
      hoverPosition={isHovered ? (hoverPosition ?? undefined) : undefined}
      onHover={onHover}
      onClick={onTake}
      disabled={!isReady}
      tooltip={isReady ? project.meta.title : 'Faltan ingredientes'}
      aria-label={`Ver ${project.meta.title}`}
    >
      {isReady && (
        <ItemSprite item={project.meta.result} alt={project.meta.title} />
      )}
    </Slot>
  );
}
