import { useLight, type LightOptions } from '@bolerish/edge';
import { Heading } from '@bolerish/ui/heading';
import { Paragraph } from '@bolerish/ui/paragraph';
import type { ReactNode } from 'react';
import { usePreferences } from '../../shared/preferences/usePreferences.js';
import { SiteShell } from '../../shared/site-shell/SiteShell.js';
import { getReadingNeighbors } from '../page-registry.js';
import { getPagePath } from '../routes.js';
import { docsNavigation } from '../sidebar.js';
import type { DocPage } from '../types.js';
import { DocumentLightContext } from './document-light-context.js';
import { DocumentSurface } from './DocumentSurface.js';

export function DocumentPage({ page }: { page: DocPage }) {
  const { motion, staticDirection } = usePreferences();
  const { previous, next } = getReadingNeighbors(page);
  return (
    <DocumentEdge motion={motion} staticDirection={staticDirection}>
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
    </DocumentEdge>
  );
}

function DocumentEdge({ children, ...options }: LightOptions & { children: ReactNode }) {
  const light = useLight(options);
  return <DocumentLightContext value={light}>{children}</DocumentLightContext>;
}
