const BASE = import.meta.env.BASE_URL;

/**
 * Las cuatro caras laterales del cubo del panorama, en el orden en que se
 * encadenan alrededor: el borde derecho de una continua con el izquierdo de la
 * siguiente (0 -> 1 -> 2 -> 3 -> 0). Las caras 4 y 5 son la del cielo y la del
 * suelo, vistas desde arriba, asi que no entran en un panorama horizontal.
 */
const FACES = [0, 1, 2, 3];

/**
 * Se repite el anillo entero mas las caras que hacen falta para que la tira
 * siga cubriendo la pantalla al final del recorrido. El salto de vuelta es
 * invisible porque la ultima cara repetida es la primera.
 *
 * Son 7 caras porque la ventana uncover 4 de ellas y todavia tiene que quedar
 * sitio para el ancho de la pantalla: en el peor caso (21:9) hacen falta 6,3.
 * Cuantas menos caras, mas pequena es la capa que compone el navegador, y a
 * partir de unos 16000 px de ancho deja de caber en una textura.
 */
const STRIP = [...FACES, ...FACES.slice(0, 3)];

export function Panorama() {
  return (
    <div className="ws-panorama" aria-hidden>
      <div className="ws-panorama-strip">
        {STRIP.map((face, i) => (
          <div
            key={i}
            className="ws-panorama-face"
            style={{ backgroundImage: `url("${BASE}gui/title/background/panorama_${face}.png")` }}
          />
        ))}
      </div>
    </div>
  );
}
