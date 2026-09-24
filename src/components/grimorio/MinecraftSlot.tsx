import { TECH_ICONS } from '../../data/projects';
import { IconImage } from './IconImage';

interface MinecraftSlotProps {
  technology: string;
}

export function MinecraftSlot({ technology }: MinecraftSlotProps) {
  const icon = TECH_ICONS[technology] ?? 'unknown';

  return <IconImage name={icon} className="mc-slot-glyph" />;
}
