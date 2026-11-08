import type { NavigationGroup } from '../shared/site-shell/SiteShell.js';
import { pages } from './page-registry.js';
import { getPagePath } from './routes.js';

export const docsNavigation: NavigationGroup[] = [
  ...new Set(pages.map((page) => page.section)),
].map((section) => ({
  title: section,
  items: pages
    .filter((page) => page.section === section)
    .map((page) => ({ title: page.title, href: getPagePath(page) })),
}));
