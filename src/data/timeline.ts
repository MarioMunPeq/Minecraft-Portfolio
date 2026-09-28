export type TimelineTabId = 'proyectos' | 'experiencia' | 'educacion';

export interface TimelineNode {
  id: string;
  title: string;
  icon: string;
  x: number;
  y: number;
}

export interface TimelineTab {
  id: TimelineTabId;
  label: string;
  icon: string;
  nodes: TimelineNode[];
}

export const CANVAS_W = 1400;
export const CANVAS_H = 720;
export const NODE_SIZE = 36;
export const NODE_SPACING = 90;
const ROW_Y = 320;

function rowPositions(count: number, y: number): { x: number; y: number }[] {
  const start = (CANVAS_W - (count - 1) * NODE_SPACING) / 2;
  return Array.from({ length: count }, (_, i) => ({
    x: start + i * NODE_SPACING,
    y,
  }));
}

const projectNodes: TimelineNode[] = [
  { id: 'persona5', title: 'Persona 5 Portfolio', icon: 'persona5', ...rowPositions(4, ROW_Y)[0] },
  { id: 'vault', title: 'Vault Archive', icon: 'vault', ...rowPositions(4, ROW_Y)[1] },
  { id: 'euromario', title: 'EuroMario', icon: 'euromario', ...rowPositions(4, ROW_Y)[2] },
  { id: 'dungeon', title: 'Dungeon Archive', icon: 'dungeon', ...rowPositions(4, ROW_Y)[3] },
];

const experienceNodes: TimelineNode[] = [
  { id: 'michelin', title: 'Michelin', icon: 'michelin', ...rowPositions(3, ROW_Y)[0] },
  { id: 'cognizant', title: 'Cognizant', icon: 'cognizant', ...rowPositions(3, ROW_Y)[1] },
  { id: 'diputacion', title: 'Diputación de Valladolid', icon: 'diputacion', ...rowPositions(3, ROW_Y)[2] },
];

const educationNodes: TimelineNode[] = [
  { id: 'eso', title: 'ESO', icon: 'eso', ...rowPositions(5, ROW_Y)[0] },
  { id: 'grado-medio-teleco', title: 'Grado Medio en Telecomunicaciones', icon: 'grado-teleco', ...rowPositions(5, ROW_Y)[1] },
  { id: 'grado-robotica', title: 'Grado en Robótica', icon: 'grado-robotica', ...rowPositions(5, ROW_Y)[2] },
  { id: 'dam', title: 'DAM', icon: 'dam', ...rowPositions(5, ROW_Y)[3] },
  { id: 'bootcamp-ia', title: 'Bootcamp de IA', icon: 'bootcamp-ia', ...rowPositions(5, ROW_Y)[4] },
];

export const TIMELINE_TABS: TimelineTab[] = [
  { id: 'proyectos', label: 'Proyectos', icon: 'proyectos', nodes: projectNodes },
  { id: 'experiencia', label: 'Experiencia', icon: 'experiencia', nodes: experienceNodes },
  { id: 'educacion', label: 'Educación', icon: 'educacion', nodes: educationNodes },
];