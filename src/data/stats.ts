import type { StatMeta } from '@/engine/data';
import type { StatKey, Stats } from '@/engine/types';

export const STAT_META: Record<StatKey, StatMeta> = {
  hp: { label: '气血', desc: '归零则身死道消。', min: 0, max: 'maxHp' },
  maxHp: { label: '气血上限', desc: '随境界提升而增长。', min: 1 },
  cultivation: { label: '修为', desc: '当前境界内的积累，足够时可尝试突破。', min: 0 },
  stones: { label: '灵石', desc: '修真界的通用货币。', min: 0 },
  insight: { label: '悟性', desc: '影响修炼效率与参悟类检定。', min: 0, max: 10 },
  constitution: { label: '根骨', desc: '影响体魄与争斗类检定。', min: 0, max: 10 },
  daoHeart: { label: '道心', desc: '心志坚定与否，影响问心与突破。', min: 0, max: 10 },
  karma: { label: '因果', desc: '善恶之报，冥冥中自有定数。', min: -10, max: 10 },
};

export const INITIAL_STATS: Stats = {
  hp: 30,
  maxHp: 30,
  cultivation: 0,
  stones: 5,
  insight: 3,
  constitution: 3,
  daoHeart: 3,
  karma: 0,
};
