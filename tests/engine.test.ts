import { describe, expect, it } from 'vitest';
import { Game, createInitialState, evaluate, type GameData, type Scene } from '@/engine';
import { REALMS } from '@/data/realms';
import { STAT_META, INITIAL_STATS } from '@/data/stats';
import { ITEMS } from '@/data/items';

function makeData(scenes: Scene[]): GameData {
  return {
    story: {
      startScene: scenes[0].id,
      deathScene: 'death',
      scenes: Object.fromEntries(
        [...scenes, base({ id: 'death', title: '死', ending: { kind: 'bad', title: '死' } })].map(
          (s) => [s.id, s],
        ),
      ),
    },
    items: ITEMS,
    realms: REALMS,
    statMeta: STAT_META,
    initialStats: INITIAL_STATS,
  };
}

const base = (over: Partial<Scene>): Scene => ({ id: 'a', chapter: 'c', title: 't', text: [], choices: [], ...over });

describe('Game', () => {
  it('执行首次进入效果，并只执行一次', () => {
    const data = makeData([
      base({ id: 'a', onFirstEnter: [{ type: 'stat', stat: 'stones', delta: 10 }], choices: [{ text: 'b', to: 'b' }] }),
      base({ id: 'b', choices: [{ text: 'a', to: 'a' }] }),
    ]);
    const g = new Game(data, createInitialState(data, '测试', 1), true);
    expect(g.state.stats.stones).toBe(INITIAL_STATS.stones + 10);
    g.choose(0);
    g.choose(0);
    expect(g.state.sceneId).toBe('a');
    expect(g.state.stats.stones).toBe(INITIAL_STATS.stones + 10);
    expect(g.state.visited.a).toBe(2);
  });

  it('隐藏不满足条件的选项，showWhenLocked 的选项置灰', () => {
    const data = makeData([
      base({
        choices: [
          { text: '隐藏', requires: { type: 'item', item: 'jade_pendant' } },
          { text: '置灰', requires: { type: 'item', item: 'jade_pendant' }, showWhenLocked: true, lockedHint: '需玉佩' },
          { text: '可选' },
        ],
      }),
    ]);
    const v = new Game(data, createInitialState(data, 'x', 1), true).view();
    expect(v.choices.map((c) => [c.text, c.available])).toEqual([
      ['置灰', false],
      ['可选', true],
    ]);
    expect(v.choices[0].lockedHint).toBe('需玉佩');
  });

  it('拒绝执行条件不满足的选项', () => {
    const data = makeData([base({ choices: [{ text: 'x', requires: { type: 'realm', gte: 3 } }] })]);
    const g = new Game(data, createInitialState(data, 'x', 1), true);
    expect(() => g.choose(0)).toThrow();
  });

  it('气血归零进入死亡场景', () => {
    const data = makeData([base({ choices: [{ text: '送死', to: 'a', effects: [{ type: 'stat', stat: 'hp', delta: -999 }] }] })]);
    const g = new Game(data, createInitialState(data, 'x', 1), true);
    const r = g.choose(0);
    expect(r.died).toBe(true);
    expect(g.state.sceneId).toBe('death');
    expect(g.view().ending?.kind).toBe('bad');
  });

  it('检定结果由种子决定，可复现', () => {
    const data = makeData([
      base({
        choices: [
          {
            text: '赌',
            check: { stat: 'insight', difficulty: 3, success: { to: 'win' }, failure: { to: 'lose' } },
          },
        ],
      }),
      base({ id: 'win' }),
      base({ id: 'lose' }),
    ]);
    const outcomes = new Set<string>();
    for (let seed = 0; seed < 50; seed++) {
      const a = new Game(data, createInitialState(data, 'x', seed), true);
      const b = new Game(data, createInitialState(data, 'x', seed), true);
      a.choose(0);
      b.choose(0);
      expect(a.state.sceneId).toBe(b.state.sceneId);
      outcomes.add(a.state.sceneId);
    }
    expect(outcomes).toEqual(new Set(['win', 'lose']));
  });

  it('突破消耗修为并提升气血上限', () => {
    const data = makeData([base({ choices: [{ text: '破', effects: [{ type: 'breakthrough' }] }] })]);
    const s = createInitialState(data, 'x', 1);
    s.stats.cultivation = REALMS[0].toNext + 5;
    const g = new Game(data, s);
    g.choose(0);
    expect(g.state.realm).toBe(1);
    expect(g.state.stats.cultivation).toBe(5);
    expect(g.state.stats.maxHp).toBe(INITIAL_STATS.maxHp + REALMS[1].maxHpBonus);
    expect(g.state.stats.hp).toBe(g.state.stats.maxHp);
  });

  it('属性受上下限约束', () => {
    const data = makeData([
      base({
        choices: [
          {
            text: 'x',
            effects: [
              { type: 'stat', stat: 'hp', delta: 999 },
              { type: 'stat', stat: 'insight', delta: 999 },
              { type: 'stat', stat: 'stones', delta: -999 },
            ],
          },
        ],
      }),
    ]);
    const g = new Game(data, createInitialState(data, 'x', 1), true);
    g.choose(0);
    expect(g.state.stats.hp).toBe(g.state.stats.maxHp);
    expect(g.state.stats.insight).toBe(10);
    expect(g.state.stats.stones).toBe(0);
  });

  it('使用物品', () => {
    const data = makeData([base({})]);
    const s = createInitialState(data, 'x', 1);
    s.stats.hp = 1;
    s.inventory.healing_pill = 1;
    const g = new Game(data, s);
    expect(g.useItem('healing_pill').ok).toBe(true);
    expect(g.state.stats.hp).toBe(26);
    expect(g.state.inventory.healing_pill).toBeUndefined();
    expect(g.useItem('healing_pill').ok).toBe(false);
  });

  it('文本模板', () => {
    const data = makeData([base({ title: '{{name}}的{{realm}}之路', text: ['第{{day}}日，灵石{{stat.stones}}'] })]);
    const v = new Game(data, createInitialState(data, '阿木', 1), true).view();
    expect(v.title).toBe('阿木的凡人之路');
    expect(v.paragraphs[0]).toBe(`第1日，灵石${INITIAL_STATS.stones}`);
  });

  it('组合条件', () => {
    const data = makeData([base({})]);
    const s = createInitialState(data, 'x', 1);
    s.flags.a = 'inner';
    expect(evaluate({ type: 'flag', flag: 'a', equals: 'inner' }, s, data)).toBe(true);
    expect(evaluate({ type: 'all', of: [{ type: 'flag', flag: 'a' }, { type: 'not', cond: { type: 'flag', flag: 'b' } }] }, s, data)).toBe(true);
    expect(evaluate({ type: 'any', of: [{ type: 'flag', flag: 'b' }, { type: 'realm', gte: 1 }] }, s, data)).toBe(false);
  });
});
