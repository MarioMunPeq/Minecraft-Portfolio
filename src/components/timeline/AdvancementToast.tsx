import { useEffect, useRef } from 'react';
import { playSound } from '../../audio/audio';
import { IconImage } from '../crafting-table/IconImage';

export interface ToastPayload {
  icon: string;
  title: string;
  key: number;
}

interface AdvancementToastProps {
  payload: ToastPayload | null;
  onDone: () => void;
}

function toastNameFont(title: string): number {
  const length = [...title].length;
  if (length <= 16) return 8;
  if (length <= 24) return 7;
  return 6;
}

export function AdvancementToast({ payload, onDone }: AdvancementToastProps) {
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    if (!payload) return;
    playSound('toastIn');
    const outTimer = window.setTimeout(() => playSound('toastOut'), 3400);
    const doneTimer = window.setTimeout(() => onDoneRef.current(), 3800);
    return () => {
      window.clearTimeout(outTimer);
      window.clearTimeout(doneTimer);
    };
  }, [payload]);

  if (!payload) return null;

  return (
    <div key={payload.key} className="tl-toast" role="status">
      <IconImage name={payload.icon} className="tl-toast-icon" />
      <span className="tl-toast-title">¡Logro conseguido!</span>
      <span
        className="tl-toast-name"
        style={{ fontSize: `calc(${toastNameFont(payload.title)}px * var(--gui-scale))` }}
      >
        {payload.title}
      </span>
    </div>
  );
}