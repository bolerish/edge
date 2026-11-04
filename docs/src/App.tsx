import { useLight } from '@bolerish/edge';
import { DocumentLightContext } from './ui/document-light-context.js';
import { DocumentSurface } from './ui/DocumentSurface.js';
import type { LightOptions } from '@bolerish/edge';
import type { ReactNode } from 'react';
import { usePreferences } from './settings/usePreferences.js';
import { Heading } from '@bolerish/ui/heading';
import { Paragraph } from '@bolerish/ui/paragraph';
import { Link } from '@bolerish/ui/link';
import { findPage, getPagePath, normalizePath } from './pages/routes.js';
import { getReadingNeighbors } from './pages/page-registry.js';
import { Home } from './home/Home.js';
import { SiteShell, docsNavigation } from './ui/SiteShell.js';

export function App({ pathname }: { pathname: string }) {
  const { motion, staticDirection } = usePreferences();
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
  const { previous, next } = getReadingNeighbors(page);
  return (
    <DocumentLighting motion={motion} staticDirection={staticDirection}>
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
        <nav className="reading-navigation" aria-label="Continue reading">
          {previous ? <DocumentSurface as="a" href={getPagePath(previous)} rel="prev"><small>Previous</small><span>{previous.title}</span></DocumentSurface> : <span />}
          {next ? <DocumentSurface as="a" href={getPagePath(next)} rel="next"><small>Next</small><span>{next.title}</span></DocumentSurface> : null}
        </nav>
        <footer className="page-footer">bolerish/edge{page.section ? ` · ${page.section}` : ''}</footer>
      </article>
    </SiteShell>
    </DocumentLighting>
  );
}

function DocumentLighting({ children, ...options }: LightOptions & { children: ReactNode }) {
  const light = useLight(options);
  return <DocumentLightContext value={light}>{children}</DocumentLightContext>;
}
