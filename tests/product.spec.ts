import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const fixturePath = fileURLToPath(new URL('./fixtures/prompts.csv', import.meta.url));
const ankiFixturePath = fileURLToPath(new URL('./fixtures/anki-front-back-tags.csv', import.meta.url));
const apkgFixturePath = fileURLToPath(new URL('./fixtures/unsupported-sample.apkg', import.meta.url));
const staticConfigPath = fileURLToPath(new URL('../public/staticwebapp.config.json', import.meta.url));
const static404Path = fileURLToPath(new URL('../public/404.html', import.meta.url));
const builtServiceWorkerPath = fileURLToPath(new URL('../dist/sw.js', import.meta.url));
const checkoutUrl = 'https://api.sociobot.in/api/v1/products/flex-practice-queue/checkout';

test('static deployment keeps known app routes, a real 404, immutable assets, and an updateable service worker', async () => {
  const config = JSON.parse(await readFile(staticConfigPath, 'utf8')) as { navigationFallback?: unknown; responseOverrides?: Record<string, { rewrite?: string }>; routes: Array<{ route: string; rewrite?: string; headers?: Record<string, string> }> };
  const routeHeaders = (route: string) => config.routes.find(entry => entry.route === route)?.headers;
  expect(config.navigationFallback).toBeUndefined();
  expect(config.responseOverrides?.['404']?.rewrite).toBe('/404.html');
  for (const route of ['/demo', '/privacy', '/terms']) expect(config.routes.find(entry => entry.route === route)?.rewrite).toBe('/index.html');
  expect(routeHeaders('/assets/*')?.['Cache-Control']).toBe('public, max-age=31536000, immutable');
  expect(routeHeaders('/sw.js')?.['Cache-Control']).toBe('no-cache');
  const page404 = await readFile(static404Path, 'utf8');
  expect(page404).toContain('<a class="skip-link" href="#main">Skip to main content</a>');
  expect(page404).toContain('href="/privacy"');
  expect(page404).toContain('href="/terms"');
  expect(page404).toContain('rel="canonical" href="https://flex-practice-queue.sociobot.in/404"');
  expect(page404).toContain('property="og:image"');
  expect(page404).toContain('rel="icon" href="/icons/icon.svg"');
  expect(await readFile(builtServiceWorkerPath, 'utf8')).not.toContain('"/staticwebapp.config.json"');
});

