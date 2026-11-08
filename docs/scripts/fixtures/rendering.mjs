import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { PassThrough } from 'node:stream';
import React from 'react';
import { renderToPipeableStream, renderToStaticMarkup } from 'react-dom/server';
import { Scene } from './scene.js';
import { createStreamingScene } from './rendering-scene.mjs';

const errors = [];
console.error = (...args) => errors.push(args.join(' '));
const tree = (fixture) =>
  React.createElement(
    'html',
    null,
    React.createElement(
      'head',
      null,
      React.createElement('title', null, 'Rendering compatibility'),
    ),
    React.createElement(
      'body',
      null,
      React.createElement('div', { id: 'root' }, React.createElement(fixture.Scene)),
      React.createElement('script', { type: 'module', src: '/rendering-client.mjs' }),
    ),
  );
const document = (html, script = 'rendering-client.mjs', mode = '') =>
  '<!doctype html><html><head><title>Rendering compatibility</title></head><body>' +
  `<div id="root" data-mode="${mode}">${html}</div>` +
  (script ? `<script type="module" src="/${script}"></script>` : '') +
  '</body></html>';

async function nodeStream(allReady) {
  const fixture = createStreamingScene();
  const chunks = [];
  await new Promise((resolve, reject) => {
    const output = new PassThrough();
    let released = false;
    output.on('data', (chunk) => {
      chunks.push(chunk.toString());
      if (!allReady && !released && chunks.join('').includes('Loading')) {
        assert(!chunks.join('').includes('delayed-surface'));
        released = true;
        fixture.resolve();
      }
    });
    output.on('end', resolve);
    output.on('error', reject);
    const stream = renderToPipeableStream(tree(fixture), {
      onShellReady() {
        if (allReady) fixture.resolve();
        else stream.pipe(output);
      },
      onAllReady() {
        if (allReady) stream.pipe(output);
      },
      onShellError: reject,
      onError: reject,
    });
  });
  return chunks.join('');
}

if (process.argv[2] !== 'web') {
  const streamed = await nodeStream(false);
  assert(streamed.includes('Loading') && streamed.includes('delayed-surface'));
  writeFileSync('node-stream.html', streamed);

  const ssg = await nodeStream(true);
  assert(ssg.includes('delayed-surface') && !ssg.includes('Loading'));
  writeFileSync('ssg.html', ssg);

  const staticHtml = renderToStaticMarkup(React.createElement(Scene));
  assert(staticHtml.includes('bolerish-edge-after'));
  assert(!staticHtml.includes('--edge-angle:'));
  writeFileSync(
    'static.css',
    readFileSync(new URL(import.meta.resolve('@bolerish/edge/style.css'))),
  );
  writeFileSync(
    'static.html',
    document(staticHtml, '').replace(
      '</head>',
      '<link rel="stylesheet" href="./static.css"></head>',
    ),
  );
  writeFileSync('csr.html', document('', 'client.js', 'csr'));
} else {
  const { renderToReadableStream } = await import(process.argv[3]);
  const fixture = createStreamingScene();
  const stream = await renderToReadableStream(tree(fixture), {
    onError: (error) => errors.push(String(error)),
  });
  const reader = stream.getReader();
  const first = await reader.read();
  const decoder = new TextDecoder();
  let html = decoder.decode(first.value, { stream: true });
  assert(html.includes('Loading') && !html.includes('delayed-surface'));
  fixture.resolve();
  while (true) {
    const next = await reader.read();
    if (next.done) break;
    html += decoder.decode(next.value, { stream: true });
  }
  html += decoder.decode();
  assert(html.includes('delayed-surface'));
  writeFileSync('web-stream.html', html);
}
assert.deepEqual(errors, []);
