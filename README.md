# Minecraft Portfolio

**El portfolio de Mario Muñoz, playing como si fuera un cliente de Minecraft 1.21.8.**

Menú principal, selección de mundo, pantalla de carga, mesa de crafteo, árbol de logros y
mesa de encantamientos. Todo reconstruido píxel a píxel sobre las texturas reales del juego,
con React 19 + TypeScript + Vite.

- **Demo en vivo:** <https://mariomunpeq.github.io/Minecraft-Portfolio/>
- **GitHub:** <https://github.com/MarioMunPeq>
- **LinkedIn:** <https://www.linkedin.com/in/mario-mu%C3%B1oz-peque%C3%B1o/>

---

## Índice

- [Qué es](#qué-es)
- [Las cinco pantallas](#las-cinco-pantallas)
- [Stack](#stack)
- [Requisitos previos](#requisitos-previos)
- [Arrancar el proyecto](#arrancar-el-proyecto)
- [Scripts disponibles](#scripts-disponibles)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Cómo añadir contenido](#cómo-añadir-contenido)
- [De dónde salen los assets](#de-dónde-salen-los-assets)
- [Validación de contenido](#validación-de-contenido)
- [Despliegue en GitHub Pages](#despliegue-en-github-pages)
- [Detalles técnicos](#detalles-técnicos)
- [Accesibilidad](#accesibilidad)
- [Créditos y nota legal](#créditos-y-nota-legal)

---

## Qué es

Un portfolio personal disguised de juego. En lugar de scroll, navegas: eliges el mundo
cargado desde el menú, esperas a que "genere el terreno" y entras. Los proyectos se
presentan como recetas de crafteo (puedes buscar entre ellas, el resultado aparece al
completar la rejilla 3x3 y se abre un cofre con los detalles), la experiencia y la
formación como un árbol de logros con pan y zoom, y las habilidades blandas como una mesa
de encantamientos con un aldeano bibliotecario que te dice en Alfabeto Galáctico qué
encantamiento estás a punto de elegir.

Todo el contenido vive en archivos `.mdx`. No hay base de datos, ni CMS, ni una sola
dependencia de interfaz de usuario: React, React Router y el plugin de MDX.

## Las cinco pantallas

| Pantalla | Ruta | Qué hay |
| --- | --- | --- |
| Menú principal | `/` | Panorámica animada, logo, texto aleatorio, Singleplayer, Logros, enlaces a GitHub y LinkedIn, y el aldeano con las habilidades blandas |
| Selección de mundo | `/singleplayer` | Un único mundo: *Portfolio de Mario Muñoz* |
| Cargando | `/cargando` | Barra de progreso simulada (1,5 a 2,5 s) sobre un bloque de tierra |
| Mesa de crafteo | `/crafting-table` | Los 6 proyectos como recetas, con buscador, inventario de tecnologías y cofre de detalle con galería |
| Árbol de logros | `/advancements` | 8 nodos encadenados en dos pestañas: Experiencia y Educación |

Rutas que no existen redirigen al menú (`<Navigate to="/" replace />`) en lugar de romper.

## Stack

**Runtime** — solo 4 dependencias:

| Paquete | Versión | Para qué |
| --- | --- | --- |
| `react` / `react-dom` | ^19.2 | UI |
| `react-router-dom` | ^7.18 | Las 5 rutas |
| `@mdx-js/rollup` | ^3.1 | El contenido en `.mdx` |

**Desarrollo:** `vite` ^8.3, `@vitejs/plugin-react` ^6.1, `typescript` ~6.0, `oxlint` ^1.81,
`@types/*`.

Cero librerías de UI, cero Tailwind, cero gestor de estado, cero paquetes de iconos. Todo el
pixel art, los PNG y los iconos se generan con scripts propios sobre `node:fs` y `node:zlib`.

## Requisitos previos

- **Node.js >= 24.12.0** (obligatorio, no 20). `scripts/check-recipes.mjs` usa
  `--experimental-strip-types` (disponible desde 22.6) y Vite 8 exige `^20.19 || >=22.12`.
- **npm** como gestor de paquetes (`packageManager: npm@11.13.0`, lockfile commiteado).

## Arrancar el proyecto

```bash
npm install
npm run dev
```

Y ya está: `http://localhost:5173/Minecraft-Portfolio/`. Ojo con el subdirectorio, el
proyecto vive bajo `/Minecraft-Portfolio/` incluso en local (ver
[Despliegue](#despliegue-en-github-pages)).

```bash
npm run build     # typecheck + bundle a dist/
npm run preview   # sirve dist/ con la misma base
```

## Scripts disponibles

| Script | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo con HMR |
| `npm run build` | `tsc -b` y luego `vite build` |
| `npm run preview` | Sirve el build de producción |
| `npm run lint` | `oxlint` con `.oxlintrc.json` |
| `npm run check` | Las dos validaciones de contenido, en orden |
| `npm run check:encoding` | Detecta caracteres corruptos en `.mdx` / `.ts` / `.tsx` / `.css` |
| `npm run check:recipes` | Valida cada receta de proyecto e imprime su rejilla 3x3 |
| `npm run assets` | Extrae 117 texturas del `.jar` del juego a `public/assets/mc/` |
| `npm run icons` | Genera los 53 iconos pixel-art 16x16 de `public/icons/` |

## Estructura del proyecto

```
src/
├── App.tsx                    rutas + redirección de rutas desconocidas
├── main.tsx                   raíz de React
├── index.css                  reset, tipografía, variable --tui, pantalla de carga
├── audio/                     motor de sonido, contexto y botón de silencio
├── components/
│   ├── TitleScreen.tsx        menú principal
│   ├── WorldSelect.tsx        selección de mundo
│   ├── WorldLoadingScreen.tsx carga simulada
│   ├── Panorama.tsx           panorámica en scroll continuo
│   ├── advancements/          árbol de logros (lore, tooltips, pan y zoom)
│   ├── crafting-table/        mesa de crafteo (recetas, cofre, lightbox, slots)
│   └── villager/              mesa de encantamientos + alfabeto galactico
├── content/                   TODO el contenido editable
│   ├── skills.ts              5 habilidades blandas + vocabulario SGA
│   ├── projects/*.mdx         6 proyectos
│   └── advancements/*.mdx     8 nodos de experiencia y formación
├── mc/                        capa de dominio: recetas, items, tipos, geometría
├── pages/CraftingTable.tsx    wrapper de ruta de la mesa de crafteo
└── types/mdx.d.ts             tipado de los módulos .mdx
```

`src/mc/` es la capa que "sabe cómo funciona Minecraft": `recipe.ts` interpreta recetas
escaladas, `techs.ts` mapea tecnologías a items, `advancements.ts` define los tipos de nodo y
las medidas del árbol. Los componentes solo pintan.

## Cómo añadir contenido

### Un proyecto

1. Crea `src/content/projects/<id>.mdx` con esta forma:

   ```mdx
   export const meta = {
     id: 'mi-proyecto',
     title: 'Mi Proyecto',
     tagline: 'Una frase que resuma el proyecto',
     year: '2026',
     status: 'activo',              // 'activo' | 'archivado'
     demo: 'https://...',
     repo: 'https://github.com/...',
     result: 'items/diamond',       // item del slot de resultado
     technologies: ['TypeScript', 'React'],
     gallery: [],
     recipe: {
       pattern: ['RT', 'C '],
       key: { R: 'React', T: 'TypeScript', C: 'CSS' },
     },
   }

   ## Qué es

   Descripción del proyecto.

   ## El reto

   Qué fue lo difícil.

   ## Qué aprendí

   Qué te llevas de aquí.
   ```

   `pattern` es una receta escalada real de Minecraft: filas de hasta 3 caracteres, el
   espacio es un hueco, y cada letra debe existir en `key`. Máximo 3x3. `pattern` admite
   menos de 3 filas y menos de 3 columnas; `recipe.ts` la centra en la rejilla por ti.

2. Registra el archivo en `src/content/projects/index.ts`.

3. Si la tecnología es nueva, añádela a `TECH_ITEMS` en `src/mc/techs.ts`. Sin eso, el
   `egg` aparece como fallback en silencio y `npm run check:recipes` te avisa.

4. Registra el item de resultado en `RESULT_ITEMS` (mismo archivo). Debe ser único en todo
   el portfolio.

5. `npm run check`.

Máximo 9 tecnologías, porque el inventario del jugador tiene 9 huecos. Dos tecnologías no
pueden compartir item, o el shader de la ranura se rompe.

### Un logro

Igual, pero en `src/content/advancements/<id>.mdx` con `asNodeMeta()` y los campos `kind`
(`task` | `goal` | `challenge`), `period`, `icon`, `x`, `y` y `parents[]`. Registra el nodo
en el array correspondiente (`EXPERIENCE` o `EDUCATION`) de
`src/content/advancements/index.ts`. Las coordenadas están a mano sobre un lienzo de
480x480; los descendants heredan la posición en diagonal para que el árbol quede en
escalera.

### Una habilidad blanda

Añádela al array de `src/content/skills.ts`: `id`, `name`, `phrase`, `level` (1 a 5) e
`item`. El nombre que se ve en la interfaz no se lee: el aldeano lo genera al azar en
alfabeto galactico a partir de `ENCHANT_WORDS`.

### Capturas de un proyecto

Manda los PNG a `public/projects/<id>/` y añade los nombres de archivo a `gallery`. Los
huecos que sobren en el cofre se convierten en panel de texto. Ver `public/projects/README.md`.

## De dónde salen los assets

Nada de esto se descarga en CI. Los assets están commiteados y el build solo los copia.

**`npm run assets`** (`scripts/extract-assets.mjs`) abre el `.jar` de Minecraft 1.21.8 con
un lector ZIP escrito desde cero (busca el EOCD, recorre el directorio central y soporta
los métodos *stored* e *inflate*), extrae una lista blanca de 117 texturas y las deja en
`public/assets/mc/{items,blocks,entities,particles}/` junto a un `manifest.json` que
registra el jar de origen.

El jar se localiza por este orden: `--jar <ruta>`, variable `MC_JAR`, o el más reciente en
`%APPDATA%/.minecraft/versions/`. `--listar` imprime la tabla sin escribir nada.

```bash
npm run assets -- --listar
npm run assets -- --jar "C:\...\1.21.8.jar"
```

**`npm run icons`** (`scripts/gen-icons.mjs`) no usa ninguna librería de imágenes. Trae su
propio encoder PNG (CRC32, chunks, `deflateSync`) y su propio decoder, y con eso hace dos
cosas: dibujar 50 iconos escritos a mano como arte ASCII con paleta (16 líneas de 16
caracteres, `.` es transparente) y re-tintar 3 sprites que extrae de `public/gui/`.
`--preview` los imprime en la terminal.

```bash
npm run icons -- --preview
```

Todo el pixel art de la interfaz sale de `public/gui/`, el inventario de texturas del juego:
ventanas, slots, iconos, sprites de HUD, fondos de logros y las panorámicas del menú.

## Validación de contenido

No hay tests unitarios ni de integración. El peso de la verificación lo llevan el typecheck,
el lint y dos validadores de contenido que corren **antes** de cada build, también en CI.

**`check:encoding`** recorre `src/content`, `src/mc`, `src/components` y `src/pages`
permitiendo solo ASCII más `áéíóúüñÁÉÍÓÚÜÑ¡¿«»·–—'`. Cualquier otra cosa la reporta como
`archivo:línea U+XXXX`. Existe porque el contenido está en español y las tildes se corrompen
con facilidad al editar MDX.

**`check:recipes`** importa el `recipe.ts` y el `techs.ts` reales usando
`--experimental-strip-types`, así que la validación nunca puede desviarse de la app. Extrae
el `meta` de cada `.mdx` con un corte de texto y lo evalúa, sin necesitar compilar MDX.
Comprueba que la receta parsea, que no hay ingredientes repetidos, que no se comparten
items, que no se superan las 9 tecnologías, que cada tecnología existe en `TECH_ITEMS`, que
el `result` coincide con `RESULT_ITEMS` y que no se repite entre proyectos. Luego imprime
un ASCII art de cada rejilla:

```
cosmere-archive      3x3  8 ingredientes
                    Reac Type Tail
                    GSAP ·    D3.j
                    Thre Dock Vite
```

## Despliegue en GitHub Pages

`.github/workflows/deploy.yml` se dispara con cada push a `main` o `master` (y a mano desde
Actions). Dos jobs: **build** (checkout, Node 24 con caché de npm, `npm ci`,
`npm run check && npm run lint`, `npm run build`, subir `dist/`) y **deploy**
(`actions/deploy-pages`). Si el contenido es inválido o el lint falla, no se despliega.

GitHub Pages no soporta rewrites, así que recargar en `/crafting-table` daba un 404. El
arreglo es un apretón de manos en dos archivos:

1. `public/404.html` guarda `location.pathname + location.search` en
   `sessionStorage['minecraft-portfolio:path']` y devuelve a la raíz. Los ficheros de
   `public/` **no** admiten sustituciones de Vite, por eso lleva su propia constante `BASE`
   escrita a mano.
2. El script inline de `index.html` recupera la ruta, borra la clave y hace
   `history.replaceState` **antes** de que monte React, para que el router arranque en la
   pantalla correcta.

Ambos van envueltos en `try/catch` (en modo privado se degrada al menú en vez de a una
pantalla en blanco), y la ruta comodín `*` sirve de segunda red de seguridad.

**El prefijo `/Minecraft-Portfolio/` está escrito a mano en tres sitios que tienen que
coincidir:**

| Sitio | Valor |
| --- | --- |
| `vite.config.ts` | `base: '/Minecraft-Portfolio/'` |
| `src/App.tsx` | `<BrowserRouter basename="/Minecraft-Portfolio">` |
| `public/404.html` | `const BASE = '/Minecraft-Portfolio'` |

Si el repo se renombra, hay que cambiar los tres.

## Detalles técnicos

**Coordenadas medidas, no aproximadas.** Casi cada componente tiene píxeles fijos medidos
sobre la textura vanilla del juego, multiplicados por una variable CSS. Por ejemplo, la
rejilla de crafteo se coloca con origen `(30, 17)` y paso de 18 sobre
`gui/container/crafting_table.png`, y el slot de resultado en `(119, 30)`. Funciona porque
las texturas de contenedor son de 256x256 con la GUI dibujada dentro: el margen
transparente simplemente no se usa.

**`--tui: min(100vw / 427, 100vh / 240)`** es la resolución de referencia de la GUI de
Minecraft. El menú y la selección de mundo escalan con la misma variable, por eso se ven
idénticos en cualquier pantalla.

**La panorámica** son 7 caras del cubo concatenadas en una tira horizontal que se desplaza
con una animación CSS. El número sale de las matemáticas: la relación de aspecto más
extrema que se ve en la práctica (21:9) necesita 6,3 caras, y hay que respetar el límite de
16.000 px por textura del navegador. La repetición no se nota porque la última cara repetida
es la primera.

**El alfabeto galactico** se renderiza con `maskPosition` sobre
`public/fonts/ascii_sga.png`, un atlas de 8x8 celdas. El atlas es blanco puro sobre alfa,
así que una máscara CSS deja que el color venga de la hoja de estilos. El reparto de
letras en filas viene del proveedor `ascii_sga` del `alt.json` del jar 1.21.8.

**Tooltips portados a `document.body`.** Los paneles son `container-type` en CSS, lo que
hace que `position: fixed` se resuelva contra el panel en vez de contra la ventana. Todos
los tooltips y los tres modales se portan para escapar de eso.

**Rutas de assets en runtime.** Vite no puede reescribir URLs construidas dinámicamente, así
que todo lo que se arma en runtime pasa por `guiUrl()` en `src/components/crafting-table/`
(o su equivalente en `audio.ts`).

**Audio.** Dos sistemas separados: la música del menú es un `<audio>` en bucle con
`preload="auto"`, que reintenta `play()` en el primer `pointerdown` para cumplir la política
de autoplay; y los efectos de interfaz usan un pool de hasta 4 `HTMLAudioElement` por sonido,
para que los clics rápidos se solapen en vez de cortarse. El silencio se guarda en
`localStorage` y el botón es `position: fixed` para no desplazar ningún layout. El icono
del botón recorre los 8 frames de `music_notes.png` con una animación `steps(8)`.

**Responsive.** Cada hoja de estilos tiene su propio bloque para retrato. El árbol de logros
va a pantalla completa (soltando el marco que no se puede estirar) y usa `dvh` porque la
cadena de alturas todavía no está resuelta en ese punto. La mesa de crafteo apila sus dos
paneles en vertical, porque en horizontal `width = height x 2.494` no cabe por debajo de
480 px. Y el aldeano, que estaba oculto por debajo de 900 px y hacía las habilidades blandas
inalcanzables, reaparece en retrato. Los targets táctiles mínimos son de 44 px.

## Accesibilidad

Los tres modales llevan `role="dialog"` y `aria-modal`. Los tooltips usan `role="tooltip"`,
la mesa de crafteo es `role="grid"` con celdas reales y las pestañas de logros son
`role="listbox"` con `aria-pressed`, donde el foco espeja el hover. `Escape` cierra todo, las
flechas mueven la galería, los sprites decorativos son `aria-hidden` y
`draggable={false}`, y todos los `aria-label` están en español.

## Créditos y nota legal

**Este es un proyecto de fans, sin relación ni patrocinio de Mojang Studios ni Microsoft.**
*Minecraft* es una marca de Mojang Studios; *Minecraft* y sus recursos (texturas, sonidos,
música, tipografías) pertenecen a sus respectivos titulares. Este repositorio no distribuye
ningún recurso del juego: se limita a extraerlos en local desde tu propia instalación para
reconstruir la interfaz, y los assets resultantes no se usan con fines comerciales.

Si eres el titular de los derechos y quieres que se retire algún asset, abre un issue y se
borra.

Todo el código, los scripts y los iconos generados son originales.

- Interfaz, assets y diseño: Mario Muñoz
- Tipografía y recursos: [Minecraft](https://minecraft.net), © Mojang Studios
- Los proyectos que aparecen en el portfolio son propiedad de sus respectivos autores

## Estado

Sin tests automatizados: la red de seguridad es `npm run check` + `npm run lint` +
`tsc -b`, los tres en el camino crítico de CI. La deuda técnica conocida que no está
pendiente de arreglar: los iconos de plantilla de Vite sin usar en `src/assets/`, unos 6,6
MB de audio y de muestras de sonido en `public/audio/` que están ahí pero no se referencian,
y la ausencia de un bloque `prefers-reduced-motion` en el CSS.