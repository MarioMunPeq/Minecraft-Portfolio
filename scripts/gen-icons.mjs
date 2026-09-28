// Generador de iconos pixel art 16x16 para tecnologías, proyectos y timeline.
// Uso: node scripts/gen-icons.mjs
import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT = join(ROOT, 'public', 'icons');
const MINECRAFT_GUI = join(ROOT, 'public', 'gui');

mkdirSync(OUT, { recursive: true });

/* ----------------------------- PNG encoder ----------------------------- */
const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([len, typeBuf, data, crc]);
}

function encodePNG(width, height, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0;
    for (let x = 0; x < width; x++) {
      const s = (y * width + x) * 4;
      const d = y * (width * 4 + 1) + 1 + x * 4;
      raw[d] = rgba[s];
      raw[d + 1] = rgba[s + 1];
      raw[d + 2] = rgba[s + 2];
      raw[d + 3] = rgba[s + 3];
    }
  }
  const idat = deflateSync(raw, { level: 9 });
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))]);
}

/* --------------------------- Palette helpers --------------------------- */
const K = [22, 19, 28];

/* ------------------------------ Icon list ------------------------------ */
const ICONS = {};

const ERRORS = [];

function add(name, palette, rows) {
  if (rows.length !== 16) {
    ERRORS.push(`${name}: se esperaban 16 filas, hay ${rows.length}`);
    return;
  }
  for (let i = 0; i < rows.length; i++) {
    if (rows[i].length !== 16) {
      ERRORS.push(`${name} fila ${i}: longitud ${rows[i].length} != 16 -> "${rows[i]}"`);
      continue;
    }
    for (const ch of rows[i]) {
      if (ch !== '.' && !(ch in palette)) {
        ERRORS.push(`${name} fila ${i}: caracter inválido "${ch}" -> "${rows[i]}"`);
      }
    }
  }
  ICONS[name] = { palette, rows };
}

// Genera un badge cuadrado con una letra/símbolo centrado.
// 'letter' son 5 filas de igual ancho (<=10); '.' se rellena con el color de fondo.
function badge(fill, letter) {
  const width = letter[0].length;
  if (width > 10) throw new Error('badge: la letra no cabe (max 10)');
  for (const line of letter) {
    if (line.length !== width) throw new Error('badge: filas de distinto ancho');
  }
  const pad = 10 - width;
  const left = Math.floor(pad / 2);
  const right = pad - left;
  const B = '.'.repeat(16);
  const blank = fill.repeat(10);
  const rows = [B, B, '.kkkkkkkkkkkk...', '.k' + blank + 'k...', '.k' + blank + 'k...'];
  for (const line of letter) {
    const inner = fill.repeat(left) + line.replace(/\./g, fill) + fill.repeat(right);
    rows.push('.k' + inner + 'k...');
  }
  rows.push('.k' + blank + 'k...', '.k' + blank + 'k...', '.k' + blank + 'k...', '.kkkkkkkkkkkk...', B, B);
  return rows;
}

/* --------------------------------- Java --------------------------------- */
add('java', {
  k: K,
  w: [247, 245, 243],
  r: [224, 80, 58],
  b: [60, 111, 216],
  s: [170, 193, 234],
  g: [201, 197, 191],
}, [
  '................',
  '.......ss.......',
  '......s..s......',
  '.....s....s.....',
  '.....bbbbbbb....',
  '....bwwwwwwb....',
  '...bwwwwwwwwb...',
  '..bwwrrrrrrwbb..',
  '..bwwrrrrrrwbb..',
  '..bwwrrrrrrwbb..',
  '..bwwwwwwwwwb...',
  '...bwwwwwwwb....',
  '...bbwwwwwbb....',
  '....bbggggb.....',
  '.....bbbb.......',
  '................',
]);

/* -------------------------------- Python ------------------------------- */
add('python', {
  k: K,
  y: [255, 211, 67],
  b: [58, 120, 176],
  w: [241, 245, 249],
}, [
  '.......kkkk.....',
  '......kyyyyk....',
  '.....kyyyyyyk...',
  '....kyyyyyyyyk..',
  '....kybbbbyyk...',
  '...kyybkkbyyk...',
  '...kyybkkbyyk...',
  '...kyybbbbbyk...',
  '...kyyyyyyyyk...',
  '....kyyyyyyk....',
  '....kyyyyyyk....',
  '.....kyyyyk.....',
  '.....kyykky.....',
  '......kykky.....',
  '.......kkk......',
  '................',
]);

/* -------------------------------- Kotlin -------------------------------- */
add('kotlin', {
  k: K,
  p: [127, 82, 255],
  w: [238, 232, 255],
}, [
  '................',
  '......kkkk......',
  '.....kppppk.....',
  '....kppwwppk....',
  '....kpwwwwpk....',
  '...kppwwwwppk...',
  '...kpwwwwpwwwk..',
  '...kppwwwwppk...',
  '...kppwwwwppk...',
  '...kppwwwwppk...',
  '....kpwwwwpk....',
  '....kpwwwwpk....',
  '.....kppppk.....',
  '......kpkk......',
  '......kpk.......',
  '.....kkk........',
]);

/* --------------------------------- C# ---------------------------------- */
add('csharp', {
  k: K,
  p: [89, 45, 178],
  w: [255, 255, 255],
}, [
  '................',
  '................',
  '....kkkkkk......',
  '...kppppppk.....',
  '..kppppppppk....',
  '..kpwkppwkpk....',
  '..kpwkppwkpk....',
  '..kpwkppwkpk....',
  '..kpppppppkpk...',
  '..kpppkpppkppk..',
  '..kpppkpppkppk..',
  '..kpppkpppkppk..',
  '...kpppkkkppk...',
  '....kk....kk....',
  '................',
  '................',
]);

/* ------------------------------ JavaScript ------------------------------ */
add('javascript', {
  k: K,
  y: [247, 223, 30],
  d: [120, 90, 0],
}, badge('y', [
  'kkk..kk',
  '..k.k..',
  '..k..kk',
  '..k...k',
  'kk...kk',
]));

/* ------------------------------ TypeScript ------------------------------ */
add('typescript', {
  k: K,
  b: [49, 120, 198],
  w: [255, 255, 255],
}, badge('b', [
  'www..ww',
  '.w..w..',
  '.w...ww',
  '.w....w',
  '.w..ww.',
]));

