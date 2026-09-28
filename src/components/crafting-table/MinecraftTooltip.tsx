interface MinecraftTooltipProps {
  text: string;
  isVisible: boolean;
  position?: { x: number; y: number };
}

const OFFSET_X = 14;
const OFFSET_Y = 10;
const MARGIN = 8;

export function MinecraftTooltip({ text, isVisible, position }: MinecraftTooltipProps) {
  if (!isVisible || !position) return null;

  // El tooltip se ancla al raton pero no puede salirse de la pantalla.
  const flipX = position.x + OFFSET_X > window.innerWidth - 180;
  const left = flipX ? position.x - OFFSET_X - 160 : position.x + OFFSET_X;
  const top = Math.min(position.y + OFFSET_Y, window.innerHeight - MARGIN - 24);

  return (
    <div className="mc-tooltip" style={{ left: Math.max(left, MARGIN), top }} role="tooltip">
      <span className="mc-tooltip-text">{text}</span>
    </div>
  );
}
