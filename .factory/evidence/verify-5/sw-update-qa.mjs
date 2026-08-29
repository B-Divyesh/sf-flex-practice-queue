import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { chromium } from 'playwright';

const root = join(process.cwd(), 'dist');
let workerVersion = 0;
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json', '.xml': 'application/xml', '.txt': 'text/plain', '.map': 'application/json' };
const server = createServer(async (req, res) => {
  const url = new URL(req.url || '/', 'http://127.0.0.1');
  if (url.pathname === '/__bump') {
    workerVersion++;
    res.writeHead(204, { 'Cache-Control': 'no-store' });
    res.end();
    return;
  }
  let rel = normalize(decodeURIComponent(url.pathname)).replace(/^[/\\]+/, '');
  if (!rel || rel === 'demo' || rel === 'privacy' || rel === 'terms') rel = 'index.html';
  try {
    const path = join(root, rel);
    const info = await stat(path);
    if (!info.isFile() || !path.startsWith(root)) throw new Error('not found');
    let body = await readFile(path);
    if (rel === 'sw.js') body = Buffer.concat([body, Buffer.from(`\n// simulated-deployment-${workerVersion}\n`)]);
    res.writeHead(200, { 'Content-Type': types[extname(path)] || 'application/octet-stream', 'Cache-Control': rel === 'sw.js' ? 'no-cache' : 'no-store', 'Service-Worker-Allowed': '/' });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end('not found');
  }
});
await new Promise(resolve => server.listen(4190, '127.0.0.1', resolve));

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const page = await context.newPage();
const errors = [];
page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
page.on('pageerror', error => errors.push(error.message));
await page.goto('http://127.0.0.1:4190/?demo=1', { waitUntil: 'networkidle' });
await page.evaluate(async () => navigator.serviceWorker.ready);
await page.reload({ waitUntil: 'networkidle' });
assert(await page.evaluate(() => Boolean(navigator.serviceWorker.controller)));
await page.evaluate(async () => { await fetch('/__bump', { cache: 'no-store' }); });
await page.evaluate(async () => { const registration = await navigator.serviceWorker.getRegistration(); await registration.update(); });
await page.getByRole('status', { name: 'Application updates' }).filter({ hasText: 'An update is ready. Reload to use it.' }).waitFor({ timeout: 15_000 });
const updateNotice = await page.getByRole('status', { name: 'Application updates' }).innerText();
await page.reload({ waitUntil: 'networkidle' });
await page.locator('.prompt-list > li').first().waitFor();
const result = {
  updateNotice,
  promptCountAfterReload: await page.locator('.prompt-list > li').count(),
  controller: await page.evaluate(() => navigator.serviceWorker.controller?.scriptURL || null),
  cacheKeys: await page.evaluate(() => caches.keys()),
  errors
};
assert.equal(result.promptCountAfterReload, 8);
assert.deepEqual(errors, []);
console.log(JSON.stringify(result, null, 2));
await browser.close();
await new Promise(resolve => server.close(resolve));