/* --------------------------------- React -------------------------------- */
add('react', {
  k: K,
  b: [97, 218, 251],
  d: [34, 120, 160],
  w: [255, 255, 255],
}, [
  '................',
  '.......k........',
  '......kbk.......',
  '.....kbbbk......',
  '.kkkkbbbbbkkkk..',
  'kbbbbbbbbbbbbk..',
  'kbbbbbbdbdbbbk..',
  '.kkbbdbbbdbbk...',
  '..kbdbbbbbdkk...',
  '.kkbdbbbbdbk....',
  'kbbbdbbbbbbbbk..',
  'kbbbbbbbbbbbbk..',
  '.kkkkbbbbbkkkk..',
  '.....kbbbk......',
  '......kbk.......',
  '.......k........',
]);

/* ---------------------------------- SQL --------------------------------- */
add('sql', {
  k: K,
  b: [94, 166, 224],
  d: [52, 104, 150],
  w: [224, 238, 250],
}, [
  '................',
  '....kkkkkkk.....',
  '...kbbbbbbbk....',
  '..kbbbbbbbbbk...',
  '..kbbbbbbbbbk...',
  '..kbbbdbbbbbk...',
  '..kdbbdbbbbbk...',
  '..kdbbdbbbbbk...',
  '..kdbbdbbbdbk...',
  '..kdbbdbbbdbk...',
  '..kddbbbbbddk...',
  '..kddbbddbddk...',
  '..kdddddddddk...',
  '...kkkkkkkkk....',
  '................',
  '................',
]);

/* ---------------------------------- Git --------------------------------- */
add('git', {
  k: K,
  o: [240, 80, 50],
  d: [140, 45, 25],
  w: [255, 255, 255],
}, [
  '................',
  '......kk........',
  '.....kooo.......',
  '....koooook.....',
  '...kooowooo.....',
  '...kooowoo......',
  '..koowoooo......',
  '..koowooo.......',
  '..kwoooook......',
  '..kooowook......',
  '..kooowoooo.....',
  '...koowooo......',
  '...kkkoook......',
  '.....koook......',
  '......kkk.......',
  '................',
]);

/* -------------------------------- Node.js ------------------------------- */
add('nodejs', {
  k: K,
  g: [139, 195, 74],
  d: [74, 110, 30],
  w: [236, 246, 218],
}, [
  '................',
  '.....kkkkk......',
  '....kgggggk.....',
  '...kgggggggk....',
  '..kgggggggggk...',
  '..kgwwwwwwgwkk..',
  '..kgwwwwwwgwwk..',
  '..kggwwwgwgggk..',
  '..kggwwwgwwggk..',
  '..kggwwgwggggk..',
  '..kggwwwgwwggk..',
  '...kgggwwwgk....',
  '....kgggggk.....',
  '.....kkkkk......',
  '................',
  '................',
]);

/* --------------------------------- HTML --------------------------------- */
add('html', {
  k: K,
  o: [228, 77, 38],
  d: [150, 40, 22],
  w: [255, 255, 255],
}, badge('o', [
  'www',
  'w..',
  'www',
  '..w',
  'www',
]));

/* --------------------------------- CSS ---------------------------------- */
add('css', {
  k: K,
  b: [38, 77, 228],
  d: [20, 45, 150],
  w: [255, 255, 255],
}, badge('b', [
  'www',
  '..w',
  'www',
  '..w',
  'www',
]));

/* -------------------------------- FastAPI ------------------------------- */
add('fastapi', {
  k: K,
  y: [246, 163, 35],
  d: [180, 105, 15],
}, [
  '................',
  '................',
  '.......kk.......',
  '......kyyk......',
  '......kyyk......',
  '.....kyyk.......',
  '.....kyykk......',
  '....kyykky......',
  '....kyyyk.......',
  '...kyyyk........',
  '...kyyyk........',
  '..kyyk..........',
  '..kyyk..........',
  '.kyyk...........',
  '.kkk............',
  '................',
]);

/* -------------------------------- GitHub -------------------------------- */
add('github', {
  k: K,
  g: [20, 20, 24],
  w: [255, 255, 255],
}, [
  '................',
  '................',
  '....kkk...kkk...',
  '...kgkgk.kgkgk..',
  '...kgkgkkgkgk...',
  '..kggkkkgkkgk...',
  '..kggkwgkwggk...',
  '..kgggkkkgkgg...',
  '...kggkgkgkgk...',
  '...kgggkkgggk...',
  '....kgkkkkgk....',
  '....kkggggkk....',
  '....kggggggk....',
  '.....kkkkkk.....',
  '................',
  '................',
]);

/* --------------------------------- Motion ------------------------------- */
add('motion', {
  k: K,
  w: [255, 255, 255],
}, [
  '................',
  '................',
  '................',
  '................',
  '...kkk..kkk.....',
  '..kwkk..kwkk....',
  '..kwkkkkwkkk....',
  '.kwwkkkwkwwwk...',
  '.kwwkkkwkwwwk...',
  'kkwwkkkwkwwwkk..',
  'kkwwkkkwkwwwkk..',
  '.kwwkkkwkwwwk...',
  '.kwwkkkwkwwwk...',
  '..kkkk..kkkk....',
  '................',
  '................',
]);

/* --------------------------------- JSON --------------------------------- */
add('json', {
  k: K,
  g: [90, 196, 92],
  w: [255, 255, 255],
}, [
  '................',
  '................',
  '......kkk.......',
  '.....kgwgk......',
  '....kgwgwgk.....',
  '....kgwgwgk.....',
  '...kgwgwgwk.....',
  '...kwgwgwgk.....',
  '...kwgwkgkgk....',
  '...kwgwkgk......',
  '...kgwgwgk......',
  '....kgwgk.......',
  '......kk........',
  '................',
  '................',
  '................',
]);

/* -------------------------------- Docker -------------------------------- */
add('docker', {
  k: K,
  b: [36, 128, 201],
  d: [18, 80, 130],
  w: [255, 255, 255],
}, [
  '................',
  '..kwwkwwkwwk....',
  '.kbwwkbwwkbwwk..',
  '.kbbwkbbwkbbwk..',
  '.kwwkwwkwwkwwk..',
  '..kkkkkkkkkkkk..',
  '................',
  '...kkkkkkkkkkk..',
  '..kbbbbbbbbbbk..',
  '.kbbbbbbbbbbbbk.',
  '.kbbbbbbbbbbbbk.',
  '.kbbbbbbbbbbbbk.',
  '..kw.kkwwkkwk...',
  '...kkkkkkkkk....',
  '................',
  '................',
]);

