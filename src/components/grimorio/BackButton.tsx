import { useNavigate } from 'react-router-dom';
import { useAudio } from '../../audio/AudioContext';
import { guiUrl } from './guiUrl';

export function BackButton() {
  const navigate = useNavigate();
  const { playClick } = useAudio();

  const handleClick = () => {
    playClick();
    navigate('/');
  };

  return (
    <button className="mc-back-button" onClick={handleClick} type="button">
      <img
        className="mc-back-icon"
        src={guiUrl('gui/sprites/widget/page_backward.png')}
        alt=""
        aria-hidden
      />
      <span className="mc-back-text">Volver al menú</span>
    </button>
  );
}