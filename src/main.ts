import './style.css';
import { PracticeStore, deleteDemo } from './db';
import { parseCsv, toCsv } from './csv';
import { samplePrompts } from './sample';
import { tags, type PromptItem, type RoundPlan, type RoundRecord, type Tag } from './types';
import { captureLicense, checkoutUrl, hasLicense, hasSavedLicense, saveLicense, verifyLicense } from './license';

const app = document.querySelector<HTMLDivElement>('#app')!;
const buildId = 'v1.0.0';
let activePractice: PracticeApp | undefined;

const escapeHtml = (value: string) => value.replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]!);
const pathTitle: Record<string, string> = {
  '/': 'Flex Practice Queue — Build short practice rounds',
  '/demo': 'Demo — Flex Practice Queue',
  '/privacy': 'Privacy — Flex Practice Queue',
  '/terms': 'Terms — Flex Practice Queue',
};

function shell(content: string, demo = false): string {
  return `
    <a class="skip-link" href="#main">Skip to main content</a>
    ${demo ? `<aside class="demo-banner" aria-label="Demo mode"><span><strong>Demo</strong> — sample data, nothing is saved</span><span><button class="text-button" id="reset-demo">Reset demo</button><button class="text-button" id="leave-demo">Start for real</button></span></aside>` : ''}
    <header class="site-header"><a class="wordmark route-link" href="/" aria-label="Flex Practice Queue home"><svg aria-hidden="true" viewBox="0 0 40 40"><path d="M5 5h30v30H5zM11 20h18M20 11v18"/></svg><span>Flex Practice<br><b>Queue</b></span></a><nav aria-label="Main navigation"><a class="route-link" href="/demo">Demo</a><a href="${location.pathname === '/' ? '#how' : '/#how'}">How it works</a><a class="route-link" href="/privacy">Privacy</a></nav></header>
    <main id="main" tabindex="-1">${content}</main>
    <footer><p><strong>Flex Practice Queue</strong> — optional practice beside your scheduler.</p><nav aria-label="Footer navigation"><a class="route-link" href="/privacy">Privacy</a><a class="route-link" href="/terms">Terms</a><a href="https://sociobot.in" rel="external">Built by Param Factory <span class="visually-hidden">(external site)</span></a></nav><p>${buildId} · Original generated artwork</p></footer>
    <div class="route-status visually-hidden" aria-live="polite"></div>
    <div id="toast" class="toast" role="status" aria-live="polite" hidden></div>`;
}

function landing(): string {
  return shell(`
    <section class="hero blueprint-grid">
      <div class="hero-copy"><p class="drawing-label">Drawing 01 · optional rehearsal lane</p><h1>Build a useful practice round</h1><p class="lede">For learners with spare minutes who want extra practice without changing a formal card schedule.</p>
        <div class="hero-action"><a class="button primary route-link" href="/demo">Try it with sample data</a><span>Loads 8 prompts in a separate demo.</span></div>
        <ul class="plain-facts" aria-label="Product facts"><li>Works offline after the first visit.</li><li>Your study data stays in this browser.</li><li>Core tools are free. Saved round plans cost $9 once.</li></ul>
      </div>
      <figure class="hero-art"><img src="/art/blueprint-practice.webp" width="1536" height="1024" alt="Prompt cards arranged around a practice timer on blueprint paper." fetchpriority="high" decoding="async"><figcaption>Pull a small rehearsal lane from the cards you already use.</figcaption></figure>
    </section>
    <section class="workbench" aria-labelledby="workspace-heading"><div class="section-heading"><p class="drawing-label">Drawing 02 · your local workbench</p><h2 id="workspace-heading">Build a round from your prompts</h2><p>Import a CSV or add one prompt. Your imported file is only read.</p></div><div id="practice-app" class="practice-app" aria-live="polite"><p class="loading-state">Opening your local queue…</p></div></section>
    <section id="how" class="how-section blueprint-grid" aria-labelledby="how-heading"><p class="drawing-label">Assembly notes</p><h2 id="how-heading">How optional practice works</h2><ol><li><b>Import prompts.</b><span>Use a CSV from your card tool. Nothing writes back.</span></li><li><b>Mark your intent.</b><span>Tag warm-up, weak, or today. Pick any mix.</span></li><li><b>Run the round.</b><span>Reveal answers at your pace. Stop when your window closes.</span></li></ol></section>
    <section class="boundary-section" aria-labelledby="boundary-heading"><div><p class="drawing-label">Scope boundary</p><h2 id="boundary-heading">Keeps your scheduler out of it</h2></div><div><p>This queue does not calculate due dates or rate source cards. It stores prompts and round notes in this browser.</p><p>Export your prompts whenever you want. Delete them from this device when needed.</p></div></section>
    ${pricingSection()}
  `);
}

