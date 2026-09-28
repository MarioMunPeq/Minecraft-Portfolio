import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { guiUrl } from './guiUrl';
import { useAudio } from '../../audio/AudioContext';
import type { Project } from '../../mc/types';

interface BookModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Modal provisional. La Fase 6 lo sustituye por el cofre grande, que es
 * donde iran las capturas y el detalle completo del proyecto.
 */
export function BookModal({ project, isOpen, onClose }: BookModalProps) {
  const { playClick } = useAudio();
  const { title, tagline, demo, repo, year } = project.meta;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        playClick();
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, playClick]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="mc-book-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="mc-book-modal" onClick={(event) => event.stopPropagation()}>
        <button
          className="mc-book-close-btn"
          onClick={() => {
            playClick();
            onClose();
          }}
          aria-label="Cerrar"
        >
          <img
            src={guiUrl('gui/sprites/widget/cross_button.png')}
            alt=""
            aria-hidden
            className="mc-book-close-icon"
          />
        </button>

        <div className="mc-book-page">
          <div className="mc-book-content">
            <h2 className="mc-book-title">{title}</h2>
            <p className="mc-book-description">{tagline}</p>
            <p className="mc-book-year">{year}</p>
            <div className="mc-book-links">
              <a
                href={demo}
                target="_blank"
                rel="noreferrer"
                className="mc-book-visit-btn"
                onClick={(event) => {
                  event.stopPropagation();
                  playClick();
                }}
              >
                Ver demo
              </a>
              <a
                href={repo}
                target="_blank"
                rel="noreferrer"
                className="mc-book-visit-btn"
                onClick={(event) => {
                  event.stopPropagation();
                  playClick();
                }}
              >
                Código
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
