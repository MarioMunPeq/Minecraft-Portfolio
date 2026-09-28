import { useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { guiUrl } from './guiUrl';

interface LightboxProps {
  images: string[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function Lightbox({ images, index, onClose, onNavigate }: LightboxProps) {
  const total = images.length;
  const src = images[index];

  const go = useCallback(
    (delta: number) => {
      if (total === 0) return;
      onNavigate((index + delta + total) % total);
    },
    [index, total, onNavigate],
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      else if (event.key === 'ArrowRight') go(1);
      else if (event.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [go, onClose]);

  if (!src) return null;

  return createPortal(
    <div
      className="mc-lightbox"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Imagen ${index + 1} de ${total}`}
    >
      <img
        className="mc-lightbox-image"
        src={guiUrl(src)}
        alt={`Captura ${index + 1} de ${total}`}
        onClick={(event) => event.stopPropagation()}
        draggable={false}
      />

      {total > 1 && (
        <div className="mc-lightbox-nav" onClick={(event) => event.stopPropagation()}>
          <button
            type="button"
            className="mc-lightbox-btn"
            onClick={() => go(-1)}
            aria-label="Anterior"
          >
            <img src={guiUrl('gui/sprites/widget/page_backward.png')} alt="" aria-hidden />
          </button>
          <span className="mc-lightbox-count">
            {index + 1} / {total}
          </span>
          <button
            type="button"
            className="mc-lightbox-btn"
            onClick={() => go(1)}
            aria-label="Siguiente"
          >
            <img src={guiUrl('gui/sprites/widget/page_forward.png')} alt="" aria-hidden />
          </button>
        </div>
      )}

      <img
        className="mc-lightbox-close"
        src={guiUrl('gui/sprites/widget/cross_button.png')}
        alt="Cerrar"
        onClick={onClose}
        draggable={false}
      />
    </div>,
    document.body,
  );
}
