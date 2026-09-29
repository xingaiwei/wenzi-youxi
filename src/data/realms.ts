import type { RealmDef } from '@/engine/types';

/** 境界表：索引即境界等级 */
export const REALMS: RealmDef[] = [
  { name: '凡人', toNext: 20, maxHpBonus: 0 },
  { name: '炼气', toNext: 60, maxHpBonus: 20 },
  { name: '筑基', toNext: 200, maxHpBonus: 50 },
  { name: '金丹', toNext: 600, maxHpBonus: 120 },
  { name: '元婴', toNext: Infinity, maxHpBonus: 300 },
];

export const REALM = {
  MORTAL: 0,
  QI_REFINING: 1,
  FOUNDATION: 2,
  GOLDEN_CORE: 3,
  NASCENT_SOUL: 4,
} as const;
