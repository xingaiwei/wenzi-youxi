import { brushStroke } from '../core/brush';
import type { Pt } from '../core/geometry';
import { INK } from '../core/palette';
import type { Rng } from '../core/rng';
import { attrs, circle, ellipse, g, path, rect } from '../core/svg';

/** 朱文印章 */
export function seal(x: number, y: number, size: number, text: string): string {
  const chars = [...text];
  const n = chars.length <= 1 ? 1 : 2;
  const cell = size / n;
  const glyphs = chars.slice(0, n * n).map((c, i) => {
    // 印文从右往左、从上往下排列
    const col = n - 1 - Math.floor(i / n);
    const row = i % n;
    return `<text ${attrs({
      x: x + col * cell + cell / 2,
      y: y + row * cell + cell * 0.8,
      'font-size': cell * 0.86,
      'text-anchor': 'middle',
      fill: INK.paper,
      'font-family': "'Ma Shan Zheng','STKaiti','KaiTi',serif",
    })}>${c}</text>`;
  });
  return g([rect(x, y, size, size, { fill: INK.cinnabar, rx: size * 0.06, opacity: 0.9 }), ...glyphs], {
    filter: 'url(#ink-rough)',
  });
}

/** 竖排题字：逐字排布，避免不同浏览器对竖排文字支持不一 */
export function calligraphy(x: number, y: number, text: string, size = 28, opacity = 0.85): string {
  const glyphs = [...text].map(
    (c, i) =>
      `<text ${attrs({
        x,
        y: y + i * size * 1.12 + size,
        'font-size': size,
        'text-anchor': 'middle',
        fill: INK.burnt,
      })}>${c}</text>`,
  );
  return g(glyphs, {
    opacity,
    'font-family': "'Ma Shan Zheng','STKaiti','KaiTi','Noto Serif SC',serif",
    filter: 'url(#ink-rough)',
  });
}

/** 月：以留白表现，周围一圈淡墨烘托 */
export function moon(x: number, y: number, r: number, crescent = false): string {
  return g([
    circle(x, y, r * 2.6, { fill: INK.heavy, opacity: 0.18, filter: 'url(#ink-blur-md)' }),
    circle(x, y, r, { fill: '#fbf6ea' }),
    circle(x, y, r * 1.6, { fill: 'url(#ink-glow)' }),
    crescent ? circle(x + r * 0.45, y - r * 0.2, r * 0.9, { fill: INK.paperDeep, opacity: 0.85 }) : '',
  ]);
}

/** 日：朱砂晕染 */
export function sun(x: number, y: number, r: number): string {
  return g([
    circle(x, y, r * 1.8, { fill: INK.cinnabar, opacity: 0.12, filter: 'url(#ink-blur-md)' }),
    circle(x, y, r, { fill: INK.cinnabar, opacity: 0.75, filter: 'url(#ink-wash)' }),
  ]);
}

/** 闪电：折线形的焦墨与留白 */
export function lightning(rng: Rng, x: number, y: number, length: number): string {
  const pts: Pt[] = [[x, y]];
  let cx = x;
  let cy = y;
  while (cy < y + length) {
    cx += rng.range(-28, 28);
    cy += rng.range(20, 45);
    pts.push([cx, cy]);
  }
  const branchAt = pts[Math.floor(pts.length / 2)];
  const branch: Pt[] = [branchAt, [branchAt[0] + 40, branchAt[1] + 30], [branchAt[0] + 60, branchAt[1] + 70]];
  return g([
    path(brushStroke(pts, { width: 18, taperStart: 0.05, taperEnd: 0.6, press: 0 }), { fill: '#fffaf0', opacity: 0.5, filter: 'url(#ink-blur-md)' }),
    path(brushStroke(pts, { width: 5, taperStart: 0.05, taperEnd: 0.6, press: 0 }), { fill: '#fffdf6' }),
    path(brushStroke(branch, { width: 2.5, taperStart: 0, taperEnd: 0.8, press: 0 }), { fill: '#fffdf6', opacity: 0.9 }),
  ]);
}

/** 光晕 */
export function glow(x: number, y: number, rx: number, ry = rx): string {
  return ellipse(x, y, rx, ry, { fill: 'url(#ink-glow)' });
}

/** 血雾 */
export function bloodMist(x: number, y: number, rx: number, ry = rx): string {
  return ellipse(x, y, rx, ry, { fill: 'url(#ink-blood)', filter: 'url(#ink-blur-md)' });
}
