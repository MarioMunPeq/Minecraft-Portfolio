import { useState } from 'react';
import { PROJECTS } from '../../data/projects';
import type { Project } from '../../data/projects';
import { ProjectList } from './ProjectList';
import { ProjectRecipe } from './ProjectRecipe';

export function CraftingStation() {
  const [selectedProject, setSelectedProject] = useState<Project>(PROJECTS[0]);

  return (
    <div className="mc-crafting-container">
      <ProjectList
        selectedProject={selectedProject}
        onSelectProject={setSelectedProject}
      />
      <ProjectRecipe project={selectedProject} />
    </div>
  );
}