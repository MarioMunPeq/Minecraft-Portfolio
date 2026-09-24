import { createContext, useContext } from 'react';

export interface AudioApi {
  muted: boolean;
  toggleMuted: () => void;
  playClick: () => void;
  playPop: () => void;
  playLevelup: () => void;
}

export const AudioContext = createContext<AudioApi | null>(null);

export function useAudio(): AudioApi {
  const ctx = useContext(AudioContext);
  if (!ctx) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return ctx;
}