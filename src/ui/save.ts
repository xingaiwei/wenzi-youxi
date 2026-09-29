import { SAVE_VERSION, type GameState } from '@/engine';

const KEY = 'wenzi-youxi:save';

/**
 * 存档读写。state 自带 version 字段，将来结构变化时在 migrate() 里做升级。
 */
export const SaveStore = {
  load(): GameState | null {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return null;
      return migrate(JSON.parse(raw));
    } catch {
      return null;
    }
  },
  save(state: GameState): void {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* 隐私模式等情况下忽略 */
    }
  },
  clear(): void {
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
  },
};

function migrate(data: unknown): GameState | null {
  if (!data || typeof data !== 'object') return null;
  const s = data as GameState;
  if (typeof s.version !== 'number' || s.version > SAVE_VERSION) return null;
  // 示例：if (s.version < 2) { ...; s.version = 2; }
  return s;
}
