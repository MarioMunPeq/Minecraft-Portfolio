import { useCallback, useEffect, useRef, useState } from 'react';
import type { MouseEvent as ReactMouseEvent, TouchEvent as ReactTouchEvent } from 'react';
import { TIMELINE_TABS, CANVAS_W, CANVAS_H, NODE_SIZE } from '../../data/timeline';
import type { TimelineNode, TimelineTab } from '../../data/timeline';
import { guiUrl } from '../crafting-table/guiUrl';
import { IconImage } from '../crafting-table/IconImage';
import { useAudio } from '../../audio/AudioContext';
import { AdvancementToast } from './AdvancementToast';
import type { ToastPayload } from './AdvancementToast';

const TAB_VISUAL: Record<TimelineTab['id'], { inactive: string; active: string }> = {
  proyectos: {
    inactive: 'gui/sprites/advancements/tab_above_left.png',
    active: 'gui/sprites/advancements/tab_above_left_selected.png',
  },
  experiencia: {
    inactive: 'gui/sprites/advancements/tab_above_middle.png',
    active: 'gui/sprites/advancements/tab_above_middle_selected.png',
  },
  educacion: {
    inactive: 'gui/sprites/advancements/tab_above_right.png',
    active: 'gui/sprites/advancements/tab_above_right_selected.png',
  },
};

const NODE_FRAME = 'gui/sprites/advancements/task_frame_obtained.png';
const WINDOW_BG = 'gui/advancements/window.png';
const claimedNodes = new Set<string>();

