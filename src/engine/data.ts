import type { ItemDef, RealmDef, StatKey, Stats, Story } from './types';

export interface StatMeta {
  label: string;
  desc: string;
  min: number;
  /** 上限：固定数值，或以另一个属性为上限 */
  max?: number | StatKey;
}

/** 引擎运行所需的全部静态数据，由 src/data 组装后注入 */
export interface GameData {
  story: Story;
  items: Record<string, ItemDef>;
  realms: RealmDef[];
  statMeta: Record<StatKey, StatMeta>;
  initialStats: Stats;
}
