import { createPortal } from 'react-dom';
import { useEffect } from 'react';
import type { AdvancementNode } from '../../mc/advancements';
import { guiUrl } from '../crafting-table/guiUrl';
import { useAudio } from '../../audio/AudioContext';
import { MDX_COMPONENTS } from '../crafting-table/MdxComponents';

interface LoreBoxProps {
  node: AdvancementNode;
  /** Posicion del nodo en pantalla, para colocar la caja al lado. */
  anchor: { x: number; y: number };
  onClose: () => void;
}

const WIDTH = 420;
const MARGIN = 16;

/**
 * Caja de detalle, con el nine-slice del juego (title_box.png es escalable:
 * 200x26 con 10 de borde). Aparece al pulsar un nodo del arbol.
 */
export function LoreBox({ node, anchor, onClose }: LoreBoxProps) {
  const { playClick } = useAudio();
  const { Description } = node;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        playClick();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, playClick]);

  const flip = anchor.x + WIDTH + MARGIN > window.innerWidth;
  const left = flip ? Math.max(anchor.x - WIDTH - 12, MARGIN) : anchor.x + 12;
  const top = Math.max(Math.min(anchor.y - 20, window.innerHeight - 260), MARGIN);

  /* En vertical no hay sitio a un lado del nodo, asi que la caja se pega al
     borde inferior y ocupa el ancho entero, como una hoja. Los estilos van
     inline, asi que la posicion de abajo no se puede resolver desde el CSS. */
  const isSheet = window.matchMedia('(max-width: 900px) and (orientation: portrait)').matches;
  const placement = isSheet ? { left: 0, right: 0, bottom: 0 } : { left, top };

  return createPortal(
    <div
      className={`mc-lore${isSheet ? ' mc-lore-sheet' : ''}`}
      style={placement}
      role="dialog"
      aria-label={node.title}
    >
      <div className="mc-lore-head">
        <h3 className="mc-lore-title">{node.title}</h3>
        <p className="mc-lore-sub">{node.subtitle}</p>
        <p className="mc-lore-period">{node.period}</p>
      </div>

      <div className="mc-lore-body">
        <Description components={MDX_COMPONENTS} />
      </div>

      {node.technologies.length > 0 && (
        <p className="mc-lore-techs">
          {node.technologies.map((tech) => (
            <span key={tech} className="mc-lore-tech">
              {tech}
            </span>
          ))}
        </p>
      )}

      <button className="mc-lore-close" onClick={onClose} aria-label="Cerrar">
        <img src={guiUrl('gui/sprites/widget/cross_button.png')} alt="" aria-hidden />
      </button>
    </div>,
    document.body,
  );
}
