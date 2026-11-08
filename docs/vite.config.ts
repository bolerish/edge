import { defineConfig } from 'vite';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const stylesheets = [
  fileURLToPath(import.meta.resolve('@bolerish/ui/global.css')),
  fileURLToPath(import.meta.resolve('@bolerish/edge/style.css')),
  ...['ui/site.css', 'home/home.css', 'ui/code-theme.css'].map(path =>
    fileURLToPath(new URL(`./src/${path}`, import.meta.url))),
];

export default defineConfig({
  plugins: [{
    name: 'edge-docs-development-html',
    async transformIndexHtml(html, context) {
      const faviconVersion = createHash('sha256')
        .update(readFileSync(new URL('./public/favicon.ico', import.meta.url))).digest('hex').slice(0, 12);
      html = html.replace('href="/favicon.ico"', `href="/favicon.ico?v=${faviconVersion}"`);
      if (!context.server) return html;
      const { renderDocument } = await context.server.ssrLoadModule('/src/entry-server.tsx') as
        typeof import('./src/entry-server.js');
      const path = new URL(context.originalUrl ?? context.path, 'http://localhost').pathname;
      return {
        html: renderDocument(html, path),
        tags: stylesheets.map(path => ({
          tag: 'link',
          attrs: { rel: 'stylesheet', href: `/@fs/${path}?direct` },
          injectTo: 'head' as const,
        })),
      };
    },
  }],
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        // The entire site is a client application; the library retains its own boundary.
        if (
          warning.code === 'MODULE_LEVEL_DIRECTIVE' &&
          warning.message.includes('use client')
        )
          return;
        warn(warning);
      },
    },
  },
});
