import type { AdvancementNode } from '../../mc/advancements';
import { guiUrl } from '../crafting-table/guiUrl';

/**
 * Un nodo usa un icono dibujado a mano (empresas, centros) o el item real de
 * Minecraft con el que el proyecto se fabrica en la mesa de crafteo.
 */
export function nodeIconUrl(node: AdvancementNode): string {
  return typeof node.icon === 'string'
    ? guiUrl(`icons/${node.icon}.png`)
    : guiUrl(`assets/mc/${node.icon.item}.png`);
}