function pricingSection(): string {
  return `<section class="price-section" aria-labelledby="price-heading"><div><p class="drawing-label">Optional paid tool</p><h2 id="price-heading">Save round plans for $9 once</h2><p>Import, tag, practice, and export stay free. A license adds named round plans for repeated routines.</p><a class="button primary" href="${checkoutUrl}">Buy a $9 license</a><p class="fine-print">Sociobot/Dodo is the merchant of record. Refunds are handled there.</p></div><form id="license-form" class="license-form"><label for="license-token">Have a license? Paste it</label><div><input id="license-token" name="license" autocomplete="off" required><button class="button secondary" type="submit">Verify license</button></div><p id="license-status" class="form-status" role="status">${hasLicense() ? 'License active.' : 'No license is saved.'}</p></form></section>`;
}

function legalPage(kind: 'privacy' | 'terms'): string {
  const privacy = kind === 'privacy';
  return shell(`<article class="legal blueprint-grid"><p class="drawing-label">Policy sheet · updated 28 August 2026</p><h1>${privacy ? 'Your practice data stays local' : 'Terms for using this practice tool'}</h1>
  ${privacy ? `<h2>Data on your device</h2><p>Prompts, tags, rounds, plans, and your license token stay in browser storage on this device. Flex Practice Queue has no account system or analytics.</p><h2>CSV files</h2><p>The app reads the CSV you choose. It does not change that file or contact your card tool.</p><h2>License checks</h2><p>If you save a paid license, the app sends that token to the Sociobot billing API at most once each day. No prompt content is sent.</p><h2>Delete or export</h2><p>Use the workbench to export prompts or erase local practice data. Clearing browser storage also removes it.</p>` : `<h2>Use of the app</h2><p>You may use the app for personal or commercial study. Keep an exported copy of prompts you cannot replace.</p><h2>One-time license</h2><p>The $9 license adds named round plans. Sociobot/Dodo processes payment as merchant of record. A refund revokes the license.</p><h2>No learning guarantee</h2><p>The app helps you choose optional practice. It does not promise a test score or replace your source-card scheduler.</p><h2>Changes and support</h2><p>We may improve these terms with a new date above. Contact <a href="mailto:support@sociobot.in">support@sociobot.in</a> for billing or product help.</p>`}</article>`);
}

function notFound(): string {
  return shell(`<section class="not-found blueprint-grid"><p class="drawing-label">Drawing not found · 404</p><h1>This practice sheet is missing</h1><p>The address does not point to a page in this app.</p><a class="button primary route-link" href="/">Return to the workbench</a></section>`);
}

function demoPage(): string {
  return shell(`<section class="demo-head blueprint-grid"><p class="drawing-label">Demo drawing · isolated workspace</p><h1>Try a mixed practice round</h1><p>Eight sample prompts are ready. Pick a tag, start a round, and reveal an answer.</p></section><section class="workbench demo-workbench" aria-label="Sample practice queue"><div id="practice-app" class="practice-app"><p class="loading-state">Loading sample prompts…</p></div></section>`, true);
}

function download(name: string, content: string, type = 'text/csv') {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([content], { type }));
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

const shuffle = <T,>(values: T[]): T[] => {
  const copy = [...values];
  for (let i = copy.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [copy[i], copy[j]] = [copy[j], copy[i]]; }
  return copy;
};

class PracticeApp {
  private store!: PracticeStore;
  private items: PromptItem[] = [];
  private rounds: RoundRecord[] = [];
  private plans: RoundPlan[] = [];
  private filter: Tag | 'all' = 'all';
  private count = 5;
  private seconds = 30;
  private queue: PromptItem[] = [];
  private current = 0;
  private again = 0;
  private revealed = false;
  private remaining = 30;
  private timer?: number;
  private startedAt = 0;

