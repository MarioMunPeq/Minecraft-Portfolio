import { useMemo, useState } from 'react';
import { PROJECTS } from '../../content/projects';
import type { Project } from '../../mc/types';
import { ItemSprite } from './ItemSprite';
import { Slot } from './Slot';
import { useAudio } from '../../audio/AudioContext';

interface ProjectListProps {
  selectedProject: Project;
  onSelectProject: (project: Project) => void;
  hoveredSlotId: string | null;
  hoverPosition: { x: number; y: number } | null;
  onHover: (id: string | null, position?: { x: number; y: number }) => void;
}

export function ProjectList({
  selectedProject,
  onSelectProject,
  hoveredSlotId,
  hoverPosition,
  onHover,
}: ProjectListProps) {
  const { playClick, playPop } = useAudio();
  const [query, setQuery] = useState('');

  const visibleProjects = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (needle === '') return PROJECTS;
    return PROJECTS.filter(({ meta }) =>
      `${meta.title} ${meta.tagline} ${meta.technologies.join(' ')}`
        .toLowerCase()
        .includes(needle),
    );
  }, [query]);

  const handleSelect = (project: Project) => {
    if (project.meta.id === selectedProject.meta.id) return;
    playClick();
    playPop();
    onSelectProject(project);
  };

  return (
    <div className="mc-panel mc-panel-left">
      <input
        className="mc-search-input"
        type="text"
        placeholder="Buscar proyectos..."
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        spellCheck={false}
        aria-label="Buscar proyectos"
      />

      <div className="mc-project-grid" role="listbox" aria-label="Proyectos disponibles">
        {visibleProjects.map((project) => {
          const isSelected = project.meta.id === selectedProject.meta.id;
          const slotId = `project-${project.meta.id}`;
          const isHovered = hoveredSlotId === slotId;

          return (
            <Slot
              key={project.meta.id}
              id={slotId}
              className={`mc-project-slot${isSelected ? ' mc-project-slot-selected' : ''}`}
              isHovered={isHovered}
              hoverPosition={isHovered ? (hoverPosition ?? undefined) : undefined}
              onHover={onHover}
              onClick={() => handleSelect(project)}
              tooltip={project.meta.title}
              aria-label={project.meta.title}
              aria-pressed={isSelected}
            >
              <ItemSprite item={project.meta.result} />
            </Slot>
          );
        })}
      </div>

      {visibleProjects.length === 0 && (
        <p className="mc-no-results">Sin resultados para «{query}»</p>
      )}
    </div>
  );
}
