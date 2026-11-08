import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from '@bolerish/ui/navigation-menu';
import { colorVars } from '@bolerish/tokens/semantic.stylex';
import { documentStyles } from './shared/document-styles.js';
import { siteColors } from './shared/site.stylex';
import * as stylex from '@stylexjs/stylex';
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
  return (
    <>
      <SiteHeader
        section={path === '/' ? 'home' : 'docs'}
        navigationOpen={navigationOpen}
        setNavigationOpen={setNavigationOpen}
      />
      {path === '/' ? (
        <Home />
      ) : (
        <DocumentLayout pathname={path} open={navigationOpen} setOpen={setNavigationOpen} />
      )}
    </>
  );
}

function SiteHeader({
  section,
  navigationOpen,
  setNavigationOpen,
}: {
  section: 'home' | 'docs';
  navigationOpen: boolean;
  setNavigationOpen: (open: boolean) => void;
}) {
  const { theme } = usePreferences();
  return (
    <>
      <Link variant="plain" {...stylex.props(documentStyles.link, styles.skipLink)} href="#content">
        Skip to content
      </Link>
      <header className={`site-header ${stylex.props(styles.siteHeader).className}`}>
        <Link
          variant="plain"
          className={`wordmark ${stylex.props(documentStyles.link, styles.wordmark).className}`}
          href="/"
          aria-current={section === 'home' ? 'page' : undefined}
        >
          bolerish<span {...stylex.props(documentStyles.link, styles.wordmarkSuffix)}>/edge</span>
        </Link>
        <NavigationMenu xstyle={styles.topNav} aria-label="Sections">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                href="/docs/"
                active={section === 'docs'}
                aria-current={section === 'docs' ? 'page' : undefined}
              >
                Docs
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div {...stylex.props(styles.headerActions)}>
          <DocumentationSearch />
          <Button
            size="icon"
            variant="ghost"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            onClick={() => updatePreferences({ theme: theme === 'light' ? 'dark' : 'light' })}
          >
            {theme === 'light' ? (
              <SunIcon {...stylex.props(styles.headerIcon)} aria-hidden="true" />
            ) : (
              <MoonIcon {...stylex.props(styles.headerIcon)} aria-hidden="true" />
            )}
          </Button>
          {section === 'docs' ? (
            <div {...stylex.props(styles.mobileToggle)}>
              <Button
                size="icon"
                variant="ghost"
                aria-label="Open navigation"
                aria-expanded={navigationOpen}
                aria-controls="mobile-navigation"
                onClick={() => setNavigationOpen(!navigationOpen)}
              >
                <span aria-hidden="true">☰</span>
              </Button>
            </div>
          ) : null}
        </div>
      </header>
    </>
  );
}

const styles = stylex.create({
  siteHeader: {
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    gap: {
      default: '36px',
      '@media (max-width: 760px)': '16px',
    },
    padding: {
      default: '0 32px',
      '@media (max-width: 760px)': '0 16px',
    },
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: colorVars.strokeDefault,
    backgroundColor: `${siteColors.background}`,
    position: 'sticky',
    top: '0',
    zIndex: '20',
  },
  wordmark: {
    fontFamily: 'ui-monospace, SFMono-Regular, monospace',
    fontSize: {
      default: '14px',
      '@media (max-width: 760px)': '12px',
    },
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    letterSpacing: '0.4px',
    color: `${colorVars.fgPrimary}`,
  },
  wordmarkSuffix: {
    color: `${colorVars.fgSecondary}`,
  },
  topNav: {
    display: 'flex',
    alignItems: 'center',
    gap: {
      default: '24px',
      '@media (max-width: 760px)': '16px',
    },
    flex: '1',
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: {
      default: '12px',
      '@media (max-width: 760px)': '4px',
    },
    marginInlineStart: 'auto',
    minWidth: '0',
  },
  headerIcon: {
    width: '20px',
    height: '20px',
    flexShrink: '0',
  },
  mobileToggle: {
    display: {
      default: 'none',
      '@media (max-width: 760px)': 'block',
    },
  },
  skipLink: {
    position: 'fixed',
    top: {
      default: '-100px',
      ':focus': '12px',
    },
    left: '16px',
    padding: '10px',
    backgroundColor: `${siteColors.background}`,
    zIndex: '100',
    color: `${colorVars.fgPrimary}`,
  },
});
