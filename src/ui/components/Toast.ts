import { h } from '../dom';

/** 屏幕底部的短暂提示 */
export function toast(message: string, ms = 2600): void {
  let host = document.querySelector<HTMLElement>('.toast-host');
  if (!host) {
    host = h('div', { class: 'toast-host', 'aria-live': 'polite' });
    document.body.append(host);
  }
  const t = h('div', { class: 'toast' }, message);
  host.append(t);
  requestAnimationFrame(() => t.classList.add('is-visible'));
  setTimeout(() => {
    t.classList.remove('is-visible');
    setTimeout(() => t.remove(), 400);
  }, ms);
}
