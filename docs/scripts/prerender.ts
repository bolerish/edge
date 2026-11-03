import { readFile, writeFile, mkdir, symlink } from 'node:fs/promises';
import { resolve } from 'node:path';
await symlink(
  resolve('node_modules'),
  resolve('../.private/docs-ssr/node_modules'),
  'dir',
).catch((error: unknown) => {
  if (!(error instanceof Error && 'code' in error && error.code === 'EEXIST')) throw error;
});
const serverUrl = new URL('../../.private/docs-ssr/entry-server.js', import.meta.url);
const { render, publicPaths }: typeof import('../src/entry-server.js') = await import(serverUrl.href);
const destination = resolve('dist');
const template = await readFile(resolve(destination, 'index.html'), 'utf8');
if ([...template.matchAll(/<title>[^<]*<\/title>/g)].length !== 1)
  throw new Error('Expected one template title');
function escapeHtml(text: string) {
  return text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('\"', '&quot;').replaceAll("'", '&#39;');
}
if (!template.includes('<!--app-html-->'))
  throw new Error('Missing prerender placeholder');
for (const path of publicPaths) {
  const { html, title } = render(path);
  const output = template
    .replace('<!--app-html-->', html)
    .replace('id="root"', `id="root" data-path="${path}"`)
    .replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`);
  const directory = resolve(destination, `.${path}`);
  await mkdir(directory, { recursive: true });
  await writeFile(resolve(directory, 'index.html'), output);
}
console.log(`Prerendered ${publicPaths.length} public pages.`);

await writeFile(
  resolve(destination, 'routes.json'),
  JSON.stringify(publicPaths),
);
