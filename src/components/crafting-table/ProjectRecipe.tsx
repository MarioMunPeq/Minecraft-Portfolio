import { useState } from 'react';
import type { Project } from '../../data/projects';
import { INVENTORY_STACK } from '../../data/projects';
import { MinecraftSlot } from './MinecraftSlot';
import { Slot } from './Slot';
import { IconImage } from './IconImage';
import { useAudio } from '../../audio/AudioContext';
import { BookModal } from './BookModal';

interface ProjectRecipeProps {
  project: Project;
  hoveredSlotId: string | null;
  hoverPosition: { x: number; y: number } | null;
  onHover: (id: string | null, position?: { x: number; y: number }) => void;
}

const CRAFTING_SLOT_COUNT = 9;

export function ProjectRecipe({
  project,
  hoveredSlotId,
  hoverPosition,
  onHover,
}: ProjectRecipeProps) {
  const { playClick, playLevelup } = useAudio();
  const [isBookOpen, setIsBookOpen] = useState(false);
  const technologies = project.technologies.slice(0, CRAFTING_SLOT_COUNT);

  const handleResultClick = () => {
    playClick();
    playLevelup();
    setIsBookOpen(true);
  };

  return (
    <div className="mc-panel mc-panel-right" aria-label="Fabricación e inventario">
      <div className="mc-crafting-grid" role="grid" aria-label="Receta de tecnologías">
        {Array.from({ length: CRAFTING_SLOT_COUNT }, (_, index) => {
          const technology = technologies[index];
          const slotId = `crafting-${project.id}-${index}`;
          const isHovered = hoveredSlotId === slotId;

          if (!technology) {
            return <div key={`empty-technology-${index}`} className="mc-slot-btn mc-empty-slot" aria-hidden="true" />;
          }

          return (
            <Slot
              key={`${project.id}-${index}`}
              id={slotId}
              isHovered={isHovered}
              hoverPosition={isHovered ? hoverPosition ?? undefined : undefined}
              onHover={onHover}
              role="gridcell"
              className="mc-slot-btn"
            >
              <MinecraftSlot technology={technology} />
            </Slot>
          );
        })}
      </div>

      <Slot
        id={`result-${project.id}`}
        isHovered={hoveredSlotId === `result-${project.id}`}
        hoverPosition={hoveredSlotId === `result-${project.id}` ? hoverPosition ?? undefined : undefined}
        onHover={onHover}
        onClick={handleResultClick}
        className="mc-slot-btn mc-result-slot"
        aria-label={`Abrir libro de ${project.name}`}
        data-project-id={project.id}
      >
        <IconImage name={project.icon} className="mc-slot-glyph" alt={project.name} />
      </Slot>

      <div className="mc-inventory-grid" role="list" aria-label="Inventario de tecnologías">
        {INVENTORY_STACK.map((technology, index) => {
          const slotId = `inventory-${technology}-${index}`;
          const isHovered = hoveredSlotId === slotId;

          return (
            <Slot
              key={`${technology}-${index}`}
              id={slotId}
              isHovered={isHovered}
              hoverPosition={isHovered ? hoverPosition ?? undefined : undefined}
              onHover={onHover}
              role="listitem"
              className="mc-slot-btn"
            >
              <MinecraftSlot technology={technology} />
            </Slot>
          );
        })}
      </div>

      <BookModal project={project} isOpen={isBookOpen} onClose={() => setIsBookOpen(false)} />
    </div>
  );
}