import type { ComponentType, ElementType } from 'react';
import { PROJECTS } from '../projects';
import type { Project, ProjectMeta } from '../../mc/types';
import type { AdvancementNode, AdvancementNodeMeta, AdvancementTab } from '../../mc/advancements';

import Synersight, { meta as synersight } from './synersight.mdx';
import Michelin, { meta as michelin } from './michelin.mdx';
import Diputacion, { meta as diputacion } from './diputacion.mdx';
import Cognizant, { meta as cognizant } from './cognizant.mdx';
import LaMerced, { meta as laMerced } from './la-merced.mdx';
import Galileo, { meta as galileo } from './galileo.mdx';
import JulianMarias, { meta as julianMarias } from './julian-marias.mdx';
import BootcampIa, { meta as bootcampIa } from './bootcamp-ia.mdx';

/**
 * Los .mdx de un proyecto exportan ProjectMeta y los de advancements
 * AdvancementNodeMeta, asi que hay que estrechar antes de usar el meta.
 */
function asNodeMeta(
  meta: ProjectMeta | AdvancementNodeMeta,
  source: string,
): AdvancementNodeMeta {
  if (!('kind' in meta)) {
    throw new Error(`${source}: "${meta.id}" no es un nodo de advancements`);
  }
  return meta;
}

function node(
  Description: ComponentType<{ components?: Record<string, ElementType> }>,
  meta: ProjectMeta | AdvancementNodeMeta,
  source: string,
): AdvancementNode {
  return { ...asNodeMeta(meta, source), Description };
}

const EXPERIENCE: AdvancementNode[] = [
  node(Synersight, synersight, 'synersight.mdx'),
  node(Michelin, michelin, 'michelin.mdx'),
  node(Diputacion, diputacion, 'diputacion.mdx'),
  node(Cognizant, cognizant, 'cognizant.mdx'),
];

const EDUCATION: AdvancementNode[] = [
  node(LaMerced, laMerced, 'la-merced.mdx'),
  node(Galileo, galileo, 'galileo.mdx'),
  node(JulianMarias, julianMarias, 'julian-marias.mdx'),
  node(BootcampIa, bootcampIa, 'bootcamp-ia.mdx'),
];

/**
 * La pestana de proyectos reutiliza el contenido que ya esta en los .mdx de
 * cada proyecto, y el item que lo representa en la mesa de crafteo pasa a ser
 * su icono aqui. El arbol crece hacia la derecha, que es lo que permite la
 * proporcion de la ventana, y el orden es cronologico por fecha del repo.
 */
const PROJECT_LAYOUT: {
  id: string;
  kind: AdvancementNode['kind'];
  x: number;
  y: number;
  parents: string[];
}[] = [
  { id: 'cosmere-archive', kind: 'challenge', x: 28, y: 18, parents: [] },
  { id: 'persona5', kind: 'challenge', x: 84, y: 52, parents: ['cosmere-archive'] },
  { id: 'vault-archive', kind: 'goal', x: 84, y: 86, parents: ['cosmere-archive'] },
  { id: 'euromario', kind: 'task', x: 140, y: 18, parents: ['persona5'] },
  { id: 'repository-library', kind: 'goal', x: 196, y: 52, parents: ['vault-archive'] },
  { id: 'dungeon-archive', kind: 'task', x: 140, y: 86, parents: ['persona5'] },
];

function projectNodes(): AdvancementNode[] {
  return PROJECT_LAYOUT.map(({ id, kind, x, y, parents }) => {
    const project: Project | undefined = PROJECTS.find((p) => p.meta.id === id);
    if (!project) {
      throw new Error(`advancements: el proyecto "${id}" no existe en src/content/projects`);
    }
    return {
      id: project.meta.id,
      title: project.meta.title,
      subtitle: project.meta.tagline,
      period: `${project.meta.year}`,
      kind,
      icon: { item: project.meta.result },
      technologies: project.meta.technologies,
      x,
      y,
      parents,
      Description: project.Description,
    };
  });
}

export const ADVANCEMENT_TABS: AdvancementTab[] = [
  {
    id: 'proyectos',
    label: 'Proyectos',
    background: 'adventure',
    icon: 'blocks/crafting_table_top',
    nodes: projectNodes(),
  },
  {
    id: 'experiencia',
    label: 'Experiencia',
    background: 'stone',
    icon: 'blocks/beacon',
    nodes: EXPERIENCE,
  },
  {
    id: 'educacion',
    label: 'Educación',
    background: 'husbandry',
    icon: 'items/book',
    nodes: EDUCATION,
  },
];
