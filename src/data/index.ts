import type { GameData } from '@/engine/data';
import { ITEMS } from './items';
import { REALMS } from './realms';
import { INITIAL_STATS, STAT_META } from './stats';
import { STORY } from './story';

export const GAME_DATA: GameData = {
  story: STORY,
  items: ITEMS,
  realms: REALMS,
  statMeta: STAT_META,
  initialStats: INITIAL_STATS,
};
