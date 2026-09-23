import { useNavigate } from 'react-router-dom';

export function WorldSelect() {
  const navigate = useNavigate();

  const handlePlayClick = () => {
    navigate('/cargando');
  };

  return (
    <div className="mc-screen">
      <div className="mc-logo">
        <span className="mc-logo-text">Minecraft</span>
      </div>

      <div className="mc-world-list">
        <div className="mc-world-slot" role="button" tabIndex={0}>
          <div className="mc-world-icon">
            <div className="mc-world-icon-placeholder" />
          </div>
          <div className="mc-world-info">
            <span className="mc-world-name">Portfolio de Mario Muñoz</span>
            <span className="mc-world-meta">Un jugador, 1.20.4</span>
          </div>
        </div>
      </div>

      <div className="mc-button-row">
        <button className="mc-button mc-button-primary" onClick={handlePlayClick}>
          Jugar en el mundo seleccionado
        </button>
        <button className="mc-button" disabled>Crear mundo nuevo</button>
        <button className="mc-button" disabled>Editar</button>
        <button className="mc-button" disabled>Duplicar</button>
        <button className="mc-button" disabled>Eliminar</button>
        <button className="mc-button" disabled>Recrear</button>
        <button className="mc-button" disabled>Buscar en servidores de mundo</button>
      </div>
    </div>
  );
}