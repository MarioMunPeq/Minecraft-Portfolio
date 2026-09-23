import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WorldSelect } from './components/WorldSelect';
import { Grimorio } from './pages/Grimorio';

function App() {
  return (
    <BrowserRouter basename="/Minecraft-Portfolio">
      <Routes>
        <Route path="/" element={<WorldSelect />} />
        <Route path="/grimorio" element={<Grimorio />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;