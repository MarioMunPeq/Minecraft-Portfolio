/**
 * Como en el juego, el nombre de cada encantamiento se construye al azar con
 * tres a cinco palabras de una lista. Lo que sale son jeroglificos, asi que
 * la lista solo importa por los trazos que deja, nunca por lo que se lea.
 */
export function rollSgaName(words: string[]): string {
  const count = 3 + Math.floor(Math.random() * 3);
  const picked: string[] = [];
  for (let i = 0; i < count; i++) {
    picked.push(words[Math.floor(Math.random() * words.length)]);
  }
  return picked.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}
