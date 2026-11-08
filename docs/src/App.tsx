import { Heading } from '@bolerish/ui/heading';
import { Paragraph } from '@bolerish/ui/paragraph';
import { Link } from '@bolerish/ui/link';
import { findPage, normalizePath } from './pages/routes.js';
import { Home } from './home/Home.js';
import { SiteShell } from './shared/site-shell/SiteShell.js';
import { docsNavigation } from './pages/sidebar.js';
import { DocumentPage } from './pages/_shared/DocumentPage.js';

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
            <Link href="/docs/">Return to Getting started</Link> or explore the{' '}
            <Link href="/">dashboard example</Link>.
          </Paragraph>
        </article>
      </SiteShell>
    );
  return <DocumentPage page={page} />;
}
