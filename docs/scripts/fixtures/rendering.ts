import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import { PassThrough } from 'node:stream';
import React from 'react';
import { renderToPipeableStream, renderToStaticMarkup } from 'react-dom/server';
import { Scene } from './scene.js';
import { Edge } from '@bolerish/edge';
import { createStreamingScene } from './rendering-scene.ts';

const errors: string[] = [];
console.error = (...args) => errors.push(args.join(' '));
const tree = (fixture: ReturnType<typeof createStreamingScene>) =>
  React.createElement(
    'html',
    null,
    React.createElement(
      'head',
      null,
      React.createElement('title', null, 'Rendering compatibility'),
      React.createElement(Edge.Styles),
    ),
    React.createElement(
      'body',
      null,
      React.createElement('div', { id: 'root' }, React.createElement(fixture.Scene)),
      React.createElement('script', { type: 'module', src: '/rendering-client.ts' }),
    ),
  );
const ssrStyles = renderToStaticMarkup(React.createElement(Edge.Styles));
const document = (html: string, script = 'rendering-client.ts', mode = '') =>
  '<!doctype html><html><head><title>Rendering compatibility</title>' +
  (mode === 'csr' ? '' : ssrStyles) +
  '</head><body>' +
  `<div id="root" data-mode="${mode}">${html}</div>` +
  (script ? `<script type="module" src="/${script}"></script>` : '') +
  '</body></html>';

async function nodeStream(allReady: boolean) {
  const fixture = createStreamingScene();
  const chunks: string[] = [];
  await new Promise<void>((resolve, reject) => {
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
    output.on('end', () => resolve());
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
  writeFileSync('static.html', document(staticHtml, ''));
  writeFileSync('csr.html', document('', 'client.js', 'csr'));
} else {
  const { renderToReadableStream } = await import(process.argv[3] ?? 'react-dom/server.edge');
  const fixture = createStreamingScene();
  const stream = await renderToReadableStream(tree(fixture), {
    onError: (error: unknown) => errors.push(String(error)),
  });
  const reader = stream.getReader();
  const first = await reader.read();
  const decoder = new TextDecoder();
  let html = decoder.decode(first.value, { stream: true });
  while (!html.includes('Loading')) {
    const shell = await reader.read();
    assert(!shell.done, 'Stream ended before the Suspense fallback');
    html += decoder.decode(shell.value, { stream: true });
  }
  assert(!html.includes('delayed-surface'));
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
