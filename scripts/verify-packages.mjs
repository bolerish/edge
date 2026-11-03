import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdir, readFile, rm, symlink } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const sandbox = resolve(root, '.private/package-check');
await rm(sandbox, { recursive: true, force: true });
await mkdir(resolve(sandbox, 'node_modules/@wisp-lighting'), {
  recursive: true,
});
for (const name of ['core', 'react']) {
  const archive = resolve(sandbox, `${name}.tgz`);
  execFileSync('pnpm', ['pack', '--out', archive], {
    cwd: resolve(root, 'packages', name),
    stdio: 'pipe',
  });
  const listing = execFileSync('tar', ['-tzf', archive], { encoding: 'utf8' });
  assert(
    !listing.includes('.private/') &&
      !listing.includes('/tests/') &&
      !listing.includes('/src/'),
  );
  const destination = resolve(sandbox, 'node_modules/@wisp-lighting', name);
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
await mkdir(resolve(sandbox, 'node_modules/@stylexjs'), { recursive: true });
for (const name of ['react', 'react-dom', '@stylexjs/stylex']) {
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
  import * as stylex from '@stylexjs/stylex';
  import {createLight} from '@wisp-lighting/core';
  import {useLight,useSurface} from '@wisp-lighting/react';
  assert.equal(typeof window,'undefined');
  createLight().refresh();
  function Card(){const light=useLight();const surface=useSurface(light,{theme:'wisp'});return React.createElement('article',stylex.props(surface.style),'Packed card');}
  assert.match(renderToStaticMarkup(React.createElement(Card)),/Packed card/);
`,
  ],
  { cwd: sandbox, stdio: 'pipe' },
);
const css = await readFile(
  resolve(sandbox, 'node_modules/@wisp-lighting/react/dist/assets/stylex.css'),
  'utf8',
);
assert(css.includes('conic-gradient') && css.includes('--wisp-angle'));
const library = await readFile(
  resolve(sandbox, 'node_modules/@wisp-lighting/react/dist/index.js'),
  'utf8',
);
assert(
  library.startsWith('"use client"') || library.startsWith("'use client'"),
);
const site = resolve(root, 'docs/dist');
const routes = JSON.parse(await readFile(resolve(site, 'routes.json'), 'utf8'));
assert(routes.includes('/docs/') && routes.includes('/playground/'));
const documents = new Map();
for (const route of routes) {
  const html = await readFile(resolve(site, `.${route}`, 'index.html'), 'utf8');
  assert(
    html.includes(`data-path="${route}"`) && html.includes('<h1'),
    `Missing prerendered content: ${route}`,
  );
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
