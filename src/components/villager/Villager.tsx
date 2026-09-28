import { useAudio } from '../../audio/AudioContext';
import { guiUrl } from '../crafting-table/guiUrl';
import { VILLAGER_LINE } from '../../content/skills';

interface VillagerProps {
  onOpen: () => void;
}

/**
 * La cabeza del bibliotecario, que hace de boton para abrir los trueques. Es
 * un recorte plano de la textura del aldeano: la cara esta en (8,8) y mide
 * 8x10, segun el desarrollo estandar de la caja de la cabeza (cabeza 8x10x8
 * con origen UV en 0,0, con el frente en (u+d, v+d) = (8,8)).
 */
export function Villager({ onOpen }: VillagerProps) {
  const { playClick } = useAudio();

  return (
    <button
      type="button"
      className="mc-villager"
      onClick={() => {
        playClick();
        onOpen();
      }}
      aria-label="Ver mis habilidades blandas"
    >
      <span className="mc-villager-bubble">{VILLAGER_LINE}</span>
      <span
        className="mc-villager-face"
        style={
          {
            '--vt': `url("${guiUrl('assets/mc/entities/villager/villager.png')}")`,
          } as React.CSSProperties
        }
      />
    </button>
  );
}
