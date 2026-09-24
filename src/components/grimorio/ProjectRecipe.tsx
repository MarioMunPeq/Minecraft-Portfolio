import type { Project } from '../../data/projects';
import { INVENTORY_STACK } from '../../data/projects';
import { MinecraftSlot } from './MinecraftSlot';
import { MinecraftTooltip } from './MinecraftTooltip';
import { IconImage } from './IconImage';
import { useAudio } from '../../audio/AudioContext';
import { guiUrl } from './guiUrl';

interface ProjectRecipeProps {
  project: Project;
}

const INVENTORY_ROWS = [84, 102, 120, 142];

function slotPos(col: number, row: number): React.CSSProperties {
  return {
    left: `calc(${8 + col * 18}px * var(--gui-scale))`,
    top: `calc(${row}px * var(--gui-scale))`,
  };
}

export function ProjectRecipe({ project }: ProjectRecipeProps) {
  const { playClick, playLevelup } = useAudio();

  const handleResultClick = () => {
    playClick();
    playLevelup();
  };

  return (
    <div className="mc-panel mc-panel-right">
      {project.technologies.slice(0, 9).map((technology, index) => (
        <div
          key={`${project.id}-${index}`}
          className="mc-slot-btn"
          style={{
            left: `calc(${30 + (index % 3) * 18}px * var(--gui-scale))`,
            top: `calc(${17 + Math.floor(index / 3) * 18}px * var(--gui-scale))`,
          }}
        >
          <img
            className="mc-slot-hover"
            src={guiUrl('gui/sprites/container/slot_highlight_front.png')}
            alt=""
            aria-hidden
          />
          <MinecraftTooltip text={technology}>
            <MinecraftSlot technology={technology} />
          </MinecraftTooltip>
        </div>
      ))}

      <a
        className="mc-slot-btn mc-result-slot"
        href={project.url}
        target="_blank"
        rel="noreferrer"
        aria-label={project.name}
        onClick={handleResultClick}
      >
        <img
          className="mc-slot-hover"
          src={guiUrl('gui/sprites/container/slot_highlight_front.png')}
          alt=""
          aria-hidden
        />
        <MinecraftTooltip text={`${project.name}\n${project.description}`}>
          <IconImage name={project.icon} className="mc-slot-glyph" />
        </MinecraftTooltip>
      </a>

      {INVENTORY_STACK.map((technology, index) => {
        const col = index % 9;
        const row = INVENTORY_ROWS[Math.floor(index / 9)];
        return (
          <div
            key={`${technology}-${index}`}
            className="mc-slot-btn"
            style={slotPos(col, row)}
          >
            <img
              className="mc-slot-hover"
              src={guiUrl('gui/sprites/container/slot_highlight_front.png')}
              alt=""
              aria-hidden
            />
            <MinecraftTooltip text={technology}>
              <MinecraftSlot technology={technology} />
            </MinecraftTooltip>
          </div>
        );
      })}
    </div>
  );
}