declare module '*.mdx' {
  import type { ComponentType, ReactNode } from 'react';
  import type { ProjectMeta } from '../mc/types';

  export const meta: ProjectMeta;

  export interface MdxComponents {
    h1?: ComponentType<{ children?: ReactNode }>;
    h2?: ComponentType<{ children?: ReactNode }>;
    h3?: ComponentType<{ children?: ReactNode }>;
    p?: ComponentType<{ children?: ReactNode }>;
    li?: ComponentType<{ children?: ReactNode }>;
    ul?: ComponentType<{ children?: ReactNode }>;
    a?: ComponentType<{ href?: string; children?: ReactNode }>;
    strong?: ComponentType<{ children?: ReactNode }>;
    em?: ComponentType<{ children?: ReactNode }>;
    code?: ComponentType<{ children?: ReactNode }>;
  }

  const MDXContent: ComponentType<{ components?: MdxComponents }>;
  export default MDXContent;
}
