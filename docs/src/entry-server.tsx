import { renderToString } from 'react-dom/server';
import { App } from './App.js';
import { publicPaths, titleFor } from './pages/routes.js';
export { publicPaths, titleFor };
export { pages, learningPath } from './pages/page-registry.js';
export { getPagePath } from './pages/routes.js';
export function render(path: string) {
  return {
    html: renderToString(<App pathname={path} />),
    title: titleFor(path),
  };
}
