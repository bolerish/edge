import { Heading } from '@bolerish/ui/heading';
import { Paragraph } from '@bolerish/ui/paragraph';
import { Link } from '@bolerish/ui/link';
import { findPage, getPagePath, normalizePath } from './pages/routes.js';
import { Home } from './home/Home.js';
import { SiteShell, docsNavigation } from './ui/SiteShell.js';

export function App({ pathname }: { pathname: string }) {
  const path = normalizePath(pathname);
  if (path === '/') return <Home />;
  const page = findPage(path);
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
            <Link href="/">dashboard example</Link>.
          </Paragraph>
        </article>
      </SiteShell>
    );
  return (
    <SiteShell
      section="docs"
      pathname={getPagePath(page)}
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
        <footer className="page-footer">Wisp{page.section ? ` · ${page.section}` : ''}</footer>
      </article>
    </SiteShell>
  );
}
