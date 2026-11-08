import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

async function catalog(locale: string): Promise<Record<string, string>> {
  const value: unknown = JSON.parse(
    await readFile(new URL(`../messages/${locale}.json`, import.meta.url), 'utf8'),
  );
  assert(
    value !== null && typeof value === 'object' && !Array.isArray(value),
    `Invalid catalog: ${locale}`,
  );
  return Object.fromEntries(
    Object.entries(value).map(([key, text]) => {
      assert(typeof text === 'string' && text.trim(), `Empty translation: ${locale}.${key}`);
      return [key, text];
    }),
  );
}
const settings: { locales: string[]; baseLocale: string } = JSON.parse(
  await readFile(new URL('../project.inlang/settings.json', import.meta.url), 'utf8'),
);
const base = await catalog(settings.baseLocale);
const placeholders = (text: string) =>
  [...text.matchAll(/\{(\w+)\}/g)].map((match) => match[1]).sort();
for (const locale of settings.locales) {
  const messages = await catalog(locale);
  assert.deepEqual(
    Object.keys(messages).sort(),
    Object.keys(base).sort(),
    `Translation keys differ: ${locale}`,
  );
  for (const [key, source] of Object.entries(base)) {
    const translation = messages[key];
    assert(translation !== undefined);
    assert.deepEqual(
      placeholders(translation),
      placeholders(source),
      `Translation inputs differ: ${locale}.${key}`,
    );
  }
}
console.log(`Translation keys and inputs verified for ${settings.locales.length} locales.`);
