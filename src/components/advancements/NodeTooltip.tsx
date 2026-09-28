import { createPortal } from 'react-dom';
import type { AdvancementNode } from '../../mc/advancements';

interface NodeTooltipProps {
  node: AdvancementNode;
  isVisible: boolean;
  position?: { x: number; y: number };
}

const OFFSET = 14;
const MARGIN = 8;
const WIDTH = 190;

export function NodeTooltip({ node, isVisible, position }: NodeTooltipProps) {
  if (!isVisible || !position) return null;

  // El panel de la ventana es un contenedor de tamaño, asi que un position:
  // fixed aqui se mediria contra el panel. El tooltip sale a document.body.
  const flipX = position.x + OFFSET + WIDTH > window.innerWidth;
  const left = flipX ? position.x - OFFSET - WIDTH : position.x + OFFSET;
  const top = Math.min(position.y + OFFSET, window.innerHeight - MARGIN - 70);

  return createPortal(
    <div
      className="mc-tooltip mc-node-tooltip"
      style={{ left: Math.max(left, MARGIN), top }}
      role="tooltip"
    >
      <span className="mc-node-tooltip-title">{node.title}</span>
      {node.subtitle && <span className="mc-node-tooltip-sub">{node.subtitle}</span>}
      <span className="mc-node-tooltip-period">{node.period}</span>
      {node.technologies.length > 0 && (
        <span className="mc-node-tooltip-techs">
          {node.technologies.join(' · ')}
        </span>
      )}
    </div>,
    document.body,
  );
}
