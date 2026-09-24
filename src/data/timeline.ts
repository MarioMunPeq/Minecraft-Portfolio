import { PROJECTS } from './projects';

export type FrameKind = 'task' | 'goal' | 'challenge';

export interface TimelineNode {
  id: string;
  title: string;
  description: string;
  icon: string;
  frame: FrameKind;
  obtained: boolean;
  x: number;
  y: number;
}

export type TimelineTabId = 'proyectos' | 'experiencia' | 'educacion';

export interface TimelineTab {
  id: TimelineTabId;
  label: string;
  icon: string;
  background: string;
  canvasW: number;
  canvasH: number;
  nodes: TimelineNode[];
}

const SPACING = 36;
const PAD_X = 28;
const ROW_TOP = 52;
const ROW_BOTTOM = 86;
const CANVAS_H = 140;

function layout(count: number): { x: number; y: number }[] {
  return Array.from({ length: count }, (_, i) => ({
    x: PAD_X + i * SPACING,
    y: i % 2 === 0 ? ROW_TOP : ROW_BOTTOM,
  }));
}

function canvasW(count: number): number {
  return (count - 1) * SPACING + PAD_X * 2;
}

const FLAGSHIP = new Set(['persona5', 'vault', 'dungeon']);

const projectLayout = layout(PROJECTS.length);
const projectNodes: TimelineNode[] = PROJECTS.map((project, i) => ({
  id: project.id,
  title: project.name,
  description: project.description,
  icon: project.icon,
  frame: FLAGSHIP.has(project.id) ? 'challenge' : 'task',
  obtained: true,
  ...projectLayout[i],
}));

const experienceLayout = layout(3);
const experienceNodes: TimelineNode[] = [
  {
    id: 'michelin',
    title: 'Michelin',
    description: 'Pasantía y primeras experiencias profesionales en Michelin.',
    icon: 'michelin',
    frame: 'task',
    obtained: true,
    ...experienceLayout[0],
  },
  {
    id: 'cognizant',
    title: 'Cognizant',
    description: 'Trabajo como desarrollador en la consultora tecnológica Cognizant.',
    icon: 'cognizant',
    frame: 'task',
    obtained: true,
    ...experienceLayout[1],
  },
  {
    id: 'diputacion',
    title: 'Diputación de Valladolid',
    description: 'Puesto actual: desarrollo de aplicaciones en la Diputación de Valladolid.',
    icon: 'diputacion',
    frame: 'task',
    obtained: false,
    ...experienceLayout[2],
  },
];

const educationLayout = layout(5);
const educationNodes: TimelineNode[] = [
  {
    id: 'eso',
    title: 'ESO',
    description: 'Educación Secundaria Obligatoria.',
    icon: 'eso',
    frame: 'task',
    obtained: true,
    ...educationLayout[0],
  },
  {
    id: 'grado-medio-teleco',
    title: 'Grado Medio en Telecomunicaciones',
    description: 'Ciclo formativo de grado medio en instalaciones de telecomunicaciones.',
    icon: 'grado-teleco',
    frame: 'task',
    obtained: true,
    ...educationLayout[1],
  },
  {
    id: 'grado-robotica',
    title: 'Grado en Robótica',
    description: 'Estudios universitarios orientados a la robótica.',
    icon: 'grado-robotica',
    frame: 'task',
    obtained: true,
    ...educationLayout[2],
  },
  {
    id: 'dam',
    title: 'DAM (Desarrollo de Aplicaciones Multiplataforma)',
    description: 'Ciclo formativo de grado superior en desarrollo de aplicaciones multiplataforma.',
    icon: 'dam',
    frame: 'task',
    obtained: true,
    ...educationLayout[3],
  },
  {
    id: 'bootcamp-ia',
    title: 'Bootcamp de IA',
    description: 'Formación intensiva en Inteligencia Artificial (en curso / futura).',
    icon: 'bootcamp-ia',
    frame: 'task',
    obtained: false,
    ...educationLayout[4],
  },
];

export const TIMELINE_TABS: TimelineTab[] = [
  {
    id: 'proyectos',
    label: 'Proyectos',
    icon: 'proyectos',
    background: 'gui/advancements/backgrounds/stone.png',
    canvasW: canvasW(projectNodes.length),
    canvasH: CANVAS_H,
    nodes: projectNodes,
  },
  {
    id: 'experiencia',
    label: 'Experiencia',
    icon: 'experiencia',
    background: 'gui/advancements/backgrounds/husbandry.png',
    canvasW: canvasW(experienceNodes.length),
    canvasH: CANVAS_H,
    nodes: experienceNodes,
  },
  {
    id: 'educacion',
    label: 'Educación',
    icon: 'educacion',
    background: 'gui/advancements/backgrounds/end.png',
    canvasW: canvasW(educationNodes.length),
    canvasH: CANVAS_H,
    nodes: educationNodes,
  },
];