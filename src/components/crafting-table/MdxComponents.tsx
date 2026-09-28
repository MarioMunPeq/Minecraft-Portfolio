import type { ComponentProps } from 'react';

/**
 * Los nodos del markdown se pintan con el aspecto del texto dentro de un
 * objeto de Minecraft: la fuente no tiene negritas de verdad, asi que el
 * enfasis se marca con color, y los enlaces con el estilo de boton del
 * inventario.
 */
export const MDX_COMPONENTS = {
  h1: ({ children, ...rest }: ComponentProps<'h1'>) => (
    <h1 className="mc-md-h1" {...rest}>
      {children}
    </h1>
  ),
  h2: ({ children, ...rest }: ComponentProps<'h2'>) => (
    <h2 className="mc-md-h2" {...rest}>
      {children}
    </h2>
  ),
  h3: ({ children, ...rest }: ComponentProps<'h3'>) => (
    <h3 className="mc-md-h3" {...rest}>
      {children}
    </h3>
  ),
  p: ({ children, ...rest }: ComponentProps<'p'>) => (
    <p className="mc-md-p" {...rest}>
      {children}
    </p>
  ),
  ul: ({ children, ...rest }: ComponentProps<'ul'>) => (
    <ul className="mc-md-ul" {...rest}>
      {children}
    </ul>
  ),
  ol: ({ children, ...rest }: ComponentProps<'ol'>) => (
    <ol className="mc-md-ul" {...rest}>
      {children}
    </ol>
  ),
  li: ({ children, ...rest }: ComponentProps<'li'>) => (
    <li className="mc-md-li" {...rest}>
      {children}
    </li>
  ),
  strong: ({ children, ...rest }: ComponentProps<'strong'>) => (
    <strong className="mc-md-strong" {...rest}>
      {children}
    </strong>
  ),
  em: ({ children, ...rest }: ComponentProps<'em'>) => (
    <em className="mc-md-em" {...rest}>
      {children}
    </em>
  ),
  code: ({ children, ...rest }: ComponentProps<'code'>) => (
    <code className="mc-md-code" {...rest}>
      {children}
    </code>
  ),
  a: ({ children, href, ...rest }: ComponentProps<'a'>) => (
    <a
      className="mc-md-a"
      href={href}
      target="_blank"
      rel="noreferrer"
      onClick={(event) => event.stopPropagation()}
      {...rest}
    >
      {children}
    </a>
  ),
};
