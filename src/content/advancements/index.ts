import type { ComponentType, ElementType } from 'react';
import type { ProjectMeta } from '../../mc/types';
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
 * AdvancementNodeMeta, asi que hay que estrechar antes de usar el meta. Los
 * proyectos ya no salen aqui: viven en la mesa de crafteo.
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

/* Los dos arboles van encadenados por los parents de cada .mdx: experiencia
   de mas antiguo a mas nuevo, y despues la formacion, en el mismo orden en el
   que se hizo. */

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

export const ADVANCEMENT_TABS: AdvancementTab[] = [
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