/* ------------------------------- MongoDB -------------------------------- */
add('mongodb', {
  k: K,
  g: [71, 158, 102],
  d: [34, 96, 62],
  w: [233, 248, 238],
}, [
  '................',
  '................',
  '......kkkk......',
  '.....kggggk.....',
  '.....kggggk.....',
  '....kggwgwk.....',
  '....kgwgwgk.....',
  '....kgwgwgkk....',
  '....kgwgwgk.....',
  '....kgwgggk.....',
  '.....kggggk.....',
  '.....kggggk.....',
  '....kgggggk.....',
  '.....kkgkk......',
  '......kk........',
  '................',
]);

/* ------------------------------ PostgreSQL ------------------------------ */
add('postgresql', {
  k: K,
  b: [52, 120, 170],
  d: [28, 70, 105],
  w: [233, 240, 248],
}, badge('b', [
  'ww...ww',
  'w.w.w..',
  'ww..w.w',
  'w...w.w',
  'w....ww',
]));

/* -------------------------------- GraphQL ------------------------------- */
add('graphql', {
  k: K,
  p: [229, 40, 171],
  d: [140, 20, 105],
  w: [255, 255, 255],
}, [
  '................',
  '....kk..kk......',
  '...kppkkppk.....',
  '...kppppppk.....',
  '..kppppppppk....',
  '..kpwkppkwppk...',
  '..kpwkppkwppk...',
  '..kppppppppk....',
  '...kpwkppwk.....',
  '...kpwkppwk.....',
  '....kkppkk......',
  '.....kpkk.......',
  '.....kpkk.......',
  '....kk..kk......',
  '................',
  '................',
]);

/* --------------------------------- Jest --------------------------------- */
add('jest', {
  k: K,
  y: [250, 201, 58],
  w: [255, 255, 255],
  d: [140, 100, 20],
}, [
  '................',
  '................',
  '....kkkkkk......',
  '...kyyyyyyk.....',
  '..kyywwwyyyk....',
  '..kywkkkwyyyk...',
  '..kywkwwkwyyyk..',
  '..kyykkkyywyk...',
  '...kyykkkyyk....',
  '..kyykkkyykkk...',
  '..kywkwwwkywk...',
  '..kyykkyykyyk...',
  '...kyyyyyyk.....',
  '....kkkkkk......',
  '................',
  '................',
]);

/* ------------------------------- Tailwind ------------------------------ */
add('tailwind', {
  k: K,
  c: [56, 189, 248],
  d: [30, 120, 175],
  w: [255, 255, 255],
}, [
  '................',
  '................',
  '................',
  '...kkkkkkkk.....',
  '..kccccccdck....',
  '..kccccccdck....',
  '..kccddccdck....',
  '..kccdcdcdck....',
  '...kcdcdccdk....',
  '...kcccccck.....',
  '...kcccccck.....',
  '....kkkkkk......',
  '................',
  '................',
  '................',
  '................',
]);

/* ----------------------------- React Native ----------------------------- */
add('reactnative', {
  k: K,
  b: [97, 218, 251],
  d: [34, 120, 160],
  w: [255, 255, 255],
}, [
  '................',
  '................',
  '...kkkkkkkk.....',
  '..kwwwwwwwwk....',
  '..kwbbbbbbwk....',
  '..kbwbbbbbbk....',
  '..kbdbkbbbwbk...',
  '..kbdbbbbbbwk...',
  '..kbbbbdbwbbk...',
  '..kbwbbdbwbbk...',
  '..kwbbbwbbbk....',
  '...kwwwwwwk.....',
  '....kkkkkk......',
  '...kbbbbbk......',
  '....kkkkk.......',
  '................',
]);

/* -------------------------------- Next.js ------------------------------- */
add('nextjs', {
  k: K,
  w: [255, 255, 255],
  g: [190, 190, 200],
}, [
  '................',
  '................',
  '....kkkkkkkk....',
  '...kwwwwwwwwk...',
  '..kwwwwwwwwwwk..',
  '..kwwkkwwwwwwk..',
  '..kwwkkwwwwwwk..',
  '..kwwkkwwwwwwk..',
  '..kwwkkwwwwwwk..',
  '..kwwkkwggggwk..',
  '..kwwkkwgggk....',
  '...kwwwwwwk.....',
  '....kkkkkk......',
  '................',
  '................',
  '................',
]);

/* --------------------------- GitHub Actions ----------------------------- */
add('githubactions', {
  k: K,
  b: [66, 133, 244],
  d: [25, 70, 155],
  w: [255, 255, 255],
}, [
  '................',
  '......kkk.......',
  '.....kbk........',
  '....kbkkk.......',
  '...kbk.kbk......',
  '..kbkkkkkbbk....',
  '..kbk..kbkkk....',
  '..kbkkkbkkk.....',
  '...kbk...kk.....',
  '....kk..........',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
]);

/* ---------------------------------- npm --------------------------------- */
add('npm', {
  k: K,
  r: [203, 56, 55],
  d: [120, 30, 30],
  w: [255, 255, 255],
}, [
  '................',
  '..kkkkkkkkkk....',
  '.krrrrrrrrrrk...',
  '.krwwrwwwwrwk...',
  '.krwrrrwwrwwk...',
  '.krwrrrwwrwwk...',
  '.krrrrwwrwwrk...',
  '.krrrrwwrwwrk...',
  '.krwrrwwrwwrk...',
  '.krwrrwwrwwrk...',
  '.krwwwwwwwrrk...',
  '.krrrrrrrrrk....',
  '..kkkkkkkkk.....',
  '................',
  '................',
  '................',
]);

/* --------------------------------- pnpm --------------------------------- */
add('pnpm', {
  k: K,
  b: [255, 201, 0],
  d: [180, 120, 0],
  w: [255, 255, 255],
  y: [255, 201, 0],
}, [
  '................',
  '................',
  '....kkkkkk......',
  '...kbyyyybk.....',
  '..kbyyyyyybk....',
  '..kbyyyybybk....',
  '..kbyyyybybk....',
  '..kbyyyybybk....',
  '..kbyyybybyk....',
  '..kbyybyyyyk....',
  '...kbbbbyybk....',
  '....kbbbbbk.....',
  '......kkkk......',
  '................',
  '................',
  '................',
]);

