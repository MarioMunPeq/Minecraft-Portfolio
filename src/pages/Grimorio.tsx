import { CraftingStation } from '../components/grimorio/CraftingStation';
import { BackButton } from '../components/grimorio/BackButton';

export function Grimorio() {
  return (
    <div className="mc-screen mc-grimorio-screen">
      <div className="mc-grimorio-container">
        <CraftingStation />
      </div>
      <BackButton />
    </div>
  );
}