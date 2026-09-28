import type { ReactNode } from 'react';

interface MinecraftTooltipProps {
  children?: ReactNode;
  text: string;
  isVisible: boolean;
  position?: { x: number; y: number };
}

export function MinecraftTooltip({ children, text, isVisible, position }: MinecraftTooltipProps) {
  return (
    <span className="mc-tooltip-trigger">
      {children}
      {isVisible && position && (
        <div
          className="mc-tooltip"
          style={{
            left: position.x + 16,
            top: position.y - 8,
          }}
        >
          <span className="mc-tooltip-text">{text}</span>
        </div>
      )}
    </span>
  );
}