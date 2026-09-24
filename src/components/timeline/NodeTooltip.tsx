import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

interface NodeTooltipProps {
  title: string;
  description: string;
  x: number;
  y: number;
  children: ReactNode;
}

export function NodeTooltip({ title, description, x, y, children }: NodeTooltipProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!isHovered) return;
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isHovered]);

  return (
    <span
      className="tl-node-trigger"
      style={{ left: x, top: y }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      {isHovered && (
        <div className="tl-tooltip" style={{ left: position.x + 16, top: position.y - 8 }}>
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