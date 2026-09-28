import { useState } from 'react';
import { PROJECTS } from '../../content/projects';
import type { Project } from '../../mc/types';
import { useAudio } from '../../audio/AudioContext';
import { ProjectList } from './ProjectList';
import { RecipeGrid } from './RecipeGrid';
import { ResultSlot } from './ResultSlot';
import { InventoryGrid } from './InventoryGrid';
import { ChestModal } from './ChestModal';

export function CraftingStation() {
  const { playClick, playLevelup } = useAudio();
  const [selectedProject, setSelectedProject] = useState<Project>(PROJECTS[0]);
  const [hoveredSlotId, setHoveredSlotId] = useState<string | null>(null);
  const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number } | null>(null);
  const [isChestOpen, setIsChestOpen] = useState(false);
  const [isResultReady, setIsResultReady] = useState(false);

  const hover = (id: string | null, position?: { x: number; y: number }) => {
    setHoveredSlotId(id);
    setHoverPosition(position ?? null);
  };

  const handleSelect = (project: Project) => {
    setSelectedProject(project);
    setIsResultReady(false);
  };

  const handleTake = () => {
    if (!isResultReady) return;
    playClick();
    playLevelup();
    setIsChestOpen(true);
  };

  const handleRevealEnd = () => {
    setIsResultReady(true);
  };

  return (
    <div className="mc-crafting-container">
      <ProjectList
        selectedProject={selectedProject}
        onSelectProject={handleSelect}
        hoveredSlotId={hoveredSlotId}
        hoverPosition={hoverPosition}
        onHover={hover}
      />

      <div className="mc-panel mc-panel-right" aria-label="Mesa de crafteo">
        <RecipeGrid
          key={selectedProject.meta.id}
          project={selectedProject}
          hoveredSlotId={hoveredSlotId}
          hoverPosition={hoverPosition}
          onHover={hover}
          onRevealEnd={handleRevealEnd}
        />

        <ResultSlot
          project={selectedProject}
          isReady={isResultReady}
          hoveredSlotId={hoveredSlotId}
          hoverPosition={hoverPosition}
          onHover={hover}
          onTake={handleTake}
        />

        <InventoryGrid
          project={selectedProject}
          hoveredSlotId={hoveredSlotId}
          hoverPosition={hoverPosition}
          onHover={hover}
        />
      </div>

      <ChestModal
        project={selectedProject}
        isOpen={isChestOpen}
        onClose={() => setIsChestOpen(false)}
      />
    </div>
  );
}
