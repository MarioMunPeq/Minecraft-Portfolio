import type { ReactNode, MouseEvent } from 'react';
import { MinecraftTooltip } from './MinecraftTooltip';

interface SlotProps {
  id: string;
  children: ReactNode;
  tooltipText?: string;
  isSelected?: boolean;
  isHovered: boolean;
  hoverPosition?: { x: number; y: number };
  onHover: (id: string | null, position?: { x: number; y: number }) => void;
  onClick?: () => void;
  className?: string;
  role?: string;
  'aria-label'?: string;
  'aria-pressed'?: boolean;
  type?: 'button' | 'div';
}

export function Slot({
  id,
  children,
  tooltipText,
  isHovered,
  hoverPosition,
  onHover,
  onClick,
  className = '',
  role,
  'aria-label': ariaLabel,
  'aria-pressed': ariaPressed,
  type = 'button',
}: SlotProps) {
  const handleMouseEnter = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    onHover(id, { x: event.clientX, y: event.clientY });
  };

  const handleMouseLeave = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    onHover(null);
  };

  const baseClasses = `mc-slot-btn ${className}${isHovered ? ' mc-slot-hovered' : ''}`;

  const slotContent = (
    <div
      className="mc-tooltip-trigger"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      role={role}
      aria-label={ariaLabel}
      aria-pressed={ariaPressed}
      style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      {children}
      {tooltipText && <MinecraftTooltip text={tooltipText} isVisible={isHovered} position={hoverPosition} />}
    </div>
  );

  if (type === 'button') {
    return (
      <button
        type="button"
        className={baseClasses}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        aria-label={ariaLabel}
        aria-pressed={ariaPressed}
      >
        {slotContent}
      </button>
    );
  }

  return (
    <div
      className={baseClasses}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      role={role}
      aria-label={ariaLabel}
      aria-pressed={ariaPressed}
    >
      {slotContent}
    </div>
  );
}