import { useState } from 'react';
import { Button } from '@bolerish/ui/button';
import { Link } from '@bolerish/ui/link';
import { MoonIcon } from '@phosphor-icons/react/Moon';
import { SunIcon } from '@phosphor-icons/react/Sun';
import { DocumentationSearch } from './shared/search/DocumentationSearch.js';
import { updatePreferences, usePreferences } from './shared/preferences/usePreferences.js';
import { Home } from './page.js';
import { DocumentLayout } from './docs/layout.js';
import { normalizePath } from './docs/_shared/routes.js';

export function Layout({ pathname }: { pathname: string }) {
  const path = normalizePath(pathname);
  const [navigationOpen, setNavigationOpen] = useState(false);
  return <>
    <SiteHeader section={path === '/' ? 'home' : 'docs'} navigationOpen={navigationOpen} setNavigationOpen={setNavigationOpen} />
    {path === '/' ? <Home /> : <DocumentLayout pathname={path} open={navigationOpen} setOpen={setNavigationOpen} />}
  </>;
}

function SiteHeader({ section, navigationOpen, setNavigationOpen }: { section: 'home' | 'docs'; navigationOpen: boolean; setNavigationOpen: (open: boolean) => void }) {
  const { theme } = usePreferences();
  return <>
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
          {section === 'docs' ? <div className="mobile-toggle"><Button size="icon" variant="ghost" aria-label="Open navigation" aria-expanded={navigationOpen} aria-controls="mobile-navigation" onClick={() => setNavigationOpen(!navigationOpen)}><span aria-hidden="true">☰</span></Button></div> : null}
        </div>
      </header>

  </>;
}
