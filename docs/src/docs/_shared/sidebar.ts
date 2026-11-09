import { sectionLabel } from '../../shared/locale.js';
import type { NavigationGroup } from '../layout.js';
import { pages } from './page-registry.js';
import { getPagePath } from './routes.js';

export function getDocsNavigation(): NavigationGroup[] {
  return [...new Set(pages.map((page) => page.section))].map((section) => ({
    title: section ? sectionLabel(section) : undefined,
    items: pages
      .filter((page) => page.section === section && page.navigation !== false)
      .map((page) => ({ title: page.title, href: getPagePath(page) })),
  }));
}
