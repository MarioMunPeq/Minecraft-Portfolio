export type SoundName = 'click' | 'pop' | 'levelup' | 'toastIn' | 'toastOut';

const SOUND_SOURCES: Record<SoundName, string> = {
  click: 'audio/random/click.ogg',
  pop: 'audio/random/pop.ogg',
  levelup: 'audio/random/levelup.ogg',
  toastIn: 'audio/ui/toast/in.ogg',
  toastOut: 'audio/ui/toast/out.ogg',
};

const MUTE_KEY = 'mc-audio-muted';

let muted = (() => {
  try {
    return localStorage.getItem(MUTE_KEY) === '1';
  } catch {
    return false;
  }
})();

function assetUrl(path: string): string {
  return `${import.meta.env.BASE_URL}${path}`.replace(/\/{2,}/g, '/');
}

const pools: Partial<Record<SoundName, HTMLAudioElement[]>> = {};

export function playSound(name: SoundName): void {
  if (muted) return;
  const pool = (pools[name] ??= []);
  let audio = pool.find((a) => a.paused);
  if (!audio) {
    audio = new Audio(assetUrl(SOUND_SOURCES[name]));
    pool.push(audio);
    if (pool.length > 4) pool.shift();
  }
  audio.currentTime = 0;
  void audio.play().catch(() => {});
}

export function getAudioMuted(): boolean {
  return muted;
}

export function setAudioMuted(value: boolean): void {
  muted = value;
  try {
    localStorage.setItem(MUTE_KEY, value ? '1' : '0');
  } catch {
    // almacenamiento no disponible
  }
}

export const MENU_MUSIC = assetUrl('audio/music/menu/floating_trees.ogg');