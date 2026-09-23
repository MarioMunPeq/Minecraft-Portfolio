export interface Project {
  id: string;
  name: string;
  icon: string;
  technologies: string[];
}

export const PROJECTS: Project[] = [
  {
    id: 'persona5',
    name: 'Persona 5 Portfolio',
    icon: '⛨',
    technologies: [
      'React',
      'TypeScript',
      'Vite',
      'HTML',
      'CSS',
      'JavaScript',
      'Git',
      'GitHub',
      'Motion',
    ],
  },
  {
    id: 'vault',
    name: 'Vault Archive',
    icon: '⛬',
    technologies: [
      'React',
      'TypeScript',
      'Vite',
      'CSS',
      'JavaScript',
      'HTML',
      'Git',
      'GitHub',
      'Web Audio',
    ],
  },
  {
    id: 'euromario',
    name: 'EuroMario',
    icon: '⛧',
    technologies: [
      'React',
      'TypeScript',
      'Vite',
      'TypeScript',
      'HTML',
      'CSS',
      'JavaScript',
      'Git',
      'GitHub',
    ],
  },
  {
    id: 'dungeon',
    name: 'Dungeon Archive',
    icon: '⛥',
    technologies: [
      'React',
      'TypeScript',
      'Vite',
      'FastAPI',
      'Python',
      'D3.js',
      'HTML',
      'CSS',
      'Git',
    ],
  },
];

export const TECH_ICONS: Record<string, string> = {
  React: '⚛',
  TypeScript: '⟨⟩',
  Vite: '⚡',
  HTML: '</>',
  CSS: '{ }',
  JavaScript: 'JS',
  Git: '≡',
  GitHub: '⌘',
  Motion: '≈',
  'Web Audio': '♪',
  FastAPI: '⚡',
  Python: '🐍',
  'D3.js': '📊',
};