// Paths are relative to the site root; pass them through `withBase` before linking.
export const NAV = [
  { href: 'research/', label: 'Research' },
  { href: 'publications/', label: 'Publications' },
  { href: 'teaching/', label: 'Teaching' },
  { href: 'talks/', label: 'Talks & Media' },
  { href: 'cv/', label: 'CV' },
  { href: 'contact/', label: 'Contact' },
] as const;

const base = import.meta.env.BASE_URL.replace(/\/?$/, '/');

/**
 * Turns a path within the site into a link that works wherever the site is
 * served from, e.g. "cv/" becomes "/Website/cv/" on GitHub Pages. Accepts
 * "files/cv.pdf" or "/files/cv.pdf" (as Pages CMS stores uploads) and leaves
 * full URLs, mailto: links and #anchors unchanged.
 */
export function withBase(path: string): string {
  if (/^([a-z][a-z\d+.-]*:|\/\/|#)/i.test(path)) return path;
  return base + path.replace(/^\/+/, '');
}

/** True when `pathname` is the page `path` points to, or a page below it. */
export function isCurrentPath(pathname: string, path: string): boolean {
  const current = pathname.replace(/\/?$/, '/');
  const target = withBase(path).replace(/\/?$/, '/');
  return target === base ? current === base : current.startsWith(target);
}
