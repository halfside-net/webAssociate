/** 
 * Remove all diacritic marks from a string, transforming to base latin characters. 
 */ 
export function latinize(str: string) {
  return str.normalize('NFD').replace(/\p{Diacritic}/gu, '');
}

/**
 * Latinize a string, make it lowercase, and remove all non-alphanumeric characters.
 */
export function normalizeText(text: string) {
  return latinize(text)
    .toLowerCase()
    .replace(/[^0-9a-z]/g, '');
}
