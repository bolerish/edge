import { sectionLabel } from '../locale.js';
import { m } from '../../paraglide/messages.js';
import * as stylex from '@stylexjs/stylex';
import { useEffect, useState, type ChangeEvent } from 'react';
import { Button } from '@bolerish/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@bolerish/ui/toggle-group';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@bolerish/ui/dialog';
import { Input } from '@bolerish/ui/input';
import { Item, ItemContent, ItemTitle, ItemDescription } from '@bolerish/ui/item';
import { Empty, EmptyDescription } from '@bolerish/ui/empty';
import { Paragraph } from '@bolerish/ui/paragraph';
import { Link } from '@bolerish/ui/link';
import { MagnifyingGlassIcon } from '@phosphor-icons/react/MagnifyingGlass';
import { searchDocuments, searchCategories, type SearchCategory } from './search-documents.js';

export function DocumentationSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'All' | SearchCategory>('All');
  const searching = query.trim().length > 0 || category !== 'All';
  const results = searching
    ? searchDocuments(query).filter((result) => category === 'All' || result.category === category)
    : [];
  const changeOpen = (value: boolean) => {
    setOpen(value);
    setQuery('');
    setCategory('All');
  };
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((value) => !value);
        setQuery('');
        setCategory('All');
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);
  return (
    <Dialog open={open} onOpenChange={changeOpen}>
      <DialogTrigger
        render={
          <Button
            size="icon"
            xstyle={styles.documentationSearch}
            align="start"
            variant="outline"
            aria-label={m.search_documentation()}
          >
            <span {...stylex.props(styles.triggerContent)}>
              <MagnifyingGlassIcon {...stylex.props(styles.icon)} aria-hidden="true" />
              <span {...stylex.props(styles.triggerText)}>{m.search_documentation_329()}</span>
            </span>
          </Button>
        }
      />

      <DialogContent xstyle={styles.searchDialog}>
        <DialogTitle>{m.search_documentation()}</DialogTitle>
        <Input
          xstyle={styles.searchInput}
          aria-label={m.search_titles_and_content()}
          placeholder={m.search_titles_and_content_331()}
          value={query}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)}
        />
        <div {...stylex.props(styles.searchLayout)}>
          <nav aria-label={m.search_sections()}>
            <ToggleGroup
              value={[category]}
              onValueChange={(values) => {
                const next = values[0];
                setCategory(searchCategories.find((category) => category === next) ?? 'All');
              }}
              size="sm"
              className={stylex.props(styles.searchSections).className}
            >
              {(['All', ...searchCategories] as const).map((section) => (
                <ToggleGroupItem key={section} value={section}>
                  #{sectionLabel(section)}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </nav>
          <div {...stylex.props(styles.searchMatches)}>
            {searching && results.length === 0 ? (
              <Empty xstyle={styles.emptyResults}>
                <EmptyDescription role="status">
                  {m.no_documents_found_try_another_search()}
                </EmptyDescription>
              </Empty>
            ) : (
              <Paragraph variant="caption" role="status" xstyle={styles.searchCount}>
                {!searching ? m.search_hint() : m.results({ count: results.length })}
              </Paragraph>
            )}
            <nav
              className={`search-results ${stylex.props(styles.searchResults).className}`}
              aria-label={m.search_results()}
            >
              {results.map((result) => (
                <Link
                  variant="plain"
                  key={result.href}
                  href={result.href}
                  onClick={() => changeOpen(false)}
                >
                  <Item size="xs">
                    <ItemContent>
                      <ItemTitle>{result.title}</ItemTitle>
                      <ItemDescription>{result.pageTitle}</ItemDescription>
                      <ItemDescription>{result.description.slice(0, 160)}</ItemDescription>
                    </ItemContent>
                  </Item>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const styles = stylex.create({
  emptyResults: { borderWidth: 0, padding: 12, alignItems: 'start', textAlign: 'left' },
  searchDialog: {
    width: 'min(760px, calc(100vw - 32px))',
    maxWidth: 'min(760px, calc(100vw - 32px))',
    maxHeight: 'calc(100dvh - 48px)',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    overflowY: 'auto',
  },
  searchLayout: {
    display: 'grid',
    gap: '16px',
    minHeight: '0',
  },
  searchSections: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
  searchMatches: {
    minWidth: '0',
  },
  searchCount: { margin: '0 12px 8px' },
  searchResults: {
    overflowY: 'auto',
    maxHeight: 'min(50dvh, 440px)',
    minHeight: '80px',
  },
  documentationSearch: {
    width: {
      default: '230px',
      '@media (max-width: 760px)': '36px',
    },
    flexShrink: '0',
  },
  triggerContent: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    paddingInline: { default: 12, '@media (max-width: 760px)': 0 },
    justifyContent: { default: 'flex-start', '@media (max-width: 760px)': 'center' },
  },
  triggerText: {
    display: {
      default: null,
      '@media (max-width: 760px)': 'none',
    },
  },
  icon: {
    width: '20px',
    height: '20px',
    flexShrink: '0',
  },
  searchInput: {
    width: '100%',
    flexShrink: '0',
  },
});
