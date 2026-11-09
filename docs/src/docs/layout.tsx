import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@bolerish/ui/accordion';
import { inlineMessage } from './_shared/inline-message.js';
import { localePath, sectionLabel } from '../shared/locale.js';
import { m } from '../paraglide/messages.js';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from '@bolerish/ui/navigation-menu';
import { colorVars } from '@bolerish/tokens/semantic.stylex';
import { documentStyles } from '../shared/document-styles.js';
import { siteColors } from '../shared/site.stylex';
import * as stylex from '@stylexjs/stylex';
import { useEffect } from 'react';
import { useLight } from '@bolerish/edge';
import { Heading } from '@bolerish/ui/heading';
import { Paragraph } from '@bolerish/ui/paragraph';
import { Link } from '@bolerish/ui/link';
import { usePreferences } from '../shared/preferences/usePreferences.js';
import { useLocationHash } from '../shared/site-shell/useLocationHash.js';
import { getReadingNeighbors } from './_shared/page-registry.js';
import { findPage, getPagePath } from './_shared/routes.js';
import { getDocsNavigation } from './_shared/sidebar.js';
import { SurfaceLightContext } from '../shared/lighting/light-context.js';
import { LightingSurface } from '../shared/lighting/LightingSurface.js';
export interface NavigationGroup {
  title?: string;
  collapsible?: boolean;
  items: { title: string; href: string; group?: string }[];
}

