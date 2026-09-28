import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { guiUrl } from './guiUrl';
import { useAudio } from '../../audio/AudioContext';
import type { Project } from '../../data/projects';

interface BookModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

export function BookModal({ project, isOpen, onClose }: BookModalProps) {
  const { playClick } = useAudio();

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
    <div className="mc-book-modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={project.name}>
      <div className="mc-book-modal" onClick={(e) => e.stopPropagation()}>
        <button
          className="mc-book-close-btn"
          onClick={() => {
            playClick();
            onClose();
          }}
          aria-label="Cerrar libro"
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
            <h2 className="mc-book-title">{project.name}</h2>
            <p className="mc-book-description">{project.description}</p>
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer"
              className="mc-book-visit-btn"
              onClick={(e) => {
                e.stopPropagation();
                playClick();
              }}
            >
              Visitar proyecto
            </a>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
