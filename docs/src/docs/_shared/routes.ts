import { sectionLabel } from '../../shared/locale.js';
import { m } from '../../paraglide/messages.js';
import { basePath, localePath, locales } from '../../shared/locale.js';
import { pages } from './page-registry.js';
import type { DocPage } from './types.js';

const basePaths = [
  '/',
  ...pages.flatMap((page) => [
    localePath(getPagePath(page), 'en'),
    ...(page.aliases ?? []).map(documentPath),
  ]),
];

export const publicPaths = locales.flatMap((locale) =>
  basePaths.map((path) => localePath(path, locale)),
);

export function getPagePath(page: DocPage) {
  return localePath(documentPath(page.slug));
}
export function findPage(path: string) {
  const normalized = normalizePath(basePath(path));
  return pages.find(
    (page) =>
      documentPath(page.slug) === normalized ||
      page.aliases?.some((slug) => documentPath(slug) === normalized),
  );
}
export function normalizePath(path: string) {
  const pathname = path.split('?')[0] ?? '/';
  return pathname.endsWith('/') ? pathname : `${pathname}/`;
}
export function titleFor(path: string) {
  if (normalizePath(basePath(path)) === '/') return `bolerish/edge · ${m.home_title()}`;
  const page = findPage(path);
  const title = page
    ? [page.section ? sectionLabel(page.section) : undefined, page.title]
        .filter(Boolean)
        .join(' · ')
    : m.page_not_found();
  return `${title} · bolerish/edge`;
}
function documentPath(slug: string) {
  return `/docs/${slug ? `${slug}/` : ''}`;
}
