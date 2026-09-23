import { useNavigate } from 'react-router-dom';

export function BackButton() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/');
  };

  return (
    <button className="mc-back-button" onClick={handleClick} type="button">
      <span className="mc-back-icon">◄</span>
      <span className="mc-back-text">Cerrar libro</span>
    </button>
  );
}