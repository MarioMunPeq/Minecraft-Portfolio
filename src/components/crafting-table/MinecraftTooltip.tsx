import { createPortal } from 'react-dom';

interface MinecraftTooltipProps {
  text: string;
  isVisible: boolean;
  position?: { x: number; y: number };
}

const OFFSET = 14;
const MARGIN = 8;

export function MinecraftTooltip({ text, isVisible, position }: MinecraftTooltipProps) {
  if (!isVisible || !position) return null;

  // El panel que contiene el slot es un contenedor de tamaño (container-type),
  // y eso convierte sus descendientes con position: fixed en absolutos
  // respecto al panel. El tooltip tiene que salir a document.body para poder
  // anclarse a la ventana y no lo recorta el overflow del panel.
  const flipX = position.x + OFFSET + 180 > window.innerWidth;
  const left = flipX ? position.x - OFFSET - 180 : position.x + OFFSET;
  const top = Math.min(position.y + OFFSET, window.innerHeight - MARGIN - 28);

  return createPortal(
    <div
      className="mc-tooltip"
      style={{ left: Math.max(left, MARGIN), top }}
      role="tooltip"
    >
      <span className="mc-tooltip-text">{text}</span>
    </div>,
    document.body,
  );
}
