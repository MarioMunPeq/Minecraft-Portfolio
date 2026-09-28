// Comprueba que los ficheros de contenido no han sufferdo corrupcion de
// codificacion al generarlos.
//
// Uso: node scripts/check-encoding.mjs
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DIRS = ['src/content', 'src/mc', 'src/components', 'src/pages', 'src/data'];

// Caracteres permitidos: ASCII, mas el abecedario espanol y su puntuacion.
const ALLOWED = new Set([...'áéíóúüñÁÉÍÓÚÜÑ¡¿«»·–—’']);

function walk(dir) {
  const out = [];
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      out.push(...walk(full));
    } else if (['.mdx', '.ts', '.tsx', '.css', '.html', '.md'].includes(extname(entry))) {
      out.push(full);
    }
  }
  return out;
}

let problems = 0;

for (const dir of DIRS) {
  for (const file of walk(join(ROOT, dir))) {
    const text = readFileSync(file, 'utf8');
    text.split('\n').forEach((line, i) => {
      for (const char of line) {
        if (char === '\t' || char === '\n' || char === '\r') continue;
        if (char.charCodeAt(0) < 128) continue;
        if (ALLOWED.has(char)) continue;
        problems++;
        console.log(
          `${relative(ROOT, file)}:${i + 1}  caracter inesperado U+${char
            .codePointAt(0)
            .toString(16)
            .toUpperCase()
            .padStart(4, '0')}  "${char}"`,
        );
        console.log(`    ${line.trim()}`);
      }
    });
  }
}

if (problems === 0) {
  console.log('codificacion correcta en todo el contenido');
} else {
  console.log(`\n${problems} caracteres sospechosos`);
  process.exitCode = 1;
}
