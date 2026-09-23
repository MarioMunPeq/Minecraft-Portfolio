import { MinecraftTooltip } from './MinecraftTooltip';
import { TECH_ICONS } from '../../data/projects';

interface MinecraftSlotProps {
  technology: string;
  size?: number;
}

export function MinecraftSlot({ technology, size = 48 }: MinecraftSlotProps) {
  const icon = TECH_ICONS[technology] || '?';

  return (
    <MinecraftTooltip text={technology}>
      <div
        className="mc-slot"
        style={{ width: size, height: size }}
      >
        <span className="mc-slot-icon" style={{ fontSize: size * 0.5 }}>{icon}</span>
      </div>
    </MinecraftTooltip>
  );
}