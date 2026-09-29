import type { GameData } from './data';
import type { Condition, GameState } from './types';

function inRange(value: number, gte?: number, lte?: number): boolean {
  if (gte !== undefined && value < gte) return false;
  if (lte !== undefined && value > lte) return false;
  return true;
}

export function canBreakthrough(state: GameState, data: GameData): boolean {
  const realm = data.realms[state.realm];
  return !!realm && state.realm < data.realms.length - 1 && state.stats.cultivation >= realm.toNext;
}

export function evaluate(cond: Condition | undefined, state: GameState, data: GameData): boolean {
  if (!cond) return true;
  switch (cond.type) {
    case 'stat':
      return inRange(state.stats[cond.stat], cond.gte, cond.lte);
    case 'realm':
      return inRange(state.realm, cond.gte, cond.lte);
    case 'item':
      return (state.inventory[cond.item] ?? 0) >= (cond.count ?? 1);
    case 'flag': {
      const v = state.flags[cond.flag];
      return cond.equals === undefined ? !!v : v === cond.equals;
    }
    case 'day':
      return inRange(state.day, cond.gte, cond.lte);
    case 'visited':
      return (state.visited[cond.scene] ?? 0) >= (cond.times ?? 1);
    case 'canBreakthrough':
      return canBreakthrough(state, data);
    case 'all':
      return cond.of.every((c) => evaluate(c, state, data));
    case 'any':
      return cond.of.some((c) => evaluate(c, state, data));
    case 'not':
      return !evaluate(cond.cond, state, data);
  }
}
