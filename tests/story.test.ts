/**
 * 剧情数据校验：每次修改剧情后运行 `npm run validate`。
 * - 所有跳转目标、物品、插图 id 均存在
 * - 所有场景都可从起点到达
 * - 随机游玩上千次不会卡死、不会报错，且能到达各个结局
 */
import { describe, expect, it } from 'vitest';
import { GAME_DATA } from '@/data';
import { Game, createInitialState, type Condition, type Effect, type Outcome, type Scene } from '@/engine';
import { ART_IDS } from '@/art/registry';
import { nextRandom } from '@/engine/rng';

const { story, items } = GAME_DATA;
const scenes = Object.values(story.scenes);

function outcomesOf(scene: Scene): Outcome[] {
  return scene.choices.flatMap((c) => (c.check ? [c.check.success, c.check.failure] : [c]));
}

function collectItems(effects: Effect[] = [], out: string[] = []): string[] {
  for (const e of effects) if (e.type === 'item') out.push(e.item);
  return out;
}

function condItems(c: Condition | undefined, out: string[] = []): string[] {
  if (!c) return out;
  if (c.type === 'item') out.push(c.item);
  if (c.type === 'all' || c.type === 'any') c.of.forEach((x) => condItems(x, out));
  if (c.type === 'not') condItems(c.cond, out);
  return out;
}

describe('剧情数据', () => {
  it('起点与死亡场景存在', () => {
    expect(story.scenes[story.startScene]).toBeDefined();
    expect(story.scenes[story.deathScene]?.ending).toBeDefined();
  });

  it.each(scenes.map((s) => [s.id, s] as const))('场景 %s 引用合法', (_, scene) => {
    for (const o of outcomesOf(scene)) {
      if (o.to) expect(story.scenes[o.to], `跳转目标 ${o.to}`).toBeDefined();
    }
    const refItems = [
      ...collectItems(scene.onEnter),
      ...collectItems(scene.onFirstEnter),
      ...outcomesOf(scene).flatMap((o) => collectItems(o.effects)),
      ...scene.choices.flatMap((c) => condItems(c.requires)),
    ];
    for (const id of refItems) expect(items[id], `物品 ${id}`).toBeDefined();
    if (scene.art) expect(ART_IDS, `插图 ${scene.art}`).toContain(scene.art);
    if (!scene.ending) expect(scene.choices.length, '非结局场景必须有选项').toBeGreaterThan(0);
    else expect(scene.choices.length, '结局场景不应有选项').toBe(0);
  });

  it('所有场景均可到达', () => {
    const seen = new Set([story.startScene, story.deathScene]);
    const queue = [story.startScene];
    while (queue.length) {
      const s = story.scenes[queue.shift()!];
      for (const o of outcomesOf(s)) {
        if (o.to && !seen.has(o.to)) {
          seen.add(o.to);
          queue.push(o.to);
        }
      }
    }
    const unreachable = scenes.map((s) => s.id).filter((id) => !seen.has(id));
    expect(unreachable).toEqual([]);
  });

  it('随机游玩：无死循环、无卡死，并能抵达各结局', () => {
    const endings = new Map<string, number>();
    const RUNS = 1500;
    const MAX_STEPS = 600;
    for (let run = 0; run < RUNS; run++) {
      const game = new Game(GAME_DATA, createInitialState(GAME_DATA, '测试', run * 7919), true);
      let seed = run + 1;
      let steps = 0;
      while (!game.view().ending && steps++ < MAX_STEPS) {
        const view = game.view();
        const avail = view.choices.filter((c) => c.available);
        expect(avail.length, `场景 ${view.scene.id} 无可用选项`).toBeGreaterThan(0);
        // 偶尔使用丹药，模拟真实玩家
        if (game.state.stats.hp < 15 && game.state.inventory.healing_pill) game.useItem('healing_pill');
        const r = nextRandom(seed);
        seed = r.seed;
        game.choose(avail[Math.floor(r.value * avail.length)].index);
      }
      const end = game.view().ending;
      if (end) endings.set(game.state.sceneId, (endings.get(game.state.sceneId) ?? 0) + 1);
    }
    const endingScenes = scenes.filter((s) => s.ending).map((s) => s.id);
    // 随机游玩在限定步数内应能触达所有结局
    for (const id of endingScenes) expect(endings.get(id) ?? 0, `结局 ${id} 未被触达`).toBeGreaterThan(0);
  });
});
