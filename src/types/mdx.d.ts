declare module '*.mdx' {
  import type { ComponentType, ElementType } from 'react';
  import type { ProjectMeta } from '../mc/types';
  import type { AdvancementNodeMeta } from '../mc/advancements';

  export const meta: ProjectMeta | AdvancementNodeMeta;

  const MDXContent: ComponentType<{ components?: Record<string, ElementType> }>;
  export default MDXContent;
}
