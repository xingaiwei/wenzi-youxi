import type { GameData } from './data';
import type { Choice, Ending, GameState, Outcome, Scene } from './types';
import { evaluate } from './conditions';
import { addJournal, applyEffects } from './effects';
import { previewCheck, type CheckPreview } from './checks';
import { nextRandom } from './rng';
import { renderText } from './text';
import { cloneState } from './state';

export interface ChoiceView {
  /** 在 scene.choices 中的原始下标，调用 choose() 时使用 */
  index: number;
  text: string;
  available: boolean;
  lockedHint?: string;
  check?: CheckPreview & { statLabel: string };
}

export interface SceneView {
  scene: Scene;
  chapter: string;
  title: string;
  art?: string;
  /** 上一次选择的结果描述 */
  outcome?: string;
  paragraphs: string[];
  choices: ChoiceView[];
  ending?: Ending;
}

export interface ChoiceResult {
  /** 若有检定，是否成功 */
  success?: boolean;
  died: boolean;
}

export interface UseItemResult {
  ok: boolean;
  message: string;
}

type Listener = (game: Game) => void;

/**
 * 游戏引擎：持有当前状态，解释执行剧情数据。
 * 所有状态修改都通过 commit() 产生新对象，便于存档与调试。
 */
export class Game {
  private _state: GameState;
  private lastOutcome?: string;
  private listeners = new Set<Listener>();

  constructor(
    readonly data: GameData,
    state: GameState,
    /** 是否为新开局（需要执行起始场景的进入效果） */
    fresh = false,
  ) {
    this._state = cloneState(state);
    if (fresh) {
      const s = cloneState(this._state);
      this.enterScene(s, s.sceneId);
      this._state = s;
    }
  }

  get state(): Readonly<GameState> {
    return this._state;
  }

  get scene(): Scene {
    const scene = this.data.story.scenes[this._state.sceneId];
    if (!scene) throw new Error(`未知场景：${this._state.sceneId}`);
    return scene;
  }

  subscribe(fn: Listener): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  // -------------------------------------------------------------------------
  // 视图
  // -------------------------------------------------------------------------

  view(): SceneView {
    const { scene } = this;
    const s = this._state;
    const t = (x: string) => renderText(x, s, this.data);

    const paragraphs = scene.text
      .filter((p) => typeof p === 'string' || evaluate(p.when, s, this.data))
      .map((p) => t(typeof p === 'string' ? p : p.text));

    const choices: ChoiceView[] = [];
    scene.choices.forEach((c, index) => {
      const available = evaluate(c.requires, s, this.data);
      if (!available && !c.showWhenLocked) return;
      const view: ChoiceView = { index, text: t(c.text), available };
      if (!available && c.lockedHint) view.lockedHint = t(c.lockedHint);
      if (c.check) {
        view.check = {
          ...previewCheck(c.check, s, this.data),
          statLabel: this.data.statMeta[c.check.stat].label,
        };
      }
      choices.push(view);
    });

    return {
      scene,
      chapter: scene.chapter,
      title: t(scene.title),
      art: scene.art,
      outcome: this.lastOutcome ? t(this.lastOutcome) : undefined,
      paragraphs,
      choices,
      ending: scene.ending,
    };
  }

  // -------------------------------------------------------------------------
  // 行动
  // -------------------------------------------------------------------------

  choose(index: number): ChoiceResult {
    const choice: Choice | undefined = this.scene.choices[index];
    if (!choice) throw new Error(`场景 ${this.scene.id} 不存在选项 ${index}`);
    if (!evaluate(choice.requires, this._state, this.data)) {
      throw new Error(`选项条件不满足：${choice.text}`);
    }

    const s = cloneState(this._state);
    let outcome: Outcome = choice;
    let success: boolean | undefined;

    if (choice.check) {
      const { chance } = previewCheck(choice.check, s, this.data);
      const roll = nextRandom(s.seed);
      s.seed = roll.seed;
      success = roll.value < chance;
      outcome = success ? choice.check.success : choice.check.failure;
    }

    applyEffects(outcome.effects, s, this.data);
    this.lastOutcome = outcome.result;

    let died = false;
    if (s.stats.hp <= 0) {
      died = true;
      this.enterScene(s, this.data.story.deathScene);
    } else if (outcome.to) {
      this.enterScene(s, outcome.to);
    }

    this.commit(s);
    return { success, died };
  }

  useItem(itemId: string): UseItemResult {
    const def = this.data.items[itemId];
    if (!def?.use) return { ok: false, message: '此物无法直接使用。' };
    if (!this._state.inventory[itemId]) return { ok: false, message: '行囊中没有此物。' };
    if (this.scene.ending) return { ok: false, message: '尘埃已定。' };

    const s = cloneState(this._state);
    applyEffects(def.use.effects, s, this.data);
    if (def.use.consume !== false) applyEffects([{ type: 'item', item: itemId, delta: -1 }], s, this.data);
    addJournal(s, `使用了${def.name}。`);
    this.commit(s);
    return { ok: true, message: def.use.message };
  }

  // -------------------------------------------------------------------------
  // 内部
  // -------------------------------------------------------------------------

  private enterScene(s: GameState, sceneId: string): void {
    const scene = this.data.story.scenes[sceneId];
    if (!scene) throw new Error(`跳转到未知场景：${sceneId}`);
    s.sceneId = sceneId;
    const times = (s.visited[sceneId] ?? 0) + 1;
    s.visited[sceneId] = times;
    if (times === 1) applyEffects(scene.onFirstEnter, s, this.data);
    applyEffects(scene.onEnter, s, this.data);

    // 场景进入效果也可能致死
    if (s.stats.hp <= 0 && !scene.ending && sceneId !== this.data.story.deathScene) {
      this.enterScene(s, this.data.story.deathScene);
    }
  }

  private commit(s: GameState): void {
    this._state = s;
    for (const fn of this.listeners) fn(this);
  }
}
