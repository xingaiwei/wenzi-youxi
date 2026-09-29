/**
 * 游戏核心类型定义。
 *
 * 剧情全部以「数据」形式描述（Scene / Choice / Effect / Condition），
 * 引擎只负责解释执行。新增剧情时一般只需要改 src/data 下的内容。
 */

/** 角色属性键 */
export type StatKey =
  | 'hp' // 气血
  | 'maxHp' // 气血上限
  | 'cultivation' // 修为（当前境界内的积累）
  | 'stones' // 灵石
  | 'insight' // 悟性
  | 'constitution' // 根骨
  | 'daoHeart' // 道心
  | 'karma'; // 因果（善恶）

export type Stats = Record<StatKey, number>;

export type FlagValue = boolean | number | string;

// ---------------------------------------------------------------------------
// 条件
// ---------------------------------------------------------------------------

export type Condition =
  | { type: 'stat'; stat: StatKey; gte?: number; lte?: number }
  | { type: 'realm'; gte?: number; lte?: number }
  | { type: 'item'; item: string; count?: number }
  | { type: 'flag'; flag: string; equals?: FlagValue }
  | { type: 'day'; gte?: number; lte?: number }
  | { type: 'visited'; scene: string; times?: number }
  /** 修为已满足突破到下一境界的要求 */
  | { type: 'canBreakthrough' }
  | { type: 'all'; of: Condition[] }
  | { type: 'any'; of: Condition[] }
  | { type: 'not'; cond: Condition };

// ---------------------------------------------------------------------------
// 效果
// ---------------------------------------------------------------------------

export type Effect =
  /** 属性增减（hp 会被限制在 0..maxHp） */
  | { type: 'stat'; stat: StatKey; delta: number }
  | { type: 'setStat'; stat: StatKey; value: number }
  /** 修炼：获得修为，受悟性加成 */
  | { type: 'cultivate'; amount: number }
  /** 境界突破（消耗修为） */
  | { type: 'breakthrough' }
  | { type: 'item'; item: string; delta: number }
  | { type: 'flag'; flag: string; value: FlagValue }
  | { type: 'passDays'; days: number }
  /** 写入游历记录 */
  | { type: 'log'; text: string };

// ---------------------------------------------------------------------------
// 剧情
// ---------------------------------------------------------------------------

/** 段落：可以是纯文本，也可以是带条件的文本 */
export type Paragraph = string | { text: string; when: Condition };

/** 选择产生的结果 */
export interface Outcome {
  /** 跳转的场景 id；省略则停留在当前场景 */
  to?: string;
  effects?: Effect[];
  /** 结果描述，会显示在下一场景顶部 */
  result?: string;
}

/** 检定加成 */
export interface CheckModifier {
  when: Condition;
  amount: number;
  /** 显示给玩家的说明，如「青锋剑 +2」 */
  label?: string;
}

/** 属性检定：成功率由属性值与难度决定 */
export interface Check {
  stat: StatKey;
  difficulty: number;
  modifiers?: CheckModifier[];
  success: Outcome;
  failure: Outcome;
}

export interface Choice extends Outcome {
  text: string;
  /** 条件不满足时隐藏该选项 */
  requires?: Condition;
  /** 为 true 时，条件不满足也显示（置灰），配合 lockedHint 使用 */
  showWhenLocked?: boolean;
  lockedHint?: string;
  /** 若存在检定，则忽略 Outcome 字段，改用检定的 success / failure */
  check?: Check;
}

export type EndingKind = 'good' | 'neutral' | 'bad';

export interface Ending {
  kind: EndingKind;
  title: string;
}

export interface Scene {
  id: string;
  /** 所属章节标题 */
  chapter: string;
  title: string;
  /** 插图 id，见 src/art/registry.ts */
  art?: string;
  text: Paragraph[];
  /** 进入场景时执行的效果（每次进入都会执行） */
  onEnter?: Effect[];
  /** 仅首次进入时执行的效果 */
  onFirstEnter?: Effect[];
  choices: Choice[];
  ending?: Ending;
}

export interface Chapter {
  id: string;
  title: string;
  scenes: Scene[];
}

export interface Story {
  startScene: string;
  /** 气血归零时跳转的场景 */
  deathScene: string;
  scenes: Record<string, Scene>;
}

// ---------------------------------------------------------------------------
// 物品 / 境界
// ---------------------------------------------------------------------------

export interface ItemDef {
  id: string;
  name: string;
  desc: string;
  /** 可在行囊中主动使用 */
  use?: {
    effects: Effect[];
    message: string;
    /** 使用后是否消耗，默认 true */
    consume?: boolean;
  };
}

export interface RealmDef {
  name: string;
  /** 突破到下一境界所需修为；最后一个境界为 Infinity */
  toNext: number;
  /** 突破到该境界时气血上限的提升 */
  maxHpBonus: number;
}

// ---------------------------------------------------------------------------
// 存档状态
// ---------------------------------------------------------------------------

export interface GameState {
  version: number;
  name: string;
  sceneId: string;
  stats: Stats;
  realm: number;
  day: number;
  inventory: Record<string, number>;
  flags: Record<string, FlagValue>;
  visited: Record<string, number>;
  /** 游历记录（最近在后） */
  journal: string[];
  /** 伪随机数种子，保证读档后结果可复现 */
  seed: number;
}
