// Extrae texturas de Minecraft del jar del juego a public/assets/mc/.
//
// Uso:
//   node scripts/extract-assets.mjs [--jar <ruta>] [--out <ruta>] [--listar]
//
// El script NO se ejecuta en CI: los assets que produce se commitean en
// public/assets/mc/ y el build de GitHub Pages solo los consume.
//
// Orden de busqueda del jar:
//   1. --jar <ruta>
//   2. variable de entorno MC_JAR
//   3. %APPDATA%/.minecraft/versions/<version>/<version>.jar (la mas reciente)
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { inflateRawSync } from 'node:zlib';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

/* ------------------------------------------------------------------------ */
/* Allowlist: que se extrae del jar.                                       */
/* ------------------------------------------------------------------------ */

// Ingredientes del mapeo tecnologia -> item de Minecraft (visto en el plan),
// mas una base amplia para poder reasignar una receta sin re-ejecutar esto.
const ITEMS = [
  // --- mapeo de las recetas ---
  'redstone', // TypeScript / GitHub Actions
  'brewing_stand', // React
  'flint_and_steel', // Vite
  'book', // HTML
  'brush', // CSS
  'comparator', // JavaScript
  'ender_eye', // Git
  'chain', // GitHub
  'string', // Tailwind
  'blaze_rod', // Firebase
  'cauldron', // Python
  'paper', // RSS / articulos
  'amethyst_shard', // IA
  'bundle', // Docker
  'elytra', // Motion
  // --- base amplia: alternativas y decoracion ---
  'iron_ingot',
  'gold_ingot',
  'copper_ingot',
  'netherite_ingot',
  'iron_nugget',
  'diamond',
  'emerald',
  'lapis_lazuli',
  'quartz',
  'honeycomb',
  'honey_bottle',
  'slime_ball',
  'ender_pearl',
  'blaze_powder',
  'echo_shard',
  'shulker_shell',
  'name_tag',
  'lead',
  'saddle',
  'armor_stand',
  'item_frame',
  'glow_item_frame',
  'spyglass',
  'shears',
  'flint',
  'feather',
  'bone',
  'ink_sac',
  'glow_ink_sac',
  'leather',
  'armadillo_scute',
  'turtle_scute',
  'experience_bottle',
  'glass_bottle',
  'writable_book',
  'written_book',
  'enchanted_book',
  'knowledge_book',
  'cookie',
  'apple',
  'golden_apple',
  'bowl',
  'totem_of_undying',
  'heart_of_the_sea',
  'nautilus_shell',
  'prismarine_shard',
  'clay_ball',
  'brick',
  'nether_brick',
  'egg',
  'fire_charge',
  'music_disc_cat',
];

// Bloques: los "items de bloque" son ingredientes validos en Minecraft
// (un cofre, un yunque, una nota), asi que se mezclan con los items.
const BLOCKS = [
  // --- crafteo, cofre, aldeano, verbos ---
  'crafting_table_top',
  'crafting_table_side',
  'enchanting_table_top',
  'enchanting_table_side',
  'lectern_top',
  'lectern_front',
  'lectern_sides',
  'smithing_table_top',
  'note_block',
  'anvil_top',
  'grindstone_side',
  'stonecutter_side',
  'crafter_north',
  'tnt_top',
  'target_top',
  'barrel_side',
  'bookshelf',
  'redstone_torch',
  'dragon_egg',
  // --- decoracion / ventanas ---
  'redstone_block',
  'emerald_block',
  'lapis_block',
  'amethyst_block',
  'dirt',
  'stone',
  'oak_planks',
  'grass_block_side',
  'lantern',
  'soul_lantern',
  'beacon',
  'hopper_inside',
  'observer_side',
  'dispenser_front',
  'piston_top',
];

// Entidades: chests 3D y las skins que usa la pantalla de jugador.
const ENTITIES = [
  'chest/normal',
  'chest/trapped',
  'player/wide/steve',
  'player/wide/alex',
  'player/slim/alex',
  'villager/villager',
];

// Particulas: se usan como sprites sueltos (sin animacion) en decoracion.
const PARTICLES = [
  'flame',
  'heart',
  'critical_hit',
  'note', // feedback de trade del aldeano
  'enchanted_hit',
  'glint',
  'soul_fire_flame',
  'angry',
  'flash',
];

const GROUPS = [
  { dir: 'items', prefix: 'item/', names: ITEMS },
  { dir: 'blocks', prefix: 'block/', names: BLOCKS },
  { dir: 'entities', prefix: 'entity/', names: ENTITIES },
  { dir: 'particles', prefix: 'particle/', names: PARTICLES },
];

/* ------------------------------------------------------------------------ */
/* Lector de ZIP minimo (sin dependencias)                                 */
/* ------------------------------------------------------------------------ */

const SIG_EOCD = 0x06054b50;
const SIG_CENTRAL = 0x02014b50;
const SIG_LOCAL = 0x04034b50;

function findEocd(buf) {
  const min = Math.max(0, buf.length - 0xffff - 22);
  for (let i = buf.length - 22; i >= min; i--) {
    if (buf.readUInt32LE(i) === SIG_EOCD) return i;
  }
  return -1;
}

