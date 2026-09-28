import { useState } from 'react';
import { PROJECTS } from '../../data/projects';
import type { Project } from '../../data/projects';
import { ProjectList } from './ProjectList';
import { ProjectRecipe } from './ProjectRecipe';

export function CraftingStation() {
  const [selectedProject, setSelectedProject] = useState<Project>(PROJECTS[0]);
  const [hoveredSlotId, setHoveredSlotId] = useState<string | null>(null);
  const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number } | null>(null);

  const handleHover = (id: string | null, position?: { x: number; y: number }) => {
    setHoveredSlotId(id);
    setHoverPosition(position ?? null);
  };

  return (
    <div className="mc-crafting-container">
      <ProjectList
        selectedProject={selectedProject}
        onSelectProject={setSelectedProject}
        hoveredSlotId={hoveredSlotId}
        hoverPosition={hoverPosition}
        onHover={handleHover}
      />
      <ProjectRecipe
        project={selectedProject}
        hoveredSlotId={hoveredSlotId}
        hoverPosition={hoverPosition}
        onHover={handleHover}
      />
    </div>
  );
}