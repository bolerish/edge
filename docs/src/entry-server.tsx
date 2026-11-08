import { renderAgentDocuments as renderLocaleAgentDocuments } from './agent-documents.js';
import { AsyncLocalStorage } from 'node:async_hooks';
import { overwriteServerAsyncLocalStorage, type Locale } from './paraglide/runtime.js';
import { localeFromPath, localePath, locales } from './shared/locale.js';
const localeStorage = new AsyncLocalStorage<{ locale?: Locale; origin?: string }>();
overwriteServerAsyncLocalStorage(localeStorage);
import * as stylex from '@stylexjs/stylex';
import { documentStyles } from './shared/document-styles.js';
import { renderToString } from 'react-dom/server';
import { Layout } from './layout.js';
import {
  findPage,
  getPagePath,
  normalizePath,
  publicPaths,
  titleFor as routeTitleFor,
} from './docs/_shared/routes.js';
export { publicPaths, getPagePath };
export function titleFor(path: string) {
  return localeStorage.run(
    { locale: localeFromPath(path), origin: 'https://edge.bolerish.com' },
    () => routeTitleFor(path),
  );
}
export function renderAgentDocuments(version: string) {
  const output = new Map<string, string>();
  for (const locale of locales) {
    localeStorage.run({ locale, origin: 'https://edge.bolerish.com' }, () => {
      for (const [path, body] of renderLocaleAgentDocuments(version)) {
        output.set(path, body);
      }
    });
  }
  return output;
}
export { pages, learningPath } from './docs/_shared/page-registry.js';
export function render(path: string) {
  return localeStorage.run(
    { locale: localeFromPath(path), origin: 'https://edge.bolerish.com' },
    () => renderPage(path),
  );
}
function renderPage(path: string) {
  return {
    path: normalizePath(path),
    html: renderToString(<Layout pathname={path} />),
    title: titleFor(path),
  };
}

export function renderDocument(template: string, path: string) {
  return localeStorage.run(
    { locale: localeFromPath(path), origin: 'https://edge.bolerish.com' },
    () => renderLocalizedDocument(template, path),
  );
}
function renderLocalizedDocument(template: string, path: string) {
  const page = render(path);
  const title = escapeHtml(page.title);
  const url = escapeHtml(new URL(page.path, 'https://edge.bolerish.com').href);
  const document = findPage(page.path);
  const description = escapeHtml(document?.description ?? routeTitleFor(path));
  const alternate = document
    ? `<link rel="alternate" type="text/markdown" href="${getPagePath(document)}index.md">`
    : '';
  return template
    .replace(
      'lang="en"',
      `lang="${localeFromPath(path) === 'zh' ? 'zh-Hans' : localeFromPath(path)}"`,
    )
    .replace('<html ', `<html class="${stylex.props(documentStyles.html).className}" `)
    .replace('<body>', `<body class="${stylex.props(documentStyles.body).className}">`)
    .replace(
      '</head>',
      () =>
        `<link rel="canonical" href="${url}">${alternate}${locales.map((locale) => `<link rel="alternate" hreflang="${locale === 'zh' ? 'zh-Hans' : locale}" href="https://edge.bolerish.com${localePath(path, locale)}">`).join('')}</head>`,
    )
    .replace(
      /(<meta (?:property|name)="(?:description|og:description|twitter:description)" content=")[^"]*(")/g,
      (_, start: string, end: string) => `${start}${description}${end}`,
    )
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
