import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { MouseEvent as ReactMouseEvent, TouchEvent as ReactTouchEvent } from 'react';
import { ADVANCEMENT_TABS } from '../../content/advancements';
import { boundsFor, MAX_SCALE, NODE_SIZE } from '../../mc/advancements';
import type { AdvancementNode, AdvancementTab } from '../../mc/advancements';
import { useAudio } from '../../audio/AudioContext';
import { guiUrl } from '../crafting-table/guiUrl';
import { BackButton } from '../crafting-table/BackButton';
import { MinecraftTooltip } from '../crafting-table/MinecraftTooltip';
import { LoreBox } from './LoreBox';
import { NodeTooltip } from './NodeTooltip';
import { nodeIconUrl } from './nodeIcon';

// Las URLs se construyen en tiempo de ejecucion, asi que Vite no las puede
// reescribir con el base: hay que pasar siempre por guiUrl.
const FRAME: Record<AdvancementNode['kind'], string> = {
  task: 'gui/sprites/advancements/task_frame_obtained.png',
  goal: 'gui/sprites/advancements/goal_frame_obtained.png',
  challenge: 'gui/sprites/advancements/challenge_frame_obtained.png',
};

/** Las pestañas van en vertical, como en el juego: la de arriba, la del medio
 *  y la de abajo. En el juego no llevan texto, se distinguen por el fondo. */
const TAB_SLOTS = [
  {
    inactive: 'gui/sprites/advancements/tab_left_top.png',
    active: 'gui/sprites/advancements/tab_left_top_selected.png',
  },
  {
    inactive: 'gui/sprites/advancements/tab_left_middle.png',
    active: 'gui/sprites/advancements/tab_left_middle_selected.png',
  },
  {
    inactive: 'gui/sprites/advancements/tab_left_bottom.png',
    active: 'gui/sprites/advancements/tab_left_bottom_selected.png',
  },
];

interface HoverState {
  node: AdvancementNode;
  at: { x: number; y: number };
}

interface TabHover {
  label: string;
  at: { x: number; y: number };
}