  constructor(private root: HTMLElement, private demo: boolean) {}
  async init() {
    this.store = await PracticeStore.create(this.demo);
    this.items = await this.store.prompts();
    if (this.demo && !localStorage.getItem('demo:fpq:seeded')) {
      await this.store.savePrompts(samplePrompts());
      localStorage.setItem('demo:fpq:seeded', '1');
      this.items = await this.store.prompts();
    }
    this.rounds = await this.store.rounds();
    this.plans = this.loadPlans();
    this.render();
  }
  destroy() { clearInterval(this.timer); this.store?.close(); }
  private filtered() { return this.filter === 'all' ? this.items : this.items.filter(item => item.tags.includes(this.filter as Tag)); }
  private get planKey() { return this.demo ? 'demo:fpq:plans' : 'fpq:plans'; }
  private get canSavePlans() { return this.demo || hasLicense(); }
  private loadPlans(): RoundPlan[] {
    try { return JSON.parse(localStorage.getItem(this.planKey) || '[]') as RoundPlan[]; }
    catch { return []; }
  }
  private persistPlans() { localStorage.setItem(this.planKey, JSON.stringify(this.plans)); }
  private render() {
    this.root.onkeydown = null;
    if (this.queue.length && this.current < this.queue.length) return this.renderRound();
    const filteredCount = this.filtered().length;
    this.root.innerHTML = `<div class="builder-panel">
      <section class="import-zone" aria-labelledby="import-heading"><div><span class="step-number">01</span><h3 id="import-heading">Add prompts</h3></div>
        <label class="file-button" for="csv-file">Import CSV</label><input class="visually-hidden" id="csv-file" type="file" accept=".csv,text/csv"><p>Columns: <code>prompt, answer, tags</code>. Anki front/back CSV also works.</p>
        <details><summary>Add one prompt</summary><form id="prompt-form"><label for="new-prompt">Prompt</label><textarea id="new-prompt" required rows="2"></textarea><label for="new-answer">Answer</label><textarea id="new-answer" rows="2"></textarea><button class="button secondary" type="submit" aria-label="Add prompt">Add prompt</button></form></details><p id="import-status" class="form-status" role="status"></p>
      </section>
      <section class="round-builder" aria-labelledby="round-heading"><div><span class="step-number">02</span><h3 id="round-heading">Choose the mix</h3></div>
        <fieldset><legend>Use prompts tagged</legend><div class="segmented">${(['all', ...tags] as const).map(tag => `<button type="button" data-filter="${tag}" aria-pressed="${this.filter === tag}">${tag === 'all' ? 'Any tag' : tag}</button>`).join('')}</div></fieldset>
        <div class="settings-row"><label>Prompt count<select id="round-count">${[3, 5, 8, 12].map(n => `<option ${this.count === n ? 'selected' : ''}>${n}</option>`).join('')}</select></label><label>Seconds each<select id="round-seconds">${[15, 30, 60, 120].map(n => `<option ${this.seconds === n ? 'selected' : ''}>${n}</option>`).join('')}</select></label></div>
        <p class="selection-note"><b>${filteredCount}</b> ${filteredCount === 1 ? 'prompt' : 'prompts'} fit this mix.</p>
        ${this.canSavePlans ? `<label class="plan-name" for="plan-name">Plan name<input id="plan-name" maxlength="40" placeholder="Morning weak cards"></label>` : ''}
        <div class="builder-actions"><button id="start-round" class="button primary" ${filteredCount ? '' : 'disabled'}>Start mixed round</button><button id="save-plan" class="button secondary">${this.canSavePlans ? 'Save round plan' : 'Save plan · paid'}</button></div>
      </section>
    </div>
    <section class="library" aria-labelledby="library-heading"><div class="library-head"><div><span class="step-number">03</span><h3 id="library-heading">Prompt queue <span>${this.items.length}</span></h3></div><div class="library-actions"><button id="export-csv" class="text-button" ${this.items.length ? '' : 'disabled'}>Export CSV</button><button id="clear-data" class="text-button danger" ${this.items.length ? '' : 'disabled'}>Delete local data</button></div></div>
      ${this.items.length ? `<ol class="prompt-list">${this.items.map(item => `<li data-id="${item.id}"><div class="prompt-copy"><b>${escapeHtml(item.prompt)}</b><span>${escapeHtml(item.answer || 'No answer supplied')}</span></div><fieldset><legend class="visually-hidden">Tags for ${escapeHtml(item.prompt)}</legend>${tags.map(tag => `<label class="tag ${tag}"><input type="checkbox" data-tag="${tag}" ${item.tags.includes(tag) ? 'checked' : ''}><span>${tag}</span></label>`).join('')}</fieldset><button class="icon-button delete-prompt" aria-label="Delete ${escapeHtml(item.prompt)}">×</button></li>`).join('')}</ol>` : `<div class="empty-state"><div class="empty-dial" aria-hidden="true">0</div><div><h4>Your queue is empty</h4><p>Import a CSV or add one prompt. Your tagged prompts will appear here.</p>${!this.demo ? '<a class="route-link" href="/demo">See the sample queue</a>' : ''}</div></div>`}
      ${this.plans.length ? `<section class="saved-plans" aria-labelledby="plans-heading"><h4 id="plans-heading">Saved round plans</h4><ul>${this.plans.map(plan => `<li data-plan="${plan.id}"><span><b>${escapeHtml(plan.name)}</b><small>${plan.filter === 'all' ? 'Any tag' : plan.filter} · ${plan.count} prompts · ${plan.seconds} seconds</small></span><button class="text-button use-plan">Use plan</button><button class="icon-button delete-plan" aria-label="Delete ${escapeHtml(plan.name)}">×</button></li>`).join('')}</ul></section>` : ''}
      ${this.rounds.length ? `<p class="round-note">Last round: ${this.rounds.at(-1)?.count} prompts · ${this.rounds.at(-1)?.again} marked again</p>` : ''}
    </section>`;
    this.bindBuilder();
  }
  private bindBuilder() {
    this.root.querySelector<HTMLInputElement>('#csv-file')?.addEventListener('change', async event => {
      const file = (event.currentTarget as HTMLInputElement).files?.[0];
      if (!file) return;
      try { const rows = parseCsv(await file.text()); await this.store.savePrompts(rows); this.items.push(...rows); this.render(); this.status(`${rows.length} prompts imported. The source file was not changed.`); }
      catch (error) { this.status(error instanceof Error ? error.message : 'The CSV could not be read. Check it and try again.', true); }
    });
    this.root.querySelector<HTMLFormElement>('#prompt-form')?.addEventListener('submit', async event => {
      event.preventDefault(); const prompt = this.root.querySelector<HTMLTextAreaElement>('#new-prompt')!.value.trim(); const answer = this.root.querySelector<HTMLTextAreaElement>('#new-answer')!.value.trim();
      if (!prompt) return;
      const item: PromptItem = { id: crypto.randomUUID(), prompt, answer, tags: ['today'], source: 'manual', createdAt: Date.now() };
      await this.store.savePrompts([item]); this.items.push(item); this.render(); this.status('Prompt added and marked today.');
    });
    this.root.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach(button => button.addEventListener('click', () => { this.filter = button.dataset.filter as Tag | 'all'; this.render(); }));
    this.root.querySelector<HTMLSelectElement>('#round-count')?.addEventListener('change', event => { this.count = Number((event.target as HTMLSelectElement).value); });
    this.root.querySelector<HTMLSelectElement>('#round-seconds')?.addEventListener('change', event => { this.seconds = Number((event.target as HTMLSelectElement).value); });
    this.root.querySelector('#start-round')?.addEventListener('click', () => this.startRound());
    this.root.querySelector('#export-csv')?.addEventListener('click', () => download('flex-practice-prompts.csv', toCsv(this.items)));
    this.root.querySelector('#clear-data')?.addEventListener('click', async () => { if (confirm(`Delete ${this.items.length} prompts, saved plans, and all round notes from this browser?`)) { await this.store.clear('prompts'); await this.store.clear('rounds'); localStorage.removeItem(this.planKey); this.items = []; this.rounds = []; this.plans = []; this.render(); } });
    this.root.querySelectorAll<HTMLInputElement>('[data-tag]').forEach(input => input.addEventListener('change', async () => { const id = input.closest<HTMLLIElement>('li')!.dataset.id!; const item = this.items.find(row => row.id === id)!; const tag = input.dataset.tag as Tag; item.tags = input.checked ? [...new Set([...item.tags, tag])] : item.tags.filter(value => value !== tag); await this.store.savePrompts([item]); }));
    this.root.querySelectorAll<HTMLButtonElement>('.delete-prompt').forEach(button => button.addEventListener('click', async () => { const id = button.closest<HTMLLIElement>('li')!.dataset.id!; await this.store.deletePrompt(id); this.items = this.items.filter(item => item.id !== id); this.render(); }));
    this.root.querySelector('#save-plan')?.addEventListener('click', () => this.savePlan());
    this.root.querySelectorAll<HTMLButtonElement>('.use-plan').forEach(button => button.addEventListener('click', () => {
      const plan = this.plans.find(value => value.id === button.closest<HTMLLIElement>('li')?.dataset.plan);
      if (!plan) return;
      this.filter = plan.filter; this.count = plan.count; this.seconds = plan.seconds; this.render(); toast(`Loaded “${plan.name}”.`);
    }));
    this.root.querySelectorAll<HTMLButtonElement>('.delete-plan').forEach(button => button.addEventListener('click', () => {
      const id = button.closest<HTMLLIElement>('li')?.dataset.plan;
      this.plans = this.plans.filter(value => value.id !== id); this.persistPlans(); this.render();
    }));
  }
  private status(message: string, error = false) { const status = this.root.querySelector<HTMLElement>('#import-status'); if (status) { status.textContent = message; status.classList.toggle('error', error); } }
  private savePlan() {
    if (!this.canSavePlans) { document.querySelector('#price-heading')?.scrollIntoView({ behavior: 'smooth' }); toast('A $9 license adds saved round plans.'); return; }
    const input = this.root.querySelector<HTMLInputElement>('#plan-name');
    const name = input?.value.trim();
    if (!name) { input?.focus(); this.status('Enter a plan name, then save it.', true); return; }
    this.plans.push({ id: crypto.randomUUID(), name, filter: this.filter, count: this.count, seconds: this.seconds });
    this.persistPlans(); this.render(); toast(`Saved “${name}”.`);
  }
  private startRound() {
    const choices = this.filtered(); if (!choices.length) return;
    this.queue = shuffle(choices).slice(0, this.count); this.current = 0; this.again = 0; this.startedAt = Date.now(); this.remaining = this.seconds; this.revealed = false; this.renderRound(); this.startTimer();
  }
  private startTimer() { clearInterval(this.timer); this.timer = window.setInterval(() => { this.remaining--; const output = this.root.querySelector('#time-left'); if (output) output.textContent = String(Math.max(0, this.remaining)); const dial = this.root.querySelector<HTMLElement>('.timer-dial'); if (dial) dial.style.setProperty('--progress', `${(this.remaining / this.seconds) * 360}deg`); if (this.remaining <= 0) { clearInterval(this.timer); this.revealed = true; this.renderRound(); } }, 1000); }
  private renderRound() {
    const item = this.queue[this.current];
    this.root.innerHTML = `<section class="round-screen" aria-labelledby="round-live-heading"><div class="round-top"><div><p class="drawing-label">Live round · ${this.current + 1} of ${this.queue.length}</p><h3 id="round-live-heading" tabindex="-1">${this.revealed ? 'Check the answer' : 'Recall the answer'}</h3></div><button id="stop-round" class="text-button">Stop round</button></div><div class="round-stage"><div class="timer-dial" style="--progress:${(this.remaining / this.seconds) * 360}deg"><span id="time-left">${this.remaining}</span><small>seconds</small></div><article class="prompt-sheet"><p>${escapeHtml(item.prompt)}</p>${this.revealed ? `<div class="answer"><span>Answer</span><p>${escapeHtml(item.answer || 'No answer was supplied for this prompt.')}</p></div>` : `<button id="reveal-answer" class="button primary">Reveal answer <kbd>Space</kbd></button>`}</article></div>${this.revealed ? `<div class="rating-actions"><button id="again" class="button secondary">Try again <kbd>←</kbd></button><button id="got-it" class="button primary">Got it <kbd>→</kbd></button></div>` : ''}<p class="keyboard-note">Keyboard: Space reveals · arrows rate the answer</p></section>`;
    this.root.querySelector('#reveal-answer')?.addEventListener('click', () => { this.revealed = true; clearInterval(this.timer); this.renderRound(); });
    this.root.querySelector('#again')?.addEventListener('click', () => this.next(true));
    this.root.querySelector('#got-it')?.addEventListener('click', () => this.next(false));
    this.root.querySelector('#stop-round')?.addEventListener('click', () => this.finishRound());
    this.root.onkeydown = event => { if (event.code === 'Space' && !this.revealed) { event.preventDefault(); this.revealed = true; clearInterval(this.timer); this.renderRound(); } else if (this.revealed && event.key === 'ArrowRight') this.next(false); else if (this.revealed && event.key === 'ArrowLeft') this.next(true); };
    this.root.querySelector<HTMLElement>('#round-live-heading')?.focus();
  }
  private next(markAgain: boolean) { if (markAgain) this.again++; this.current++; if (this.current >= this.queue.length) this.finishRound(); else { this.remaining = this.seconds; this.revealed = false; this.renderRound(); this.startTimer(); } }
  private async finishRound() {
    clearInterval(this.timer); this.root.onkeydown = null; const completed = Math.min(this.current + 1, this.queue.length); const record: RoundRecord = { id: crypto.randomUUID(), finishedAt: Date.now(), count: completed, again: this.again, seconds: Math.round((Date.now() - this.startedAt) / 1000) }; await this.store.saveRound(record); this.rounds.push(record); this.queue = []; this.current = 0;
    this.root.innerHTML = `<section class="round-result"><p class="drawing-label">Round complete</p><h3>${completed} prompts practiced</h3><div class="result-measure"><span>${this.again}</span><small>marked “try again”</small></div><p>Your imported prompt data and source schedule were not changed.</p><button id="back-builder" class="button primary">Build another round</button></section>`;
    this.root.querySelector('#back-builder')?.addEventListener('click', () => this.render());
  }
}

