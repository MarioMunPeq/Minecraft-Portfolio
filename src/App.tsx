import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WorldSelect } from './components/WorldSelect';
import { WorldLoadingScreen } from './components/WorldLoadingScreen';
import { CraftingTable } from './pages/CraftingTable';
import { Timeline } from './components/timeline/Timeline';

function App() {
  return (
    <BrowserRouter basename="/Minecraft-Portfolio">
      <Routes>
        <Route path="/" element={<WorldSelect />} />
        <Route path="/cargando" element={<WorldLoadingScreen />} />
        <Route path="/crafting-table" element={<CraftingTable />} />
        <Route path="/timeline" element={<Timeline />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;