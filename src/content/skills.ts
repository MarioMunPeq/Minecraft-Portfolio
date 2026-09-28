export interface Skill {
  id: string;
  name: string;
  /** Una frase corta, tal y como aparece en el tooltip de la habilidad. */
  phrase: string;
  /** 1 a 5. Es el nivel del encantamiento: color del nombre y pips de la fila. */
  level: number;
  /** Item de 16x16 que representa la habilidad. */
  item: string;
}

/**
 * Palabras con las que el juego construye los nombres de los encantamientos:
 * elige de tres a cinco al azar y las junta. Lo que sale en las filas de
 * opcion son jeroglificos, asi que la lista solo importa por los trazos que
 * deja, no por lo que se lea.
 */
export const ENCHANT_WORDS = [
  'equipo',
  'grupo',
  'ritmo',
  'prisa',
  'error',
  'proyecto',
  'reunion',
  'cliente',
  'codigo',
  'diseño',
  'gente',
  'horas',
  'ideas',
  'plan',
  'riesgo',
  'tabla',
  'union',
  'cambio',
  'miedo',
  'fe',
  'sueño',
  'turno',
  'hoja',
  'roca',
  'fuego',
  'agua',
  'viento',
  'obsidiana',
  'enredadera',
  'murcielago',
  'farol',
  'yunque',
  'escalera',
  /* Cortas: el nombre de cada fila solo da para unas nueve letras, asi que
     el generador de jeroglificos solo puede usar palabras de 3 a 5. */
  'oro',
  'mar',
  'sol',
  'pan',
  'sal',
  'paz',
  'voz',
  'ala',
  'aro',
  'eje',
  'nube',
  'ruta',
  'duna',
  'veta',
  'nudo',
  'lazo',
];

/** Lo que dice el bocadillo del aldeano en el menu. */
export const VILLAGER_LINE =
  'Tengo cinco encantamientos guardados. Si buscas como trabajo con ' +
  'gente, mira cual te falta.';

export const SKILLS: Skill[] = [
  {
    id: 'equipo',
    name: 'Trabajo en equipo',
    phrase: 'Me muevo bien dentro de un grupo y no dejo a nadie atras.',
    level: 4,
    item: 'items/honeycomb',
  },
  {
    id: 'autonomia',
    name: 'Autonomia',
    phrase: 'Arranco solo y respondo por lo que decido, sin esperar que me empufen.',
    level: 4,
    item: 'items/ender_eye',
  },
  {
    id: 'adaptabilidad',
    name: 'Adaptabilidad',
    phrase: 'Cambio de rumbo rapido cuando el contexto o el equipo cambian.',
    level: 3,
    item: 'items/feather',
  },
  {
    id: 'problemas',
    name: 'Resolucion de problemas',
    phrase: 'Busco la causa raiz en lugar de parchear el sintoma.',
    level: 5,
    item: 'items/redstone',
  },
  {
    id: 'tiempo',
    name: 'Gestion del tiempo',
    phrase: 'Priorizo lo que importa y entrego antes de la fecha.',
    level: 4,
    item: 'items/music_disc_cat',
  },
];

/**
 * Los dos slots de entrada de la mesa de encantamientos. El primero es el
 * libro que se paga y el segundo el lapislazuli que hace de catalizador.
 * Que el coste sea un libro es el mismo truco que en el juego: el
 * bibliotecario cambia libros por esmeraldas, asi que la ranura ya apunta a
 * "habilidades" sin escribirlo.
 */
export const ENCHANT_COST = 'items/book';
export const ENCHANT_COST_LABEL = 'Habilidades blandas';
export const ENCHANT_XP = 'items/lapis_lazuli';
export const ENCHANT_XP_LABEL = 'Nivel 1 a 5';

/**
 * Color de cada nivel. Son los colores de rareza del juego, para que un nivel
 * alto se lea de un vistazo sin tener que leer el numero.
 */
export const LEVEL_COLORS = ['#d0d0d0', '#5dc85d', '#5dc8d6', '#f0c020', '#c060f0'];

export function levelColor(level: number): string {
  return LEVEL_COLORS[Math.min(LEVEL_COLORS.length, Math.max(1, level)) - 1];
}
