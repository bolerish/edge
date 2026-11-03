import { pages } from './page-registry.js';
import type { DocPage } from './types.js';

export const publicPaths = [
  '/',
  ...pages.flatMap((page) => [
    getPagePath(page),
    ...(page.aliases ?? []).map(documentPath),
  ]),
];

export function getPagePath(page: DocPage) {
  return documentPath(page.slug);
}
export function findPage(path: string) {
  const normalized = normalizePath(path);
  return pages.find((page) =>
    getPagePath(page) === normalized ||
    page.aliases?.some((slug) => documentPath(slug) === normalized),
  );
}
export function normalizePath(path: string) {
  const pathname = path.split('?')[0] ?? '/';
  return pathname.endsWith('/') ? pathname : `${pathname}/`;
}
export function titleFor(path: string) {
  if (normalizePath(path) === '/') return 'bolerish/edge · Directional surface lighting';
  const page = findPage(path);
  const title = page ? [page.section, page.title].filter(Boolean).join(' · ') : 'Page not found';
  return `${title} · bolerish/edge`;
}
function documentPath(slug: string) {
  return `/docs/${slug ? `${slug}/` : ''}`;
}
