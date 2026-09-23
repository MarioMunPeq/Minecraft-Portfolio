import { GrimoirePage } from './GrimoirePage';
import { ProjectList } from './ProjectList';
import { ProjectRecipe } from './ProjectRecipe';
import type { Project } from '../../data/projects';

interface GrimoireBookProps {
  selectedProject: Project;
  onSelectProject: (project: Project) => void;
}

export function GrimoireBook({ selectedProject, onSelectProject }: GrimoireBookProps) {
  return (
    <div className="mc-grimoire-book">
      <div className="mc-book-spine" />
      
      <GrimoirePage side="left">
        <ProjectList
          selectedProject={selectedProject}
          onSelectProject={onSelectProject}
        />
      </GrimoirePage>
      
      <GrimoirePage side="right">
        <ProjectRecipe project={selectedProject} />
      </GrimoirePage>
    </div>
  );
}