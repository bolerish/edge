import { renderToString } from 'react-dom/server';
import { App, publicPaths, titleFor } from './App.js';
export { publicPaths };
export function render(path: string) {
  return {
    html: renderToString(<App pathname={path} />),
    title: titleFor(path),
  };
}
