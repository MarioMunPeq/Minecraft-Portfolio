import { useEffect, useState } from 'react';
import type { MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import { useAudio } from '../../audio/AudioContext';
import {
  ENCHANT_COST,
  ENCHANT_COST_LABEL,
  ENCHANT_WORDS,
  ENCHANT_XP,
  ENCHANT_XP_LABEL,
  SKILLS,
  levelColor,
} from '../../content/skills';
import type { Skill } from '../../content/skills';
import { MinecraftTooltip } from '../crafting-table/MinecraftTooltip';
import { guiUrl } from '../crafting-table/guiUrl';
import { SgaText } from './sga';
import { rollSgaName } from './sgaName';

/**
 * Coordenadas medidas sobre gui/container/enchanting_table.png, que es un
 * atlas de 256x256 con la ventana de 176x166 en su esquina superior
 * izquierda.
 *
 * Arriba: el recuadro de 20x20 en (58,13) es el objeto que se encanta, con el
 * item 16x16 centrado dentro en (60,15), y las dos ranuras de 18x18 de
 * (14,46) y (34,46), con el item un pixel dentro.
 *
 * A la derecha hay tres filas de opcion: los bordes horizontales estan en
 * y 14, 33, 52 y 71, y la caja va de x 78 a 157, asi que el interior es
 * x 79..156 y 17 de alto.
 *
 * Abajo, el inventario del jugador: nueve columnas desde x 7 con paso 18
 * (el item en x 8), filas en y 83, 101 y 119, y el atajo en y 141. Las
 * cinco habilidades ocupan los cinco primeros huecos de la primera fila.
 */
const TITLE = { x: 8, y: 6 };
const TARGET = { x: 60, y: 15 };
const COST_SLOT = { x: 15, y: 47 };
const XP_SLOT = { x: 35, y: 47 };
const INVENTORY_LABEL = { x: 8, y: 74 };

const OPTION_TOPS = [15, 34, 53];
const OPTION_X = 79;

const SKILL_XS = [8, 26, 44, 62, 80];
const SKILL_Y = 84;

const CLOSE = { x: 161, y: 1 };

/** Una tirada para las tres filas: nombre en jeroglificos y coste en niveles. */
const rollRunes = () =>
  OPTION_TOPS.map(() => ({
    text: rollSgaName(ENCHANT_WORDS),
    cost: 1 + Math.floor(Math.random() * 5),
  }));

const at = (x: number, y: number) => ({
  left: `calc(${x} * var(--px))`,
  top: `calc(${y} * var(--px))`,
});

interface EnchantGuiProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EnchantGui({ isOpen, onClose }: EnchantGuiProps) {
  const { playClick } = useAudio();
  const [selected, setSelected] = useState<Skill | null>(null);
  const [hover, setHover] = useState<{ text: string; x: number; y: number } | null>(null);

  /* Las tres filas empiezan con un nombre de jeroglificos tirado al azar, y
     se vuelven a tirar al cambiar de habilidad, como cuando mueves el item
     en la mesa. La primera fila es la que muestra la habilidad en claro. */
  const [runes, setRunes] = useState(rollRunes);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        playClick();
        onClose();
      }
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, playClick]);

  if (!isOpen) return null;

  const close = () => {
    playClick();
    setHover(null);
    onClose();
  };

  const showTip = (text: string) => (event: MouseEvent<HTMLElement>) =>
    setHover({ text, x: event.clientX, y: event.clientY });

  const hideTip = () => setHover(null);

  const select = (skill: Skill) => {
    playClick();
    setRunes(rollRunes());
    setSelected((prev) => (prev?.id === skill.id ? null : skill));
  };

  return createPortal(
    <div className="mc-enchant-overlay" onClick={close} role="presentation">
      <div
        className="mc-enchant"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Habilidades blandas"
      >
        <div className="mc-enchant-title" style={at(TITLE.x, TITLE.y)}>
          Encantar
        </div>

        <div
          className="mc-enchant-target"
          style={at(TARGET.x, TARGET.y)}
          onMouseEnter={showTip(ENCHANT_COST_LABEL)}
          onMouseMove={showTip(ENCHANT_COST_LABEL)}
          onMouseLeave={hideTip}
          role="img"
          aria-label={ENCHANT_COST_LABEL}
        >
          <img src={guiUrl(`assets/mc/${ENCHANT_COST}.png`)} alt="" aria-hidden />
        </div>

        <div
          className="mc-enchant-input"
          style={at(COST_SLOT.x, COST_SLOT.y)}
          onMouseEnter={showTip(ENCHANT_XP_LABEL)}
          onMouseMove={showTip(ENCHANT_XP_LABEL)}
          onMouseLeave={hideTip}
          role="img"
          aria-label={ENCHANT_XP_LABEL}
        >
          <img src={guiUrl(`assets/mc/${ENCHANT_XP}.png`)} alt="" aria-hidden />
        </div>

        <div className="mc-enchant-input mc-enchant-input-empty" style={at(XP_SLOT.x, XP_SLOT.y)} />

        <div className="mc-enchant-label" style={at(INVENTORY_LABEL.x, INVENTORY_LABEL.y)}>
          Inventario
        </div>

        {OPTION_TOPS.map((top, index) => {
          const isRevealed = index === 0 && selected;
          return (
            <div key={top} className="mc-enchant-row" style={at(OPTION_X, top)}>
              {isRevealed && selected ? (
                <>
                  <img
                    className="mc-enchant-row-icon"
                    src={guiUrl(`assets/mc/${selected.item}.png`)}
                    alt=""
                    aria-hidden
                  />
                  <span className="mc-enchant-row-name">{selected.name}</span>
                  <span
                    className="mc-enchant-row-level"
                    style={{ color: levelColor(selected.level) }}
                  >
                    {selected.level}
                  </span>
                </>
              ) : (
                <>
                  <SgaText text={runes[index].text} />
                  <span className="mc-enchant-row-filler" />
                  <span className="mc-enchant-row-level">{runes[index].cost}</span>
                </>
              )}
            </div>
          );
        })}

        {SKILLS.map((skill, index) => {
          const isSelected = selected?.id === skill.id;
          const tip = `${skill.name}\nNivel ${skill.level} de 5\n${skill.phrase}`;
          return (
            <button
              key={skill.id}
              type="button"
              className="mc-enchant-skill"
              style={{
                ...at(SKILL_XS[index], SKILL_Y),
                ['--lvl' as string]: levelColor(skill.level),
              }}
              onClick={() => select(skill)}
              onMouseEnter={showTip(tip)}
              onMouseMove={showTip(tip)}
              onMouseLeave={hideTip}
              aria-label={skill.name}
              aria-pressed={isSelected}
            >
              <img src={guiUrl(`assets/mc/${skill.item}.png`)} alt="" aria-hidden />
              <span className="mc-enchant-skill-level">{skill.level}</span>
            </button>
          );
        })}

        <button
          type="button"
          className="mc-enchant-close"
          style={at(CLOSE.x, CLOSE.y)}
          onClick={close}
          aria-label="Cerrar"
        >
          <img src={guiUrl('gui/sprites/widget/cross_button.png')} alt="" aria-hidden />
        </button>

        <MinecraftTooltip
          text={hover?.text ?? ''}
          isVisible={hover !== null}
          position={hover ?? undefined}
        />
      </div>
    </div>,
    document.body,
  );
}
