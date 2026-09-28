import { useState } from 'react';
import type { ReactNode } from 'react';

interface NodeTooltipProps {
  title: string;
  description: string;
  x: number;
  y: number;
  canvasWidth: number;
  canvasHeight: number;
  children: ReactNode;
}

export function NodeTooltip({
  title,
  description,
  x,
  y,
  canvasWidth,
  canvasHeight,
  children,
}: NodeTooltipProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <span
      className="tl-node-trigger"
      style={{
        left: `${(x / canvasWidth) * 100}%`,
        top: `${(y / canvasHeight) * 100}%`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      {isHovered && (
        <div className="tl-tooltip">
          <span className="tl-tooltip-frame" />
          <span className="tl-tooltip-body">
            <span className="tl-tooltip-title">{title}</span>
            <span className="tl-tooltip-desc">{description}</span>
          </span>
        </div>
      )}
    </span>
  );
}
