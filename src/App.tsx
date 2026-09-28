import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TitleScreen } from './components/TitleScreen';
import { WorldSelect } from './components/WorldSelect';
import { WorldLoadingScreen } from './components/WorldLoadingScreen';
import { CraftingTable } from './pages/CraftingTable';
import { AdvancementsScreen } from './components/advancements/AdvancementsScreen';

function App() {
  return (
    <BrowserRouter basename="/Minecraft-Portfolio">
      <Routes>
        <Route path="/" element={<TitleScreen />} />
        <Route path="/singleplayer" element={<WorldSelect />} />
        <Route path="/cargando" element={<WorldLoadingScreen />} />
        <Route path="/crafting-table" element={<CraftingTable />} />
        <Route path="/advancements" element={<AdvancementsScreen />} />
        {/* Cualquier ruta que no exista (un enlace mal escrito, por ejemplo)
            devuelve al menu en vez de dejar la pantalla en blanco. */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
