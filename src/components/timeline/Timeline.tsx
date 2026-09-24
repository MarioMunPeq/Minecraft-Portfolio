import { useCallback, useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { TIMELINE_TABS } from '../../data/timeline';
import type { TimelineNode, TimelineTab } from '../../data/timeline';
import { guiUrl } from '../grimorio/guiUrl';
import { IconImage } from '../grimorio/IconImage';
import { useAudio } from '../../audio/AudioContext';
import { AdvancementToast } from './AdvancementToast';
import type { ToastPayload } from './AdvancementToast';
import { NodeTooltip } from './NodeTooltip';

interface TabVisual {
  left: number;
  inactive: string;
  active: string;
}

const TAB_VISUAL: Record<string, TabVisual> = {
  proyectos: {
    left: 6,
    inactive: 'gui/sprites/advancements/tab_above_left.png',
    active: 'gui/sprites/advancements/tab_above_left_selected.png',
  },
  experiencia: {
    left: 112,
    inactive: 'gui/sprites/advancements/tab_above_middle.png',
    active: 'gui/sprites/advancements/tab_above_middle_selected.png',
  },
  educacion: {
    left: 218,
    inactive: 'gui/sprites/advancements/tab_above_right.png',
    active: 'gui/sprites/advancements/tab_above_right_selected.png',
  },
};

const FRAME_SRC: Record<string, { obtained: string; unobtained: string }> = {
  task: {
    obtained: 'gui/sprites/advancements/task_frame_obtained.png',
    unobtained: 'gui/sprites/advancements/task_frame_unobtained.png',
  },
  goal: {
    obtained: 'gui/sprites/advancements/goal_frame_obtained.png',
    unobtained: 'gui/sprites/advancements/goal_frame_unobtained.png',
  },
  challenge: {
    obtained: 'gui/sprites/advancements/challenge_frame_obtained.png',
    unobtained: 'gui/sprites/advancements/challenge_frame_unobtained.png',
  },
};

const claimedNodes = new Set<string>();

export function Timeline() {
  const { playClick } = useAudio();
  const [activeTab, setActiveTab] = useState<TimelineTab>(TIMELINE_TABS[0]);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [toast, setToast] = useState<ToastPayload | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const drag = useRef({ active: false, moved: false, sx: 0, sy: 0, ox: 0, oy: 0 });
  const toastSeq = useRef(0);
  const moveHandlerRef = useRef<((e: PointerEvent) => void) | null>(null);
  const upHandlerRef = useRef<(() => void) | null>(null);

  const clampPan = useCallback((x: number, y: number) => {
    const vw = viewportRef.current?.offsetWidth ?? 0;
    const vh = viewportRef.current?.offsetHeight ?? 0;
    const cw = canvasRef.current?.offsetWidth ?? 0;
    const ch = canvasRef.current?.offsetHeight ?? 0;
    return {
      x: Math.min(0, Math.max(vw - cw, x)),
      y: Math.min(0, Math.max(vh - ch, y)),
    };
  }, []);

  const stopDrag = useCallback(() => {
    if (moveHandlerRef.current) {
      window.removeEventListener('pointermove', moveHandlerRef.current);
      moveHandlerRef.current = null;
    }
    if (upHandlerRef.current) {
      window.removeEventListener('pointerup', upHandlerRef.current);
      window.removeEventListener('pointercancel', upHandlerRef.current);
      upHandlerRef.current = null;
    }
    if (drag.current.active) {
      drag.current.active = false;
      window.setTimeout(() => {
        drag.current.moved = false;
      }, 80);
    }
  }, []);

  useEffect(() => stopDrag, [stopDrag]);

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    stopDrag();
    drag.current = {
      active: true,
      moved: false,
      sx: e.clientX,
      sy: e.clientY,
      ox: pan.x,
      oy: pan.y,
    };
    const onMove = (ev: PointerEvent) => {
      if (!drag.current.active) return;
      const dx = ev.clientX - drag.current.sx;
      const dy = ev.clientY - drag.current.sy;
      if (Math.abs(dx) + Math.abs(dy) > 3) {
        drag.current.moved = true;
      }
      setPan(clampPan(drag.current.ox + dx, drag.current.oy + dy));
    };
    const onUp = () => stopDrag();
    moveHandlerRef.current = onMove;
    upHandlerRef.current = onUp;
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
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
    toastSeq.current += 1;
    setToast({ icon: node.icon, title: node.title, key: toastSeq.current });
  };

  const tab = activeTab;

  const connectors = tab.nodes.map((node, i) => {
    if (i === 0) return null;
    const prev = tab.nodes[i - 1];
    const sx = prev.x + 13;
    const sy = prev.y;
    const ex = node.x - 13;
    const ey = node.y;
    return (
      <path
        key={`${tab.id}-${node.id}`}
        d={`M ${sx} ${sy} L ${ex} ${sy} L ${ex} ${ey}`}
        fill="none"
        stroke="#c6c6c6"
        strokeWidth={2}
        shapeRendering="crispEdges"
      />
    );
  });

  return (
    <div className="mc-screen tl-screen">
      <div className="tl-wrap">
        <div className="tl-panel">
          <div className="tl-tabs">
            {TIMELINE_TABS.map((t) => {
              const tv = TAB_VISUAL[t.id];
              const isActive = t.id === activeTab.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  className={`tl-tab${isActive ? ' tl-tab-active' : ''}`}
                  style={{
                    left: `calc(${tv.left}px * var(--gui-scale))`,
                    backgroundImage: `url(${guiUrl(isActive ? tv.active : tv.inactive)})`,
                  }}
                  onClick={() => selectTab(t)}
                  aria-label={t.label}
                  aria-pressed={isActive}
                >
                  <IconImage name={t.icon} className="tl-tab-glyph" />
                </button>
              );
            })}
          </div>

          <div
            className="tl-viewport"
            ref={viewportRef}
            onPointerDown={handlePointerDown}
            onContextMenu={(e) => e.preventDefault()}
          >
            <div
              className="tl-canvas"
              ref={canvasRef}
              style={{
                width: `calc(${tab.canvasW}px * var(--gui-scale))`,
                height: `calc(${tab.canvasH}px * var(--gui-scale))`,
                transform: `translate(${pan.x}px, ${pan.y}px)`,
              }}
            >
              <div className="tl-scale" style={{ width: tab.canvasW, height: tab.canvasH }}>
                <div
                  className="tl-bg"
                  style={{ backgroundImage: `url(${guiUrl(tab.background)})` }}
                />
                <svg className="tl-lines" width={tab.canvasW} height={tab.canvasH} shapeRendering="crispEdges">
                  {connectors}
                </svg>
                {tab.nodes.map((node) => (
                  <NodeTooltip
                    key={node.id}
                    title={node.title}
                    description={node.description}
                    x={node.x}
                    y={node.y}
                  >
                    <button
                      type="button"
                      className="tl-node"
                      style={{
                        backgroundImage: `url(${guiUrl(FRAME_SRC[node.frame][node.obtained ? 'obtained' : 'unobtained'])})`,
                      }}
                      onClick={() => handleNodeClick(node)}
                      aria-label={node.title}
                    >
                      <IconImage name={node.icon} className="tl-node-glyph" />
                    </button>
                  </NodeTooltip>
                ))}
              </div>
            </div>
          </div>

          <div className="tl-frame" aria-hidden="true" />
        </div>
      </div>
      <AdvancementToast payload={toast} onDone={() => setToast(null)} />
    </div>
  );
}