test('@claim:demo-sandbox keeps real prompts, rounds, and plans untouched through reset and start-for-real', async ({ page }) => {
  await page.goto('/');
  await page.locator('summary').click();
  await page.locator('#new-prompt').fill('Real workspace sentinel');
  await page.locator('#new-answer').fill('This remains outside the demo.');
  await page.getByRole('button', { name: 'Add prompt' }).click();
  await page.getByRole('button', { name: 'Start mixed round' }).click();
  await page.getByRole('button', { name: 'Stop round' }).click();
  await page.getByRole('button', { name: 'Build another round' }).click();
  const realPlan = '[{"id":"real-plan","name":"Real plan","filter":"today","count":3,"seconds":30}]';
  await page.evaluate(value => localStorage.setItem('fpq:plans', value), realPlan);
  const realSnapshot = await page.evaluate(async () => {
    const database = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('flex-practice-queue');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const read = (store: string) => new Promise<unknown[]>((resolve, reject) => {
      const request = database.transaction(store).objectStore(store).getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const snapshot = JSON.stringify({ prompts: await read('prompts'), rounds: await read('rounds') });
    database.close();
    return snapshot;
  });
  await page.goto('/demo');
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.locator('.prompt-list > li')).toHaveCount(8);
  await page.locator('#csv-file').setInputFiles(fixturePath);
  await expect(page.locator('.prompt-list > li')).toHaveCount(10);
  await page.getByLabel('Plan name').fill('Five-minute weak set');
  await page.getByRole('button', { name: 'Save round plan' }).click();
  await expect(page.getByText('Five-minute weak set', { exact: true })).toBeVisible();
  const keys = await page.evaluate(() => Object.keys(localStorage));
  expect(keys).toContain('demo:fpq:plans');
  expect(await page.evaluate(() => localStorage.getItem('fpq:plans'))).toBe(realPlan);
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.locator('.prompt-list > li')).toHaveCount(8);
  await expect(page.getByText('Five-minute weak set')).toHaveCount(0);
  await page.getByRole('button', { name: 'Start for real' }).click();
  await expect(page.getByText('Demo — sample data, nothing is saved')).toHaveCount(0);
  await expect(page.locator('.prompt-list > li')).toHaveCount(1);
  await expect(page.getByText('Real workspace sentinel', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('fpq:plans'))).toBe(realPlan);
  expect(await page.evaluate(() => Object.keys(localStorage).filter(key => key.startsWith('demo:')))).toEqual([]);
  const afterSnapshot = await page.evaluate(async () => {
    const database = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('flex-practice-queue');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const read = (store: string) => new Promise<unknown[]>((resolve, reject) => {
      const request = database.transaction(store).objectStore(store).getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const snapshot = JSON.stringify({ prompts: await read('prompts'), rounds: await read('rounds') });
    database.close();
    return snapshot;
  });
  expect(afterSnapshot).toBe(realSnapshot);
  const databaseNames = await page.evaluate(async () => (await indexedDB.databases()).map(database => database.name));
  expect(databaseNames).not.toContain('demo:flex-practice-queue');
});

test('demo shows and starts the same fixed sample round in the first 390px viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveURL(/\?demo=1$/);
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  const preview = page.getByRole('heading', { name: 'Explain why seasons occur.' });
  await expect(preview).toBeVisible();
  const box = await preview.boundingBox();
  expect(box?.y).toBeLessThan(844);
  const previewPrompt = (await preview.textContent())!;
  await page.getByRole('button', { name: 'Start this sample round' }).click();
  await expect(page.getByRole('heading', { name: 'Recall the answer' })).toBeVisible();
  await expect(page.getByText('Live round · 1 of 3')).toBeVisible();
  await expect(page.locator('.prompt-sheet > p')).toHaveText(previewPrompt);

  for (const nextPrompt of ['What does a pure function avoid?', 'Use “serendipity” in a sentence.']) {
    await page.getByRole('button', { name: /Reveal answer/ }).click();
    await page.getByRole('button', { name: /Mark as got it/ }).click();
    await expect(page.locator('.prompt-sheet > p')).toHaveText(nextPrompt);
  }
});

test('landing copy names the job, free tools, and paid feature in plain words', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Extra flashcard practice', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Build a short flashcard practice round' })).toBeVisible();
  await expect(page.getByText('Choose a few existing flashcards for extra practice.', { exact: true })).toBeVisible();
  await expect(page.getByText('Import, tag, practice, and export are free. Saved round plans cost $9 once.', { exact: true })).toBeVisible();
  await expect(page.getByText('Your practice queue', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'How optional practice works' })).toBeVisible();
  await expect(page.getByText('Tag prompts.', { exact: true })).toBeVisible();
  await expect(page.getByText('Paid round plans', { exact: true })).toBeVisible();
  const copy = await page.locator('main').innerText();
  expect(copy).not.toMatch(/Drawing 01|Drawing 02|rehearsal lane|Assembly notes|Mark your intent|Scope boundary|Optional paid tool|Core tools|Build a useful practice round/i);
});

test('hash routes wait for the local queue before focusing the requested section', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const howHeading = page.getByRole('heading', { name: 'How optional practice works' });

  await page.goto('/#how');
  await expect(page.locator('#practice-app')).not.toContainText('Opening your local queue…');
  await expect(howHeading).toBeFocused();
  await expect(page.locator('.route-status')).toHaveText('How optional practice works');
  const directBox = await howHeading.boundingBox();
  expect(directBox?.y).toBeGreaterThanOrEqual(0);
  expect(directBox?.y).toBeLessThan(844);

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/privacy');
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'How it works' }).click();
  await expect(page).toHaveURL('/#how');
  await expect(page.locator('#practice-app')).not.toContainText('Opening your local queue…');
  await expect(howHeading).toBeFocused();
  const linkedBox = await howHeading.boundingBox();
  expect(linkedBox?.y).toBeGreaterThanOrEqual(0);
  expect(linkedBox?.y).toBeLessThan(900);

});

