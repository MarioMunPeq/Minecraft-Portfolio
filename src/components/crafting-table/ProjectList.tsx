import { PROJECTS } from '../../data/projects';
import type { Project } from '../../data/projects';
import { IconImage } from './IconImage';
import { Slot } from './Slot';
import { useAudio } from '../../audio/AudioContext';

interface ProjectListProps {
  selectedProject: Project;
  onSelectProject: (project: Project) => void;
  hoveredSlotId: string | null;
  hoverPosition: { x: number; y: number } | null;
  onHover: (id: string | null, position?: { x: number; y: number }) => void;
}

const CRAFTABLE_PROJECTS = PROJECTS.slice(0, 4);

export function ProjectList({
  selectedProject,
  onSelectProject,
  hoveredSlotId,
  hoverPosition,
  onHover,
}: ProjectListProps) {
  const { playClick, playPop } = useAudio();

  const handleSelect = (project: Project) => {
    playClick();
    playPop();
    onSelectProject(project);
  };

  return (
    <div className="mc-panel mc-panel-left" aria-label="Búsqueda de proyectos">
      <input
        className="mc-search-input"
        placeholder="Buscar proyectos..."
        spellCheck={false}
        aria-label="Buscar proyectos"
      />

      <div className="mc-project-grid" aria-label="Proyectos disponibles">
        {CRAFTABLE_PROJECTS.map((project) => {
          const isSelected = project.id === selectedProject.id;
          const slotId = `project-${project.id}`;
          const isHovered = hoveredSlotId === slotId;

          return (
            <Slot
              key={project.id}
              id={slotId}
              isSelected={isSelected}
              isHovered={isHovered}
              hoverPosition={isHovered ? hoverPosition ?? undefined : undefined}
              onHover={onHover}
              onClick={() => handleSelect(project)}
              aria-label={project.name}
              aria-pressed={isSelected}
              className={`mc-project-slot${isSelected ? ' mc-project-slot-selected' : ''}`}
            >
              <IconImage name={project.icon} className="mc-slot-glyph" alt={project.name} />
            </Slot>
          );
        })}
      </div>
    </div>
  );
}