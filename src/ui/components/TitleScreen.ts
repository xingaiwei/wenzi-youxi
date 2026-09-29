import { renderArt } from '@/art/registry';
import { h } from '../dom';

interface Options {
  hasSave: boolean;
  onNew: (name: string) => void;
  onContinue: () => void;
}

/** 标题画面 */
export class TitleScreen {
  readonly el: HTMLElement;

  constructor(opts: Options) {
    const nameInput = h('input', {
      class: 'name-input',
      type: 'text',
      maxlength: 8,
      placeholder: '无名',
      'aria-label': '你的名字',
      autocomplete: 'off',
    });
    const form = h(
      'form',
      {
        class: 'name-form is-hidden',
        on: {
          submit: (e) => {
            e.preventDefault();
            opts.onNew(nameInput.value);
          },
        },
      },
      h('label', { class: 'name-label' }, '汝名为何？', nameInput),
      h('button', { class: 'btn btn-primary', type: 'submit' }, '踏上仙途'),
    );

    const menu = h(
      'div',
      { class: 'title-menu' },
      opts.hasSave ? h('button', { class: 'btn btn-primary', type: 'button', on: { click: opts.onContinue } }, '继续旅程') : null,
      h(
        'button',
        {
          class: `btn ${opts.hasSave ? '' : 'btn-primary'}`,
          type: 'button',
          on: {
            click: () => {
              if (opts.hasSave && !confirm('开始新的旅程将覆盖现有存档，确定吗？')) return;
              menu.classList.add('is-hidden');
              form.classList.remove('is-hidden');
              nameInput.focus();
            },
          },
        },
        '新的旅程',
      ),
    );

    this.el = h(
      'main',
      { class: 'title-screen' },
      h('div', { class: 'title-art', html: renderArt('title') }),
      h(
        'div',
        { class: 'title-content' },
        h('h1', { class: 'title-logo' }, '问道'),
        h('p', { class: 'title-sub' }, '一卷水墨修仙录'),
        menu,
        form,
      ),
      h('footer', { class: 'title-foot' }, '数字键 1–9 可快速选择 · 进度自动保存'),
    );
  }
}