test('plan actions name the result they produce', async ({ page }) => {
  await page.goto('/');
  const planOption = page.getByRole('link', { name: 'View $9 saved plans' });
  await expect(planOption).toHaveAttribute('href', '#price-heading');
  await planOption.click();
  await expect(page.getByRole('heading', { name: 'Save round plans for $9 once' })).toBeFocused();
  await expect(page.getByRole('button', { name: 'Save plan · paid' })).toHaveCount(0);

  await page.goto('/demo');
  await page.getByLabel('Plan name').fill('Weak sixty');
  await page.getByRole('button', { name: 'Save round plan' }).click();
  const load = page.getByRole('button', { name: 'Load plan settings' });
  await expect(load).toBeVisible();
  await load.click();
  await expect(page.getByRole('button', { name: 'Show all prompts', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('button', { name: 'Use plan' })).toHaveCount(0);
});

test('mobile interactive targets meet the 44px touch baseline', async ({ page }) => {
  const targetBoxes = async () => page.locator('.wordmark, footer nav a, .empty-state a, .file-button, .segmented button, .builder-actions .button, .library-actions .text-button, .icon-button').evaluateAll(nodes => nodes.map(node => {
    const rect = (node as HTMLElement).getBoundingClientRect();
    return { name: (node as HTMLElement).innerText || (node as HTMLElement).getAttribute('aria-label') || node.tagName, x: rect.x, y: rect.y, width: rect.width, height: rect.height };
  }));
  const assertTargets = (boxes: Awaited<ReturnType<typeof targetBoxes>>) => {
    expect(boxes.length).toBeGreaterThan(0);
    for (const box of boxes) {
      expect(box.width, `${box.name} width`).toBeGreaterThanOrEqual(44);
      expect(box.height, `${box.name} height`).toBeGreaterThanOrEqual(44);
    }
    for (let first = 0; first < boxes.length; first++) for (let second = first + 1; second < boxes.length; second++) {
      const a = boxes[first]; const b = boxes[second];
      expect(a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height, `${a.name} and ${b.name} overlap`).toBe(false);
    }
  };

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  assertTargets(await targetBoxes());

  await page.goto('/404.html');
  assertTargets(await targetBoxes());
});

test('200% text size reflows the landing and demo controls within a 390px viewport', async ({ page }) => {
  const expectWithinViewport = async (selector: string) => {
    const box = await page.locator(selector).boundingBox();
    expect(box, `${selector} box`).not.toBeNull();
    expect(box!.x, `${selector} left edge`).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width, `${selector} right edge`).toBeLessThanOrEqual(390);
  };

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.waitForFunction(() => !document.querySelector('#practice-app')?.textContent?.includes('Opening'));
  await page.evaluate(() => { document.documentElement.style.fontSize = '32px'; });
  expect(await page.locator('html').evaluate(node => node.scrollWidth)).toBe(390);
  await expectWithinViewport('.hero h1');
  await expectWithinViewport('#license-token');
  await expectWithinViewport('#license-form button');

  await page.goto('/demo');
  await page.waitForFunction(() => !document.querySelector('#practice-app')?.textContent?.includes('Loading'));
  await page.evaluate(() => { document.documentElement.style.fontSize = '32px'; });
  expect(await page.locator('html').evaluate(node => node.scrollWidth)).toBe(390);
  await expectWithinViewport('#new-prompt');
  await expectWithinViewport('#plan-name');
  await expectWithinViewport('#start-round');
});

test('a manual prompt that is empty after trimming announces a recovery error', async ({ page }) => {
  await page.goto('/demo');
  await page.locator('#csv-file').setInputFiles(fixturePath);
  await expect(page.locator('#import-status')).toHaveText('2 prompts imported. The source file was not changed.');
  await page.locator('summary').click();
  await page.locator('#new-prompt').fill('   ');
  await page.getByRole('button', { name: 'Add prompt' }).click();

  await expect(page.locator('#import-status')).toHaveText('Enter a prompt before adding it.');
  await expect(page.locator('#import-status')).toHaveAttribute('aria-live', 'polite');
  await expect(page.locator('#new-prompt')).toHaveValue('');
  await expect(page.locator('#new-prompt')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#new-prompt')).toHaveAttribute('aria-describedby', 'import-status');
  await expect(page.locator('#new-prompt')).toBeFocused();
  await expect(page.locator('.prompt-list > li')).toHaveCount(10);
});

test('inline Anki help and support links meet the 44px touch baseline', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const [route, selector] of [['/', '.anki-help-link'], ['/demo', '.anki-help-link'], ['/terms', '.support-link']]) {
    await page.goto(route);
    if (route === '/demo') await page.waitForFunction(() => !document.querySelector('#practice-app')?.textContent?.includes('Loading'));
    const box = await page.locator(selector).boundingBox();
    expect(box, `${route} ${selector} box`).not.toBeNull();
    expect(box!.width, `${route} ${selector} width`).toBeGreaterThanOrEqual(44);
    expect(box!.height, `${route} ${selector} height`).toBeGreaterThanOrEqual(44);
  }
});

