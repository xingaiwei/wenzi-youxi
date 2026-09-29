import type { GameData } from './data';
import type { Effect, GameState, StatKey } from './types';
import { canBreakthrough } from './conditions';

const JOURNAL_LIMIT = 200;

function clampStat(state: GameState, data: GameData, stat: StatKey, value: number): number {
  const bounds = data.statMeta[stat];
  let v = Math.max(bounds.min, value);
  if (bounds.max !== undefined) {
    const max = typeof bounds.max === 'number' ? bounds.max : state.stats[bounds.max];
    v = Math.min(max, v);
  }
  return Math.round(v);
}

function setStat(state: GameState, data: GameData, stat: StatKey, value: number): void {
  state.stats[stat] = clampStat(state, data, stat, value);
  // 气血上限变化后，重新约束气血
  if (stat === 'maxHp') state.stats.hp = clampStat(state, data, 'hp', state.stats.hp);
}

/** 修炼所得修为：悟性每点 +10% */
export function cultivationGain(state: GameState, amount: number): number {
  return Math.round(amount * (1 + state.stats.insight * 0.1));
}

export function addJournal(state: GameState, text: string): void {
  state.journal.push(`第${state.day}日　${text}`);
  if (state.journal.length > JOURNAL_LIMIT) state.journal.splice(0, state.journal.length - JOURNAL_LIMIT);
}

/** 就地修改 state（调用方负责先 clone） */
export function applyEffect(effect: Effect, state: GameState, data: GameData): void {
  switch (effect.type) {
    case 'stat':
      setStat(state, data, effect.stat, state.stats[effect.stat] + effect.delta);
      break;
    case 'setStat':
      setStat(state, data, effect.stat, effect.value);
      break;
    case 'cultivate':
      setStat(state, data, 'cultivation', state.stats.cultivation + cultivationGain(state, effect.amount));
      break;
    case 'breakthrough': {
      if (!canBreakthrough(state, data)) break;
      const cost = data.realms[state.realm].toNext;
      state.realm += 1;
      const next = data.realms[state.realm];
      setStat(state, data, 'cultivation', state.stats.cultivation - cost);
      setStat(state, data, 'maxHp', state.stats.maxHp + next.maxHpBonus);
      setStat(state, data, 'hp', state.stats.maxHp);
      addJournal(state, `突破至${next.name}境。`);
      break;
    }
    case 'item': {
      const count = Math.max(0, (state.inventory[effect.item] ?? 0) + effect.delta);
      if (count === 0) delete state.inventory[effect.item];
      else state.inventory[effect.item] = count;
      break;
    }
    case 'flag':
      state.flags[effect.flag] = effect.value;
      break;
    case 'passDays':
      state.day += effect.days;
      break;
    case 'log':
      addJournal(state, effect.text);
      break;
  }
}

export function applyEffects(effects: Effect[] | undefined, state: GameState, data: GameData): void {
  for (const e of effects ?? []) applyEffect(e, state, data);
}
