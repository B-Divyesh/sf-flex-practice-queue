import { tags, type PromptItem, type Tag } from './types';

export function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let value = '';
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"' && quoted && line[i + 1] === '"') { value += '"'; i++; }
    else if (char === '"') quoted = !quoted;
    else if (char === ',' && !quoted) { fields.push(value.trim()); value = ''; }
    else value += char;
  }
  if (quoted) throw new Error('A quoted field is not closed. Fix the CSV and try again.');
  fields.push(value.trim());
  return fields;
}

export function parseCsv(text: string, source: PromptItem['source'] = 'csv'): PromptItem[] {
  const lines = text.replace(/^\uFEFF/, '').split(/\r?\n/).filter(line => line.trim());
  if (!lines.length) throw new Error('The CSV is empty. Add a prompt column and try again.');
  const first = parseCsvLine(lines[0]).map(value => value.toLowerCase());
  const hasHeader = first.some(value => ['prompt', 'front', 'question'].includes(value));
  const promptIndex = hasHeader ? first.findIndex(value => ['prompt', 'front', 'question'].includes(value)) : 0;
  const answerIndex = hasHeader ? first.findIndex(value => ['answer', 'back', 'response'].includes(value)) : 1;
  const tagsIndex = hasHeader ? first.findIndex(value => value === 'tags') : 2;
  const data = hasHeader ? lines.slice(1) : lines;
  const now = Date.now();
  const result = data.map((line, index) => {
    const cells = parseCsvLine(line);
    const prompt = cells[promptIndex]?.trim();
    if (!prompt) throw new Error(`Row ${index + (hasHeader ? 2 : 1)} has no prompt. Add one and try again.`);
    const importedTags = (cells[tagsIndex] || '').split(/[; ]+/).filter(value => tags.includes(value as Tag)) as Tag[];
    return { id: crypto.randomUUID(), prompt, answer: cells[answerIndex]?.trim() || '', tags: importedTags, source, createdAt: now + index } satisfies PromptItem;
  });
  if (!result.length) throw new Error('The CSV has headings but no prompts. Add a row and try again.');
  return result;
}

const quote = (value: string) => `"${value.replaceAll('"', '""')}"`;
export const toCsv = (items: PromptItem[]) => ['prompt,answer,tags', ...items.map(item => [item.prompt, item.answer, item.tags.join(';')].map(quote).join(','))].join('\n');
