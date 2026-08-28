import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const root = new URL('../dist/', import.meta.url).pathname;
async function files(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(entries.map(entry => entry.isDirectory() ? files(join(dir, entry.name)) : [join(dir, entry.name)]));
  return nested.flat();
}
const all = (await files(root)).map(file => `/${relative(root, file)}`).filter(file => !file.endsWith('sw.js') && !file.endsWith('.map') && file !== '/staticwebapp.config.json');
const swPath = join(root, 'sw.js');
const sw = await readFile(swPath, 'utf8');
await writeFile(swPath, sw.replace('["__PRECACHE__"]', JSON.stringify(all)));
