import type { CSSProperties, ReactNode, MouseEvent } from 'react';
import { MinecraftTooltip } from './MinecraftTooltip';

interface SlotProps {
  id: string;
  children: ReactNode;
  /** Texto del tooltip. Si falta, el slot no muestra nada al pasar el raton. */
  tooltip?: string;
  isHovered: boolean;
  hoverPosition?: { x: number; y: number };
  onHover: (id: string | null, position?: { x: number; y: number }) => void;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
  role?: string;
  'aria-label'?: string;
  'aria-pressed'?: boolean;
}

export function Slot({
  id,
  children,
  tooltip,
  isHovered,
  hoverPosition,
  onHover,
  onClick,
  disabled = false,
  className = '',
  style,
  role,
  'aria-label': ariaLabel,
  'aria-pressed': ariaPressed,
}: SlotProps) {
  const handleMouseEnter = (event: MouseEvent<HTMLElement>) => {
    if (disabled) return;
    event.stopPropagation();
    onHover(id, { x: event.clientX, y: event.clientY });
  };

  const handleMouseLeave = (event: MouseEvent<HTMLElement>) => {
    if (disabled) return;
    event.stopPropagation();
    onHover(null);
  };

  const classes = [
    'mc-slot-btn',
    className,
    isHovered ? 'mc-slot-hovered' : '',
    disabled ? 'mc-slot-disabled' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={classes}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      disabled={disabled}
      style={style}
      role={role}
      aria-label={ariaLabel}
      aria-pressed={ariaPressed}
    >
      {children}
      {tooltip && (
        <MinecraftTooltip
          text={tooltip}
          isVisible={isHovered}
          position={hoverPosition}
        />
      )}
    </button>
  );
}
