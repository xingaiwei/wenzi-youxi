import type { Game } from '@/engine';
import { confirmTwice, h } from '../dom';
import { toast } from './Toast';

type Tab = 'bag' | 'journal' | 'menu';

/** 侧边抽屉：行囊 / 游历 / 菜单 */
export class SidePanel {
  readonly el = h('aside', { class: 'side-panel', 'aria-hidden': 'true' });
  private tab: Tab = 'bag';

  constructor(
    private game: Game,
    private actions: { onExit: () => void; onRestart: () => void },
  ) {
    this.el.addEventListener('click', (e) => {
      if (e.target === this.el) this.close();
    });
  }

  open(tab: Tab = this.tab): void {
    this.tab = tab;
    this.render();
    this.el.classList.add('is-open');
    this.el.setAttribute('aria-hidden', 'false');
  }

  close(): void {
    this.el.classList.remove('is-open');
    this.el.setAttribute('aria-hidden', 'true');
  }

  get isOpen(): boolean {
    return this.el.classList.contains('is-open');
  }

  render(): void {
    const tabBtn = (t: Tab, label: string) =>
      h('button', { type: 'button', class: `tab ${this.tab === t ? 'is-active' : ''}`, on: { click: () => this.open(t) } }, label);
    const body = this.tab === 'bag' ? this.renderBag() : this.tab === 'journal' ? this.renderJournal() : this.renderMenu();
    this.el.replaceChildren(
      h(
        'div',
        { class: 'panel-sheet' },
        h('div', { class: 'panel-tabs' }, tabBtn('bag', '行囊'), tabBtn('journal', '游历'), tabBtn('menu', '菜单'), h('button', { type: 'button', class: 'btn-ghost panel-close', 'aria-label': '关闭', on: { click: () => this.close() } }, '×')),
        h('div', { class: 'panel-body' }, body),
      ),
    );
  }

  private renderBag(): HTMLElement {
    const { state, data } = this.game;
    const entries = Object.entries(state.inventory);
    if (!entries.length) return h('p', { class: 'empty' }, '行囊空空如也。');
    return h(
      'ul',
      { class: 'bag' },
      ...entries.map(([id, count]) => {
        const def = data.items[id];
        if (!def) return h('li', {}, id);
        return h(
          'li',
          { class: 'bag-item' },
          h('div', { class: 'bag-head' }, h('strong', {}, def.name), count > 1 ? h('span', { class: 'count' }, `×${count}`) : null),
          h('p', {}, def.desc),
          def.use
            ? h(
                'button',
                {
                  type: 'button',
                  class: 'btn-small',
                  on: {
                    click: () => {
                      const r = this.game.useItem(id);
                      toast(r.message);
                      this.render();
                    },
                  },
                },
                '使用',
              )
            : null,
        );
      }),
    );
  }

  private renderJournal(): HTMLElement {
    const entries = [...this.game.state.journal].reverse();
    if (!entries.length) return h('p', { class: 'empty' }, '尚无记载。');
    return h('ol', { class: 'journal' }, ...entries.map((e) => h('li', {}, e)));
  }

  private renderMenu(): HTMLElement {
    return h(
      'div',
      { class: 'menu' },
      h('p', { class: 'hint' }, '进度会在每次选择后自动保存。'),
      h('button', { type: 'button', class: 'btn', on: { click: () => this.actions.onExit() } }, '返回标题'),
      h(
        'button',
        {
          type: 'button',
          class: 'btn btn-danger',
          on: {
            click: (e) => confirmTwice(e.currentTarget as HTMLButtonElement, '再点一次：放弃进度', this.actions.onRestart),
          },
        },
        '重新开始',
      ),
    );
  }
}
