import type { RecipeMeta } from './types';

/** La mesa de crafteo tiene siempre 3x3 huecos disponibles. */
export const GRID = 3;

export interface RecipeCell {
  tech: string;
  row: number;
  col: number;
}

export interface ParsedRecipe {
  /** Ancho y alto de la forma, ya recortados a su caja envolvente. */
  width: number;
  height: number;
  /** Celdas con ingredientes, en coordenadas absolutas dentro del 3x3. */
  cells: RecipeCell[];
  /** Todas las coordenadas 3x3, para poder pintar los slots vacios. */
  slots: { row: number; col: number }[];
}

/**
 * Convierte un patron con forma en celdas colocadas dentro del 3x3.
 *
 * Minecraft recorta la receta a su caja envolvente y luego la puede colocar
 * en cualquier hueco del 3x3. Aqui la centramos siempre, que es lo que se ve
 * al fabricar.
 */
export function parseRecipe(recipe: RecipeMeta): ParsedRecipe {
  const rows = recipe.pattern;

  if (rows.length === 0) {
    return { width: 0, height: 0, cells: [], slots: [] };
  }
  if (rows.length > GRID) {
    throw new Error(`La receta tiene ${rows.length} filas y el maximo es ${GRID}`);
  }
  for (const row of rows) {
    if (row.length > GRID) {
      throw new Error(`La receta tiene una fila de ${row.length} y el maximo es ${GRID}`);
    }
  }

  const width = Math.max(...rows.map((r) => r.length));
  const height = rows.length;

  const known = new Set(Object.keys(recipe.key));
  for (const row of rows) {
    for (const char of row) {
      if (char !== ' ' && !known.has(char)) {
        throw new Error(`La receta usa la clave "${char}" que no esta en key`);
      }
    }
  }

  const offsetCol = Math.floor((GRID - width) / 2);
  const offsetRow = Math.floor((GRID - height) / 2);

  const cells: RecipeCell[] = [];
  rows.forEach((row, rowIndex) => {
    for (let colIndex = 0; colIndex < row.length; colIndex++) {
      const char = row[colIndex];
      if (char === ' ') continue;
      cells.push({
        tech: recipe.key[char],
        row: offsetRow + rowIndex,
        col: offsetCol + colIndex,
      });
    }
  });

  const slots: { row: number; col: number }[] = [];
  for (let row = 0; row < GRID; row++) {
    for (let col = 0; col < GRID; col++) {
      slots.push({ row, col });
    }
  }

  return { width, height, cells, slots };
}
