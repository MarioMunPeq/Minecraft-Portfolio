import type { ComponentType, ElementType } from 'react';

export type AdvancementKind = 'task' | 'goal' | 'challenge';

/** Item real de Minecraft, con su ruta dentro de public/assets/mc/. */
export interface AdvancementIcon {
  item: string;
}

export interface AdvancementNodeMeta {
  id: string;
  title: string;
  /** Rol o contexto, en una linea. */
  subtitle: string;
  period: string;
  /** task y goal comparten frame; challenge es el grande. */
  kind: AdvancementKind;
  icon: AdvancementIcon;
  technologies: string[];
  /** Coordenadas dentro del lienzo de la pestana. */
  x: number;
  y: number;
  /** Nodos de los que cuelga este, para dibujar las lineas. */
  parents: string[];
}

export interface AdvancementNode extends AdvancementNodeMeta {
  Description: ComponentType<{ components?: Record<string, ElementType> }>;
}

export type AdvancementBackground = 'stone' | 'nether' | 'end' | 'adventure' | 'husbandry';

export interface AdvancementTab {
  id: string;
  label: string;
  background: AdvancementBackground;
  /** Item que identifica la seccion en su pestaña. */
  icon: string;
  nodes: AdvancementNode[];
}

/** Lienzo virtual de cada arbol. La ventana lo muestra recortado y se mueve. */
export const CANVAS_W = 480;
export const CANVAS_H = 480;

/** Media anchura de un frame de 26x26. */
export const NODE_SIZE = 26;

/** Ancho en pixeles de textura del area util de la ventana de advancements. */
export const CONTENT_W = 224;

/**
 * Escala maxima del arbol. Con 3 los nodos siguen siendo grandes y el arbol
 * cabe a la derecha de las pestanas sin quedar debajo de ellas.
 */
export const MAX_SCALE = 3;

export interface TreeBounds {
  minX: number;
  minY: number;
  w: number;
  h: number;
}

/** Caja que ocupa el arbol de una pestana, contando el tamano de los frames. */
export function boundsFor(tab: AdvancementTab): TreeBounds {
  if (tab.nodes.length === 0) return { minX: 0, minY: 0, w: CONTENT_W, h: 1 };
  const half = NODE_SIZE / 2;
  const minX = Math.min(...tab.nodes.map((n) => n.x - half));
  const maxX = Math.max(...tab.nodes.map((n) => n.x + half));
  const minY = Math.min(...tab.nodes.map((n) => n.y - half));
  const maxY = Math.max(...tab.nodes.map((n) => n.y + half));
  return { minX, minY, w: maxX - minX, h: maxY - minY };
}

export function nodeById(tab: AdvancementTab, id: string): AdvancementNode | undefined {
  return tab.nodes.find((node) => node.id === id);
}
