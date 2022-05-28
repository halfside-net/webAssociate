export function latinize(str) {
  return str.normalize('NFD').replace(/\p{Diacritic}/gu, '');
}

export function normalizeText(text) {
  return latinize(text)
    .toLowerCase()
    .replace(/[^0-9a-z]/g, '');
}
