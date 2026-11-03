import { Heading } from '@bolerish/ui/heading';
import { Paragraph } from '@bolerish/ui/paragraph';
import { Link } from '@bolerish/ui/link';
import { pages } from './pages/index.js';
import { Playground } from './playground/Playground.js';
import { SiteShell, docsNavigation } from './ui/SiteShell.js';

export function normalizePath(path: string) {
  const pathname = path.split('?')[0] ?? '/';
  return pathname.endsWith('/') ? pathname : `${pathname}/`;
}
export const publicPaths = [
  '/',
  '/docs/',
  ...pages.filter((page) => page.slug).map((page) => `/docs/${page.slug}/`),
  '/playground/',
];
export function titleFor(path: string) {
  const normalized = normalizePath(path);
  if (normalized === '/playground/') return 'Playground · Wisp';
  return `${pages.find((page) => `/docs/${page.slug ? `${page.slug}/` : ''}` === normalized)?.title ?? (normalized === '/' ? 'Introduction' : 'Page not found')} · Wisp`;
}
export function App({ pathname }: { pathname: string }) {
  const path = normalizePath(pathname);
  if (path === '/playground/') return <Playground />;
  const page = pages.find(
    (page) =>
      `/docs/${page.slug ? `${page.slug}/` : ''}` ===
      (path === '/' ? '/docs/' : path),
  );
  if (!page)
    return (
      <SiteShell section="docs" pathname={path} navigation={docsNavigation}>
        <article className="document">
          <Heading level={1} size="page">
            Page not found
          </Heading>
          <Paragraph>
            This page is not available.{' '}
            <Link href="/docs/">Return to the introduction</Link> or explore the{' '}
            <Link href="/playground/">Playground</Link>.
          </Paragraph>
        </article>
      </SiteShell>
    );
  return (
    <SiteShell
      section="docs"
      pathname={path === '/' ? '/docs/' : path}
      navigation={docsNavigation}
      toc={page.sections.map(({ id, title }) => ({ id, title }))}
    >
      <article className="document">
        <Heading level={1} size="page">
          {page.title}
        </Heading>
        <Paragraph variant="description">{page.description}</Paragraph>
        {page.sections.map((section) => (
          <section key={section.id} id={section.id} className="doc-section">
            <Heading level={2} size="section">
              {section.title}
            </Heading>
            {section.content}
          </section>
        ))}
        <footer className="page-footer">Wisp · React + StyleX</footer>
      </article>
    </SiteShell>
  );
}
