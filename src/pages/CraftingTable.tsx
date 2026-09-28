import { CraftingStation } from '../components/crafting-table/CraftingStation';
import { BackButton } from '../components/crafting-table/BackButton';

export function CraftingTable() {
  return (
    <div className="mc-screen mc-crafting-table-screen">
      <CraftingStation />
      <BackButton />
    </div>
  );
}