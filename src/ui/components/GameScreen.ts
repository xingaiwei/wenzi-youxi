import type { Game } from '@/engine';
import { h } from '../dom';
import { ArtFrame } from './ArtFrame';
import { choiceList } from './ChoiceList';
import { SidePanel } from './SidePanel';
import { StatusBar } from './StatusBar';

interface Actions {
  onRestart: () => void;
  onExit: () => void;
}

const ENDING_LABEL = { good: '善终', neutral: '平生', bad: '劫灭' } as const;

/** 游戏主画面：状态栏 + 插图 + 正文 + 选项 */
export class GameScreen {
  readonly el: HTMLElement;
  private art = new ArtFrame();
  private status: StatusBar;
  private panel: SidePanel;
  private textEl = h('article', { class: 'story', 'aria-live': 'polite' });
  private lastSceneKey = '';

  constructor(
    private game: Game,
    private actions: Actions,
  ) {
    this.panel = new SidePanel(game, actions);
    this.status = new StatusBar(game, () => this.panel.open());
    this.el = h(
      'main',
      { class: 'game-screen' },
      this.status.el,
      h('div', { class: 'stage' }, this.art.el, this.textEl),
      this.panel.el,
    );
    game.subscribe(() => this.render());
    document.addEventListener('keydown', this.onKey);
    this.render();
  }

  private onKey = (e: KeyboardEvent) => {
    if (!this.el.isConnected) {
      document.removeEventListener('keydown', this.onKey);
      return;
    }
    if (e.key === 'Escape') return this.panel.isOpen ? this.panel.close() : this.panel.open();
    if (this.panel.isOpen || e.metaKey || e.ctrlKey || e.altKey) return;
    if (/^[1-9]$/.test(e.key)) {
      this.textEl.querySelector<HTMLButtonElement>(`.choice[data-key="${e.key}"]`)?.click();
    }
  };

  private render(): void {
    const view = this.game.view();
    this.status.render();
    if (this.panel.isOpen) this.panel.render();
    this.art.show(view.art);

    // 同一场景内的操作（如坊市买卖）不重播入场动画
    const sceneKey = `${this.game.state.sceneId}:${this.game.state.visited[this.game.state.sceneId]}`;
    const animate = sceneKey !== this.lastSceneKey;
    this.lastSceneKey = sceneKey;

    const paras = view.paragraphs.map((p, i) => h('p', { class: animate ? 'reveal' : '', style: animate ? `--i:${i}` : undefined }, p));
    const delay = animate ? view.paragraphs.length : 0;

    const tail = view.ending
      ? h(
          'div',
          { class: `ending ending-${view.ending.kind} ${animate ? 'reveal' : ''}`, style: `--i:${delay}` },
          h('div', { class: 'ending-seal' }, ENDING_LABEL[view.ending.kind]),
          h('h3', {}, `结局 · ${view.ending.title}`),
          h(
            'div',
            { class: 'ending-actions' },
            h('button', { class: 'btn btn-primary', type: 'button', on: { click: this.actions.onRestart } }, '重入轮回'),
            h('button', { class: 'btn', type: 'button', on: { click: this.actions.onExit } }, '返回标题'),
          ),
        )
      : h(
          'div',
          { class: animate ? 'reveal' : '', style: `--i:${delay}` },
          choiceList(view.choices, (i) => this.game.choose(i)),
        );

    const head = h('header', { class: 'story-head' }, h('span', { class: 'chapter' }, view.chapter), h('h2', { class: 'scene-title' }, view.title));
    const outcome = view.outcome ? [h('blockquote', { class: 'outcome' }, view.outcome)] : [];
    this.textEl.replaceChildren(head, ...outcome, ...paras, tail);
    if (animate) this.textEl.scrollTop = 0;
  }
}
