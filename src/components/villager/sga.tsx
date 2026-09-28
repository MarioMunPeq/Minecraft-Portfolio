/**
 * Standard Galactic Alphabet: el alfabeto con el que el juego escribe los
 * nombres de los encantamientos.
 *
 * La hoja public/fonts/ascii_sga.png es un atlas de 128x128 con celdas de
 * 8x8 en una rejilla de 16x16. El reparto de letras esta en el provider
 * ascii_sga de assets/minecraft/font/alt.json, medido sobre el jar de 1.21.8:
 * mayusculas A..O en la fila 4 (columnas 1..15), P..Z en la 5 (0..10), y las
 * minusculas igual, a..o en la 6 y p..z en la 7.
 */
const CELLS: Record<string, [number, number]> = {};

const fill = (chars: string, row: number, startCol: number) => {
  for (let i = 0; i < chars.length; i++) {
    CELLS[chars[i]] = [startCol + i, row];
  }
};

fill('ABCDEFGHIJKLMNO', 4, 1);
fill('PQRSTUVWXYZ', 5, 0);
fill('abcdefghijklmno', 6, 1);
fill('pqrstuvwxyz', 7, 0);

interface SgaTextProps {
  text: string;
}

/**
 * Texto en jeroglificos: un span por glifo. Los glifos del atlas son blanco
 * puro con alfa, asi que se tintan con una mascara y el color lo pone el CSS.
 */
export function SgaText({ text }: SgaTextProps) {
  return (
    <span className="mc-sga" aria-hidden>
      {text.split('').map((char, index) => {
        const cell = CELLS[char];
        if (!cell) return null;
        const [col, row] = cell;
        return (
          <span
            key={`${char}-${index}`}
            className="mc-sga-glyph"
            style={{
              maskPosition: `calc(${-col * 8} * var(--px)) calc(${-row * 8} * var(--px))`,
            }}
          />
        );
      })}
    </span>
  );
}