function toast(message: string) { const node = document.querySelector<HTMLElement>('#toast'); if (!node) return; node.textContent = message; node.hidden = false; setTimeout(() => node.hidden = true, 4000); }

async function renderRoute(push = false) {
  activePractice?.destroy(); activePractice = undefined;
  const path = location.pathname.replace(/\/$/, '') || '/';
  document.title = pathTitle[path] || 'Page not found — Flex Practice Queue';
  document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href', `https://flex-practice-queue.sociobot.in${path}`);
  app.innerHTML = path === '/' ? landing() : path === '/demo' ? demoPage() : path === '/privacy' ? legalPage('privacy') : path === '/terms' ? legalPage('terms') : notFound();
  bindShell();
  const target = app.querySelector<HTMLElement>('#practice-app');
  if (target) {
    activePractice = new PracticeApp(target, path === '/demo');
    try { await activePractice.init(); }
    catch { target.innerHTML = `<section class="error-state" role="alert"><h3>Your local queue did not open</h3><p>Browser storage may be blocked. Allow site data, then try again.</p><button class="button secondary" id="retry-store">Try opening the queue</button></section>`; target.querySelector('#retry-store')?.addEventListener('click', () => renderRoute()); }
  }
  if (push) { const heading = app.querySelector<HTMLElement>('h1'); heading?.setAttribute('tabindex', '-1'); heading?.focus(); app.querySelector('.route-status')!.textContent = document.title; scrollTo(0, 0); }
}

