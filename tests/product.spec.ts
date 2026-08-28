import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const fixturePath = fileURLToPath(new URL('./fixtures/prompts.csv', import.meta.url));

test('@claim:demo-sandbox opens eight useful prompts in isolated demo storage', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.locator('.prompt-list > li')).toHaveCount(8);
  await page.getByLabel('Plan name').fill('Five-minute weak set');
  await page.getByRole('button', { name: 'Save round plan' }).click();
  await expect(page.getByText('Five-minute weak set', { exact: true })).toBeVisible();
  const keys = await page.evaluate(() => Object.keys(localStorage));
  expect(keys).toContain('demo:fpq:plans');
  expect(keys).not.toContain('fpq:plans');
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.locator('.prompt-list > li')).toHaveCount(8);
  await expect(page.getByText('Five-minute weak set')).toHaveCount(0);
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
  await page.getByRole('button', { name: /Got it/ }).click();
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
  await page.getByRole('button', { name: 'weak' }).click();
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
  await page.getByRole('button', { name: 'weak' }).click();
  await page.getByLabel('Prompt count').selectOption('3');
  await page.getByLabel('Seconds each').selectOption('60');
  await page.getByLabel('Plan name').fill('Weak sixty');
  await page.getByRole('button', { name: 'Save round plan' }).click();
  await page.getByRole('button', { name: 'Any tag' }).click();
  await page.getByLabel('Prompt count').selectOption('8');
  await page.getByRole('button', { name: 'Use plan' }).click();
  await expect(page.getByRole('button', { name: 'weak', exact: true })).toHaveAttribute('aria-pressed', 'true');
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
  await expect(page.getByRole('button', { name: 'Save plan · paid' })).toBeVisible();
});

test('@claim:paid-price shows the one-time price and hosted checkout', async ({ page }) => {
  await page.goto('/');
  const buy = page.getByRole('link', { name: 'Buy a $9 license' });
  await expect(page.getByRole('heading', { name: 'Save round plans for $9 once' })).toBeVisible();
  await expect(buy).toHaveAttribute('href', 'https://api.sociobot.in/api/v1/products/flex-practice-queue/checkout');
});

test('routes, mobile layout, metadata, and accessibility pass', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  for (const route of ['/', '/demo', '/privacy', '/terms', '/missing-sheet']) {
    await page.goto(route);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page).toHaveTitle(/Flex Practice Queue/);
    const results = await new AxeBuilder({ page: page as never }).analyze();
    expect(results.violations.filter(item => ['serious', 'critical'].includes(item.impact || ''))).toEqual([]);
  }
  expect(consoleErrors).toEqual([]);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo');
  await expect(page.locator('body')).toHaveJSProperty('scrollWidth', 390);
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
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

test('a pasted license enables saved plans without a reload', async ({ page }) => {
  await page.route('https://api.sociobot.in/api/v1/products/flex-practice-queue/verify?license=pasted-license', route => route.fulfill({ json: { valid: true, reason: 'ok', expires_at: null } }));
  await page.goto('/');
  await page.getByLabel('Have a license? Paste it').fill('pasted-license');
  await page.getByRole('button', { name: 'Verify license' }).click();
  await expect(page.getByText('License active.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Save round plan' })).toBeVisible();
});