/* -------------------------------- Linux --------------------------------- */
add('linux', {
  k: K,
  g: [52, 52, 58],
  d: [26, 26, 30],
  w: [238, 238, 244],
  o: [255, 152, 54],
}, [
  '................',
  '....kk...kk.....',
  '...kggk.ggk.....',
  '...kgggkgggk....',
  '..kggkkkggggk...',
  '..kgwwwwwwwgk...',
  '..kgggkkkgggk...',
  '...kggkkkggk....',
  '...kggkkkggk....',
  '..kkgkkkkkggk...',
  '..kwooooooowk...',
  '...k' + 'o'.repeat(8) + 'k...',
  '....kkkkkkk.....',
  '................',
  '................',
  '................',
]);

/* --------------------------------- Bash --------------------------------- */
add('bash', {
  k: K,
  g: [94, 202, 122],
  w: [255, 255, 255],
  d: [40, 90, 55],
}, [
  '................',
  '................',
  '....kkkkkkk.....',
  '...kggggggk.....',
  '..kgwwwwwwgk....',
  '..kgwggggggk....',
  '..kgwgggwgwk....',
  '..kgwggwgggk....',
  '..kgwwgwgwgk....',
  '..kgwwwggggk....',
  '..kgwwwwwwgk....',
  '...kggggggk.....',
  '....kkkkkkk.....',
  '................',
  '................',
  '................',
]);

/* -------------------------------- VS Code ------------------------------- */
add('vscode', {
  k: K,
  b: [0, 153, 214],
  d: [0, 96, 140],
  w: [255, 255, 255],
}, [
  '................',
  '......kkk.......',
  '.....kbbbk......',
  '....kbbbbbk.....',
  '....kbwbbbkk....',
  '....kbwbbbwk....',
  '....kbwbbbwk....',
  '....kbwbbwwk....',
  '....kbwwbwwk....',
  '....kwwbbbwk....',
  '....kkbbbbk.....',
  '.....kbbbk......',
  '......kkk.......',
  '................',
  '................',
  '................',
]);

/* -------------------------------- Chrome -------------------------------- */
add('chrome', {
  k: K,
  r: [232, 65, 60],
  g: [30, 170, 80],
  y: [244, 209, 54],
  b: [52, 135, 240],
}, [
  '................',
  '....kkkkkk......',
  '..kkrrrryyrkk...',
  '.krrrrrryyrrk...',
  '.krrrrryyyrrk...',
  'krrrrryyrrrbkk..',
  'krrryyrrrbbbkk..',
  'kryyrrrbbrbbkk..',
  'kryyrbbrbbbbk...',
  '.kgbgbbbbbbkk...',
  '.kggbbbbbbbk....',
  '..kkgbbbbbkk....',
  '....kkkkkkk.....',
  '................',
  '................',
  '................',
]);

/* --------------------------------- Figma -------------------------------- */
add('figma', {
  k: K,
  r: [242, 78, 30],
  o: [242, 114, 34],
  p: [168, 84, 255],
  b: [27, 190, 255],
  g: [10, 207, 131],
  w: [255, 255, 255],
}, [
  '................',
  '...kkkkkkk......',
  '..krrrrrrrk.....',
  '..krrrrrrrk.....',
  '..kkkkrrrk......',
  '.....krork......',
  '....kororkk.....',
  '....kororrk.....',
  '....kbbpppk.....',
  '....kbbpppk.....',
  '....kbbpwpk.....',
  '.....kbbbbk.....',
  '......kkkk......',
  '................',
  '................',
  '................',
]);

/* -------------------------------- Arduino ------------------------------- */
add('arduino', {
  k: K,
  t: [0, 141, 165],
  d: [0, 90, 110],
  w: [231, 250, 250],
}, [
  '................',
  '................',
  '.....kk..kk.....',
  '....ktkkkktk....',
  '...ktk..ktkkk...',
  '...ktk...ktkk...',
  '..ktkk...ktk....',
  '..ktk....ktk....',
  '..ktk....ktk....',
  '...ktk...ktk....',
  '...ktkk..ktkk...',
  '....ktkkkktk....',
  '.....kk..kk.....',
  '................',
  '................',
  '................',
]);

/* --------------------------------- Vite --------------------------------- */
add('vite', {
  k: K,
  p: [100, 108, 255],
  d: [60, 65, 170],
  w: [255, 224, 130],
}, badge('p', [
  '..w',
  '.ww',
  'www',
  'ww.',
  'w..',
]));

/* -------------------------------- D3.js --------------------------------- */
add('d3', {
  k: K,
  o: [249, 160, 60],
  d: [180, 105, 20],
  w: [255, 255, 255],
}, badge('o', [
  'ww..www',
  'w.w...w',
  'w.w..ww',
  'w.w...w',
  'ww..www',
]));

/* -------------------------------- Unknown ------------------------------- */
add('unknown', {
  k: K,
  g: [130, 130, 138],
  d: [80, 80, 88],
  w: [235, 235, 240],
}, badge('g', [
  '.ww',
  'w..',
  '.w.',
  '...',
  '.w.',
]));

/* ------------------------------- Persona 5 ------------------------------ */
add('persona5', {
  k: K,
  r: [224, 52, 52],
  d: [120, 25, 25],
  w: [255, 255, 255],
}, [
  '................',
  '.....kkkkk......',
  '....kwwwwwwk....',
  '...kwwwwwwwwk...',
  '..kwwwrrrrrrwk..',
  '..kwwrrrrrrwwk..',
  '..kwwrrrrrrwk...',
  '..kwwrrrrrwwk...',
  '..kwwrrrrwwwk...',
  '...kwwrrrwwk....',
  '...kwwwwwwwk....',
  '....kwwwwwk.....',
  '.....kkkkkk.....',
  '................',
  '................',
  '................',
]);

/* --------------------------------- Vault -------------------------------- */
add('vault', {
  k: K,
  y: [247, 209, 75],
  d: [140, 110, 30],
  v: [72, 137, 204],
  w: [255, 255, 255],
}, [
  '................',
  '....kkkkkkk.....',
  '...kvvvvvvvk....',
  '..kvvvvvvvvvk...',
  '..kvyyvvvvvvk...',
  '..kvyyvvvvvwk...',
  '..kvvyyvvvvvk...',
  '..kvyyvvvvvvk...',
  '..kvyyvddvvvk...',
  '..kvvvvvvvvvk...',
  '..kvvvvvyyvvk...',
  '...kvvvvvvvk....',
  '....kkkkkkk.....',
  '................',
  '................',
  '................',
]);

