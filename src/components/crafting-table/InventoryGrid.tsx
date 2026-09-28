import type { Project } from '../../mc/types';
import { itemForTech } from '../../mc/techs';
import { ItemSprite } from './ItemSprite';
import { Slot } from './Slot';

interface InventoryGridProps {
  project: Project;
  hoveredSlotId: string | null;
  hoverPosition: { x: number; y: number } | null;
  onHover: (id: string | null, position?: { x: number; y: number }) => void;
}

/**
 * El stack completo del proyecto, una tecnologia por slot. En Minecraft esto
 * seria el inventario del jugador, y como el nuestro solo tiene cabida para
 * el stack del proyecto, la lista se limita a el.
 */
export function InventoryGrid({
  project,
  hoveredSlotId,
  hoverPosition,
  onHover,
}: InventoryGridProps) {
  const technologies = project.meta.technologies;

  return (
    <div
      className="mc-inventory-grid"
      role="list"
      aria-label={`Stack de ${project.meta.title}`}
    >
      {technologies.map((tech, index) => {
        const slotId = `inventory-${tech}-${index}`;
        const isHovered = hoveredSlotId === slotId;

        return (
          <Slot
            key={`${tech}-${index}`}
            id={slotId}
            className="mc-inventory-slot"
            isHovered={isHovered}
            hoverPosition={isHovered ? (hoverPosition ?? undefined) : undefined}
            onHover={onHover}
            tooltip={tech}
            role="listitem"
            aria-label={tech}
          >
            <ItemSprite item={itemForTech(tech)} />
          </Slot>
        );
      })}
    </div>
  );
}
