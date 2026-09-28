import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { guiUrl } from './guiUrl';
import { useAudio } from '../../audio/AudioContext';
import { itemForTech } from '../../mc/techs';
import type { Project } from '../../mc/types';
import { ItemSprite } from './ItemSprite';
import { Slot } from './Slot';
import { MDX_COMPONENTS } from './MdxComponents';
import { Lightbox } from './Lightbox';

/**
 * Coordenadas medidas sobre gui/container/generic_54.png (GUI de 176x222).
 * El cofre son 6 filas de 9 desde (8, 18) con paso 18. Debajo, de y 140 a 213,
 * esta el inventario del jugador, que aqui se usa de panel de texto.
 */
const ITEMS_X = 8;
const ITEMS_Y = 18;
const PITCH = 18;
const COLS = 9;
const MAX_CELLS = COLS * 6;
const TEXT_X = 8;
const TEXT_W = 160;
const TEXT_BOTTOM = 221;

interface ChestModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

export function ChestModal({ project, isOpen, onClose }: ChestModalProps) {
  const { playClick } = useAudio();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [hovered, setHovered] = useState<{ id: string | null; at: { x: number; y: number } | null }>({
    id: null,
    at: null,
  });
  const { meta, Description } = project;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen && lightboxIndex === null) {
        playClick();
        onClose();
      }
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, playClick, lightboxIndex]);

  if (!isOpen) return null;

  // El item del proyecto va primero, luego el stack, y lo que quede lo
  // ocupan las capturas.
  const techCells = meta.technologies.map((tech) => ({
    key: `tech-${tech}`,
    kind: 'tech' as const,
    item: itemForTech(tech),
    label: tech,
  }));
  // Las capturas viven en public/projects/<id>/.
  const galleryCells = meta.gallery.map((file, index) => ({
    key: `shot-${file}`,
    kind: 'image' as const,
    src: `projects/${meta.id}/${file}`,
    index,
    label: `Captura ${index + 1}`,
  }));

  const cells = [
    { key: 'result', kind: 'result' as const, item: meta.result, label: meta.title },
    ...techCells,
    ...galleryCells,
  ].slice(0, MAX_CELLS);

  const setHover = (id: string | null, at?: { x: number; y: number }) => {
    setHovered({ id, at: at ?? null });
  };

  const close = () => {
    playClick();
    onClose();
  };

  const galleryPaths = meta.gallery.map((file) => `projects/${meta.id}/${file}`);

  // El panel de texto arranca justo debajo de la ultima fila ocupada y llega
  // hasta el borde inferior del cofre, para que no se vea ninguna rejilla
  // vacia ni el inventario del jugador de la textura.
  const usedRows = Math.ceil(Math.min(MAX_CELLS, cells.length) / COLS);
  const textTop = ITEMS_Y + usedRows * PITCH;
  const textHeight = TEXT_BOTTOM - textTop;

  return createPortal(
    <div className="mc-chest-overlay" onClick={close} role="presentation">
      <div
        className="mc-chest"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={meta.title}
      >
        <h2 className="mc-chest-title">{meta.title}</h2>

        <div className="mc-chest-items" role="list">
          {cells.map((cell, index) => {
            const col = index % COLS;
            const row = Math.floor(index / COLS);
            const style = {
              left: `calc(${(ITEMS_X + col * PITCH)} * var(--px))`,
              top: `calc(${(ITEMS_Y + row * PITCH)} * var(--px))`,
            };

            if (cell.kind === 'image') {
              return (
                <button
                  key={cell.key}
                  type="button"
                  className="mc-slot-btn mc-chest-shot"
                  style={style}
                  onClick={() => {
                    playClick();
                    setLightboxIndex(cell.index);
                  }}
                  onMouseEnter={(event) => setHover(cell.key, { x: event.clientX, y: event.clientY })}
                  onMouseLeave={() => setHover(null)}
                  aria-label={cell.label}
                >
                  <span
                    className="mc-chest-shot-img"
                    style={{ backgroundImage: `url("${guiUrl(cell.src)}")` }}
                  />
                </button>
              );
            }

            return (
              <Slot
                key={cell.key}
                id={cell.key}
                className="mc-chest-slot"
                style={style}
                isHovered={hovered.id === cell.key}
                hoverPosition={hovered.id === cell.key ? (hovered.at ?? undefined) : undefined}
                onHover={setHover}
                tooltip={cell.label}
                aria-label={cell.label}
              >
                <ItemSprite item={cell.item} alt={cell.kind === 'result' ? cell.label : ''} />
              </Slot>
            );
          })}
        </div>

        <div
          className="mc-chest-text"
          style={{
            left: `calc(${TEXT_X} * var(--px))`,
            top: `calc(${textTop} * var(--px))`,
            width: `calc(${TEXT_W} * var(--px))`,
            height: `calc(${textHeight} * var(--px))`,
          }}
        >
          <div className="mc-chest-scroll">
            <p className="mc-chest-tagline">{meta.tagline}</p>
            <p className="mc-chest-meta">
              {meta.year} · {meta.status}
            </p>
            <div className="mc-chest-body">
              <Description components={MDX_COMPONENTS} />
            </div>
          </div>

          <div className="mc-chest-links">
            <a
              className="mc-chest-btn"
              href={meta.demo}
              target="_blank"
              rel="noreferrer"
              onClick={(event) => {
                event.stopPropagation();
                playClick();
              }}
            >
              Ver demo
            </a>
            <a
              className="mc-chest-btn"
              href={meta.repo}
              target="_blank"
              rel="noreferrer"
              onClick={(event) => {
                event.stopPropagation();
                playClick();
              }}
            >
              Código
            </a>
          </div>
        </div>

        <button className="mc-chest-close" onClick={close} aria-label="Cerrar">
          <img src={guiUrl('gui/sprites/widget/cross_button.png')} alt="" aria-hidden />
        </button>
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={galleryPaths}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </div>,
    document.body,
  );
}
