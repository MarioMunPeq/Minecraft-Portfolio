import type { AdvancementNode } from '../../mc/advancements';
import { guiUrl } from '../crafting-table/guiUrl';

/**
 * Todos los nodos usan un item real de Minecraft: se eligio uno que cuenta
 * algo del puesto o de la titulacion, en lugar del logo de la empresa.
 */
export function nodeIconUrl(node: AdvancementNode): string {
  return guiUrl(`assets/mc/${node.icon.item}.png`);
}
