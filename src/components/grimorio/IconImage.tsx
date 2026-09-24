import { guiUrl } from './guiUrl';

interface IconImageProps {
  name: string;
  className?: string;
  alt?: string;
}

export function IconImage({ name, className, alt = '' }: IconImageProps) {
  return (
    <img
      className={className}
      src={guiUrl(`icons/${name}.png`)}
      alt={alt}
      aria-hidden={alt === '' ? true : undefined}
      draggable={false}
    />
  );
}
