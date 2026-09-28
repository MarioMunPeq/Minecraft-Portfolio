import type { CSSProperties } from 'react';
import type { Project } from '../../mc/types';
import { ItemSprite } from './ItemSprite';
import { Slot } from './Slot';

/**
 * El slot de resultado de esta textura es un cuadrado de 26x26 en (119, 30),
 * no un slot normal de 18x18: el marco va de x 119 a 144 y de y 30 a 55, con
 * el interior de 24x24 en (120, 31). El boton ocupa el marco entero para que
 * la zona clicable sea la que se ve, y el item de 16x16 queda centrado por
 * flexbox, 5px a cada lado.
 */
const RESULT_X = 119;
const RESULT_Y = 30;

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
