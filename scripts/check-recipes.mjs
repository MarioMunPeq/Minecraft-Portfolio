// Verifica que las recetas de los proyectos son validas y encajan en el 3x3.
//
// Uso: node --experimental-strip-types scripts/check-recipes.mjs
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { parseRecipe, GRID } from '../src/mc/recipe.ts';
import { TECH_ITEMS, RESULT_ITEMS } from '../src/mc/techs.ts';
import { FALLBACK_ITEM } from '../src/mc/techs.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECTS_DIR = join(__dirname, '..', 'src', 'content', 'projects');

const problems = [];
const resultItemsUsed = new Map();

for (const file of readdirSync(PROJECTS_DIR).filter((f) => f.endsWith('.mdx'))) {
  const text = readFileSync(join(PROJECTS_DIR, file), 'utf8');
  const start = text.indexOf('export const meta');
  if (start === -1) {
    problems.push(`${file}: no encuentra "export const meta"`);
    continue;
  }

  // El bloque meta es JS literal: se evalua en un scope aislado.
  const end = text.indexOf('\n\n', text.indexOf('};', start));
  const block = text.slice(start, end > 0 ? end : undefined);
  const code = block.replace('export const meta =', 'return');
  let meta;
  try {
    meta = new Function(code)();
  } catch (error) {
    problems.push(`${file}: no se puede leer el meta (${error.message})`);
    continue;
  }

  if (meta.id !== file.replace('.mdx', '')) {
    problems.push(`${file}: id "${meta.id}" no coincide con el nombre del fichero`);
  }

  let parsed;
  try {
    parsed = parseRecipe(meta.recipe);
  } catch (error) {
    problems.push(`${file}: ${error.message}`);
    continue;
  }

  // Sin ingredientes repetidos dentro de la misma receta.
  const techs = parsed.cells.map((c) => c.tech);
  const dupes = techs.filter((t, i) => techs.indexOf(t) !== i);
  if (dupes.length > 0) {
    problems.push(`${file}: ingredientes repetidos en la receta: ${[...new Set(dupes)].join(', ')}`);
  }

  // Los ingredientes repetidos implicarian dos items iguales en la mesa.
  const items = techs.map((t) => TECH_ITEMS[t]);
  const dupeItems = items.filter((t, i) => items.indexOf(t) !== i);
  if (dupeItems.length > 0) {
    problems.push(`${file}: dos tecnologias distintas comparten item: ${[...new Set(dupeItems)].join(', ')}`);
  }

  // El stack completo no puede pasar los 9 huecos del inventario.
  if (meta.technologies.length > 9) {
    problems.push(`${file}: ${meta.technologies.length} tecnologias, el inventario solo tiene 9 huecos`);
  }

  for (const tech of meta.technologies) {
    if (!(tech in TECH_ITEMS)) {
      problems.push(`${file}: "${tech}" no esta en TECH_ITEMS (usaria ${FALLBACK_ITEM})`);
    }
  }

  if (RESULT_ITEMS[meta.id] !== meta.result) {
    problems.push(`${file}: el item de resultado "${meta.result}" no coincide con RESULT_ITEMS ("${RESULT_ITEMS[meta.id]}")`);
  }

  // Los items de resultado deben ser unicos por proyecto.
  if (resultItemsUsed.has(meta.result)) {
    problems.push(`el resultado "${meta.result}" esta repetido en ${file} y en ${resultItemsUsed.get(meta.result)}`);
  }
  resultItemsUsed.set(meta.result, file);

  const art = [0, 1, 2]
    .map((row) =>
      [0, 1, 2]
        .map((col) => parsed.cells.find((c) => c.row === row && c.col === col)?.tech ?? '·')
        .map((t) => t.slice(0, 4).padEnd(5))
        .join(''),
    )
    .join('\n' + ' '.repeat(20));
  console.log(
    `${meta.id.padEnd(20)} ${parsed.width}x${parsed.height}  ${techs.length} ingredientes\n${' '.repeat(20)}${art}`,
  );
}

console.log(`\nrejilla maxima: ${GRID}x${GRID}`);

if (problems.length > 0) {
  console.log(`\n${problems.length} problemas:`);
  for (const p of problems) console.log(`  ${p}`);
  process.exitCode = 1;
} else {
  console.log('todas las recetas son validas');
}
