import type { ComponentType } from 'react';

/**
 * Receta con forma, al estilo de Minecraft: cada caracter del patron es una
 * clave del mapa `key` y el espacio es un slot vacio.
 *
 *   pattern: ['RT ', ' T ']
 *   key: { R: 'React', T: 'TypeScript' }
 */
export interface RecipeMeta {
  pattern: string[];
  key: Record<string, string>;
}

export interface ProjectMeta {
  id: string;
  title: string;
  /** Una linea, aparece como subtitulo en el cofre y en el tooltip del item. */
  tagline: string;
  year: number;
  status: 'activo' | 'archivado';
  demo: string;
  repo: string;
  /** Item de Minecraft que representa el proyecto ya fabricado. */
  result: string;
  /** Stack completo. La receta es solo el subconjunto que mejor lo cuenta. */
  technologies: string[];
  recipe: RecipeMeta;
}

export interface Project {
  meta: ProjectMeta;
  Description: ComponentType;
}
