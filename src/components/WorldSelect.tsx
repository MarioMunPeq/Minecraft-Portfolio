import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAudio } from '../audio/AudioContext';
import { Panorama } from './Panorama';

const WORLD_NAME = 'Portfolio de Mario Muñoz';
const BASE = import.meta.env.BASE_URL;

const OVERLAY_SRC = `${BASE}gui/title/background/panorama_overlay.png`;

function formatDate(date: Date): string {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${dd}/${mm}/${yyyy}, ${hh}:${min}`;
}

export function WorldSelect() {
  const navigate = useNavigate();
  const { playClick } = useAudio();
  const lastPlayed = useMemo(() => formatDate(new Date()), []);

  const handlePlayClick = () => {
    playClick();
    navigate('/cargando');
  };

  const handleAdvancementsClick = () => {
    playClick();
    navigate('/advancements');
  };

  return (
    <div className="ws-screen">
      <Panorama />
      <img className="ws-pan-overlay" src={OVERLAY_SRC} alt="" />

      <div className="ws-column">
        <h1 className="ws-title">Select World</h1>

        <div className="ws-search">
          <img className="ws-search-icon" src={`${BASE}gui/sprites/icon/search.png`} alt="" />
          <input
            className="ws-search-input"
            type="text"
            spellCheck={false}
            aria-label="Buscar mundo"
          />
        </div>

        <div className="ws-list">
          <div className="ws-entry">
            <div className="ws-entry-highlight" />
            <img
              className="ws-entry-icon"
              src={`${BASE}gui/realms/new_world.png`}
              alt={WORLD_NAME}
            />
            <div className="ws-entry-info">
              <span className="ws-entry-name">{WORLD_NAME}</span>
              <span className="ws-entry-meta">
                {WORLD_NAME} ({lastPlayed})
              </span>
              <span className="ws-entry-meta">Survival Mode, Version: 26.3</span>
            </div>
          </div>
        </div>

        <div className="ws-buttons">
          <div className="ws-buttons-row">
            <button type="button" className="ws-button ws-button-play" onClick={handlePlayClick}>
              Play Selected World
            </button>
            <button type="button" className="ws-button ws-button-inert">
              Create New World
            </button>
          </div>
          <div className="ws-buttons-row">
            <button type="button" className="ws-button ws-button-inert">
              Edit
            </button>
            <button type="button" className="ws-button ws-button-inert">
              Delete
            </button>
            <button type="button" className="ws-button ws-button-timeline" onClick={handleAdvancementsClick}>
              Logros
            </button>
            <button type="button" className="ws-button ws-button-inert">
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}