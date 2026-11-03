import { copyFile } from 'node:fs/promises';
import { resolve } from 'node:path';
await copyFile(new URL('../LICENSE', import.meta.url), resolve('dist/LICENSE'));
