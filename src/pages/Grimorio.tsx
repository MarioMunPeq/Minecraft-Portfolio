import { useState } from 'react';
import { PROJECTS } from '../data/projects';
import type { Project } from '../data/projects';
import { GrimoireBook } from '../components/grimorio/GrimoireBook';
import { BackButton } from '../components/grimorio/BackButton';

export function Grimorio() {
  const [selectedProject, setSelectedProject] = useState<Project>(PROJECTS[0]);

  return (
    <div className="mc-screen mc-grimorio-screen">
      <div className="mc-grimorio-container">
        <GrimoireBook
          selectedProject={selectedProject}
          onSelectProject={setSelectedProject}
        />
      </div>
      <BackButton />
    </div>
  );
}