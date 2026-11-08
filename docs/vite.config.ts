import { defineConfig } from 'vite';
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
      if (!context.server) return html;
      const { render } = await context.server.ssrLoadModule('/src/entry-server.tsx') as
        typeof import('./src/entry-server.js');
      const path = new URL(context.originalUrl ?? context.path, 'http://localhost').pathname;
      const page = render(path);
      return {
        html: html
          .replace('<!--app-html-->', page.html)
          .replace('id="root"', `id="root" data-path="${page.path}"`)
          .replace(/<title>[^<]*<\/title>/, () => `<title>${page.title}</title>`),
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
