import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function WorldLoadingScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const duration = 1500 + Math.random() * 1000;
    const timer = setTimeout(() => {
      navigate('/crafting-table');
    }, duration);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="mc-loading-screen">
      <div className="mc-loading-text">Loading terrain...</div>
    </div>
  );
}