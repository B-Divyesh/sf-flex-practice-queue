import type { PromptItem, RoundRecord } from './types';

const open = (demo: boolean): Promise<IDBDatabase> => new Promise((resolve, reject) => {
  const request = indexedDB.open(demo ? 'demo:flex-practice-queue' : 'flex-practice-queue', 1);
  request.onupgradeneeded = () => {
    request.result.createObjectStore('prompts', { keyPath: 'id' });
    request.result.createObjectStore('rounds', { keyPath: 'id' });
  };
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error);
});

const all = <T>(db: IDBDatabase, store: string): Promise<T[]> => new Promise((resolve, reject) => {
  const request = db.transaction(store).objectStore(store).getAll();
  request.onsuccess = () => resolve(request.result as T[]);
  request.onerror = () => reject(request.error);
});

const putMany = (db: IDBDatabase, store: string, values: unknown[]): Promise<void> => new Promise((resolve, reject) => {
  const tx = db.transaction(store, 'readwrite');
  values.forEach(value => tx.objectStore(store).put(value));
  tx.oncomplete = () => resolve();
  tx.onerror = () => reject(tx.error);
});

export class PracticeStore {
  private constructor(private db: IDBDatabase, readonly demo: boolean) {}

  static async create(demo: boolean) { return new PracticeStore(await open(demo), demo); }
  prompts() { return all<PromptItem>(this.db, 'prompts'); }
  rounds() { return all<RoundRecord>(this.db, 'rounds'); }
  savePrompts(values: PromptItem[]) { return putMany(this.db, 'prompts', values); }
  saveRound(value: RoundRecord) { return putMany(this.db, 'rounds', [value]); }
  deletePrompt(id: string): Promise<void> { return new Promise((resolve, reject) => {
    const tx = this.db.transaction('prompts', 'readwrite');
    tx.objectStore('prompts').delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  }); }
  clear(store: 'prompts' | 'rounds'): Promise<void> { return new Promise((resolve, reject) => {
    const tx = this.db.transaction(store, 'readwrite');
    tx.objectStore(store).clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  }); }
  close() { this.db.close(); }
}

export const deleteDemo = () => new Promise<void>((resolve, reject) => {
  localStorage.removeItem('demo:fpq:plans');
  localStorage.removeItem('demo:fpq:seeded');
  const request = indexedDB.deleteDatabase('demo:flex-practice-queue');
  request.onsuccess = () => resolve();
  request.onerror = () => reject(request.error);
  request.onblocked = () => resolve();
});
