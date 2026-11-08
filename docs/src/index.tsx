import '@bolerish/ui/global.css';
import '@bolerish/edge/style.css';
import './site.css';
import './home.css';
import './shared/code/code-theme.css';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { findPage, normalizePath, titleFor } from './docs/_shared/routes.js';
const root = document.querySelector<HTMLElement>('#root');
if (!root) throw new Error('Missing site root');
const path = normalizePath(location.pathname);
document.title = titleFor(path);
if (root.dataset.path === path) hydrateRoot(root, <BrowserNavigation initialPath={path} />);
else createRoot(root).render(<BrowserNavigation initialPath={path} />);

import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { Layout } from './layout.js';

/** Keeps document navigation in the current page; native links still work without JS. */
function BrowserNavigation({ initialPath }: { initialPath: string }) {
  const [path, setPath] = useState(initialPath);
  useEffect(() => {
    function update() {
      const next = normalizePath(location.pathname);
      flushSync(() => setPath(next));
      document.title = titleFor(next);
      const target = location.hash ? document.getElementById(decodeURIComponent(location.hash.slice(1))) : null;
      if (target) target.scrollIntoView();
      else window.scrollTo(0, 0);
      document.getElementById('content')?.focus({ preventScroll: true });
    }
    function click(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target instanceof Element ? event.target.closest('a') : null;
      if (!anchor || anchor.hasAttribute('download') || (anchor.target && anchor.target !== '_self')) return;
      const url = new URL(anchor.href);
      if (url.origin !== location.origin || url.search || (url.pathname === location.pathname && url.hash)) return;
      const next = normalizePath(url.pathname);
      if (next !== '/' && !findPage(next)) return;
      event.preventDefault();
      history.pushState(null, '', url);
      update();
    }
    document.addEventListener('click', click);
    window.addEventListener('popstate', update);
    return () => {
      document.removeEventListener('click', click);
      window.removeEventListener('popstate', update);
    };
  }, []);
  return <Layout key={path} pathname={path} />;
}