export function Timeline() {
  const [bgError, setBgError] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = guiUrl(WINDOW_BG);
    img.onload = () => setBgError(false);
    img.onerror = () => {
      console.error('[Timeline] Failed to load background:', guiUrl(WINDOW_BG));
      setBgError(true);
    };
  }, []);
  const { playClick } = useAudio();
  const [activeTab, setActiveTab] = useState<TimelineTab>(TIMELINE_TABS[0]);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [toast, setToast] = useState<ToastPayload | null>(null);

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const toastSeqRef = useRef(0);

  const drag = useRef({
    active: false,
    moved: false,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
  });

  const clampPan = useCallback((x: number, y: number) => {
    const vp = viewportRef.current;
    const cv = canvasRef.current;
    if (!vp || !cv) return { x, y };
    const vw = vp.clientWidth;
    const vh = vp.clientHeight;
    const cw = cv.offsetWidth;
    const ch = cv.offsetHeight;
    const minX = Math.min(0, vw - cw);
    const minY = Math.min(0, vh - ch);
    return {
      x: Math.max(minX, Math.min(0, x)),
      y: Math.max(minY, Math.min(0, y)),
    };
  }, []);

  const stopDrag = useCallback(() => {
    if (drag.current.active) {
      drag.current.active = false;
      window.setTimeout(() => {
        drag.current.moved = false;
      }, 80);
    }
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!drag.current.active) return;
    const dx = e.clientX - drag.current.startX;
    const dy = e.clientY - drag.current.startY;
    if (Math.abs(dx) + Math.abs(dy) > 3) drag.current.moved = true;
    const next = clampPan(drag.current.originX + dx, drag.current.originY + dy);
    setPan(next);
  }, [clampPan]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!drag.current.active) return;
    const t = e.touches[0];
    const dx = t.clientX - drag.current.startX;
    const dy = t.clientY - drag.current.startY;
    if (Math.abs(dx) + Math.abs(dy) > 3) drag.current.moved = true;
    const next = clampPan(drag.current.originX + dx, drag.current.originY + dy);
    setPan(next);
  }, [clampPan]);

  const handleMouseUp = useCallback(() => {
    stopDrag();
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  }, [stopDrag, handleMouseMove]);

  const handleTouchEnd = useCallback(() => {
    stopDrag();
    window.removeEventListener('touchmove', handleTouchMove);
    window.removeEventListener('touchend', handleTouchEnd);
    window.removeEventListener('touchcancel', handleTouchEnd);
  }, [stopDrag, handleTouchMove]);

  const startDrag = useCallback((clientX: number, clientY: number) => {
    stopDrag();
    drag.current = {
      active: true,
      moved: false,
      startX: clientX,
      startY: clientY,
      originX: pan.x,
      originY: pan.y,
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchcancel', handleTouchEnd);
  }, [pan, stopDrag, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  const handleMouseDown = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    e.preventDefault();
    startDrag(e.clientX, e.clientY);
  };

  const handleTouchStart = (e: ReactTouchEvent<HTMLDivElement>) => {
    if (e.touches.length !== 1) return;
    e.preventDefault();
    const t = e.touches[0];
    startDrag(t.clientX, t.clientY);
  };

  const selectTab = (tab: TimelineTab) => {
    playClick();
    setActiveTab(tab);
    setPan({ x: 0, y: 0 });
  };

  const handleNodeClick = (node: TimelineNode) => {
    if (drag.current.moved) return;
    playClick();
    if (claimedNodes.has(node.id)) return;
    claimedNodes.add(node.id);
    toastSeqRef.current += 1;
    setToast({ icon: node.icon, title: node.title, key: toastSeqRef.current });
  };

  const connectors = activeTab.nodes.map((node, i) => {
    if (i === 0) return null;
    const prev = activeTab.nodes[i - 1];
    const sx = prev.x + NODE_SIZE / 2;
    const sy = prev.y;
    const ex = node.x - NODE_SIZE / 2;
    const ey = node.y;
    const midX = sx + (ex - sx) / 2;
    return (
      <path
        key={`${activeTab.id}-${node.id}`}
        d={`M ${sx} ${sy} H ${midX} V ${ey} H ${ex}`}
        fill="none"
        stroke="#E0E0E0"
        strokeWidth={2}
        shapeRendering="crispEdges"
      />
    );
  });

  return (
    <div className="mc-screen tl-screen">
      <div
        className="tl-panel"
        style={{
          backgroundImage: `url(${guiUrl(WINDOW_BG)})`,
          backgroundColor: bgError ? '#1a1a2e' : 'transparent',
        }}
      >
        <div className="tl-tabs" role="tablist" aria-label="Categorías del timeline">
          {TIMELINE_TABS.map((t) => {
            const tv = TAB_VISUAL[t.id];
            const isActive = t.id === activeTab.id;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                className="tl-tab"
                style={{
                  backgroundImage: `url(${guiUrl(isActive ? tv.active : tv.inactive)})`,
                  left: t.id === 'proyectos' ? '2.34%' : t.id === 'experiencia' ? '43.75%' : '85.16%',
                  top: '0%',
                  width: '10.94%',
                  height: '12.5%',
                }}
                onClick={() => selectTab(t)}
                aria-label={t.label}
                aria-selected={isActive}
                title={t.label}
              >
                <IconImage name={t.icon} className="tl-tab-glyph" />
              </button>
            );
          })}
        </div>

        <div className="tl-content">
          <div
            className="tl-viewport"
            ref={viewportRef}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onContextMenu={(e) => e.preventDefault()}
          >
            <div
              className="tl-canvas"
              ref={canvasRef}
              style={{
                width: `${CANVAS_W}px`,
                height: `${CANVAS_H}px`,
                transform: `translate(${pan.x}px, ${pan.y}px)`,
              }}
            >
              <svg
                className="tl-lines"
                viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
                preserveAspectRatio="none"
                shapeRendering="crispEdges"
                aria-hidden="true"
              >
                {connectors}
              </svg>
              {activeTab.nodes.map((node) => (
                <button
                  key={node.id}
                  type="button"
                  className="tl-node"
                  style={{
                    left: `${node.x}px`,
                    top: `${node.y}px`,
                    backgroundImage: `url(${guiUrl(NODE_FRAME)})`,
                  }}
                  onClick={() => handleNodeClick(node)}
                  aria-label={node.title}
                >
                  <IconImage name={node.icon} className="tl-node-glyph" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <AdvancementToast payload={toast} onDone={() => setToast(null)} />
    </div>
  );
}