function bindShell() {
  app.querySelectorAll<HTMLAnchorElement>('a.route-link').forEach(link => link.addEventListener('click', event => { if (link.origin !== location.origin) return; event.preventDefault(); history.pushState({}, '', link.href); renderRoute(true); }));
  app.querySelector('#reset-demo')?.addEventListener('click', async () => { activePractice?.destroy(); await deleteDemo(); renderRoute(); toast('Demo reset to its original 8 prompts.'); });
  app.querySelector('#leave-demo')?.addEventListener('click', async () => { activePractice?.destroy(); await deleteDemo(); history.pushState({}, '', '/'); renderRoute(true); });
  app.querySelector<HTMLFormElement>('#license-form')?.addEventListener('submit', async event => { event.preventDefault(); const input = app.querySelector<HTMLInputElement>('#license-token')!; saveLicense(input.value); const status = app.querySelector<HTMLElement>('#license-status')!; status.textContent = 'Checking license…'; const verdict = await verifyLicense(true); status.textContent = verdict.message; });
}

const receivedLicense = captureLicense();
renderRoute().then(async () => {
  if (!receivedLicense && !hasSavedLicense()) return;
  const verdict = await verifyLicense(receivedLicense);
  if (verdict.valid) { await renderRoute(); toast('License active. Saved round plans are ready.'); }
});
addEventListener('popstate', () => renderRoute(true));
addEventListener('offline', () => toast('You are offline. Saved prompts and practice still work.'));
addEventListener('online', () => toast('Back online.'));

if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
  addEventListener('load', () => navigator.serviceWorker.register('/sw.js').then(registration => {
    registration.addEventListener('updatefound', () => { const worker = registration.installing; worker?.addEventListener('statechange', () => { if (worker.state === 'installed' && navigator.serviceWorker.controller) toast('An update is ready. Reload to use it.'); }); });
  }).catch(() => { /* the app remains usable without installation */ }));
}
