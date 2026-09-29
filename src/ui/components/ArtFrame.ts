import { renderArt } from '@/art/registry';
import { h } from '../dom';

/** 插图画框：切换插图时淡入淡出 */
export class ArtFrame {
  readonly el = h('figure', { class: 'art-frame' });
  private current?: string;

  show(artId: string | undefined): void {
    if (!artId || artId === this.current) return;
    this.current = artId;
    const layer = h('div', { class: 'art-layer', html: renderArt(artId) });
    this.el.append(layer);
    // 下一帧再加 class，触发过渡
    requestAnimationFrame(() => layer.classList.add('is-visible'));
    const old = [...this.el.querySelectorAll('.art-layer')].slice(0, -1);
    setTimeout(() => old.forEach((n) => n.remove()), 900);
  }
}
