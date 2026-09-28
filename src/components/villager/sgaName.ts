/**
 * Como en el juego, el nombre de cada encantamiento se construye al azar con
 * palabras de una lista, pero cabiendo en el ancho de la fila: el juego pide
 * el nombre con el ancho disponible y aqui se rellena hasta el tope. La fila
 * de opcion deja unos 9 glifos de 8 px, asi que se cuentan solo letras: los
 * espacios no ocupan, no se dibujan.
 */
const MAX_LETTERS = 9;

const LETTERS = /[a-z]/gi;

export function rollSgaName(words: string[]): string {
  /* Solo sirven las palabras cortas: con un tope de 9 letras, una de 8 deja
     sin sitio para una segunda y el nombre queda un palo. */
  const usable = words.filter((word) => word.length >= 3 && word.length <= 5);
  const pool = usable.length > 0 ? usable : words;

  const picked: string[] = [];
  let letters = 0;

  while (picked.length < 3) {
    const word = pool[Math.floor(Math.random() * pool.length)];
    if (letters + word.replace(LETTERS, '').length > MAX_LETTERS) break;
    picked.push(word);
    letters += word.length;
  }

  if (picked.length === 0) picked.push(pool[0]);

  return picked.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}
