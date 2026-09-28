export function guiUrl(path: string): string {
  return `${import.meta.env.BASE_URL}${path}`.replace(/\/{2,}/g, '/');
}