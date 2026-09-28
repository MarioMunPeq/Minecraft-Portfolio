import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MIN_DURATION = 1500;
const MAX_DURATION = 2500;

export function WorldLoadingScreen() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = MIN_DURATION + Math.random() * (MAX_DURATION - MIN_DURATION);
    const start = performance.now();
    let frame = 0;

    const step = (now: number) => {
      const ratio = Math.min(1, (now - start) / duration);

      // El juego arranca rapido, se frena cerca del final y se queda en 99.
      const eased = 1 - Math.pow(1 - ratio, 2.2);
      setProgress(ratio < 1 ? Math.min(99, Math.floor(eased * 100)) : 100);

      if (ratio < 1) {
        frame = requestAnimationFrame(step);
      } else {
        navigate('/crafting-table');
      }
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [navigate]);

  // La caja crece con el porcentaje, igual que en la pantalla original.
  const scale = 0.45 + (progress / 100) * 0.55;

  return (
    <div className="mc-loading-screen">
      <div className="mc-loading-stage">
        <div className="mc-loading-percent">{progress}%</div>
        <div className="mc-loading-box" style={{ transform: `scale(${scale})` }}>
          <div className="mc-loading-box-face" />
        </div>
        <div className="mc-loading-text">Generando terreno</div>
      </div>
    </div>
  );
}