export function AdvancementsScreen() {
  const { playClick } = useAudio();
  const [activeTab, setActiveTab] = useState<AdvancementTab>(ADVANCEMENT_TABS[0]);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [hovered, setHovered] = useState<HoverState | null>(null);
  const [hoveredTab, setHoveredTab] = useState<TabHover | null>(null);
  const [openNode, setOpenNode] = useState<{ node: AdvancementNode; anchor: { x: number; y: number } } | null>(
    null,
  );

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const drag = useRef({ active: false, moved: false, startX: 0, startY: 0, originX: 0, originY: 0 });

  const bounds = useMemo(() => boundsFor(activeTab), [activeTab]);

  /**
   * Mantiene el arbol dentro de la ventana sin dejar huecos. Si el arbol es
   * mas grande, se mueve en el rango [exceso-negativo, 0]; si es mas pequeno,
   * en [0, exceso], y asi se puede empujar para librar las pestanas.
   */
  const clampPan = useCallback((x: number, y: number) => {
    const vp = viewportRef.current;
    const cv = canvasRef.current;
    if (!vp || !cv) return { x, y };
    const clamp = (value: number, size: number, extent: number) => {
      const gap = extent - size;
      const low = Math.min(0, gap);
      const high = Math.max(0, gap);
      return Math.max(low, Math.min(high, value));
    };
    return {
      x: clamp(x, cv.offsetWidth, vp.clientWidth),
      y: clamp(y, cv.offsetHeight, vp.clientHeight),
    };
  }, []);

  /**
   * La ventana es ancha y baja (el GUI mide 252x140), asi que el arbol se
   * escala para que entre entero y no se vea un trozo vacio al entrar.
   */
  const fitTree = useCallback(() => {
    const vp = viewportRef.current;
    if (!vp || vp.clientWidth === 0) return;
    const fit = Math.min(vp.clientWidth / bounds.w, vp.clientHeight / bounds.h);
    setScale(Math.max(1, Math.min(MAX_SCALE, fit)));
  }, [bounds.w, bounds.h]);

  useEffect(() => {
    fitTree();
    window.addEventListener('resize', fitTree);
    return () => window.removeEventListener('resize', fitTree);
  }, [fitTree]);

  /**
   * Recentra despues de que la escala ya este aplicada. Las pestañas quedan
   * fuera de la ventana, asi que el hueco se puede centrar tal cual.
   */
  useLayoutEffect(() => {
    const vp = viewportRef.current;
    const cv = canvasRef.current;
    if (!vp || !cv || cv.offsetWidth === 0) return;
    setPan(
      clampPan((vp.clientWidth - cv.offsetWidth) / 2, (vp.clientHeight - cv.offsetHeight) / 2),
    );
  }, [activeTab, scale, clampPan]);

  const stopDrag = useCallback(() => {
    if (drag.current.active) {
      drag.current.active = false;
      window.setTimeout(() => {
        drag.current.moved = false;
      }, 80);
    }
  }, []);

  useEffect(() => {
    const move = (dx: number, dy: number) => {
      if (!drag.current.active) return;
      if (Math.abs(dx) + Math.abs(dy) > 3) drag.current.moved = true;
      setPan(
        clampPan(drag.current.originX + dx, drag.current.originY + dy),
      );
    };
    const handleMouseMove = (e: MouseEvent) => move(e.clientX - drag.current.startX, e.clientY - drag.current.startY);
    const handleTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      move(t.clientX - drag.current.startX, t.clientY - drag.current.startY);
    };
    const end = () => {
      stopDrag();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', end);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', end);
      window.removeEventListener('touchcancel', end);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', end);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', end);
    window.addEventListener('touchcancel', end);
    return end;
  }, [clampPan, stopDrag]);

  const startDrag = (clientX: number, clientY: number) => {
    stopDrag();
    drag.current = {
      active: true,
      moved: false,
      startX: clientX,
      startY: clientY,
      originX: pan.x,
      originY: pan.y,
    };
  };

  const handleMouseDown = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    e.preventDefault();
    startDrag(e.clientX, e.clientY);
  };

  const handleTouchStart = (e: ReactTouchEvent<HTMLDivElement>) => {
    if (e.touches.length !== 1) return;
    e.preventDefault();
    startDrag(e.touches[0].clientX, e.touches[0].clientY);
  };

  const selectTab = (tab: AdvancementTab) => {
    playClick();
    setActiveTab(tab);
    setHovered(null);
    setOpenNode(null);
  };

  const connectors = useMemo(() => {
    const paths: string[] = [];
    for (const node of activeTab.nodes) {
      for (const parentId of node.parents) {
        const parent = activeTab.nodes.find((n) => n.id === parentId);
        if (!parent) continue;
        // Linea ortogonal en dos tramos, como las del juego.
        const sx = parent.x + NODE_SIZE / 2;
        const sy = parent.y;
        const ex = node.x - NODE_SIZE / 2;
        const ey = node.y;
        const midX = (sx + ex) / 2;
        paths.push(`M ${sx} ${sy} H ${midX} V ${ey} H ${ex}`);
      }
    }
    return paths;
  }, [activeTab]);

  return (
    <div className="mc-screen mc-adv-screen">
      <div className="mc-adv-window">
        <div className="mc-adv-inner">
          <div
            className="mc-adv-body"
            style={{
              backgroundImage: `url("${guiUrl(`gui/advancements/backgrounds/${activeTab.background}.png`)}")`,
            }}
          >
            <div
              className="mc-adv-viewport"
              ref={viewportRef}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              onContextMenu={(e) => e.preventDefault()}
            >
              <div
                className="mc-adv-canvas"
                ref={canvasRef}
                style={{
                  width: `${bounds.w * scale}px`,
                  height: `${bounds.h * scale}px`,
                  transform: `translate(${pan.x}px, ${pan.y}px)`,
                }}
              >
                <div
                  className="mc-adv-tree"
                  style={{
                    width: `${bounds.w}px`,
                    height: `${bounds.h}px`,
                    transform: `translate(${-bounds.minX}px, ${-bounds.minY}px) scale(${scale})`,
                  }}
                >
                  <svg
                    className="mc-adv-lines"
                    viewBox={`${bounds.minX} ${bounds.minY} ${bounds.w} ${bounds.h}`}
                    preserveAspectRatio="none"
                    shapeRendering="crispEdges"
                    aria-hidden="true"
                  >
                    {connectors.map((d) => (
                      <path key={d} d={d} />
                    ))}
                  </svg>

                  {activeTab.nodes.map((node) => (
                    <button
                      key={node.id}
                      type="button"
                      className={`mc-adv-node mc-adv-node-${node.kind}`}
                      style={{
                        left: `${node.x - NODE_SIZE / 2}px`,
                        top: `${node.y - NODE_SIZE / 2}px`,
                        ['--frame' as string]: `url("${guiUrl(FRAME[node.kind])}")`,
                        ['--icon' as string]: `url("${nodeIconUrl(node)}")`,
                      }}
                      onMouseEnter={(e) => setHovered({ node, at: { x: e.clientX, y: e.clientY } })}
                      onMouseLeave={() => setHovered(null)}
                      onClick={(e) => {
                        if (drag.current.moved) return;
                        playClick();
                        setOpenNode({ node, anchor: { x: e.clientX, y: e.clientY } });
                      }}
                      aria-label={`${node.title}, ${node.period}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mc-adv-tabs" role="tablist" aria-label="Secciones">
            {ADVANCEMENT_TABS.map((tab, index) => {
              const slot = TAB_SLOTS[index] ?? TAB_SLOTS[0];
              const isActive = tab.id === activeTab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className="mc-adv-tab"
                  style={{ backgroundImage: `url("${guiUrl(isActive ? slot.active : slot.inactive)}")` }}
                  onMouseEnter={(e) => setHoveredTab({ label: tab.label, at: { x: e.clientX, y: e.clientY } })}
                  onMouseLeave={() => setHoveredTab(null)}
                  onFocus={() => setHoveredTab({ label: tab.label, at: { x: 0, y: 0 } })}
                  onBlur={() => setHoveredTab(null)}
                  onClick={() => selectTab(tab)}
                  aria-label={tab.label}
                >
                  <span
                    className="mc-adv-tab-icon"
                    style={{ backgroundImage: `url("${guiUrl(`assets/mc/${tab.icon}.png`)}")` }}
                    aria-hidden
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {hovered && <NodeTooltip node={hovered.node} isVisible position={hovered.at} />}
      {hoveredTab && hoveredTab.at.x > 0 && (
        <MinecraftTooltip
          text={hoveredTab.label}
          isVisible
          position={hoveredTab.at}
          className="mc-adv-tooltip"
        />
      )}
      {openNode && (
        <LoreBox node={openNode.node} anchor={openNode.anchor} onClose={() => setOpenNode(null)} />
      )}

      <BackButton />
    </div>
  );
}
