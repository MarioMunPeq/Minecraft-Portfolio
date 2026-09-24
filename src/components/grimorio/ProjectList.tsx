import { useState } from 'react';
import { PROJECTS } from '../../data/projects';
import type { Project } from '../../data/projects';
import { MinecraftTooltip } from './MinecraftTooltip';
import { IconImage } from './IconImage';
import { guiUrl } from './guiUrl';
import { useAudio } from '../../audio/AudioContext';

interface ProjectListProps {
  selectedProject: Project;
  onSelectProject: (project: Project) => void;
}

function slotLeft(index: number): string {
  return `calc(${8 + index * 18}px * var(--gui-scale))`;
}

export function ProjectList({ selectedProject, onSelectProject }: ProjectListProps) {
  const [query, setQuery] = useState('');
  const { playClick, playPop } = useAudio();
  const normalized = query.trim().toLowerCase();
  const filtered = PROJECTS.filter((project) =>
    project.name.toLowerCase().includes(normalized),
  );
  const selectedIndex = filtered.findIndex((project) => project.id === selectedProject.id);

  const handleSelect = (project: Project) => {
    playClick();
    playPop();
    onSelectProject(project);
  };

  return (
    <div className="mc-panel mc-panel-left">
      <input
        className="mc-search-input"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Buscar..."
        spellCheck={false}
        aria-label="Buscar proyectos"
      />

      {filtered.map((project, index) => (
        <button
          key={project.id}
          type="button"
          className="mc-slot-btn"
          style={{ left: slotLeft(index), top: 'calc(17px * var(--gui-scale))' }}
          onClick={() => handleSelect(project)}
          aria-label={project.name}
        >
          <img
            className="mc-slot-hover"
            src={guiUrl('gui/sprites/container/slot_highlight_front.png')}
            alt=""
            aria-hidden
          />
          <MinecraftTooltip text={`${project.name} — ${project.description}`}>
            <IconImage name={project.icon} className="mc-slot-glyph" />
          </MinecraftTooltip>
        </button>
      ))}

      {selectedIndex >= 0 && (
        <img
          className="mc-slot-highlight-selected"
          src={guiUrl('gui/sprites/container/slot_highlight_back.png')}
          alt=""
          style={{
            left: slotLeft(selectedIndex),
            top: 'calc(14px * var(--gui-scale))',
          }}
        />
      )}

      {filtered.length === 0 && (
        <span className="mc-no-results">Sin resultados</span>
      )}
    </div>
  );
}