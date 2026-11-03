import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { App } from '../App.js';
import { findPage, normalizePath, titleFor } from '../pages/routes.js';

/** Keeps document navigation in the current page; native links still work without JS. */
export function BrowserApp({ initialPath }: { initialPath: string }) {
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
  return <App key={path} pathname={path} />;
}
