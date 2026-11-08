import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createServer } from 'node:http';
import { copyFile, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';
import { build } from 'vite';

const root = fileURLToPath(new URL('../../', import.meta.url));
const archives = resolve(root, '.private/react-compatibility');
await mkdir(archives, { recursive: true });
for (const name of ['core', 'styles', 'react']) {
  execFileSync('pnpm', ['pack', '--out', resolve(archives, `${name}.tgz`)], {
    cwd: resolve(root, 'packages', name),
    stdio: 'pipe',
  });
}

const scene = `
import React, { createRef, forwardRef, useState } from 'react';
import { Edge, useLight, useSurface } from '@bolerish/edge';
export const lightRef = createRef();
export const hostRef = createRef();
export const events = { attached: 0, cleaned: 0, nulls: 0, replacementAttached: 0, replacementDetached: 0 };
export const detached = [];
const callback = node => {
  if (!node) { events.nulls++; return; }
  events.attached++;
  detached.push(node);
  return () => { events.cleaned++; };
};
const replacement = node => {
  if (node) events.replacementAttached++;
  else events.replacementDetached++;
};
const Existing = forwardRef(function Existing(props, ref) {
  return React.createElement('button', { ...props, ref });
});
function HookHost() {
  const ref = useSurface({ color: 'red' });
  return React.createElement(Existing, { ref, id: 'hook', className: 'consumer' }, 'Existing host');
}
export function Scene({ edgeStyle = 'raised', pseudoElement = 'after', motion = 'static', show = true, alternate = false }) {
  const [clicks, setClicks] = useState(0);
  return React.createElement(React.Fragment, null,
    React.createElement(Edge.Provider, { ref: lightRef, motion, staticDirection: 315 },
      show ? React.createElement(Edge.Surface, {
        as: 'button', type: 'button', id: 'lit', ref: alternate ? replacement : callback,
        edgeStyle, pseudoElement, className: 'consumer',
        style: { padding: 12, borderRadius: 8 },
        onClick: () => setClicks(n => n + 1),
      }, 'Example button ' + clicks) : null,
      React.createElement(Edge.Surface, { as: 'article', id: 'object-ref', ref: hostRef }, 'Example card'),
      React.createElement(HookHost),
      React.createElement('button', { id: 'plain' }, 'Unlit'),
      React.createElement(Edge.Provider, { motion: 'static', staticDirection: 90 },
        React.createElement(Edge.Surface, { id: 'nested' }, 'Independent'))));
}
`;
const consumerTypes = `
import * as React from 'react';
import { Edge, type Light, useLight, useSurface } from '@bolerish/edge';
import '@bolerish/edge/style.css';
const light = React.createRef<Light>();
const button = React.createRef<HTMLButtonElement>();
const article = React.createRef<HTMLElement>();
<Edge.Provider ref={light}><Edge.Surface as="button" ref={button} disabled onClick={e => { e.currentTarget.disabled = true; }} /></Edge.Provider>;
<Edge.Surface as="article" ref={article} />;
<Edge.Surface as="a" href="/" />;
// @ts-expect-error The default host is a div.
<Edge.Surface href="/" />;
// @ts-expect-error Buttons do not accept href.
<Edge.Surface as="button" href="/" />;
// @ts-expect-error Refs must match the selected host.
<Edge.Surface as="a" ref={button} />;
function ExistingHost() {
  const ref: React.RefCallback<HTMLButtonElement> = useSurface<HTMLButtonElement>();
  const explicit: React.RefCallback<HTMLButtonElement> = useSurface<HTMLButtonElement>(useLight());
  void explicit;
  return <button ref={ref} />;
}
void ExistingHost;
`;

// Runtime versions and type versions are independently pinned, including React 18's first types.
const versions = [
  { react: '18.0.0', types: '18.0.0', domTypes: '18.0.0' },
  { react: '18.3.1', types: '18.3.31', domTypes: '18.3.7' },
  { react: '19.0.0', types: '19.0.0', domTypes: '19.0.0' },
  { react: '19.3.1', types: '19.3.0', domTypes: '19.3.0' },
];
const browser = await chromium.launch();
try {
  for (const version of versions) {
    const consumer = await mkdtemp(resolve(tmpdir(), 'edge-react-compat-'));
    console.log(`React ${version.react}: isolated consumer ${consumer}`);
    await writeFile(
      resolve(consumer, 'package.json'),
      JSON.stringify({
        name: 'edge-react-compatibility',
        private: true,
        type: 'module',
        packageManager: 'pnpm@12.15.0',
        dependencies: {
          '@bolerish/edge': `file:${archives}/react.tgz`,
          react: version.react,
          'react-dom': version.react,
          '@types/react': version.types,
          '@types/react-dom': version.domTypes,
          '@types/scheduler': '0.16.8',
        },
      }),
    );
    await writeFile(
      resolve(consumer, 'pnpm-workspace.yaml'),
      `overrides:\n  '@bolerish/edge-core': 'file:${archives}/core.tgz'\n  '@bolerish/edge-styles': 'file:${archives}/styles.tgz'\n`,
    );
    execFileSync('pnpm', ['install', '--ignore-scripts', '--strict-peer-dependencies'], {
      cwd: consumer,
      stdio: 'pipe',
    });
    await writeFile(resolve(consumer, 'consumer.tsx'), consumerTypes);
    execFileSync(
      'pnpm',
      [
        '--filter',
        '@bolerish/edge',
        'exec',
        'tsc',
        '--ignoreConfig',
        '--strict',
        '--noEmit',
        '--jsx',
        version.types === '18.0.0' ? 'react' : 'react-jsx',
        '--module',
        'nodenext',
        '--target',
        'es2022',
        resolve(consumer, 'consumer.tsx'),
      ],
      { cwd: root, stdio: 'inherit' },
    );
    await writeFile(resolve(consumer, 'scene.js'), scene);
    await writeFile(
      resolve(consumer, 'ssr.mjs'),
      `
      import assert from 'node:assert/strict';
      import { writeFileSync } from 'node:fs';
      import React from 'react';
      import { renderToString } from 'react-dom/server';
      import { Scene } from './scene.js';
      const errors = [];
      console.error = (...args) => errors.push(args.join(' '));
      const html = renderToString(React.createElement(React.StrictMode, null, React.createElement(Scene, {})));
      assert.equal(errors.length, 0, errors.join('\\n'));
      assert(html.startsWith('<button'));
      assert(html.includes('bolerish-edge-after'));
      writeFileSync('index.html', '<!doctype html><html><head><title>React compatibility</title></head><body><div id="root">' + html + '</div><script type="module" src="/client.js"></script></body></html>');
    `,
    );
    for (const environment of ['development', 'production']) {
      execFileSync(process.execPath, ['ssr.mjs'], {
        cwd: consumer,
        stdio: 'pipe',
        env: { ...process.env, NODE_ENV: environment },
      });
    }
    for (const name of ['rendering.mjs', 'rendering-scene.mjs', 'rendering-client.mjs']) {
      await copyFile(new URL(`./fixtures/${name}`, import.meta.url), resolve(consumer, name));
    }
    for (const environment of ['development', 'production']) {
      for (const backend of ['node', 'web']) {
        execFileSync(
          process.execPath,
          [
            'rendering.mjs',
            backend,
            version.react.startsWith('18.') ? 'react-dom/server.browser' : 'react-dom/server.edge',
          ],
          {
            cwd: consumer,
            stdio: 'pipe',
            timeout: 30000,
            env: { ...process.env, NODE_ENV: environment },
          },
        );
      }
    }
    await writeFile(
      resolve(consumer, 'client.js'),
      `
      import React from 'react';
      import { createRoot, hydrateRoot } from 'react-dom/client';
      import { Scene, lightRef, hostRef, events, detached } from './scene.js';
      import '@bolerish/edge/style.css';
      const tree = props => React.createElement(React.StrictMode, null, React.createElement(Scene, props));
      const container = document.getElementById('root');
      const root = container.dataset.mode === 'csr' ? createRoot(container) : hydrateRoot(container, tree({}));
      if (container.dataset.mode === 'csr') root.render(tree({}));
      window.fixture = { lightRef, hostRef, events, detached, update: props => root.render(tree(props)), unmount: () => root.unmount() };
    `,
    );
    await build({
      root: consumer,
      configFile: false,
      logLevel: 'error',
      build: {
        outDir: 'dist',
        rollupOptions: {
          input: [
            'index.html',
            'node-stream.html',
            'web-stream.html',
            'ssg.html',
            'static.html',
            'csr.html',
          ].map((name) => resolve(consumer, name)),
        },
      },
    });
    const site = resolve(consumer, 'dist');
    const server = createServer(async (request, response) => {
      const path = new URL(request.url ?? '/', 'http://localhost').pathname;
      try {
        const file = resolve(site, path === '/' ? 'index.html' : `.${path}`);
        response.setHeader(
          'Content-Type',
          file.endsWith('.js')
            ? 'text/javascript'
            : file.endsWith('.css')
              ? 'text/css'
              : 'text/html',
        );
        response.end(await readFile(file));
      } catch {
        response.writeHead(404).end();
      }
    });
    await new Promise<void>((done) => server.listen(0, '127.0.0.1', done));
    const address = server.address();
    assert(address && typeof address !== 'string');
    const page = await browser.newPage();
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    try {
      await page.goto(`http://127.0.0.1:${address.port}`);
      await page.waitForFunction(
        () => document.getElementById('lit')?.style.getPropertyValue('--edge-angle') === '315.0deg',
      );
      assert.equal(await page.locator('#plain').getAttribute('class'), null);
      assert.equal(
        await page
          .locator('#nested')
          .evaluate((node) => node.style.getPropertyValue('--edge-angle')),
        '90.0deg',
      );
      await page.locator('#lit').click();
      await page.waitForFunction(
        () => document.getElementById('lit')?.textContent === 'Example button 1',
      );
      await page.evaluate(
        `window.fixture.update({ edgeStyle: 'recessed', pseudoElement: 'before' })`,
      );
      await page.waitForFunction(
        () => document.getElementById('lit')?.style.getPropertyValue('--edge-angle') === '135.0deg',
      );
      assert(
        await page
          .locator('#lit')
          .evaluate((node) => node.classList.contains('bolerish-edge-before')),
      );
      assert.equal(await page.evaluate(`window.fixture.events.attached`), 1);
      assert.equal(
        await page.evaluate(
          `window.fixture.hostRef.current === document.getElementById('object-ref')`,
        ),
        true,
      );
      assert.equal(
        await page.evaluate(`typeof window.fixture.lightRef.current.refresh`),
        'function',
      );
      await page.evaluate(`window.fixture.update({ motion: 'dynamic' })`);
      await page.waitForFunction(
        () =>
          document.getElementById('lit')?.classList.contains('bolerish-edge-after') &&
          document.getElementById('lit')?.style.getPropertyValue('--edge-angle') === '315.0deg',
      );
      await page.mouse.move(500, 300);
      await page.waitForFunction(
        () => document.getElementById('lit')?.style.getPropertyValue('--edge-angle') !== '315.0deg',
      );
      await page.evaluate(`window.fixture.update({ alternate: true })`);
      await page.waitForFunction(`window.fixture.events.replacementAttached === 1`);
      assert.equal(await page.evaluate(`window.fixture.events.cleaned`), 1);
      await page.evaluate(`window.fixture.update({ show: false, alternate: true })`);
      await page.waitForFunction(() => !document.getElementById('lit'));
      assert.equal(await page.evaluate(`window.fixture.events.cleaned`), 1);
      assert.equal(await page.evaluate(`window.fixture.events.nulls`), 0);
      assert.equal(await page.evaluate(`window.fixture.events.replacementDetached`), 1);
      assert.equal(
        await page.evaluate(`window.fixture.detached[0].style.getPropertyValue('--edge-angle')`),
        '',
      );
      await page.evaluate(
        `window.fixture.hook = document.getElementById('hook'); window.fixture.unmount()`,
      );
      assert.equal(await page.evaluate(`window.fixture.lightRef.current`), null);
      assert.equal(await page.evaluate(`window.fixture.hostRef.current`), null);
      assert.equal(await page.evaluate(`window.fixture.hook.className`), 'consumer');
      assert.equal(
        await page.evaluate(`window.fixture.hook.style.getPropertyValue('--edge-highlight')`),
        '',
      );
      await page.goto(`http://127.0.0.1:${address.port}/csr.html`);
      await page.waitForFunction(() =>
        document.getElementById('lit')?.style.getPropertyValue('--edge-angle'),
      );
      await page.locator('#lit').click();
      await page.waitForFunction(
        () => document.getElementById('lit')?.textContent === 'Example button 1',
      );
      await page.evaluate(`window.fixture.unmount()`);
      for (const mode of ['node-stream', 'web-stream', 'ssg']) {
        await page.goto(`http://127.0.0.1:${address.port}/${mode}.html`);
        await page.waitForFunction(
          () =>
            document.getElementById('delayed-hook')?.style.getPropertyValue('--edge-angle') ===
            '90.0deg',
        );
        assert.equal(
          await page
            .locator('#delayed-surface')
            .evaluate((node) => node.style.getPropertyValue('--edge-angle')),
          '90.0deg',
        );
        assert.equal(
          await page
            .locator('#shell')
            .evaluate((node) => node.style.getPropertyValue('--edge-angle')),
          '90.0deg',
        );
        assert.equal(await page.locator('#fallback').count(), 0);
        assert.deepEqual(await page.evaluate(`window.renderingFixture.errors`), []);
        await page.evaluate(
          `window.savedHook = document.getElementById('delayed-hook'); window.renderingFixture.unmount()`,
        );
        assert.equal(
          await page.evaluate(`window.savedHook.style.getPropertyValue('--edge-angle')`),
          '',
        );
        assert.equal(await page.evaluate(`window.savedHook.className`), '');
      }
      const staticContext = await browser.newContext({ javaScriptEnabled: false });
      try {
        const staticPage = await staticContext.newPage();
        await staticPage.goto(`http://127.0.0.1:${address.port}/static.html`);
        assert(await staticPage.locator('#lit').isVisible());
        assert(
          await staticPage
            .locator('#lit')
            .evaluate((node) => node.classList.contains('bolerish-edge-after')),
        );
        assert.equal(await staticPage.locator('#hook').getAttribute('class'), 'consumer');
        assert.equal(
          await staticPage
            .locator('#lit')
            .evaluate((node) => node.style.getPropertyValue('--edge-angle')),
          '',
        );
      } finally {
        await staticContext.close();
      }
      assert.deepEqual(errors, []);
    } finally {
      await page.close();
      await new Promise<void>((done, reject) =>
        server.close((error) => (error ? reject(error) : done())),
      );
    }
    await rm(consumer, { recursive: true, force: true });
    console.log(
      `React ${version.react}: declarations, CSR, SSR, Node/Web streaming Suspense, SSG, static HTML, hydration, refs and cleanup passed.`,
    );
  }
} finally {
  await browser.close();
}
