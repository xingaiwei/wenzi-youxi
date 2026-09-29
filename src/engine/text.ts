import type { GameData } from './data';
import type { GameState } from './types';

/**
 * 文本模板：{{name}} 角色名、{{realm}} 境界名、{{day}} 天数、{{stat.xxx}} 属性值
 */
export function renderText(template: string, state: GameState, data: GameData): string {
  return template.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (raw, key: string) => {
    if (key === 'name') return state.name;
    if (key === 'realm') return data.realms[state.realm]?.name ?? '';
    if (key === 'day') return String(state.day);
    if (key.startsWith('stat.')) {
      const stat = key.slice(5) as keyof GameState['stats'];
      if (stat in state.stats) return String(state.stats[stat]);
    }
    return raw;
  });
}
