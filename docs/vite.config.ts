import { defineConfig } from 'vite';
import stylex from '@stylexjs/unplugin';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const stylesheets = [
  fileURLToPath(new URL('./src/site.css', import.meta.url)),
  fileURLToPath(import.meta.resolve('@bolerish/ui/global.css')),
  fileURLToPath(import.meta.resolve('@bolerish/edge/style.css')),
];

export default defineConfig({
  optimizeDeps: { exclude: ['@bolerish/tokens'] },
  ssr: { noExternal: ['@bolerish/tokens'] },
  plugins: [
    stylex.vite({
      // The document prelude places Edge below the shared StyleX priority layers.
      useCSSLayers: true,
      // Match the published UI package so xstyle replaces its base property keys.
      debug: false,
      unstable_moduleResolution: { type: 'commonJS' },
    }),
    {
      name: 'edge-docs-html',
      configureServer(server) {
        server.middlewares.use(async (request, response, next) => {
          const path = new URL(request.url ?? '/', 'http://localhost').pathname;
          if (
            !['GET', 'HEAD'].includes(request.method ?? '') ||
            !(
              path === '/llms.txt' ||
              path === '/llms-full.txt' ||
              /^\/docs\/.*index\.md$/.test(path)
            )
          )
            return next();
          try {
            const { renderAgentDocuments } = (await server.ssrLoadModule(
              '/src/entry-server.tsx',
            )) as typeof import('./src/entry-server.js');
            const { version } = JSON.parse(
              readFileSync(new URL('../packages/react/package.json', import.meta.url), 'utf8'),
            );
            const body = renderAgentDocuments(version).get(path);
            response.statusCode = body === undefined ? 404 : 200;
            response.setHeader(
              'Content-Type',
              `${path.endsWith('.md') ? 'text/markdown' : 'text/plain'}; charset=utf-8`,
            );
            response.end(request.method === 'HEAD' ? undefined : (body ?? 'Not found'));
          } catch (error) {
            next(error);
          }
        });
      },
      async transformIndexHtml(html, context) {
        const faviconVersion = createHash('sha256')
          .update(readFileSync(new URL('./public/favicon.ico', import.meta.url)))
          .digest('hex')
          .slice(0, 12);
        html = html.replace('href="/favicon.ico"', `href="/favicon.ico?v=${faviconVersion}"`);
        if (!context.server) return html;
        const { renderDocument } = (await context.server.ssrLoadModule(
          '/src/entry-server.tsx',
        )) as typeof import('./src/entry-server.js');
        const path = new URL(context.originalUrl ?? context.path, 'http://localhost').pathname;
        return {
          html: renderDocument(html, path),
          tags: stylesheets.map((path) => ({
            tag: 'link',
            attrs: { rel: 'stylesheet', href: `/@fs/${path}?direct` },
            injectTo: path === stylesheets[0] ? ('head-prepend' as const) : ('head' as const),
          })),
        };
      },
    },
  ],
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        // The entire site is a client application; the library retains its own boundary.
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE' && warning.message.includes('use client'))
          return;
        warn(warning);
      },
    },
  },
});
