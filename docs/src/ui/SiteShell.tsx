import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Button } from '@bolerish/ui/button';
import { Link } from '@bolerish/ui/link';
import { pages } from '../pages/index.js';
import { getPagePath } from '../pages/routes.js';
import { useLocationHash } from './useLocationHash.js';
import { MoonIcon } from '@phosphor-icons/react/Moon';
import { SunIcon } from '@phosphor-icons/react/Sun';
import { DocumentationSearch } from '../search/DocumentationSearch.js';
import { updatePreferences, usePreferences } from '../settings/usePreferences.js';

export interface NavigationGroup {
  title?: string;
  items: { title: string; href: string }[];
}
export interface SectionLink {
  id: string;
  title: string;
}

export function SiteShell({
  section,
  pathname,
  navigation = [],
  toc = [],
  children,
}: {
  section: 'docs' | 'home';
  pathname: string;
  navigation?: NavigationGroup[];
  toc?: SectionLink[];
  children: ReactNode;
}) {
  const { theme } = usePreferences();
  const [open, setOpen] = useState(false);
  const hash = useLocationHash();
  const menu = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        menu.current?.focus();
      }
    };
    window.addEventListener('keydown', escape);
    return () => window.removeEventListener('keydown', escape);
  }, [open]);
  const nav = (
    <nav aria-label="Documentation">
      {navigation.map((group, index) => (
        <div className="nav-group" key={group.title ?? index}>
          {group.title ? <p className="nav-heading">{group.title}</p> : null}
          {group.items.map((item) => {
            const active =
              item.href === pathname || item.href === pathname + hash;
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
  return (
    <>
      <a className="skip-link" href="#content">
        Skip to content
      </a>
      <header className="site-header">
        <a
          className="wordmark"
          href="/"
          aria-current={section === 'home' ? 'page' : undefined}
        >
          bolerish<span>/edge</span>
        </a>
        <nav className="top-nav" aria-label="Sections">
          <Link
            href="/docs/"
            variant="plain"
            aria-current={section === 'docs' ? 'page' : undefined}
          >
            Docs
          </Link>
        </nav>
        <div className="header-actions">
          <DocumentationSearch />
          <Button
            size="icon"
            variant="ghost"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            onClick={() => updatePreferences({ theme: theme === 'light' ? 'dark' : 'light' })}
          >
            {theme === 'light' ? <SunIcon aria-hidden="true" /> : <MoonIcon aria-hidden="true" />}
          </Button>
        {section === 'docs' ? (
          <div className="mobile-toggle">
            <Button
              ref={menu}
              size="icon"
              variant="ghost"
              aria-label="Open navigation"
              aria-expanded={open}
              aria-controls="mobile-navigation"
              onClick={() => setOpen((value) => !value)}
            >
              <span aria-hidden="true">☰</span>
            </Button>
          </div>
        ) : null}
        </div>
      </header>
      {section === 'docs' ? (
        <div
          id="mobile-navigation"
          className="mobile-navigation"
          hidden={!open}
        >
          {nav}
        </div>
      ) : null}
      <div
        className={
          section === 'home'
            ? 'home-layout'
            : `site-layout ${toc.length ? 'with-toc' : 'wide-content'}`
        }
      >
        {section === 'docs' ? <aside className="sidebar">{nav}</aside> : null}
        <main id="content" tabIndex={-1} className="site-content">
          {children}
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
    </>
  );
}

export const docsNavigation: NavigationGroup[] = [
  ...new Set(pages.map((page) => page.section)),
].map((section) => ({
  title: section,
  items: pages
    .filter((page) => page.section === section)
    .map((page) => ({ title: page.title, href: getPagePath(page) })),
}));