test('@claim:offline-reload works offline after the first visit', async ({ page, context }) => {
  await page.goto('/demo');
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.reload();
  await expect(page.locator('.prompt-list > li')).toHaveCount(8);
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Try a mixed practice round' })).toBeVisible();
  await expect(page.locator('.prompt-list > li')).toHaveCount(8);
});

test('@claim:local-privacy sends no study data off-site', async ({ page }) => {
  const crossOrigin: string[] = [];
  page.on('request', request => {
    if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') crossOrigin.push(request.url());
  });
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Start mixed round' }).click();
  await page.getByRole('button', { name: /Reveal answer/ }).click();
  await page.getByRole('button', { name: /Mark as got it/ }).click();
  expect(crossOrigin).toEqual([]);
});

test('@claim:csv-readonly imports CSV and leaves the selected file unchanged', async ({ page }) => {
  const before = await readFile(fixturePath, 'utf8');
  await page.goto('/demo');
  await page.locator('#csv-file').setInputFiles(fixturePath);
  await expect(page.getByText('10 prompts imported. The source file was not changed.')).toHaveCount(0);
  await expect(page.getByText('2 prompts imported. The source file was not changed.')).toBeVisible();
  await expect(page.locator('.prompt-list > li')).toHaveCount(10);
  expect(await readFile(fixturePath, 'utf8')).toBe(before);
});

test('@claim:source-schedule-untouched imports, tags, practices, and exports without contacting a flashcard schedule', async ({ page }) => {
  const before = await readFile(fixturePath, 'utf8');
  const offOriginRequests: string[] = [];
  page.on('request', request => {
    if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') offOriginRequests.push(request.url());
  });
  await page.goto('/demo');
  await page.locator('#csv-file').setInputFiles(fixturePath);
  await page.getByLabel('weak', { exact: true }).first().check();
  await page.getByRole('button', { name: 'Show weak prompts', exact: true }).click();
  await page.getByLabel('Prompt count').selectOption('3');
  await page.getByRole('button', { name: 'Start mixed round' }).click();
  await page.getByRole('button', { name: /Reveal answer/ }).click();
  await page.getByRole('button', { name: /Mark as got it/ }).click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Stop round' }).click();
  await page.getByRole('button', { name: 'Build another round' }).click();
  await page.getByRole('button', { name: 'Export CSV' }).click();
  await downloadPromise;
  expect(await readFile(fixturePath, 'utf8')).toBe(before);
  expect(offOriginRequests).toEqual([]);
});

test('@claim:anki-csv-import imports front/back/tags and leaves the selected file unchanged', async ({ page }) => {
  const before = await readFile(ankiFixturePath, 'utf8');
  await page.goto('/demo');
  await page.locator('#csv-file').setInputFiles(ankiFixturePath);
  await expect(page.getByText('3 prompts imported. The source file was not changed.')).toBeVisible();
  await expect(page.locator('.prompt-list > li')).toHaveCount(11);
  const imported = page.locator('.prompt-list > li').filter({ hasText: 'What causes the northern lights?' });
  await expect(imported).toContainText('Charged particles excite gases high in Earth’s atmosphere.');
  await expect(imported.getByLabel('weak')).toBeChecked();
  await expect(imported.getByLabel('today')).toBeChecked();
  expect(await readFile(ankiFixturePath, 'utf8')).toBe(before);
});

test('@claim:anki-apkg-not-supported keeps packages out and gives CSV export guidance', async ({ page }) => {
  await page.goto('/demo');
  await page.locator('#csv-file').setInputFiles(apkgFixturePath);
  await expect(page.getByRole('status')).toContainText('This app cannot read .apkg packages. Export a front, back, tags CSV from Anki first.');
  await expect(page.locator('.prompt-list > li')).toHaveCount(8);
});