/* ------------------------------- EuroMario ------------------------------ */
add('euromario', {
  k: K,
  g: [80, 210, 80],
  d: [40, 130, 40],
  r: [220, 60, 50],
  w: [255, 255, 255],
}, [
  '................',
  '................',
  '......kk........',
  '.....kkkk.......',
  '.....kwwk.......',
  '....kwwwkk......',
  '....kwwwwk......',
  '...kwwwwwwk.....',
  '...krwwwwrk.....',
  '...krwrrwwk.....',
  '...krrrrrrk.....',
  '..kkrrrrrrkk....',
  '..krrrrrrrrk....',
  '...kkkkkkkk.....',
  '................',
  '................',
]);

/* -------------------------------- Dungeon ------------------------------- */
add('dungeon', {
  k: K,
  p: [155, 81, 224],
  d: [90, 40, 140],
  w: [255, 255, 255],
}, [
  '................',
  '......kkkk......',
  '.....kppppk.....',
  '....kppppppk....',
  '...kppppppppk...',
  '..kppppppppppk..',
  '..kpwwppwwppk...',
  '..kpwwppwwppk...',
  '...kpppppppk....',
  '....kpppppk.....',
  '.....kpppk......',
  '......kpk.......',
  '......kpk.......',
  '.....kk.kk......',
  '................',
  '................',
]);

/* -------------------------------- Michelin ------------------------------ */
add('michelin', {
  k: K,
  b: [50, 93, 184],
  w: [246, 246, 250],
  d: [170, 170, 185],
}, [
  '................',
  '.....kkkkkk.....',
  '...kkwwwwwwkk...',
  '..kwwwwwwwwwwk..',
  '..kwwwwwkwwwwk..',
  '.kwwkwkwkwkwwk..',
  '.kwwwwwwwwwwk...',
  '.kwkwwwwwwwkk...',
  '..kkwwwwwwk.....',
  '..kkwwwwwwkk....',
  '...kwwwwwwk.....',
  '...kwwwwwwk.....',
  '..kkkkkkkkkk....',
  '................',
  '................',
  '................',
]);

/* ------------------------------ Synersight ------------------------------ */
/* Icono provisional: un ojo, por el nombre. Sustituir por el logo real. */
add('synersight', {
  k: K,
  b: [30, 74, 120],
  c: [86, 200, 220],
  w: [255, 255, 255],
}, [
  '................',
  '................',
  '................',
  '.....kkkkkk.....',
  '...kkbbbbbbkk...',
  '..kbbbwwwwbbbk..',
  '.kbbwwccccwwbbk.',
  'kbbwcccccccccwb.',
  'kbwcccckkccckwb.',
  'kbwcccckkccckwb.',
  'kbbwcccccccccwb.',
  '.kbbwwccccwwbbk.',
  '..kbbbwwwwbbbk..',
  '...kkbbbbbbkk...',
  '.....kkkkkk.....',
  '................',
]);

/* ------------------------------- Cognizant ------------------------------ */
add('cognizant', {
  k: K,
  b: [38, 94, 171],
  d: [20, 55, 110],
  y: [247, 209, 75],
  w: [255, 255, 255],
}, [
  '................',
  '................',
  '..kkkkkkkkkk....',
  '.kbbbbbbbbbbk...',
  '.kbbbbbbbbbbk...',
  '.kbwbbbbbbbwk...',
  '.kbwwbbbbbwwk...',
  '.kbwwybbbwwk....',
  '.kbwwybbwwwk....',
  '.kbbbbybbbbk....',
  '.kbwbbbwwbbk....',
  '.kwwbbbbwwk.....',
  '..kkkkkkkkk.....',
  '................',
  '................',
  '................',
]);

/* ----------------------------- Diputacion ------------------------------- */
add('diputacion', {
  k: K,
  b: [92, 140, 220],
  d: [45, 80, 140],
  w: [255, 255, 255],
}, [
  '................',
  '.....kkkkk......',
  '....kwkkk.......',
  '...kwwkkkk......',
  '...kwkkkkk......',
  '....kkkkkkk.....',
  '...kbbbbbbk.....',
  '..kbbbwbbbwk....',
  '..kbbbbbbbbk....',
  '..kbwbwbbwbk....',
  '..kbwbwbbwbk....',
  '..kbwbbbbwbk....',
  '...kkkkkkkk.....',
  '................',
  '................',
  '................',
]);

/* ---------------------------------- ESO ---------------------------------- */
add('eso', {
  k: K,
  b: [202, 148, 60],
  d: [130, 90, 35],
  w: [250, 246, 235],
  g: [180, 178, 170],
}, [
  '................',
  '......kkk.......',
  '....kkbwk.......',
  '...kbbwbbk......',
  '..kbbwwwbbk.....',
  '..kwwwwwwwk.....',
  '..kbwwwwbbk.....',
  '..kwwwwwbbk.....',
  '..kbwwwwbbk.....',
  '..kwwwwwbbk.....',
  '...kwwwwbk......',
  '....kbbbk.......',
  '.....kkk........',
  '................',
  '................',
  '................',
]);

/* ----------------------------- Grado Medio Teleco ------------------------ */
add('grado-teleco', {
  k: K,
  b: [120, 168, 224],
  d: [70, 110, 165],
  w: [255, 255, 255],
}, [
  '................',
  '.......kk.......',
  '.......kbk......',
  '.......kbk......',
  '.......kbk......',
  '.....kkbkk......',
  '....kbk.kb......',
  '.....kbbk.......',
  '..kkkkbbkkkk....',
  '.kbwkbbbbwbk....',
  '.kbwbbbbbbbk....',
  '..kkkkbbkkkk....',
  '.....kbbk.......',
  '......kk........',
  '................',
  '................',
]);

/* ----------------------------- Grado Robotica ---------------------------- */
add('grado-robotica', {
  k: K,
  g: [130, 138, 158],
  d: [70, 75, 90],
  b: [110, 200, 255],
  y: [255, 215, 80],
}, [
  '................',
  '......kk........',
  '......kgk.......',
  '.....kbgyk......',
  '...kkggggkk.....',
  '..kggggggggk....',
  '..kggggggggk....',
  '..kgkgkkkgkk....',
  '..kgggkkkggk....',
  '..kggkkkkkggk...',
  '..kggggggggk....',
  '..kggggggggk....',
  '...kkkkkkkk.....',
  '................',
  '................',
  '................',
]);