function readZip(buf) {
  const eocd = findEocd(buf);
  if (eocd === -1) throw new Error('ZIP invalido: no se encuentra el registro EOCD');

  const total = buf.readUInt16LE(eocd + 10);
  let ptr = buf.readUInt32LE(eocd + 16);
  const entries = new Map();

  for (let i = 0; i < total; i++) {
    if (buf.readUInt32LE(ptr) !== SIG_CENTRAL) {
      throw new Error(`ZIP invalido: cabecera central corrupta en la entrada ${i}`);
    }
    const method = buf.readUInt16LE(ptr + 10);
    const compressedSize = buf.readUInt32LE(ptr + 20);
    const nameLen = buf.readUInt16LE(ptr + 28);
    const extraLen = buf.readUInt16LE(ptr + 30);
    const commentLen = buf.readUInt16LE(ptr + 32);
    const localOffset = buf.readUInt32LE(ptr + 42);
    const name = buf.toString('utf8', ptr + 46, ptr + 46 + nameLen);

    entries.set(name, { method, compressedSize, localOffset });
    ptr += 46 + nameLen + extraLen + commentLen;
  }

  return entries;
}

function readZipEntry(buf, entry) {
  const { localOffset } = entry;
  if (buf.readUInt32LE(localOffset) !== SIG_LOCAL) {
    throw new Error('ZIP invalido: cabecera local corrupta');
  }
  const nameLen = buf.readUInt16LE(localOffset + 26);
  const extraLen = buf.readUInt16LE(localOffset + 28);
  const start = localOffset + 30 + nameLen + extraLen;
  const data = buf.subarray(start, start + entry.compressedSize);

  if (entry.method === 0) return data;
  if (entry.method === 8) return inflateRawSync(data);
  throw new Error(`Metodo de compresion no soportado: ${entry.method}`);
}

/* ------------------------------------------------------------------------ */
/* Localizacion del jar                                                    */
/* ------------------------------------------------------------------------ */

function parseArgs(argv) {
  const args = { jar: null, out: null, listar: false };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--jar') args.jar = argv[++i];
    else if (argv[i] === '--out') args.out = argv[++i];
    else if (argv[i] === '--listar') args.listar = true;
  }
  return args;
}

// Compara nombres de version tipo 1.21.8, 25w31a, 26.2 de forma estable.
function versionKey(name) {
  const nums = name.match(/\d+/g) ?? ['0'];
  return nums.map((n) => n.padStart(6, '0')).join('.');
}

function findJar() {
  if (process.env.MC_JAR) return resolve(process.env.MC_JAR);

  const appData = process.env.APPDATA;
  if (!appData) return null;
  const versionsDir = join(appData, '.minecraft', 'versions');
  if (!existsSync(versionsDir)) return null;

  const candidates = [];
  for (const entry of readdirSync(versionsDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const jar = join(versionsDir, entry.name, `${entry.name}.jar`);
    if (existsSync(jar)) {
      candidates.push({ name: entry.name, jar, key: versionKey(entry.name) });
    }
  }
  if (candidates.length === 0) return null;

  candidates.sort((a, b) => (a.key < b.key ? 1 : -1));
  return candidates[0].jar;
}

/* ------------------------------------------------------------------------ */
/* Extraccion                                                               */
/* ------------------------------------------------------------------------ */

const args = parseArgs(process.argv.slice(2));
const outRoot = args.out ? resolve(args.out) : join(ROOT, 'public', 'assets', 'mc');
const jarPath = args.jar ? resolve(args.jar) : findJar();

const wanted = new Map(); // ruta en el zip -> ruta de salida relativa
for (const group of GROUPS) {
  for (const name of new Set(group.names)) {
    const zipPath = `assets/minecraft/textures/${group.prefix}${name}.png`;
    wanted.set(zipPath, `${group.dir}/${name}.png`);
  }
}

if (args.listar) {
  for (const [zipPath, outPath] of [...wanted].sort()) {
    console.log(`${zipPath} -> ${outPath}`);
  }
  console.log(`\n${wanted.size} texturas en la allowlist`);
  process.exit(0);
}

if (!jarPath) {
  console.error(
    'No se encuentra el jar de Minecraft.\n' +
      'Opciones: pasa --jar <ruta> o define la variable de entorno MC_JAR.',
  );
  process.exit(1);
}
if (!existsSync(jarPath)) {
  console.error(`El jar no existe: ${jarPath}`);
  process.exit(1);
}

const jar = readFileSync(jarPath);
const entries = readZip(jar);

let written = 0;
const missing = [];

for (const [zipPath, outPath] of wanted) {
  const entry = entries.get(zipPath);
  if (!entry) {
    missing.push(outPath);
    continue;
  }
  const dest = join(outRoot, outPath);
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, readZipEntry(jar, entry));
  written++;
}

const manifest = {
  source: basename(jarPath),
  extracted: written,
  groups: Object.fromEntries(
    GROUPS.map((g) => [g.dir, [...new Set(g.names)].length]),
  ),
  files: [...wanted.values()].sort(),
};
writeFileSync(join(outRoot, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);

console.log(`jar:    ${jarPath}`);
console.log(`destino: ${outRoot}`);
console.log(`extraidas: ${written}/${wanted.size}`);

if (missing.length > 0) {
  console.log(`\nNO ENCONTRADAS (${missing.length}):`);
  for (const m of missing) console.log(`  ${m}`);
  process.exitCode = 1;
}
