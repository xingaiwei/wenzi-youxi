import type { Game } from '@/engine';
import { h } from '../dom';

/** 顶部状态栏：姓名、境界、修为、气血、灵石与各项属性 */
export class StatusBar {
  readonly el = h('header', { class: 'status-bar' });

  constructor(
    private game: Game,
    private onOpenPanel: () => void,
  ) {}

  render(): void {
    const { state, data } = this.game;
    const s = state.stats;
    const realm = data.realms[state.realm];
    const need = Number.isFinite(realm.toNext) ? realm.toNext : 0;
    const cultPct = need ? Math.min(100, (s.cultivation / need) * 100) : 100;
    const hpPct = (s.hp / s.maxHp) * 100;

    const attr = (key: 'insight' | 'constitution' | 'daoHeart' | 'karma') =>
      h('span', { class: 'attr', title: data.statMeta[key].desc }, h('em', {}, data.statMeta[key].label), String(s[key]));

    this.el.replaceChildren(
      h('div', { class: 'status-id' }, h('span', { class: 'status-name' }, state.name), h('span', { class: 'status-realm' }, realm.name), h('span', { class: 'status-day' }, `第${state.day}日`)),
      h(
        'div',
        { class: 'status-bars' },
        meter('气血', `${s.hp}/${s.maxHp}`, hpPct, 'hp'),
        meter('修为', need ? `${s.cultivation}/${need}` : '圆满', cultPct, 'cult'),
      ),
      h('div', { class: 'status-attrs' }, attr('insight'), attr('constitution'), attr('daoHeart'), attr('karma'), h('span', { class: 'attr' }, h('em', {}, '灵石'), String(s.stones))),
      h('button', { class: 'btn-ghost status-bag', type: 'button', on: { click: this.onOpenPanel } }, '行囊'),
    );
  }
}

function meter(label: string, text: string, pct: number, kind: string): HTMLElement {
  return h(
    'div',
    { class: `meter meter-${kind}`, role: 'meter', 'aria-label': label, 'aria-valuenow': Math.round(pct), 'aria-valuemin': 0, 'aria-valuemax': 100 },
    h('span', { class: 'meter-label' }, label),
    h('span', { class: 'meter-track' }, h('span', { class: 'meter-fill', style: `width:${pct.toFixed(1)}%` })),
    h('span', { class: 'meter-text' }, text),
  );
}
