/** 极简的 DOM 构造工具，避免引入框架 */
type Child = Node | string | null | undefined | false;
type Props = {
  class?: string;
  style?: string;
  html?: string;
  on?: Partial<Record<keyof HTMLElementEventMap, (e: Event) => void>>;
  [attr: string]: unknown;
};

export function h<K extends keyof HTMLElementTagNameMap>(tag: K, props: Props = {}, ...children: Child[]): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (v === undefined || v === null || v === false) continue;
    if (k === 'class') el.className = String(v);
    else if (k === 'html') el.innerHTML = String(v);
    else if (k === 'on') {
      for (const [evt, fn] of Object.entries(v as Record<string, EventListener>)) el.addEventListener(evt, fn);
    } else if (v === true) el.setAttribute(k, '');
    else el.setAttribute(k, String(v));
  }
  for (const c of children) if (c !== null && c !== undefined && c !== false) el.append(c);
  return el;
}

export function clear(el: Element): void {
  while (el.firstChild) el.firstChild.remove();
}

/**
 * 两步确认：第一次点击把按钮文字换成提示，3 秒内再点一次才执行。
 * （不用 confirm()：嵌入式环境中原生对话框可能被屏蔽）
 */
export function confirmTwice(button: HTMLButtonElement, prompt: string, action: () => void): void {
  if (button.dataset.armed === '1') {
    action();
    return;
  }
  const original = button.textContent;
  button.dataset.armed = '1';
  button.textContent = prompt;
  setTimeout(() => {
    button.dataset.armed = '';
    button.textContent = original;
  }, 3000);
}
