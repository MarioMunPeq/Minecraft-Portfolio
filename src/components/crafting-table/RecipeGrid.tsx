import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import type { Project } from '../../mc/types';
import { parseRecipe } from '../../mc/recipe';
import { itemForTech } from '../../mc/techs';
import { ItemSprite } from './ItemSprite';
import { Slot } from './Slot';

/**
 * Coordenadas medidas sobre gui/container/crafting_table.png. El CSS define
 * --px como "un pixel de la textura", asi que aqui basta con multiplicar.
 * La cuadrícula 3x3 arranca en (29, 16) y avanza 18: celda de 16 + separador 2.
 */
const GRID_X = 29;
const GRID_Y = 16;
const PITCH = 18;

const FILL_INTERVAL_MS = 70;

interface RecipeGridProps {
  project: Project;
  hoveredSlotId: string | null;
  hoverPosition: { x: number; y: number } | null;
  onHover: (id: string | null, position?: { x: number; y: number }) => void;
  onRevealEnd?: () => void;
}

export function RecipeGrid({
  project,
  hoveredSlotId,
  hoverPosition,
  onHover,
  onRevealEnd,
}: RecipeGridProps) {
  const recipe = parseRecipe(project.meta.recipe);
  const [revealed, setRevealed] = useState(0);
  const total = recipe.cells.length;

  // El padre remonta la rejilla al cambiar de proyecto (key={id}), asi que
  // aqui no hay que resetear nada: se anima sola al montarse.
  const revealEndRef = useRef(onRevealEnd);
  useEffect(() => {
    revealEndRef.current = onRevealEnd;
  });

  useEffect(() => {
    if (total === 0) return;

    let filled = 0;
    const timer = window.setInterval(() => {
      filled += 1;
      setRevealed(filled);
      if (filled >= total) {
        window.clearInterval(timer);
        revealEndRef.current?.();
      }
    }, FILL_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [total]);

  return (
    <div className="mc-recipe-area" role="grid" aria-label={`Receta de ${project.meta.title}`}>
      {recipe.cells.map((cell, index) => {
        const slotId = `crafting-${cell.tech}-${cell.row}-${cell.col}`;
        const isRevealed = index < revealed;
        const style: CSSProperties = {
          left: `calc(${(GRID_X + cell.col * PITCH)} * var(--px))`,
          top: `calc(${(GRID_Y + cell.row * PITCH)} * var(--px))`,
        };

        return (
          <Slot
            key={slotId}
            id={slotId}
            className="mc-recipe-slot"
            style={style}
            isHovered={hoveredSlotId === slotId}
            hoverPosition={hoveredSlotId === slotId ? (hoverPosition ?? undefined) : undefined}
            onHover={onHover}
            tooltip={cell.tech}
            role="gridcell"
            aria-label={cell.tech}
          >
            {isRevealed && <ItemSprite item={itemForTech(cell.tech)} />}
          </Slot>
        );
      })}
    </div>
  );
}
