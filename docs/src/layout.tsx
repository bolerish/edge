import { localePath } from './shared/locale.js';
import { basePath } from './shared/locale.js';
import { LanguageMenu } from './shared/LanguageMenu.js';
import { m } from './paraglide/messages.js';
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
  const path = normalizePath(basePath(pathname));
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
        {m.skip_to_content()}
      </Link>
      <header className={`site-header ${stylex.props(styles.siteHeader).className}`}>
        <Link
          variant="plain"
          className={`wordmark ${stylex.props(documentStyles.link, styles.wordmark).className}`}
          href={localePath('/')}
          aria-current={section === 'home' ? 'page' : undefined}
        >
          {'bolerish'}
          <span {...stylex.props(documentStyles.link, styles.wordmarkSuffix)}>{'/edge'}</span>
        </Link>
        <nav {...stylex.props(styles.topNav)} aria-label={m.sections()}>
          <Link
            variant="plain"
            className={stylex.props(documentStyles.link, styles.docsLink).className}
            href={localePath('/docs/')}
            aria-current={section === 'docs' ? 'page' : undefined}
          >
            Docs
          </Link>
        </nav>
        <div {...stylex.props(styles.headerActions)}>
          <DocumentationSearch />
          <LanguageMenu />
          <Button
            size="icon"
            variant="ghost"
            data-testid="theme-toggle"
            aria-label={theme === 'light' ? m.switch_dark() : m.switch_light()}
            onClick={() => updatePreferences({ theme: theme === 'light' ? 'dark' : 'light' })}
          >
            <span {...stylex.props(styles.themeIcons)}>
              <SunIcon {...stylex.props(styles.headerIcon, styles.lightIcon)} aria-hidden="true" />
              <MoonIcon {...stylex.props(styles.headerIcon, styles.darkIcon)} aria-hidden="true" />
            </span>
          </Button>
        </div>
      </header>
      {section === 'docs' ? (
        <div {...stylex.props(styles.mobileToggle)}>
          <Button
            size="icon"
            variant="ghost"
            aria-label={m.open_navigation()}
            aria-expanded={navigationOpen}
            aria-controls="mobile-navigation"
            onClick={() => setNavigationOpen(!navigationOpen)}
          >
            <span aria-hidden="true">☰</span>
          </Button>
        </div>
      ) : null}
    </>
  );
}

const styles = stylex.create({
  siteHeader: {
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    columnGap: { default: '36px', '@media (max-width: 760px)': '8px' },
    padding: { default: '0 32px', '@media (max-width: 760px)': '0 12px' },
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
    fontSize: '14px',
    flexShrink: 0,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    letterSpacing: '0.4px',
    color: `${colorVars.fgPrimary}`,
  },
  wordmarkSuffix: {
    color: `${colorVars.fgSecondary}`,
  },
  docsLink: {
    fontSize: '12px',
    fontWeight: 400,
    color: { default: colorVars.fgSecondary, ':hover': colorVars.fgPrimary },
    padding: '8px 4px',
    textDecoration: 'none',
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
  themeIcons: { display: 'grid' },
  lightIcon: { color: `light-dark(${colorVars.fgPrimary}, transparent)` },
  darkIcon: { color: `light-dark(transparent, ${colorVars.fgPrimary})` },
  headerIcon: {
    gridArea: '1 / 1',
    width: '20px',
    height: '20px',
    flexShrink: '0',
  },
  mobileToggle: {
    padding: '4px 12px',
    borderBottom: `1px solid ${colorVars.strokeDefault}`,
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
