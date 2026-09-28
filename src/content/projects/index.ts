import type { Project } from '../../mc/types';

import Persona5, { meta as persona5 } from './persona5.mdx';
import EuroMario, { meta as euromario } from './euromario.mdx';
import VaultArchive, { meta as vaultArchive } from './vault-archive.mdx';
import DungeonArchive, { meta as dungeonArchive } from './dungeon-archive.mdx';
import RepositoryLibrary, { meta as repositoryLibrary } from './repository-library.mdx';
import CosmereArchive, { meta as cosmereArchive } from './cosmere-archive.mdx';

export const PROJECTS: Project[] = [
  { meta: persona5, Description: Persona5 },
  { meta: euromario, Description: EuroMario },
  { meta: vaultArchive, Description: VaultArchive },
  { meta: dungeonArchive, Description: DungeonArchive },
  { meta: repositoryLibrary, Description: RepositoryLibrary },
  { meta: cosmereArchive, Description: CosmereArchive },
];

export function findProject(id: string): Project | undefined {
  return PROJECTS.find((project) => project.meta.id === id);
}
