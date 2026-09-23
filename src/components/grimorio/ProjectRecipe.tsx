import type { Project } from '../../data/projects';
import { MinecraftSlot } from './MinecraftSlot';

interface ProjectRecipeProps {
  project: Project;
}

export function ProjectRecipe({ project }: ProjectRecipeProps) {
  return (
    <div className="mc-project-recipe">
      <h2 className="mc-page-title">{project.name}</h2>
      
      <div className="mc-project-icon-large">{project.icon}</div>
      
      <h3 className="mc-recipe-label">Receta del proyecto</h3>
      
      <div className="mc-crafting-grid">
        {project.technologies.map((tech, index) => (
          <MinecraftSlot key={`${project.id}-${index}`} technology={tech} size={52} />
        ))}
      </div>
    </div>
  );
}