test('@claim:csv-export exports every prompt with CSV headings', async ({ page }) => {
  await page.goto('/demo');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export CSV' }).click();
  const download = await downloadPromise;
  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  const csv = Buffer.concat(chunks).toString('utf8');
  expect(download.suggestedFilename()).toBe('flex-practice-prompts.csv');
  expect(csv.split('\n')).toHaveLength(9);
  expect(csv).toMatch(/^prompt,answer,tags\n/);
  expect(csv).toContain('Explain why seasons occur.');
});

test('@claim:mixed-round runs a timed round with keyboard controls', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Show weak prompts' }).click();
  await page.getByLabel('Prompt count').selectOption('3');
  await page.getByLabel('Seconds each').selectOption('15');
  await page.getByRole('button', { name: 'Start mixed round' }).click();
  await expect(page.getByText('15', { exact: true })).toBeVisible();
  for (let index = 0; index < 3; index++) {
    await page.keyboard.press('Space');
    await expect(page.getByText('Answer', { exact: true })).toBeVisible();
    await page.keyboard.press(index === 0 ? 'ArrowLeft' : 'ArrowRight');
  }
  await expect(page.getByRole('heading', { name: '3 prompts practiced' })).toBeVisible();
  await expect(page.getByText('1', { exact: true })).toBeVisible();
});

