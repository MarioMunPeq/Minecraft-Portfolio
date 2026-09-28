/**
 * Tecnologia -> item de Minecraft que la representa en la mesa de crafteo.
 *
 * La analogia no es literal: es la que mejor se entiende jugando. El hover
 * siempre dice el nombre real de la tecnologia, asi que el item solo tiene que
 * ser reconocible y bonito.
 *
 * Los valores son rutas relativas dentro de public/assets/mc/.
 */
export const TECH_ITEMS: Record<string, string> = {
  // Lenguajes
  TypeScript: 'items/redstone',
  JavaScript: 'items/comparator',
  Python: 'items/cauldron',
  // Frameworks y librerias
  React: 'items/brewing_stand',
  'React Router': 'items/chain',
  Tailwind: 'items/string',
  Motion: 'items/elytra',
  'Three.js': 'items/ender_pearl',
  'D3.js': 'items/spyglass',
  GSAP: 'items/feather',
  Vite: 'items/flint_and_steel',
  // Marcado y estilos
  HTML: 'items/book',
  CSS: 'items/brush',
  // Datos, backend e infraestructura
  Firebase: 'items/blaze_rod',
  Zustand: 'items/honeycomb',
  Docker: 'items/bundle',
  Mapbox: 'items/map',
  'Web Audio': 'blocks/note_block',
  IA: 'items/amethyst_shard',
  RSS: 'items/paper',
  PWA: 'items/writable_book',
  // Herramientas
  Git: 'items/ender_eye',
  'GitHub Actions': 'blocks/redstone_torch',
  Testing: 'blocks/target_top',
};

/** Item que aparece en el slot de resultado de cada proyecto. */
export const RESULT_ITEMS: Record<string, string> = {
  'persona5': 'items/golden_apple',
  'euromario': 'items/enchanted_book',
  'vault-archive': 'items/diamond',
  'dungeon-archive': 'blocks/bookshelf',
  'repository-library': 'items/emerald',
  'cosmere-archive': 'items/echo_shard',
};

/** Item de reserva para tecnologias que no esten mapeadas. */
export const FALLBACK_ITEM = 'items/egg';

export function itemForTech(tech: string): string {
  return TECH_ITEMS[tech] ?? FALLBACK_ITEM;
}
