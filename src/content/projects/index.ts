import type { Project } from '../../mc/types';

import Persona5, { meta as persona5 } from './persona5.mdx';
import EuroMario, { meta as euromario } from './euromario.mdx';
import VaultArchive, { meta as vaultArchive } from './vault-archive.mdx';
import DungeonArchive, { meta as dungeonArchive } from './dungeon-archive.mdx';
import RepositoryLibrary, { meta as repositoryLibrary } from './repository-library.mdx';
import CosmereArchive, { meta as cosmereArchive } from './cosmere-archive.mdx';

/**
 * Los .mdx de advancements exportan AdvancementNodeMeta, asi que hay que
 * estrechar antes de usar el meta del proyecto.
 */
function asProjectMeta(meta: unknown, source: string): Project['meta'] {
  if (typeof meta !== 'object' || meta === null || !('recipe' in meta)) {
    throw new Error(`${source}: el contenido no tiene la forma de un proyecto`);
  }
  return meta as Project['meta'];
}

export const PROJECTS: Project[] = [
  { meta: asProjectMeta(persona5, 'persona5.mdx'), Description: Persona5 },
  { meta: asProjectMeta(euromario, 'euromario.mdx'), Description: EuroMario },
  { meta: asProjectMeta(vaultArchive, 'vault-archive.mdx'), Description: VaultArchive },
  { meta: asProjectMeta(dungeonArchive, 'dungeon-archive.mdx'), Description: DungeonArchive },
  { meta: asProjectMeta(repositoryLibrary, 'repository-library.mdx'), Description: RepositoryLibrary },
  { meta: asProjectMeta(cosmereArchive, 'cosmere-archive.mdx'), Description: CosmereArchive },
];

export function findProject(id: string): Project | undefined {
  return PROJECTS.find((project) => project.meta.id === id);
}
