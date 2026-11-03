import { isValidElement, type ReactNode } from 'react';
import { pages } from '../pages/index.js';
import { getPagePath } from '../pages/routes.js';

interface SearchDocument {
  title: string;
  pageTitle: string;
  href: string;
  text: string;
  description: string;
}
const documents: SearchDocument[] = pages.flatMap((page) => {
  const href = getPagePath(page);
  const pageTitle = [page.section, page.title].filter(Boolean).join(' · ');
  return [
    { title: page.title, pageTitle, href, text: `${pageTitle} ${page.description}`.toLowerCase(), description: page.description },
    ...page.sections.map((section) => {
      const description = textContent(section.content).replace(/\s+/g, ' ').trim();
      return {
        title: section.title, pageTitle, href: `${href}#${section.id}`,
        text: `${pageTitle} ${section.title} ${description}`.toLowerCase(), description,
      };
    }),
  ];
});

export function searchDocuments(query: string) {
  const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  return documents.filter((document) => words.length
    ? words.every((word) => document.text.includes(word))
    : !document.href.includes('#'));
}
function textContent(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(textContent).join(' ');
  if (isValidElement<{ children?: ReactNode; code?: string }>(node))
    return `${textContent(node.props.children)} ${node.props.code ?? ''}`;
  return '';
}
