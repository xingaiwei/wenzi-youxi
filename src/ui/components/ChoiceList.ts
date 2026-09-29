import type { ChoiceView } from '@/engine';
import { h } from '../dom';

/** 选项列表。onChoose 接收选项在场景中的原始下标 */
export function choiceList(choices: ChoiceView[], onChoose: (index: number) => void): HTMLElement {
  let n = 0;
  return h(
    'ol',
    { class: 'choices' },
    ...choices.map((c) => {
      const key = c.available ? ++n : 0;
      const meta: (string | HTMLElement)[] = [];
      if (c.check) {
        const pct = Math.round(c.check.chance * 100);
        meta.push(
          h('span', { class: `check ${pct >= 70 ? 'is-easy' : pct >= 40 ? 'is-mid' : 'is-hard'}` }, `${c.check.statLabel}检定 · ${pct}%`),
        );
        if (c.check.bonuses.length) meta.push(h('span', { class: 'bonus' }, c.check.bonuses.join('　')));
      }
      if (!c.available && c.lockedHint) meta.push(h('span', { class: 'locked-hint' }, c.lockedHint));

      return h(
        'li',
        {},
        h(
          'button',
          {
            class: 'choice',
            type: 'button',
            disabled: !c.available,
            'data-key': key || undefined,
            on: { click: () => c.available && onChoose(c.index) },
          },
          h('span', { class: 'choice-key' }, key ? String(key) : '·'),
          h('span', { class: 'choice-body' }, h('span', { class: 'choice-text' }, c.text), meta.length ? h('span', { class: 'choice-meta' }, ...meta) : null),
        ),
      );
    }),
  );
}
