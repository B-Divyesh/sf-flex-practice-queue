export const tags = ['warm-up', 'weak', 'today'] as const;
export type Tag = typeof tags[number];

export interface PromptItem {
  id: string;
  prompt: string;
  answer: string;
  tags: Tag[];
  source: 'csv' | 'manual' | 'sample';
  createdAt: number;
}

export interface RoundRecord {
  id: string;
  finishedAt: number;
  count: number;
  again: number;
  seconds: number;
}

export interface RoundPlan {
  id: string;
  name: string;
  filter: Tag | 'all';
  count: number;
  seconds: number;
}
