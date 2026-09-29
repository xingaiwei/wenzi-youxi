import type { GameData } from './data';
import type { Check, GameState } from './types';
import { evaluate } from './conditions';

export interface CheckPreview {
  /** 成功率 0..1 */
  chance: number;
  /** 生效中的加成说明 */
  bonuses: string[];
}

const BASE = 0.5;
const PER_POINT = 0.12;
const MIN_CHANCE = 0.05;
const MAX_CHANCE = 0.95;

export function effectiveValue(check: Check, state: GameState, data: GameData): { value: number; bonuses: string[] } {
  let value = state.stats[check.stat];
  const bonuses: string[] = [];
  for (const m of check.modifiers ?? []) {
    if (evaluate(m.when, state, data)) {
      value += m.amount;
      if (m.label) bonuses.push(m.label);
    }
  }
  return { value, bonuses };
}

export function previewCheck(check: Check, state: GameState, data: GameData): CheckPreview {
  const { value, bonuses } = effectiveValue(check, state, data);
  const raw = BASE + (value - check.difficulty) * PER_POINT;
  return { chance: Math.min(MAX_CHANCE, Math.max(MIN_CHANCE, raw)), bonuses };
}
