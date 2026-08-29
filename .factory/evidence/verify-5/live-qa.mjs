import assert from 'node:assert/strict';
import { chromium, request as playwrightRequest } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const base = 'https://flex-practice-queue.sociobot.in';
const report = { checkedAt: new Date().toISOString(), base, routes: [], desktop: {}, mobile: {}, demoFlow: {}, links: [] };
const browser = await chromium.launch({ headless: true });

for (const route of [
  ['/', 200, 'Flex Practice Queue — Short flashcard practice rounds'],
  ['/demo', 200, 'Demo — Flex Practice Queue'],
  ['/privacy', 200, 'Privacy — Flex Practice Queue'],
  ['/terms', 200, 'Terms — Flex Practice Queue'],
  ['/verification-5-missing', 404, 'Page not found — Flex Practice Queue']
]) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', error => pageErrors.push(error.message));
  const response = await page.goto(`${base}${route[0]}`, { waitUntil: 'networkidle' });
  assert.equal(response?.status(), route[1]);
  assert.equal(await page.title(), route[2]);
  assert.equal(await page.locator('html').getAttribute('lang'), 'en');
  assert.equal(await page.locator('main').count(), 1);
  assert.equal(await page.locator('h1').count(), 1);
  assert.equal(await page.locator('img:not([alt])').count(), 0);
  const axe = await new AxeBuilder({ page }).analyze();
  const serious = axe.violations.filter(item => ['serious', 'critical'].includes(item.impact || ''));
  assert.deepEqual(serious, []);
  if (route[1] === 200) {
    assert.deepEqual(consoleErrors, []);
    assert.deepEqual(pageErrors, []);
  }
  report.routes.push({
    path: route[0], status: response?.status(), title: await page.title(), h1: await page.locator('h1').innerText(),
    mainCount: await page.locator('main').count(), seriousCriticalAxe: serious.length,
    consoleErrors, pageErrors, headers: response?.headers()
  });
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.keyboard.press('Tab');
  const firstFocus = await page.evaluate(() => ({ text: document.activeElement?.textContent?.trim(), className: document.activeElement?.className }));
  assert.match(firstFocus.text || '', /Skip to main content/);
  const focusStyle = await page.locator('.skip-link').evaluate(node => {
    const style = getComputedStyle(node);
    return { outlineColor: style.outlineColor, outlineStyle: style.outlineStyle, outlineWidth: style.outlineWidth, outlineOffset: style.outlineOffset };
  });
  assert.equal(focusStyle.outlineStyle, 'solid');
  assert.equal(focusStyle.outlineWidth, '3px');
  await page.keyboard.press('Enter');
  assert.equal(await page.evaluate(() => document.activeElement?.tagName), 'MAIN');
  report.desktop = { firstFocus, focusStyle, skipTarget: await page.evaluate(() => document.activeElement?.id) };
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.goto(base, { waitUntil: 'networkidle' });
  const heroActionBox = await page.getByRole('link', { name: 'Try it with sample data' }).boundingBox();
  assert(heroActionBox && heroActionBox.y < 844);
  assert.equal(await page.evaluate(() => document.body.scrollWidth), 390);
  assert.equal(await page.locator('html').evaluate(node => getComputedStyle(node).scrollBehavior), 'auto');
  await page.screenshot({ path: '.factory/evidence/verify-5/live-mobile-first-screen.png', fullPage: false });
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  assert.match(page.url(), /\?demo=1$/);
  await page.locator('.prompt-list > li').first().waitFor();
  assert.equal(await page.locator('.prompt-list > li').count(), 8);
  assert.equal(await page.evaluate(() => document.body.scrollWidth), 390);
  const previewBox = await page.getByRole('heading', { name: 'Explain why seasons occur.' }).boundingBox();
  assert(previewBox && previewBox.y < 844);
  await page.screenshot({ path: '.factory/evidence/verify-5/live-mobile-demo.png', fullPage: false });
  assert.deepEqual(consoleErrors, []);
  assert.deepEqual(pageErrors, []);
  report.mobile = { viewport: [390, 844], heroActionBox, previewBox, scrollWidth: 390, reducedScrollBehavior: 'auto', consoleErrors, pageErrors };
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const requests = [];
  const consoleErrors = [];
  const pageErrors = [];
  page.on('request', req => requests.push({ method: req.method(), url: req.url(), body: req.postData() }));
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.goto(`${base}/demo`, { waitUntil: 'networkidle' });
  assert.equal(await page.locator('.prompt-list > li').count(), 8);

  const invalidCases = [
    ['empty.csv', '', 'The CSV is empty. Add a prompt column and try again.'],
    ['headings.csv', 'prompt,answer,tags\n', 'The CSV has headings but no prompts. Add a row and try again.'],
    ['missing.csv', 'prompt,answer,tags\n,answer,weak\n', 'Row 2 has no prompt. Add one and try again.'],
    ['quote.csv', 'prompt,answer,tags\n"Unclosed,answer,weak\n', 'A quoted field is not closed. Fix the CSV and try again.'],
    ['deck.apkg', 'not really a package', 'This app cannot read .apkg packages. Export a front, back, tags CSV from Anki first.']
  ];
  const invalidResults = [];
  for (const [name, body, expected] of invalidCases) {
    await page.locator('#csv-file').setInputFiles({ name, mimeType: 'text/csv', buffer: Buffer.from(body) });
    await page.getByRole('status').filter({ hasText: expected }).waitFor();
    invalidResults.push({ name, status: await page.locator('#import-status').innerText(), count: await page.locator('.prompt-list > li').count() });
    assert.equal(await page.locator('.prompt-list > li').count(), 8);
  }

  const validCsv = '\ufefffront,back,tags\r\n"What, exactly, is ""osmosis""?","Movement, across a membrane",weak today\r\n';
  await page.locator('#csv-file').setInputFiles({ name: 'quoted-anki.csv', mimeType: 'text/csv', buffer: Buffer.from(validCsv) });
  await page.getByText('1 prompts imported. The source file was not changed.').waitFor();
  assert.equal(await page.locator('.prompt-list > li').count(), 9);
  const recovered = page.locator('.prompt-list > li').filter({ hasText: 'What, exactly, is "osmosis"?' });
  assert.equal(await recovered.count(), 1);
  assert.equal(await recovered.getByLabel('weak').isChecked(), true);
  assert.equal(await recovered.getByLabel('today').isChecked(), true);

  await page.locator('summary').click();
  await page.locator('#new-prompt').fill('   ');
  await page.getByRole('button', { name: 'Add prompt' }).click();
  const whitespaceManual = { count: await page.locator('.prompt-list > li').count(), status: await page.locator('#import-status').innerText(), focusedId: await page.evaluate(() => document.activeElement?.id || '') };
  assert.equal(whitespaceManual.count, 9);
  await page.locator('#new-prompt').fill('Recovery prompt');
  await page.locator('#new-answer').fill('Recovery answer');
  await page.getByRole('button', { name: 'Add prompt' }).click();
  await page.getByText('Prompt added and marked today.').waitFor();
  assert.equal(await page.locator('.prompt-list > li').count(), 10);

  await page.getByLabel('Plan name').fill('   ');
  await page.getByRole('button', { name: 'Save round plan' }).click();
  assert.equal(await page.locator('#import-status').innerText(), 'Enter a plan name, then save it.');
  assert.equal(await page.evaluate(() => document.activeElement?.id), 'plan-name');

  await page.getByRole('button', { name: 'Start this sample round' }).click();
  const prompts = [];
  for (let index = 0; index < 3; index++) {
    prompts.push(await page.locator('.prompt-sheet > p').innerText());
    await page.keyboard.press('Space');
    await page.getByText('Answer', { exact: true }).waitFor();
    await page.keyboard.press(index === 0 ? 'ArrowLeft' : 'ArrowRight');
  }
  await page.getByRole('heading', { name: '3 prompts practiced' }).waitFor();
  assert.deepEqual(prompts, ['Explain why seasons occur.', 'What does a pure function avoid?', 'Use “serendipity” in a sentence.']);
  await page.getByRole('button', { name: 'Build another round' }).click();
  assert.match(await page.locator('.round-note').innerText(), /Last round: 3 prompts · 1 marked again/);

  await page.getByRole('button', { name: 'Show weak prompts' }).click();
  await page.getByLabel('Prompt count').selectOption('12');
  const weakAvailable = Number(await page.locator('.selection-note b').innerText());
  await page.getByRole('button', { name: 'Start mixed round' }).click();
  await page.getByText(/Live round · 1 of \d+/).waitFor();
  const liveRoundLabel = await page.locator('.drawing-label').filter({ hasText: 'Live round' }).innerText();
  const queued = Number(liveRoundLabel.match(/of (\d+)/i)?.[1]);
  assert(Number.isFinite(queued), `Could not parse queue length from: ${liveRoundLabel}`);
  assert.equal(queued, weakAvailable);
  await page.getByRole('button', { name: 'Stop round' }).click();

  const crossOrigin = requests.filter(item => new URL(item.url).origin !== base);
  assert.deepEqual(crossOrigin, []);
  assert.deepEqual(consoleErrors, []);
  assert.deepEqual(pageErrors, []);
  report.demoFlow = { invalidResults, recoveryImportCount: 9, recoveryManualCount: 10, whitespaceManual, fixedRoundPrompts: prompts, weakAvailable, liveRoundLabel, queued, requestCount: requests.length, crossOrigin, consoleErrors, pageErrors };
  await context.close();
}

{
  const context = await browser.newContext();
  const page = await context.newPage();
  const hrefs = new Set();
  for (const path of ['/', '/demo', '/privacy', '/terms']) {
    await page.goto(`${base}${path}`, { waitUntil: 'networkidle' });
    for (const href of await page.locator('a[href]').evaluateAll(nodes => nodes.map(node => node.href))) hrefs.add(href);
  }
  const api = await playwrightRequest.newContext();
  for (const href of [...hrefs].sort()) {
    if (href.startsWith('mailto:')) { report.links.push({ href, status: 'mailto' }); continue; }
    const response = await api.get(href, { maxRedirects: 0, failOnStatusCode: false });
    const location = response.headers().location;
    report.links.push({ href, status: response.status(), locationOrigin: location ? new URL(location).origin : null });
  }
  await api.dispose();
  await context.close();
}

await browser.close();
console.log(JSON.stringify(report, null, 2));
