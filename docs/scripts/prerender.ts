import { readFile, writeFile, mkdir, symlink, readlink, unlink } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';
const modulesPath = resolve('../.private/docs-ssr/node_modules');
const modulesTarget = relative(dirname(modulesPath), resolve('node_modules'));
// Relative links survive moving the checkout; replace only the generated symlink.
try {
  if ((await readlink(modulesPath)) !== modulesTarget) await unlink(modulesPath);
} catch (error) {
  if (!(error instanceof Error && 'code' in error && error.code === 'ENOENT')) throw error;
}
await symlink(modulesTarget, modulesPath, 'dir').catch((error: unknown) => {
  if (!(error instanceof Error && 'code' in error && error.code === 'EEXIST')) throw error;
});
const serverUrl = new URL('../../.private/docs-ssr/entry-server.js', import.meta.url);
const {
  renderDocument,
  publicPaths,
  renderAgentDocuments,
}: typeof import('../src/entry-server.js') = await import(serverUrl.href);
const destination = resolve('dist');
const template = await readFile(resolve(destination, 'index.html'), 'utf8');
if ([...template.matchAll(/<title>[^<]*<\/title>/g)].length !== 1)
  throw new Error('Expected one template title');
if (!template.includes('<!--app-html-->')) throw new Error('Missing prerender placeholder');
for (const path of publicPaths) {
  const output = renderDocument(template, path);
  const directory = resolve(destination, `.${path}`);
  await mkdir(directory, { recursive: true });
  await writeFile(resolve(directory, 'index.html'), output);
}
await writeFile(resolve(destination, '404.html'), renderDocument(template, '/404/'));
console.log(`Prerendered ${publicPaths.length} public pages.`);

await writeFile(resolve(destination, 'routes.json'), JSON.stringify(publicPaths));

const { version }: { version: string } = JSON.parse(
  await readFile(resolve('../packages/react/package.json'), 'utf8'),
);
for (const [path, body] of renderAgentDocuments(version)) {
  const file = resolve(destination, `.${path}`);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, body);
}
