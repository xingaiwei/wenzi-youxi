import type { ItemDef } from '@/engine/types';

const defs: ItemDef[] = [
  {
    id: 'jade_pendant',
    name: '残月玉佩',
    desc: '老者所赠，玉色温润，缺了一角，握在掌心隐隐发烫。',
  },
  {
    id: 'qingmu_scroll',
    name: '《青木诀》残卷',
    desc: '一门木属性吐纳法门，只剩前三层。',
  },
  {
    id: 'healing_pill',
    name: '回春丹',
    desc: '疗伤圣品，服下可恢复气血。',
    use: {
      effects: [{ type: 'stat', stat: 'hp', delta: 25 }],
      message: '丹药入腹，一股暖流行遍四肢百骸，伤势好了大半。',
    },
  },
  {
    id: 'qi_pill',
    name: '聚气丹',
    desc: '炼气期修士常用的丹药，可增长修为。',
    use: {
      effects: [{ type: 'cultivate', amount: 8 }],
      message: '丹力化开，灵气在经脉中缓缓流转，修为有所精进。',
    },
  },
  {
    id: 'foundation_pill',
    name: '筑基丹',
    desc: '可大增筑基成功之机，千金难求。突破筑基时自动服用。',
  },
  {
    id: 'iron_sword',
    name: '铁剑',
    desc: '宗门发放的制式铁剑，聊胜于无。争斗时略有助益。',
  },
  {
    id: 'azure_sword',
    name: '青锋剑',
    desc: '剑冢所得古剑，剑身如一泓秋水。争斗时大有助益。',
  },
  {
    id: 'spirit_herb',
    name: '凝露草',
    desc: '后山常见的灵草，可在坊市换些灵石。',
  },
  {
    id: 'beast_core',
    name: '妖丹',
    desc: '妖兽体内凝结的内丹，价值不菲。',
  },
];

export const ITEMS: Record<string, ItemDef> = Object.fromEntries(defs.map((d) => [d.id, d]));
