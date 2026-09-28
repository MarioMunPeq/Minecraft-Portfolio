import { guiUrl } from './guiUrl';

interface ItemSpriteProps {
  /** Ruta relativa dentro de public/assets/mc/, p. ej. 'items/redstone'. */
  item: string;
  className?: string;
  alt?: string;
}

/** Sprite de 16x16 de Minecraft, escalado con filtrado pixelado. */
export function ItemSprite({ item, className = '', alt = '' }: ItemSpriteProps) {
  return (
    <img
      className={`mc-item-sprite ${className}`.trim()}
      src={guiUrl(`assets/mc/${item}.png`)}
      alt={alt}
      aria-hidden={alt === '' ? true : undefined}
      draggable={false}
    />
  );
}
