import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdir, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const sandbox = resolve(root, '.private/package-check');
await rm(sandbox, { recursive: true, force: true });
await mkdir(resolve(sandbox, 'node_modules/@bolerish'), {
  recursive: true,
});
for (const name of ['core', 'styles', 'react']) {
  const archive = resolve(sandbox, `${name}.tgz`);
  execFileSync('pnpm', ['pack', '--out', archive], {
    cwd: resolve(root, 'packages', name),
    stdio: 'pipe',
  });
  const listing = execFileSync('tar', ['-tzf', archive], { encoding: 'utf8' });
  assert(
    !listing.includes('.private/') &&
      !listing.includes('/tests/') &&
      !listing.includes('/src/') &&
      !/\.test\.[cm]?[jt]sx?/.test(listing),
  );
  const destination = resolve(
    sandbox,
    'node_modules/@bolerish',
    name === 'react' ? 'edge' : `edge-${name}`,
  );
  await mkdir(destination, { recursive: true });
  execFileSync('tar', [
    '-xzf',
    archive,
    '--strip-components=1',
    '-C',
    destination,
  ]);
  const manifest = JSON.parse(
    await readFile(resolve(destination, 'package.json'), 'utf8'),
  );
  assert.equal(manifest.name, name === 'react' ? '@bolerish/edge' : `@bolerish/edge-${name}`);
  for (const target of Object.values(manifest.exports)) {
    if (typeof target === 'string')
      await readFile(resolve(destination, target));
    else
      for (const path of Object.values(target))
        await readFile(resolve(destination, path));
  }
  assert(!JSON.stringify(manifest.dependencies ?? {}).includes('workspace:'));
  await readFile(resolve(destination, 'dist/LICENSE'));
}
// The common style bindings must work before any React package is available.
execFileSync(process.execPath, ['--input-type=module', '-e', `
  import assert from 'node:assert/strict';
  import {getSurfaceProps} from '@bolerish/edge-styles';
  const props = getSurfaceProps({color:'red',intensity:0.4});
  assert(props.className);
  assert.equal(props.style['--wisp-highlight'],'red');
  assert.equal(props.style['--wisp-intensity'],0.4);
`], {cwd:sandbox, stdio:'pipe'});
for (const name of ['react', 'react-dom']) {
  await symlink(
    resolve(root, 'packages/react/node_modules', name),
    resolve(sandbox, 'node_modules', name),
    'dir',
  );
}
execFileSync(
  process.execPath,
  [
    '--input-type=module',
    '-e',
    `
  import assert from 'node:assert/strict';
  import React from 'react';
  import {renderToStaticMarkup} from 'react-dom/server';
  import {createLight} from '@bolerish/edge-core';
  import {Lighting,useLight,useSurface} from '@bolerish/edge';
  assert.equal(typeof window,'undefined');
  createLight().refresh();
  function Card(){const light=useLight();const surface=useSurface(light,{theme:'wisp'});return React.createElement('article',{className:surface.className,style:surface.style},'Packed card');}
  assert.match(renderToStaticMarkup(React.createElement(Card)),/Packed card/);
  const scope=React.createElement(Lighting,{motion:'static'},React.createElement(Lighting.Surface,{as:'article'},'Scoped card'));
  assert.match(renderToStaticMarkup(scope),/^<article /);

`,
  ],
  { cwd: sandbox, stdio: 'pipe' },
);
const consumer = resolve(sandbox, 'consumer.mts');
await writeFile(consumer, `
  import '@bolerish/edge/style.css';
  import '@bolerish/edge-styles/style.css';
  import {Lighting} from '@bolerish/edge';
  import {getSurfaceProps} from '@bolerish/edge-styles';
  void Lighting;
  getSurfaceProps({color:'red'});
`);
execFileSync('pnpm', [
  '--filter', '@bolerish/edge', 'exec', 'tsc', '--ignoreConfig',
  '--noEmit', '--strict', '--skipLibCheck', '--module', 'nodenext',
  '--target', 'es2022', consumer,
], {cwd:root, stdio:'pipe'});

const css = await readFile(
  resolve(sandbox, 'node_modules/@bolerish/edge/dist/assets/stylex.css'),
  'utf8',
);
assert(css.includes('conic-gradient') && css.includes('--wisp-angle'));
const library = await readFile(
  resolve(sandbox, 'node_modules/@bolerish/edge/dist/index.js'),
  'utf8',
);
assert(!/from\s*["']@stylexjs\/stylex/.test(library), 'Consumers must not need StyleX');
assert(
  library.startsWith('"use client"') || library.startsWith("'use client'"),
);
const { titleFor, pages, learningPath } = await import('../.private/docs-ssr/entry-server.js');
assert.equal(new Set(learningPath).size, pages.length, 'Reading path covers each page once');
assert(learningPath.every(page => pages.includes(page)), 'Reading path contains only known pages');
const site = resolve(root, 'docs/dist');
const routes = JSON.parse(await readFile(resolve(site, 'routes.json'), 'utf8'));
assert(
  routes.includes('/docs/') &&
    routes.includes('/') &&
    !routes.includes('/playground/'),
);
assert.equal(new Set(routes).size, routes.length, 'Documentation routes must be unique');
const installation = await readFile(
  resolve(site, 'docs/react/index.html'),
  'utf8',
);
assert(
  installation.includes('token keyword'),
  'SSG must include highlighted code tokens',
);
const documents = new Map();
for (const route of routes) {
  const html = await readFile(resolve(site, `.${route}`, 'index.html'), 'utf8');
  assert(
    html.includes(`data-path="${route}"`) && html.includes('<h1'),
    `Missing prerendered content: ${route}`,
  );
  const escapedTitle = titleFor(route).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('\"', '&quot;').replaceAll("'", '&#39;');
  assert(html.includes(`<title>${escapedTitle}</title>`), `Incorrect static title: ${route}`);
  documents.set(route, html);
}
for (const [route, html] of documents) {
  for (const match of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
    const target = new URL(
      match[1].replaceAll('&amp;', '&'),
      `https://wisp.invalid${route}`,
    );
    if (target.origin !== 'https://wisp.invalid') continue;
    const page = documents.get(target.pathname);
    assert(page, `Broken site route: ${match[1]} from ${route}`);
    if (target.hash) {
      const ids = new Set(
        [...page.matchAll(/\bid="([^"]+)"/g)].map((item) => item[1]),
      );
      assert(
        ids.has(decodeURIComponent(target.hash.slice(1))),
        `Broken site anchor: ${match[1]} from ${route}`,
      );
    }
  }
}
console.log(
  'Package archives verified: public imports, SSR, declarations, CSS, licenses, docs anchors and private-file exclusion.',
);
