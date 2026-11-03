import { useEffect, useState, type ChangeEvent } from 'react';
import { Button } from '@bolerish/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogTrigger } from '@bolerish/ui/dialog';
import { Input } from '@bolerish/ui/input';
import { InputGroup } from '@bolerish/ui/input-group';
import { MagnifyingGlassIcon } from '@phosphor-icons/react/MagnifyingGlass';
import { searchDocuments } from './search-documents.js';

export function DocumentationSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const results = searchDocuments(query);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);
  return (
    <Dialog open={open} onOpenChange={(value) => { setOpen(value); setQuery(''); }}>
      <InputGroup className="documentation-search">
        <DialogTrigger render={<Button className="documentation-search-trigger" variant="ghost" aria-label="Search documentation" />}>
          <MagnifyingGlassIcon aria-hidden="true" />
          <span>Search documentation…</span>
        </DialogTrigger>
      </InputGroup>
      <DialogContent className="search-dialog">
        <DialogTitle>Search documentation</DialogTitle>
        <DialogDescription>Find guides, API references and examples.</DialogDescription>
        <Input aria-label="Search titles and content" placeholder="Search titles and content…" value={query} onChange={(event: ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)} />
        <p role="status" className="search-count">{results.length ? `${results.length} ${results.length === 1 ? 'result' : 'results'}` : 'No documents found. Try another search.'}</p>
        <nav className="search-results" aria-label="Search results">
          {results.map((result) => (
            <a key={result.href} href={result.href}>
              <strong>{result.title}</strong>
              <small>{result.pageTitle}</small>
              <span>{result.description.slice(0, 160)}</span>
            </a>
          ))}
        </nav>
      </DialogContent>
    </Dialog>
  );
}
