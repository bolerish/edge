import { renderToString } from 'react-dom/server';
import { App } from './App.js';
import { publicPaths, titleFor } from './pages/routes.js';
export { publicPaths };
export function render(path: string) {
  return {
    html: renderToString(<App pathname={path} />),
    title: titleFor(path),
  };
}