export function DocumentLayout({
  pathname,
  open,
  setOpen,
}: {
  pathname: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const page = findPage(pathname);
  const { motion, staticDirection, direction, radius } = usePreferences();
  const light = useLight({ motion, staticDirection, direction, radius });
  const { previous, next } = page
    ? getReadingNeighbors(page)
    : { previous: undefined, next: undefined };
  const navigation = getDocsNavigation();
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
    <NavigationMenu
      orientation="vertical"
      aria-label={m.documentation()}
      xstyle={styles.navigationRoot}
    >
      <NavigationMenuList xstyle={styles.navigationList}>
        {navigation.map((group, index) => {
          const items = group.items.map((item) => {
            const active =
              item.href === (page ? getPagePath(page) : pathname) ||
              item.href === (page ? getPagePath(page) : pathname) + hash;
            return (
              <div key={item.href}>
                {item.group ? (
                  <Paragraph variant="caption" xstyle={styles.navSubheading}>
                    {item.group}
                  </Paragraph>
                ) : null}
                <NavigationMenuLink
                  href={item.href}
                  {...stylex.props(active && styles.navLinkActive)}
                  xstyle={styles.navLink}
                  active={active}
                  aria-current={active ? 'page' : undefined}
                  onClick={() => setOpen(false)}
                >
                  {item.title}
                </NavigationMenuLink>
              </div>
            );
          });
          return (
            <NavigationMenuItem
              className="nav-group"
              xstyle={styles.navGroup}
              key={group.title ?? index}
            >
              {group.collapsible ? (
                <Accordion
                  key={String(page?.section === 'React')}
                  defaultValue={page?.section === 'React' ? ['react'] : []}
                >
                  <AccordionItem value="react" xstyle={styles.navAccordionItem}>
                    <AccordionTrigger {...stylex.props(styles.navToggle)}>
                      {group.title}
                    </AccordionTrigger>
                    <AccordionContent xstyle={styles.navAccordionContent}>{items}</AccordionContent>
                  </AccordionItem>
                </Accordion>
              ) : (
                <>
                  {group.title ? (
                    <Paragraph variant="caption" xstyle={styles.navHeading}>
                      {group.title}
                    </Paragraph>
                  ) : null}
                  {items}
                </>
              )}
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
  return (
    <SurfaceLightContext value={light}>
      {
        <div
          id="mobile-navigation"
          {...stylex.props(styles.mobileNavigation, open && styles.mobileOpen)}
          hidden={!open}
        >
          {nav}
        </div>
      }
      <div {...stylex.props(styles.siteLayout, !toc.length && styles.wideContent)}>
        <aside className={`sidebar ${stylex.props(styles.sidebar).className}`}>{nav}</aside>
        <main id="content" tabIndex={-1} {...stylex.props(styles.siteContent)}>
          {page ? (
            <>
              <article className="document">
                <Heading level={1} size="page" xstyle={styles.documentTitle}>
                  {page.title}
                </Heading>
                <Paragraph variant="description" xstyle={styles.documentDescription}>
                  {page.description}
                </Paragraph>
                {page.sections.map((section) => (
                  <section key={section.id} id={section.id} {...stylex.props(styles.docSection)}>
                    <Heading level={2} size="section" xstyle={styles.sectionTitle}>
                      {section.title}
                    </Heading>
                    {section.content}
                  </section>
                ))}
                <nav
                  className={`reading-navigation ${stylex.props(styles.readingNavigation).className}`}
                  aria-label={m.continue_reading()}
                >
                  {previous ? (
                    <LightingSurface
                      as="a"
                      href={getPagePath(previous)}
                      rel="prev"
                      {...stylex.props(documentStyles.link, styles.readingLink)}
                    >
                      <small {...stylex.props(styles.readingLabel)}>{m.previous()}</small>
                      <span>{previous.title}</span>
                    </LightingSurface>
                  ) : (
                    <span />
                  )}
                  {next ? (
                    <LightingSurface
                      as="a"
                      href={getPagePath(next)}
                      rel="next"
                      {...stylex.props(documentStyles.link, styles.readingLink, styles.nextLink)}
                    >
                      <small {...stylex.props(styles.readingLabel)}>{m.next()}</small>
                      <span>{next.title}</span>
                    </LightingSurface>
                  ) : null}
                </nav>
                <footer {...stylex.props(styles.pageFooter)}>
                  {'bolerish/edge'}
                  {page.section ? ` · ${sectionLabel(page.section)}` : ''}
                </footer>
              </article>
            </>
          ) : (
            <article className="document">
              <Heading level={1} size="page" xstyle={styles.documentTitle}>
                {m.page_not_found()}
              </Heading>
              <Paragraph>
                {inlineMessage(m.not_found_navigation(), {
                  part0: <Link href={localePath('/docs/')}>{m.getting_started()}</Link>,
                  part1: <Link href={localePath('/')}>{m.dashboard_example()}</Link>,
                })}
              </Paragraph>
            </article>
          )}
        </main>
        {toc.length ? (
          <nav
            className={`table-of-contents ${stylex.props(styles.tableOfContents).className}`}
            aria-label={m.on_this_page()}
          >
            <p {...stylex.props(styles.tocTitle)}>{m.on_this_page()}</p>
            {toc.map((item) => (
              <Link
                variant="plain"
                key={item.id}
                {...stylex.props(
                  documentStyles.link,
                  styles.tocLink,
                  hash === `#${item.id}` && styles.tocActive,
                )}
                href={`#${item.id}`}
                aria-current={hash === `#${item.id}` ? 'location' : undefined}
              >
                {item.title}
              </Link>
            ))}
          </nav>
        ) : null}
      </div>
    </SurfaceLightContext>
  );
}

const styles = stylex.create({
  navigationRoot: { display: 'block', maxWidth: 'none', width: '100%', zIndex: 'auto' },
  navigationList: { display: 'block', width: '100%' },
  siteLayout: {
    display: {
      default: 'grid',
      '@media (max-width: 760px)': 'block',
    },
    gridTemplateColumns: {
      default: '224px minmax(0, 800px) 180px',
      '@media (max-width: 1100px)': '200px minmax(0, 1fr)',
    },
    columnGap: {
      default: '48px',
      '@media (max-width: 1100px)': '36px',
    },
    maxWidth: '1536px',
    margin: '0 auto',
    padding: {
      default: '30px 32px 80px',
      '@media (max-width: 760px)': '22px 20px 56px',
    },
    rowGap: {
      default: null,
      '@media (max-width: 1100px)': '36px',
    },
  },
  wideContent: {
    gridTemplateColumns: '224px minmax(0, 1fr)',
    columnGap: '64px',
    display: {
      default: null,
      '@media (max-width: 760px)': 'block',
    },
    padding: {
      default: null,
      '@media (max-width: 760px)': '22px 20px 56px',
    },
  },
  sidebar: {
    position: 'sticky',
    top: '94px',
    alignSelf: 'start',
    maxHeight: 'calc(100dvh - 120px)',
    overflowY: 'auto',
    scrollbarWidth: 'none',
    paddingRight: '16px',
    display: {
      default: null,
      '@media (max-width: 760px)': 'none',
    },
  },
  navToggle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    minHeight: 32,
    padding: '8px 10px',
    borderWidth: 0,
    backgroundColor: 'transparent',
    color: colorVars.fgPrimary,
    font: 'inherit',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    borderRadius: 6,
    outline: { default: null, ':focus-visible': `2px solid ${colorVars.fgPrimary}` },
    outlineOffset: 2,
  },
  navAccordionItem: { borderWidth: 0 },
  navAccordionContent: { padding: 0 },
  navHeading: { marginBlockEnd: 10, marginInline: 10 },
  navSubheading: { marginBlock: '16px 6px', marginInline: 10 },
  navLink: { width: '100%' },
  navLinkActive: { backgroundColor: colorVars.bgSubtle, color: colorVars.fgPrimary },
  siteContent: {
    minWidth: '0',
    padding: {
      default: '18px 0',
      '@media (max-width: 760px)': '8px 0',
    },
    outline: {
      default: 'none',
      ':focus-visible': `2px solid ${colorVars.fgPrimary}`,
    },
    outlineOffset: 4,
    paddingTop: {
      default: null,
      '@media (min-width: 1500px)': '24px',
    },
  },
  docSection: {
    marginBlockStart: {
      default: '32px',
      '@media (max-width: 760px)': '28px',
    },
    scrollMarginTop: '92px',
  },
  pageFooter: {
    marginBlockStart: '48px',
    paddingTop: '24px',
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: colorVars.strokeDefault,
    color: `${colorVars.fgSecondary}`,
    fontSize: '12px',
  },
  readingNavigation: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: '24px',
    marginBlockStart: '48px',
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: colorVars.strokeDefault,
    paddingTop: '24px',
  },
  tableOfContents: {
    position: 'sticky',
    top: '112px',
    alignSelf: 'start',
    fontSize: '12px',
    lineHeight: '1.8',
    paddingTop: '18px',
    display: {
      default: null,
      '@media (max-width: 1100px)': 'none',
    },
  },
  navGroup: {
    marginBlockStart: {
      default: null,
      ':not(:first-child)': '26px',
    },
  },
  mobileNavigation: {
    display: 'none',
  },
  mobileOpen: {
    display: {
      default: 'none',
      '@media (max-width: 760px)': 'block',
    },
    position: 'fixed',
    top: 88,
    bottom: 0,
    left: 0,
    width: 'min(300px, 85vw)',
    overflow: 'auto',
    padding: '24px 20px',
    backgroundColor: siteColors.background,
    borderRightWidth: '1px',
    borderRightStyle: 'solid',
    borderRightColor: colorVars.strokeDefault,
    boxShadow: '8px 0 32px #0001',
    zIndex: 30,
  },
  documentTitle: {
    margin: '0',
    marginBlockEnd: {
      default: '24px',
      '@media (max-width: 760px)': '20px',
    },
  },
  documentDescription: {
    marginBlockEnd: '28px',
  },
  sectionTitle: {
    marginBlockEnd: '18px',
  },
  tocTitle: {
    fontWeight: '600',
    marginBlockEnd: '12px',
  },
  tocLink: {
    display: 'block',
    textDecoration: 'none',
    color: {
      default: `${colorVars.fgSecondary}`,
      ':hover': `${colorVars.fgPrimary}`,
    },
    margin: '10px 0',
  },
  tocActive: {
    color: `${colorVars.fgPrimary}`,
  },
  readingLink: {
    display: 'grid',
    gap: '6px',
    textDecoration: 'none',
    color: `${colorVars.fgPrimary}`,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colorVars.strokeDefault,
    borderRadius: '8px',
    padding: '16px',
  },
  nextLink: {
    textAlign: 'right',
  },
  readingLabel: {
    color: `${colorVars.fgSecondary}`,
  },
});