/* ---------------------------------- DAM ---------------------------------- */
add('dam', {
  k: K,
  g: [100, 112, 130],
  d: [55, 62, 75],
  b: [110, 200, 255],
}, [
  '................',
  '................',
  '..kkkkkkkkkk....',
  '.kbbbbbbbbbbk...',
  '.kbbbbbbbbbbk...',
  '.kbbbbbbbbbbk...',
  '.kbbkbbbbbbbk...',
  '.kbbbbbbbbbbk...',
  '.kbbkbbbbbbbk...',
  '.kbbbbbbbbbbk...',
  '.kbbbbkbbbbbk...',
  '..kkkkkkkkkk....',
  '..kbbbbbbbbbk...',
  '..kkkkkkkkkk....',
  '................',
  '................',
]);

/* ------------------------------ Bootcamp IA ------------------------------ */
add('bootcamp-ia', {
  k: K,
  p: [180, 132, 240],
  d: [100, 60, 150],
  w: [255, 255, 255],
  y: [255, 220, 90],
}, [
  '................',
  '.....kk..kk.....',
  '....kppkkppk....',
  '...kppkkkkppk...',
  '...kppkkkkppk...',
  '...kppkkkkppk...',
  '....kppkkppk....',
  '.....kkwwkk.....',
  '...kyykwwkyyk...',
  '...kywwwwwwwyk..',
  '....kyywwyyk....',
  '.....kykkyk.....',
  '......kkkk......',
  '................',
  '................',
  '................',
]);

/* ------------------------ Timeline: proyectos y experiencia ------------------------- */
// Tab "Proyectos"  -> sprites/container/slot/pickaxe.png (16x16, de assets de Minecraft)
// Tab "Experiencia" -> sprites/container/slot/emerald.png (16x16, de assets de Minecraft)

/* ------------------------- Timeline: educacion --------------------------- */
add('educacion', {
  k: K,
  c: [64, 180, 190],
  d: [32, 100, 110],
  w: [230, 250, 250],
  y: [255, 215, 90],
}, [
  '................',
  '....kkkkkkk.....',
  '...kccccccck....',
  '..kccccccccck...',
  '..kcccyccccck...',
  '..kccycccccck...',
  '..kccccycccck...',
  '..kccycccccck...',
  '..kcccyccccck...',
  '..kccccccccck...',
  '...kccccccck....',
  '....kccccck.....',
  '......kkkk......',
  '................',
  '................',
  '................',
]);

/* ------------------------------ Render ------------------------------ */
function renderIcon({ palette, rows }) {
  const size = 16;
  const rgba = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) {
    const row = rows[y];
    for (let x = 0; x < size; x++) {
      const ch = row[x];
      const color = palette[ch];
      const i = (y * size + x) * 4;
      if (!color) {
        rgba[i + 3] = 0;
        continue;
      }
      rgba[i] = color[0];
      rgba[i + 1] = color[1];
      rgba[i + 2] = color[2];
      rgba[i + 3] = 255;
    }
  }
  return encodePNG(size, size, rgba);
}

/* --------------------- Render individual PNG files --------------------- */
if (ERRORS.length) {
  console.error(`\n${ERRORS.length} error(es) de validación:`);
  for (const e of ERRORS) console.error('  - ' + e);
  process.exit(1);
}

