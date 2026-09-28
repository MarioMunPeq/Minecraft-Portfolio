import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { AudioContext } from './AudioContext';
import type { AudioApi } from './AudioContext';
import { getAudioMuted, setAudioMuted, playSound, MENU_MUSIC } from './audio';
import { guiUrl } from '../components/crafting-table/guiUrl';

export function AudioProvider({ children }: { children: ReactNode }) {
  const [muted, setMuted] = useState(() => getAudioMuted());
  const musicRef = useRef<HTMLAudioElement | null>(null);

  const toggleMuted = useCallback(() => {
    playSound('click');
    const next = !muted;
    setAudioMuted(next);
    setMuted(next);
  }, [muted]);

  const api = useMemo<AudioApi>(
    () => ({
      muted,
      toggleMuted,
      playClick: () => playSound('click'),
      playPop: () => playSound('pop'),
      playLevelup: () => playSound('levelup'),
    }),
    [muted, toggleMuted],
  );

  useEffect(() => {
    if (musicRef.current) {
      musicRef.current.muted = muted;
    }
  }, [muted]);

  useEffect(() => {
    if (musicRef.current) {
      musicRef.current.volume = 0.35;
    }
  }, []);

  useEffect(() => {
    const resume = () => {
      musicRef.current?.play().catch(() => {});
    };
    window.addEventListener('pointerdown', resume);
    return () => window.removeEventListener('pointerdown', resume);
  }, []);

  return (
    <AudioContext.Provider value={api}>
      <audio
        ref={musicRef}
        src={MENU_MUSIC}
        loop
        autoPlay
        preload="auto"
        muted={muted}
      />
      <button
        type="button"
        className="mc-audio-toggle"
        onClick={toggleMuted}
        aria-pressed={!muted}
        title={muted ? 'Activar sonido' : 'Silenciar'}
        aria-label={muted ? 'Activar sonido' : 'Silenciar'}
      >
        <span
          className={`mc-audio-toggle-icon${muted ? ' is-muted' : ''}`}
          style={{ backgroundImage: `url("${guiUrl('gui/sprites/icon/music_notes.png')}")` }}
          aria-hidden
        />
      </button>
      {children}
    </AudioContext.Provider>
  );
}