test('@claim:saved-plans saves and reloads a named round plan in demo', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Show weak prompts' }).click();
  await page.getByLabel('Prompt count').selectOption('3');
  await page.getByLabel('Seconds each').selectOption('60');
  await page.getByLabel('Plan name').fill('Weak sixty');
  await page.getByRole('button', { name: 'Save round plan' }).click();
  await page.getByRole('button', { name: 'Show all prompts' }).click();
  await page.getByLabel('Prompt count').selectOption('8');
  await page.getByRole('button', { name: 'Load plan settings' }).click();
  await expect(page.getByRole('button', { name: 'Show weak prompts', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByLabel('Prompt count')).toHaveValue('3');
  await expect(page.getByLabel('Seconds each')).toHaveValue('60');
});

test('@claim:data-delete removes local practice data', async ({ page }) => {
  await page.goto('/demo');
  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Delete local data' }).click();
  await expect(page.getByRole('heading', { name: 'Your queue is empty' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Your queue is empty' })).toBeVisible();
});

test('@claim:free-core keeps import, tagging, practice, and export free', async ({ page }) => {
  await page.goto('/');
  expect(await page.evaluate(() => localStorage.getItem('sb_license:flex-practice-queue'))).toBeNull();
  await page.locator('#csv-file').setInputFiles(fixturePath);
  await page.getByLabel('weak', { exact: true }).first().check();
  await expect(page.getByRole('button', { name: 'Start mixed round' })).toBeEnabled();
  await expect(page.getByRole('button', { name: 'Export CSV' })).toBeEnabled();
  await expect(page.getByRole('link', { name: 'View $9 saved plans' })).toBeVisible();
});

test('@claim:paid-price starts a hosted Sociobot checkout for the one-time price', async ({ page, request }) => {
  await page.goto('/');
  const buy = page.getByRole('link', { name: 'Buy a $9 license' });
  await expect(page.getByRole('heading', { name: 'Save round plans for $9 once' })).toBeVisible();
  await expect(buy).toHaveAttribute('href', checkoutUrl);
  const checkout = await request.get(checkoutUrl, { maxRedirects: 0 });
  expect(checkout.status()).toBeGreaterThanOrEqual(300);
  expect(checkout.status()).toBeLessThan(400);
  const destination = checkout.headers().location;
  expect(destination).toBeTruthy();
  expect(new URL(destination!).protocol).toBe('https:');
});

test('routes, mobile layout, metadata, and accessibility pass', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  const routes = [
    { path: '/', title: 'Flex Practice Queue — Short flashcard practice rounds', canonical: '/' },
    { path: '/demo', title: 'Demo — Flex Practice Queue', canonical: '/demo' },
    { path: '/privacy', title: 'Privacy — Flex Practice Queue', canonical: '/privacy' },
    { path: '/terms', title: 'Terms — Flex Practice Queue', canonical: '/terms' },
    { path: '/404.html', title: 'Page not found — Flex Practice Queue', canonical: '/404' }
  ];
  for (const route of routes) {
    await page.goto(route.path);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page).toHaveTitle(route.title);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://flex-practice-queue.sociobot.in${route.canonical}`);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /\S/);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', 'https://flex-practice-queue.sociobot.in/art/social-card.webp');
    const footer = page.getByRole('navigation', { name: 'Footer navigation' });
    await expect(footer.getByRole('link', { name: 'Privacy' })).toHaveAttribute('href', '/privacy');
    await expect(footer.getByRole('link', { name: 'Terms' })).toHaveAttribute('href', '/terms');
    const results = await new AxeBuilder({ page: page as never }).analyze();
    expect(results.violations.filter(item => ['serious', 'critical'].includes(item.impact || ''))).toEqual([]);
  }
  await page.goto('/404.html');
  await expect(page.getByRole('link', { name: 'Flex Practice Queue home' })).toHaveAttribute('href', '/');
  await expect(page.getByRole('navigation', { name: 'Main navigation' })).toContainText('Demo');
  await expect(page.getByRole('navigation', { name: 'Footer navigation' })).toContainText('Privacy');
  expect(consoleErrors).toEqual([]);

  await page.goto('/');
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Privacy' }).click();
  await expect(page).toHaveURL('/privacy');
  await expect(page.getByRole('heading', { level: 1, name: 'Your practice data stays local' })).toBeFocused();
  await expect(page.locator('.route-status')).toHaveText('Privacy — Flex Practice Queue');
  await page.goBack();
  await expect(page).toHaveURL('/');
  await expect(page.getByRole('heading', { level: 1, name: 'Build a short flashcard practice round' })).toBeFocused();

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo');
  await expect(page.locator('body')).toHaveJSProperty('scrollWidth', 390);
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  expect(await page.locator('html').evaluate(node => getComputedStyle(node).scrollBehavior)).toBe('auto');
});

test('@claim:license-check stores and checks a returned license at most daily', async ({ page }) => {
  let checks = 0;
  await page.route('https://api.sociobot.in/api/v1/products/flex-practice-queue/verify?license=test-license', async route => {
    checks++;
    await route.fulfill({ json: { valid: true, reason: 'ok', expires_at: null } });
  });
  await page.goto('/demo?license=test-license');
  await expect.poll(() => checks).toBe(1);
  await expect(page).toHaveURL(/\/demo$/);
  expect(await page.evaluate(() => localStorage.getItem('sb_license:flex-practice-queue'))).toBe('test-license');
  await page.getByRole('button', { name: 'Start for real' }).click();
  await expect(page.getByRole('button', { name: 'Save round plan' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Save round plan' })).toBeVisible();
  expect(checks).toBe(1);
});

test('@claim:license-data-minimization sends only the license token during verification', async ({ page }) => {
  const calls: Array<{ method: string; url: string; body: string | null }> = [];
  await page.route('https://api.sociobot.in/api/v1/products/flex-practice-queue/verify?license=only-this-token', async route => {
    calls.push({ method: route.request().method(), url: route.request().url(), body: route.request().postData() });
    await route.fulfill({ json: { valid: true, reason: 'ok', expires_at: null } });
  });
  await page.goto('/demo');
  await page.evaluate(() => {
    localStorage.setItem('demo:fpq:plans', JSON.stringify([{ name: 'private plan' }]));
    localStorage.setItem('sb_license:flex-practice-queue', 'only-this-token');
    localStorage.removeItem('sb_license:flex-practice-queue:verdict');
  });
  await page.reload();
  await expect.poll(() => calls).toHaveLength(1);
  expect(calls[0]).toEqual({
    method: 'GET',
    url: 'https://api.sociobot.in/api/v1/products/flex-practice-queue/verify?license=only-this-token',
    body: null
  });
});

test('a pasted license enables saved plans without a reload', async ({ page }) => {
  await page.route('https://api.sociobot.in/api/v1/products/flex-practice-queue/verify?license=pasted-license', route => route.fulfill({ json: { valid: true, reason: 'ok', expires_at: null } }));
  await page.goto('/');
  await page.getByLabel('Have a license? Paste it').fill('pasted-license');
  await page.getByRole('button', { name: 'Verify license' }).click();
  await expect(page.getByRole('status', { name: 'License verification status' })).toHaveText('License active.');
  await expect(page.getByRole('status', { name: 'Application updates' })).toHaveText('License verified. Saved round plans are ready.');
  await expect(page.getByText('License active.', { exact: true })).toHaveCount(1);
  await expect(page.getByRole('button', { name: 'Save round plan' })).toBeVisible();
});
