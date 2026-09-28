# Capturas de los proyectos

Cada proyecto tiene su carpeta aquí dentro. Para que una captura aparezca en el
cofre hay que hacer dos cosas:

1. **Copiar el fichero** en la carpeta del proyecto.
   ```
   public/projects/persona5/inicio.png
   ```

2. **Anadir el nombre** a la lista `gallery` del frontmatter de su `.mdx`.
   ```
   gallery: ['inicio.png', 'movil.png'],
   ```

Los nombres van relativos a esta carpeta. Las capturas salen en los huecos
libres del cofre y se abren a pantalla completa al pulsarlas.

Conviene usar nombres sin espacios y en minúsculas, por ejemplo
`inicio.png`, `juego.png`, `movil.png`. La carpeta tiene un `.gitkeep` para que
git la conserve aunque esté vacía.
