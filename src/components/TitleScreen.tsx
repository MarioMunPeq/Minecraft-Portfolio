import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAudio } from '../audio/AudioContext';
import { Panorama } from './Panorama';
import { Villager } from './villager/Villager';
import { EnchantGui } from './villager/EnchantGui';

const BASE = import.meta.env.BASE_URL;

/**
 * El juego saca el texto de propaganda al azar de una lista y lo inclina unos
 * grados al lado del logo. Se elige uno al cargar el modulo, que es
 * equivalente a hacerlo al abrir la pantalla.
 */
const SPLASHES = [
  'Viaje antes que destino!',
];

const SPLASH = SPLASHES[Math.floor(Math.random() * SPLASHES.length)];

/** El usuario sale de los repos del portfolio. */
const GITHUB_URL = 'https://github.com/MarioMunPeq';
const LINKEDIN_URL = 'https://www.linkedin.com/in/mario-mu%C3%B1oz-peque%C3%B1o/';

export function TitleScreen() {
  const navigate = useNavigate();
  const { playClick } = useAudio();
  const [skillsOpen, setSkillsOpen] = useState(false);
  const splash = SPLASH;

  const go = (path: string) => {
    playClick();
    navigate(path);
  };

  return (
    <div className="mc-title">
      <Panorama />

      <div className="mc-title-stack">
        <img className="mc-title-logo" src={`${BASE}gui/title/minecraft.png`} alt="Minecraft" />
        <img className="mc-title-edition" src={`${BASE}gui/title/edition.png`} alt="Java Edition" />
      </div>

      {/* Fuera del stack a proposito: este tiene un transform, y un ancestro
          con transform hace que position: fixed se resuelva contra el. */}
      <span className="mc-title-splash">{splash}</span>

      <nav className="mc-title-menu" aria-label="Menu principal">
        <button type="button" className="mc-title-btn" onClick={() => go('/singleplayer')}>
          Singleplayer
        </button>
        <button type="button" className="mc-title-btn mc-title-btn-inert">
          Multiplayer
        </button>
        <button type="button" className="mc-title-btn" onClick={() => go('/advancements')}>
          Logros
        </button>

        <div className="mc-title-menu-row">
          <a
            className="mc-title-btn"
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            onClick={playClick}
          >
            GitHub
          </a>
          <a
            className="mc-title-btn"
            href={LINKEDIN_URL}
            target="_blank"
            rel="noreferrer"
            onClick={playClick}
          >
            LinkedIn
          </a>
        </div>

        <div className="mc-title-menu-bottom">
          <button type="button" className="mc-title-btn mc-title-btn-small">
            Options...
          </button>
          <button type="button" className="mc-title-btn mc-title-btn-small">
            Quit Game
          </button>
        </div>
      </nav>

      <p className="mc-title-version">Minecraft 1.21.8</p>
      <p className="mc-title-copyright">Copyright Mojang AB. Do not distribute!</p>

      <Villager onOpen={() => setSkillsOpen(true)} />
      <EnchantGui isOpen={skillsOpen} onClose={() => setSkillsOpen(false)} />
    </div>
  );
}
