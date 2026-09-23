import { PROJECTS } from '../../data/projects';
import type { Project } from '../../data/projects';

interface ProjectListProps {
  selectedProject: Project;
  onSelectProject: (project: Project) => void;
}

export function ProjectList({ selectedProject, onSelectProject }: ProjectListProps) {
  return (
    <div className="mc-project-list">
      <h2 className="mc-page-title">RECETAS</h2>
      <div className="mc-project-items">
        {PROJECTS.map((project) => (
          <button
            key={project.id}
            className={`mc-project-item ${project.id === selectedProject.id ? 'selected' : ''}`}
            onClick={() => onSelectProject(project)}
            tabIndex={0}
            role="listitem"
            aria-selected={project.id === selectedProject.id}
          >
            <span className="mc-project-icon">{project.icon}</span>
            <span className="mc-project-name">{project.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}