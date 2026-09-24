import { useState, useEffect } from 'react';

interface MinecraftTooltipProps {
  children: React.ReactNode;
  text: string;
}

export function MinecraftTooltip({ children, text }: MinecraftTooltipProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    if (isHovered) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isHovered]);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <span
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="mc-tooltip-trigger"
    >
      {children}
      {isHovered && (
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