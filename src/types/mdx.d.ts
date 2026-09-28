declare module '*.mdx' {
  import type { ComponentType, ElementType } from 'react';
  import type { ProjectMeta } from '../mc/types';

  export const meta: ProjectMeta;

  const MDXContent: ComponentType<{ components?: Record<string, ElementType> }>;
  export default MDXContent;
}
