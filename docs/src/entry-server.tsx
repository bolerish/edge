import { renderToString } from 'react-dom/server';
import { App } from './App.js';
import { normalizePath, publicPaths, titleFor } from './pages/routes.js';
export { publicPaths, titleFor };
export { pages, learningPath } from './pages/page-registry.js';
export { getPagePath } from './pages/routes.js';
export function render(path: string) {
  return {
    path: normalizePath(path),
    html: renderToString(<App pathname={path} />),
    title: titleFor(path),
  };
}
