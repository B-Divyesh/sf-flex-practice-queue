import type { PromptItem } from './types';

const rows: Array<[string, string, PromptItem['tags']]> = [
  ['Explain why seasons occur.', 'Earth’s axial tilt changes the angle and length of sunlight through the year.', ['weak', 'today']],
  ['What does a pure function avoid?', 'It avoids side effects and returns the same result for the same inputs.', ['warm-up']],
  ['Use “serendipity” in a sentence.', 'We found the quiet garden by serendipity while taking a wrong turn.', ['today']],
  ['Differentiate x² sin x.', '2x sin x + x² cos x.', ['weak']],
  ['Name the three branches of the US federal government.', 'Legislative, executive, and judicial.', ['warm-up']],
  ['Why does salt lower water’s freezing point?', 'Dissolved ions disrupt formation of the ordered ice lattice.', ['weak', 'today']],
  ['Translate “I would like some water” into Spanish.', 'Quisiera un poco de agua.', ['warm-up']],
  ['What is opportunity cost?', 'The value of the best alternative you give up.', ['today']]
];

export const samplePrompts = (): PromptItem[] => rows.map((row, index) => ({
  id: `sample-${index + 1}`,
  prompt: row[0], answer: row[1], tags: row[2], source: 'sample', createdAt: 1_700_000_000_000 + index
}));
