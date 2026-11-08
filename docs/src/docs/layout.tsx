import { useEffect } from 'react';
import { useLight } from '@bolerish/edge';
import { Heading } from '@bolerish/ui/heading';
import { Paragraph } from '@bolerish/ui/paragraph';
import { Link } from '@bolerish/ui/link';
import { usePreferences } from '../shared/preferences/usePreferences.js';
import { useLocationHash } from '../shared/site-shell/useLocationHash.js';
import { getReadingNeighbors } from './_shared/page-registry.js';
import { findPage, getPagePath } from './_shared/routes.js';
import { docsNavigation } from './_shared/sidebar.js';
import { DocumentLightContext } from './_shared/document-light-context.js';
import { DocumentSurface } from './_shared/DocumentSurface.js';
export interface NavigationGroup { title?: string; items: { title: string; href: string }[]; }

export function DocumentLayout({ pathname, open, setOpen }: { pathname: string; open: boolean; setOpen: (open: boolean) => void }) {
  const page = findPage(pathname);
  const { motion, staticDirection } = usePreferences();
  const light = useLight({ motion, staticDirection });
  const { previous, next } = page ? getReadingNeighbors(page) : { previous: undefined, next: undefined };
  const navigation = docsNavigation;
  const toc = page?.sections.map(({ id, title }) => ({ id, title })) ?? [];
  const hash = useLocationHash();
  useEffect(() => {
    if (!open) return;
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        document.querySelector<HTMLButtonElement>('[aria-controls="mobile-navigation"]')?.focus();
      }
    };
    window.addEventListener('keydown', escape);
    return () => window.removeEventListener('keydown', escape);
  }, [open, setOpen]);
  const nav = (
    <nav aria-label="Documentation">
      {navigation.map((group, index) => (
        <div className="nav-group" key={group.title ?? index}>
          {group.title ? <p className="nav-heading">{group.title}</p> : null}
          {group.items.map((item) => {
            const active =
              item.href === (page ? getPagePath(page) : pathname) || item.href === (page ? getPagePath(page) : pathname) + hash;
            return (
              <a
                key={item.href}
                href={item.href}
                className="nav-link"
                aria-current={active ? 'page' : undefined}
                onClick={() => setOpen(false)}
              >
                {item.title}
              </a>
            );
          })}
        </div>
      ))}
    </nav>
  );
  return <DocumentLightContext value={light}>
      {(
        <div
          id="mobile-navigation"
          className="mobile-navigation"
          hidden={!open}
        >
          {nav}
        </div>
      )}
      <div
        className={`site-layout ${toc.length ? 'with-toc' : 'wide-content'}`}
      >
        <aside className="sidebar">{nav}</aside>
        <main id="content" tabIndex={-1} className="site-content">
          {page ? <>
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
</> : <article className="document"><Heading level={1} size="page">Page not found</Heading><Paragraph>This page is not available. <Link href="/docs/">Return to Getting started</Link> or explore the <Link href="/">dashboard example</Link>.</Paragraph></article>}
        </main>
        {toc.length ? (
          <nav className="table-of-contents" aria-label="On this page">
            <p>On this page</p>
            {toc.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                aria-current={hash === `#${item.id}` ? 'location' : undefined}
              >
                {item.title}
              </a>
            ))}
          </nav>
        ) : null}
      </div>
  </DocumentLightContext>;
}
