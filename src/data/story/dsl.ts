/**
 * 编写剧情用的小工具函数，让章节文件读起来更像「剧本」而不是一堆对象字面量。
 *
 *   effects: [stat('hp', -10), give('healing_pill'), setFlag('met_su')]
 *   requires: all(hasItem('jade_pendant'), realmAtLeast(1))
 */
import type { CheckModifier, Condition, Effect, FlagValue, StatKey } from '@/engine/types';

// ---- 效果 -----------------------------------------------------------------

export const stat = (s: StatKey, delta: number): Effect => ({ type: 'stat', stat: s, delta });
export const cultivate = (amount: number): Effect => ({ type: 'cultivate', amount });
export const breakthrough = (): Effect => ({ type: 'breakthrough' });
export const give = (item: string, count = 1): Effect => ({ type: 'item', item, delta: count });
export const take = (item: string, count = 1): Effect => ({ type: 'item', item, delta: -count });
export const setFlag = (flag: string, value: FlagValue = true): Effect => ({ type: 'flag', flag, value });
export const days = (n: number): Effect => ({ type: 'passDays', days: n });
export const log = (text: string): Effect => ({ type: 'log', text });

// ---- 条件 -----------------------------------------------------------------

export const statAtLeast = (s: StatKey, gte: number): Condition => ({ type: 'stat', stat: s, gte });
export const statAtMost = (s: StatKey, lte: number): Condition => ({ type: 'stat', stat: s, lte });
export const realmAtLeast = (gte: number): Condition => ({ type: 'realm', gte });
export const realmIs = (r: number): Condition => ({ type: 'realm', gte: r, lte: r });
export const hasItem = (item: string, count = 1): Condition => ({ type: 'item', item, count });
export const flag = (name: string, equals?: FlagValue): Condition => ({ type: 'flag', flag: name, equals });
export const dayAtLeast = (gte: number): Condition => ({ type: 'day', gte });
export const visited = (scene: string, times = 1): Condition => ({ type: 'visited', scene, times });
export const canBreak = (): Condition => ({ type: 'canBreakthrough' });
export const all = (...of: Condition[]): Condition => ({ type: 'all', of });
export const any = (...of: Condition[]): Condition => ({ type: 'any', of });
export const not = (cond: Condition): Condition => ({ type: 'not', cond });

// ---- 检定加成 ---------------------------------------------------------------

export const bonus = (when: Condition, amount: number, label?: string): CheckModifier => ({ when, amount, label });

/** 常用：兵器加成 */
export const WEAPON_BONUS: CheckModifier[] = [
  bonus(all(hasItem('iron_sword'), not(hasItem('azure_sword'))), 1, '铁剑 +1'),
  bonus(hasItem('azure_sword'), 3, '青锋剑 +3'),
];

/** 常用：条件段落 */
export const when = (cond: Condition, text: string) => ({ text, when: cond });
