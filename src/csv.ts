import { tags, type PromptItem, type Tag } from './types';

function parseCsvRecords(input: string): string[][] {
  const records: string[][] = [];
  let fields: string[] = [];
  let value = '';
  let quoted = false;
  let recordHasContent = false;

  const finishRecord = () => {
    fields.push(value.trim());
    if (recordHasContent) records.push(fields);
    fields = [];
    value = '';
    recordHasContent = false;
  };

  for (let index = 0; index < input.length; index++) {
    const char = input[index];
    if (quoted) {
      if (char === '"' && input[index + 1] === '"') { value += '"'; index++; }
      else if (char === '"') quoted = false;
      else value += char;
      continue;
    }
    if (char === '"') { quoted = true; recordHasContent = true; }
    else if (char === ',') { fields.push(value.trim()); value = ''; recordHasContent = true; }
    else if (char === '\n' || char === '\r') {
      finishRecord();
      if (char === '\r' && input[index + 1] === '\n') index++;
    } else {
      value += char;
      if (!/\s/.test(char)) recordHasContent = true;
    }
  }
  if (quoted) throw new Error('A quoted field is not closed. Fix the CSV and try again.');
  if (recordHasContent || fields.length) finishRecord();
  return records;
}

export function parseCsvLine(line: string): string[] {
  return parseCsvRecords(line)[0] || [''];
}

export function parseCsv(text: string, source: PromptItem['source'] = 'csv'): PromptItem[] {
  const records = parseCsvRecords(text.replace(/^\uFEFF/, ''));
  if (!records.length) throw new Error('The CSV is empty. Add a prompt column and try again.');
  const first = records[0].map(value => value.toLowerCase());
  const hasHeader = first.some(value => ['prompt', 'front', 'question'].includes(value));
  const promptIndex = hasHeader ? first.findIndex(value => ['prompt', 'front', 'question'].includes(value)) : 0;
  const answerIndex = hasHeader ? first.findIndex(value => ['answer', 'back', 'response'].includes(value)) : 1;
  const tagsIndex = hasHeader ? first.findIndex(value => value === 'tags') : 2;
  const data = hasHeader ? records.slice(1) : records;
  const now = Date.now();
  const result = data.map((cells, index) => {
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
