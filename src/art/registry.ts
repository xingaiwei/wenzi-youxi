import { createRng } from './core/rng';
import { canvas, INK_DEFS, VIEW_H, VIEW_W } from './core/svg';
import { calligraphy, seal } from './elements/marks';
import { mortalScenes } from './scenes/mortal';
import { mysticScenes } from './scenes/mystic';
import { sectScenes } from './scenes/sect';
import type { ArtScene } from './scenes/types';

/** 所有插图。新增插图：在 scenes/ 下写一个 ArtScene 并在此登记 */
const ARTS: Record<string, ArtScene> = {
  ...mortalScenes,
  ...sectScenes,
  ...mysticScenes,
  // 用位图覆盖某幅插图的示例：
  // village: { image: 'art/village.webp', alt: '青石村' },
};

export const ART_IDS = Object.keys(ARTS);

const cache = new Map<string, string>();

/** 渲染插图为 SVG 字符串（带缓存）。同一 id 每次结果一致 */
export function renderArt(id: string): string {
  const hit = cache.get(id);
  if (hit) return hit;
  const art = ARTS[id];
  if (!art) throw new Error(`未知插图：${id}`);
  if (art.image) {
    const html = `<img class="art-image" src="${art.image}" alt="${art.alt ?? art.inscription ?? ''}" decoding="async">`;
    cache.set(id, html);
    return html;
  }
  if (!art.draw) throw new Error(`插图 ${id} 既没有 draw 也没有 image`);
  const rng = createRng(`art:${id}`);
  const layers = art.draw(rng);
  if (art.inscription) {
    const size = 30;
    const left = art.inscriptionAt === 'left';
    const x = left ? 48 : VIEW_W - 48;
    const len = [...art.inscription].length;
    layers.push(calligraphy(x, 40, art.inscription, size));
    layers.push(seal(x - 13, 40 + len * size * 1.12 + 14, 26, '问道'));
  }
  const svg = canvas(layers, { tone: art.tone, title: art.inscription });
  cache.set(id, svg);
  return svg;
}

let defsInstalled = false;

/** 在文档中注入一次共享滤镜定义 */
export function installInkDefs(doc: Document = document): void {
  if (defsInstalled) return;
  const holder = doc.createElement('div');
  holder.innerHTML = INK_DEFS;
  doc.body.prepend(holder.firstElementChild!);
  defsInstalled = true;
}

export { VIEW_W, VIEW_H };
