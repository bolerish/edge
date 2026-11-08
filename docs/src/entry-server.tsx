import * as stylex from '@stylexjs/stylex';
import { documentStyles } from './shared/document-styles.js';
import { renderToString } from 'react-dom/server';
import { Layout } from './layout.js';
import {
  findPage,
  getPagePath,
  normalizePath,
  publicPaths,
  titleFor,
} from './docs/_shared/routes.js';
export { publicPaths, titleFor, getPagePath };
export { renderAgentDocuments } from './agent-documents.js';
export { pages, learningPath } from './docs/_shared/page-registry.js';
export function render(path: string) {
  return {
    path: normalizePath(path),
    html: renderToString(<Layout pathname={path} />),
    title: titleFor(path),
  };
}

export function renderDocument(template: string, path: string) {
  const page = render(path);
  const title = escapeHtml(page.title);
  const url = escapeHtml(new URL(page.path, 'https://edge.bolerish.com').href);
  const document = findPage(page.path);
  const alternate = document
    ? `<link rel="alternate" type="text/markdown" href="${getPagePath(document)}index.md">`
    : '';
  return template
    .replace('<html ', `<html class="${stylex.props(documentStyles.html).className}" `)
    .replace('<body>', `<body class="${stylex.props(documentStyles.body).className}">`)
    .replace('</head>', () => `${alternate}</head>`)
    .replace('<!--app-html-->', () => page.html)
    .replace('id="root"', `id="root" data-path="${escapeHtml(page.path)}"`)
    .replace(/<title>[^<]*<\/title>/, () => `<title>${title}</title>`)
    .replace(
      /(<meta (?:property|name)="(?:og:title|twitter:title)" content=")[^"]*(")/g,
      (_, start: string, end: string) => `${start}${title}${end}`,
    )
    .replace(
      /(<meta property="og:url" content=")[^"]*(")/,
      (_, start: string, end: string) => `${start}${url}${end}`,
    );
}

function escapeHtml(text: string) {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
