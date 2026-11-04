import { useEffect, useState, type ChangeEvent } from 'react';
import { Button } from '@bolerish/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@bolerish/ui/dialog';
import { Input } from '@bolerish/ui/input';
import { InputGroup } from '@bolerish/ui/input-group';
import { MagnifyingGlassIcon } from '@phosphor-icons/react/MagnifyingGlass';
import { searchDocuments } from './search-documents.js';

export function DocumentationSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'All' | 'Appearance' | 'Guides' | 'React'>('All');
  const searching = query.trim().length > 0 || category !== 'All';
  const results = searching ? searchDocuments(query).filter(result => category === 'All' || result.category === category) : [];
  const changeOpen = (value: boolean) => { setOpen(value); setQuery(''); setCategory('All'); };
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
      <InputGroup className="documentation-search">
        <DialogTrigger render={<Button className="documentation-search-trigger" variant="ghost" aria-label="Search documentation" />}>
          <MagnifyingGlassIcon aria-hidden="true" />
          <span>Search documentation…</span>
        </DialogTrigger>
      </InputGroup>
      <DialogContent className="search-dialog">
        <DialogTitle>Search documentation</DialogTitle>
        <Input aria-label="Search titles and content" placeholder="Search titles and content…" value={query} onChange={(event: ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)} />
        <div className="search-layout">
          <nav className="search-sections" aria-label="Search sections">
            {(['All', 'Appearance', 'Guides', 'React'] as const).map(section => (
              <Button key={section} size="sm" variant={category === section ? 'secondary' : 'ghost'}
                aria-pressed={category === section} onClick={() => setCategory(section)}>
                #{section}
              </Button>
            ))}
          </nav>
          <div className="search-matches">
            <p role="status" className="search-count">{!searching
              ? 'Search documentation or choose a category.'
              : results.length ? `${results.length} ${results.length === 1 ? 'result' : 'results'}` : 'No documents found. Try another search.'}</p>
            <nav className="search-results" aria-label="Search results">
              {results.map(result => (
                <a key={result.href} href={result.href} onClick={() => changeOpen(false)}>
                  <strong>{result.title}</strong>
                  <small>{result.pageTitle}</small>
                  <span>{result.description.slice(0, 160)}</span>
                </a>
              ))}
            </nav>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