if (process.argv.includes('--preview')) {
  for (const [name, icon] of Object.entries(ICONS)) {
    const chars = new Map();
    const pool = 'abcdefghijklmnopqrstuvwxyz0123456789';
    console.log(`\n### ${name}`);
    for (const row of icon.rows) {
      let line = '';
      for (const ch of row) {
        if (ch === '.') { line += '  '; continue; }
        if (!chars.has(ch)) chars.set(ch, pool[chars.size] ?? '?');
        line += chars.get(ch) + ' ';
      }
      console.log(line);
    }
    const legend = [...chars.entries()].map(([ch, code]) => {
      const c = icon.palette[ch];
      return `${code}=#${c.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
    }).join(' ');
    console.log(legend);
  }
  process.exit(0);
}

for (const [name, icon] of Object.entries(ICONS)) {
  writeFileSync(join(OUT, `${name}.png`), renderIcon(icon));
  console.log(`generado: ${name}.png`);
}

/* --------------- Copiar sprites 16x16 desde assets de Minecraft --------------- */

function applyTint(rgba, tint) {
  if (!tint) return rgba;
  for (let i = 0; i < rgba.length; i += 4) {
    rgba[i] = Math.round((rgba[i] * tint[0]) / 255);
    rgba[i + 1] = Math.round((rgba[i + 1] * tint[1]) / 255);
    rgba[i + 2] = Math.round((rgba[i + 2] * tint[2]) / 255);
  }
  return rgba;
}

function copyAtlasFrame(name, src, frameIndex, tint) {
  const { width, height, rgba } = decodePng(readFileSync(src));
  if (width !== 16 || height % 16 !== 0) {
    throw new Error(`Atlas no compatible: ${width}x${height} en ${src}`);
  }
  const frames = height / 16;
  if (frameIndex >= frames) {
    throw new Error(`Frame ${frameIndex} fuera de rango en ${src}`);
  }
  const y0 = frameIndex * 16;
  const out = new Uint8Array(16 * 16 * 4);
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      const s = ((y0 + y) * width + x) * 4;
      const d = (y * 16 + x) * 4;
      out[d] = rgba[s];
      out[d + 1] = rgba[s + 1];
      out[d + 2] = rgba[s + 2];
      out[d + 3] = rgba[s + 3];
    }
  }
  applyTint(out, tint);
  writeFileSync(join(OUT, `${name}.png`), encodePNG(16, 16, out));
  console.log(`copiado frame: ${name}.png`);
}

function copySprite(name, src, tint) {
  const buf = readFileSync(src);
  const { width, height, rgba } = decodePng(buf);
  applyTint(rgba, tint);
  writeFileSync(join(OUT, `${name}.png`), encodePNG(width, height, rgba));
  console.log(`copiado: ${name}.png (${width}x${height})`);
}

function decodePng(data) {
  // decodificación mínima de PNG (RGBA) para extraer frames de sprites 16x16
  // firma
  if (data.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') throw new Error('no png');
  let pos = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = 0;
  const chunks = [];
  while (pos < data.length) {
    const len = data.readUInt32BE(pos);
    const type = data.subarray(pos + 4, pos + 8).toString('ascii');
    const body = data.subarray(pos + 8, pos + 8 + len);
    chunks.push({ type, body });
    pos += 12 + len;
    if (type === 'IEND') break;
  }
  for (const c of chunks) {
    if (c.type === 'IHDR') {
      width = c.body.readUInt32BE(0);
      height = c.body.readUInt32BE(4);
      bitDepth = c.body[8];
      colorType = c.body[9];
    }
  }
  const plte = chunks.find((c) => c.type === 'PLTE');
  const trns = chunks.find((c) => c.type === 'tRNS');
  const idat = deflateSync(Buffer.concat(chunks.filter((c) => c.type === 'IDAT').map((c) => c.body)));
  if (colorType === 6 && bitDepth === 8) {
    return decodeRgba8(width, height, idat);
  }
  if (colorType === 4 && bitDepth === 8) {
    return decodeGrayAlpha(width, height, idat);
  }
  if (colorType === 2 && bitDepth === 8) {
    return decodeRgb24(width, height, idat);
  }
  if (colorType === 0) {
    return decodeGrayscale(width, height, bitDepth, idat, trns);
  }
  if (colorType === 3 && bitDepth === 8 && plte) {
    const palette = [];
    for (let i = 0; i * 3 < plte.body.length; i++) {
      palette.push([plte.body[i * 3], plte.body[i * 3 + 1], plte.body[i * 3 + 2]]);
    }
    const alpha = [];
    if (trns) {
      for (let i = 0; i < trns.body.length; i++) alpha.push(trns.body[i]);
    }
    const rgba = new Uint8Array(width * height * 4);
    const stride = width + 1;
    for (let y = 0; y < height; y++) {
      const filter = idat[y * stride];
      for (let x = 0; x < width; x++) {
        const raw = idat[y * stride + 1 + x];
        const l = x > 0 ? idat[y * stride + 1 + x - 1] : 0;
        const u = y > 0 ? idat[(y - 1) * stride + 1 + x] : 0;
        const lu = x > 0 && y > 0 ? idat[(y - 1) * stride + 1 + x - 1] : 0;
        let val = raw;
        if (filter === 1) val = (raw + l) & 0xff;
        else if (filter === 2) val = (raw + u) & 0xff;
        else if (filter === 3) val = (raw + ((l + u) >> 1)) & 0xff;
        else if (filter === 4) {
          const p = l + u - lu;
          const pa = Math.abs(p - l);
          const pb = Math.abs(p - u);
          const pc = Math.abs(p - lu);
          val = (raw + (pa <= pb && pa <= pc ? l : pb <= pc ? u : lu)) & 0xff;
        }
        const [pr, pg, pb2] = palette[val] ?? [0, 0, 0];
        const a = alpha[val] ?? 255;
        const d = (y * width + x) * 4;
        rgba[d] = pr;
        rgba[d + 1] = pg;
        rgba[d + 2] = pb2;
        rgba[d + 3] = a;
      }
    }
    return { width, height, rgba };
  }
  throw new Error(`formato PNG no soportado: bitDepth=${bitDepth} colorType=${colorType}`);
}

function decodeGrayscale(width, height, bitDepth, idat, trns) {
  const sampleBits = bitDepth === 16 ? 16 : bitDepth;
  const max = (1 << sampleBits) - 1;
  const rgba = new Uint8Array(width * height * 4);
  const bytesPerPix = bitDepth === 16 ? 2 : 1;
  const stride = width * bytesPerPix + 1;
  const transparentGray = trns ? trns.body.readUInt16BE(0) : null;
  for (let y = 0; y < height; y++) {
    const filter = idat[y * stride];
    const recon = new Uint8Array(width * bytesPerPix);
    for (let x = 0; x < width; x++) {
      for (let j = 0; j < bytesPerPix; j++) {
        const raw = idat[y * stride + 1 + x * bytesPerPix + j];
        let filtered = 0;
        if (bitDepth <= 8) {
          const l = x > 0 ? idat[y * stride + 1 + (x - 1) * bytesPerPix + j] : 0;
          const u = y > 0 ? idat[(y - 1) * stride + 1 + x * bytesPerPix + j] : 0;
          const lu = x > 0 && y > 0 ? idat[(y - 1) * stride + 1 + (x - 1) * bytesPerPix + j] : 0;
          let val = raw;
          if (filter === 1) val = (raw + l) & 0xff;
          else if (filter === 2) val = (raw + u) & 0xff;
          else if (filter === 3) val = (raw + ((l + u) >> 1)) & 0xff;
          else if (filter === 4) {
            const p = l + u - lu;
            const pa = Math.abs(p - l);
            const pb = Math.abs(p - u);
            const pc = Math.abs(p - lu);
            val = (raw + (pa <= pb && pa <= pc ? l : pb <= pc ? u : lu)) & 0xff;
          }
          filtered = val;
        } else {
          // bitDepth 16: reconstrucción simple sin filtros avanzados
          filtered = raw;
        }
        recon[x * bytesPerPix + j] = filtered;
      }
    }
    for (let x = 0; x < width; x++) {
      let gray;
      if (bitDepth === 16) {
        gray = (recon[x * 2] << 8 | recon[x * 2 + 1]) >> 8;
      } else if (bitDepth === 8) {
        gray = recon[x];
      } else {
        const byte = recon[x];
        const shift = 8 - bitDepth - (x % (8 / bitDepth)) * bitDepth;
        gray = ((byte >> shift) & max) * (255 / max);
      }
      const d = (y * width + x) * 4;
      const a = transparentGray !== null && gray === transparentGray ? 0 : 255;
      rgba[d] = gray;
      rgba[d + 1] = gray;
      rgba[d + 2] = gray;
      rgba[d + 3] = a;
    }
  }
  return { width, height, rgba };
}

function decodeRgb24(width, height, idat) {
  const rgba = new Uint8Array(width * height * 4);
  const stride = width * 3 + 1;
  for (let y = 0; y < height; y++) {
    const filter = idat[y * stride];
    for (let x = 0; x < width; x++) {
      for (let b = 0; b < 3; b++) {
        const raw = idat[y * stride + 1 + x * 3 + b];
        const l = x > 0 ? rgba[y * width * 4 + (x - 1) * 4 + b] : 0;
        const u = y > 0 ? rgba[(y - 1) * width * 4 + x * 4 + b] : 0;
        const lu = x > 0 && y > 0 ? rgba[(y - 1) * width * 4 + (x - 1) * 4 + b] : 0;
        let val = raw;
        if (filter === 1) val = (raw + l) & 0xff;
        else if (filter === 2) val = (raw + u) & 0xff;
        else if (filter === 3) val = (raw + ((l + u) >> 1)) & 0xff;
        else if (filter === 4) {
          const p = l + u - lu;
          const pa = Math.abs(p - l);
          const pb = Math.abs(p - u);
          const pc = Math.abs(p - lu);
          val = (raw + (pa <= pb && pa <= pc ? l : pb <= pc ? u : lu)) & 0xff;
        }
        rgba[y * width * 4 + x * 4 + b] = val;
      }
      rgba[y * width * 4 + x * 4 + 3] = 255;
    }
  }
  return { width, height, rgba };
}

function decodeGrayAlpha(width, height, idat) {
  const rgba = new Uint8Array(width * height * 4);
  const stride = width * 2 + 1;
  for (let y = 0; y < height; y++) {
    const filter = idat[y * stride];
    for (let x = 0; x < width; x++) {
      for (let b = 0; b < 2; b++) {
        const raw = idat[y * stride + 1 + x * 2 + b];
        const l = x > 0 ? rgba[y * width * 4 + (x - 1) * 4 + (b === 0 ? 0 : 3)] : 0;
        const u = y > 0 ? rgba[(y - 1) * width * 4 + x * 4 + (b === 0 ? 0 : 3)] : 0;
        const lu = x > 0 && y > 0 ? rgba[(y - 1) * width * 4 + (x - 1) * 4 + (b === 0 ? 0 : 3)] : 0;
        let val = raw;
        if (filter === 1) val = (raw + l) & 0xff;
        else if (filter === 2) val = (raw + u) & 0xff;
        else if (filter === 3) val = (raw + ((l + u) >> 1)) & 0xff;
        else if (filter === 4) {
          const p = l + u - lu;
          const pa = Math.abs(p - l);
          const pb = Math.abs(p - u);
          const pc = Math.abs(p - lu);
          val = (raw + (pa <= pb && pa <= pc ? l : pb <= pc ? u : lu)) & 0xff;
        }
        const grayAlpha = b === 0;
        rgba[y * width * 4 + x * 4 + (grayAlpha ? 0 : 3)] = val;
        if (grayAlpha) {
          rgba[y * width * 4 + x * 4 + 1] = val;
          rgba[y * width * 4 + x * 4 + 2] = val;
        }
      }
    }
  }
  return { width, height, rgba };
}

function decodeRgba8(width, height, idat) {
  const stride = width * 4 + 1;
  const rgba = new Uint8Array(width * height * 4);
  for (let y = 0; y < height; y++) {
    const filter = idat[y * stride];
    for (let x = 0; x < width; x++) {
      const slot = y * stride + 1 + x * 4;
      for (let b = 0; b < 4; b++) {
        const raw = idat[slot + b];
        const l = x > 0 ? rgba[y * width * 4 + (x - 1) * 4 + b] : 0;
        const u = y > 0 ? rgba[(y - 1) * width * 4 + x * 4 + b] : 0;
        const lu = x > 0 && y > 0 ? rgba[(y - 1) * width * 4 + (x - 1) * 4 + b] : 0;
        let val = raw;
        if (filter === 1) val = (raw + l) & 0xff;
        else if (filter === 2) val = (raw + u) & 0xff;
        else if (filter === 3) val = (raw + ((l + u) >> 1)) & 0xff;
        else if (filter === 4) {
          const p = l + u - lu;
          const pa = Math.abs(p - l);
          const pb = Math.abs(p - u);
          const pc = Math.abs(p - lu);
          val = (raw + (pa <= pb && pa <= pc ? l : pb <= pc ? u : lu)) & 0xff;
        }
        rgba[y * width * 4 + x * 4 + b] = val;
      }
    }
  }
  return { width, height, rgba };
}

// music note icon (Web Audio + toggle de audio)
const musicPath = join(MINECRAFT_GUI, 'sprites', 'icon', 'music_notes.png');
if (existsSync(musicPath)) {
  copyAtlasFrame('webaudio', musicPath, 0, [170, 240, 127]);
} else {
  console.warn('AVISO: no se encuentra music_notes.png en los assets de Minecraft');
}

// emerald (tab experiencia)
const emeraldPath = join(MINECRAFT_GUI, 'sprites', 'container', 'slot', 'emerald.png');
if (existsSync(emeraldPath)) {
  copySprite('experiencia', emeraldPath, [55, 210, 110]);
} else {
  console.warn('AVISO: no se encuentra emerald.png en los assets de Minecraft');
}

// pickaxe (tab proyectos)
const pickPath = join(MINECRAFT_GUI, 'sprites', 'container', 'slot', 'pickaxe.png');
if (existsSync(pickPath)) {
  copySprite('proyectos', pickPath, [205, 175, 130]);
} else {
  console.warn('AVISO: no se encuentra pickaxe.png en los assets de Minecraft');
}

/* --------------------- Sprite sheet para inspección --------------------- */
const names = Object.keys(ICONS).concat(['webaudio', 'experiencia', 'proyectos']);
const SCALE = 6;
const cols = 12;
const rows = Math.ceil(names.length / cols);
const sheetW = cols * 16 * SCALE;
const sheetH = rows * 16 * SCALE;
const sheet = new Uint8Array(sheetW * sheetH * 4);
for (let i = 0; i < names.length; i++) {
  const buffer = readFileSync(join(OUT, `${names[i]}.png`));
  const { width, height, rgba } = decodePng(buffer);
  const cx = (i % cols) * 16 * SCALE;
  const cy = Math.floor(i / cols) * 16 * SCALE;
  const bg = [24, 22, 30];
  for (let y = 0; y < height * SCALE; y++) {
    for (let x = 0; x < width * SCALE; x++) {
      const sx = Math.floor(x / SCALE);
      const sy = Math.floor(y / SCALE);
      const si = (sy * width + sx) * 4;
      const a = rgba[si + 3];
      const di = ((cy + y) * sheetW + (cx + x)) * 4;
      if (a === 0) {
        sheet[di] = bg[0];
        sheet[di + 1] = bg[1];
        sheet[di + 2] = bg[2];
        sheet[di + 3] = 255;
      } else {
        const blend = a / 255;
        sheet[di] = Math.round(rgba[si] * blend + bg[0] * (1 - blend));
        sheet[di + 1] = Math.round(rgba[si + 1] * blend + bg[1] * (1 - blend));
        sheet[di + 2] = Math.round(rgba[si + 2] * blend + bg[2] * (1 - blend));
        sheet[di + 3] = 255;
      }
    }
  }
}
const sheetPath = join(tmpdir(), 'minecraft-portfolio-icons-sheet.png');
writeFileSync(sheetPath, encodePNG(sheetW, sheetH, sheet));
console.log(`sprite sheet: ${sheetPath}`);
console.log(`total iconos: ${names.length}`);