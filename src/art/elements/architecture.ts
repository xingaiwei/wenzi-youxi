import { brushStroke } from '../core/brush';
import { polyPath, type Pt } from '../core/geometry';
import { INK } from '../core/palette';
import type { Rng } from '../core/rng';
import { g, path, rect } from '../core/svg';

/** 飞檐屋顶：两端上翘 */
function roof(rng: Rng, cx: number, y: number, w: number, h: number, s: number): string {
  const eave: Pt[] = [
    [cx - w / 2 - 10 * s, y - 8 * s],
    [cx - w / 2 + 6 * s, y],
    [cx, y + 2 * s],
    [cx + w / 2 - 6 * s, y],
    [cx + w / 2 + 10 * s, y - 8 * s],
  ];
  const ridge: Pt[] = [
    [cx - w * 0.3, y - h],
    [cx, y - h - 1 * s],
    [cx + w * 0.3, y - h],
  ];
  const body: Pt[] = [eave[0], eave[1], eave[2], eave[3], eave[4], [cx + w * 0.3, y - h], [cx - w * 0.3, y - h]];
  return g([
    path(polyPath(body, true), { fill: INK.heavy, opacity: 0.55 }),
    path(brushStroke(eave, { width: 3.5 * s, rng, taperStart: 0.15, taperEnd: 0.15 }), { fill: INK.burnt }),
    path(brushStroke(ridge, { width: 3 * s, rng, taperStart: 0.1, taperEnd: 0.1 }), { fill: INK.burnt }),
    // 瓦垄
    ...Array.from({ length: 6 }, (_, i) => {
      const t = (i + 0.5) / 6;
      const x = cx - w * 0.3 + t * w * 0.6;
      const bx = cx - w / 2 + t * w;
      return path(brushStroke([[x, y - h + 2 * s], [bx, y - 1 * s]], { width: 1 * s, taperStart: 0.1, taperEnd: 0.3 }), {
        fill: INK.burnt,
        opacity: 0.6,
      });
    }),
  ]);
}

/** 亭台楼阁，可指定层数 */
export function pavilion(rng: Rng, x: number, y: number, scale = 1, tiers = 1): string {
  const s = scale;
  const out: string[] = [];
  // 台基
  out.push(rect(x - 42 * s, y - 6 * s, 84 * s, 8 * s, { fill: INK.heavy, opacity: 0.55 }));
  out.push(path(brushStroke([[x - 46 * s, y - 6 * s], [x + 46 * s, y - 6 * s]], { width: 2 * s, taperStart: 0.05, taperEnd: 0.05 }), { fill: INK.burnt }));
  let base = y - 6 * s;
  for (let t = 0; t < tiers; t++) {
    const w = (70 - t * 12) * s;
    const colH = (34 - t * 4) * s;
    for (const px of [-w / 2 + 6 * s, -w / 6, w / 6, w / 2 - 6 * s]) {
      out.push(path(brushStroke([[x + px, base], [x + px, base - colH]], { width: 2.4 * s, taperStart: 0.02, taperEnd: 0.02, rng }), { fill: INK.thick }));
    }
    // 栏杆
    out.push(path(brushStroke([[x - w / 2, base - 9 * s], [x + w / 2, base - 9 * s]], { width: 1.4 * s, taperStart: 0.05, taperEnd: 0.05 }), { fill: INK.thick, opacity: 0.8 }));
    base -= colH;
    out.push(roof(rng, x, base, w + 20 * s, 16 * s, s));
    base -= 16 * s;
  }
  // 宝顶
  out.push(path(brushStroke([[x, base + 2 * s], [x, base - 8 * s]], { width: 2.5 * s, taperStart: 0, taperEnd: 0.6 }), { fill: INK.burnt }));
  return g(out, { filter: 'url(#ink-rough)' });
}

/** 山门牌坊 */
export function gate(rng: Rng, x: number, y: number, scale = 1): string {
  const s = scale;
  const out: string[] = [];
  const w = 120 * s;
  const h = 90 * s;
  for (const px of [-w / 2, -w / 5, w / 5, w / 2]) {
    const ph = Math.abs(px) > w / 3 ? h * 0.75 : h;
    out.push(path(brushStroke([[x + px, y], [x + px, y - ph]], { width: 5 * s, taperStart: 0.02, taperEnd: 0.02, rng }), { fill: INK.thick }));
  }
  out.push(rect(x - w / 5, y - h + 14 * s, (w * 2) / 5, 14 * s, { fill: INK.heavy, opacity: 0.6 }));
  out.push(roof(rng, x, y - h, w * 0.6, 14 * s, s));
  out.push(roof(rng, x - w * 0.36, y - h * 0.75, w * 0.36, 11 * s, s * 0.8));
  out.push(roof(rng, x + w * 0.36, y - h * 0.75, w * 0.36, 11 * s, s * 0.8));
  return g(out, { filter: 'url(#ink-rough)' });
}

/** 石阶：蜿蜒而上的短横线 */
export function stairs(rng: Rng, from: Pt, to: Pt, steps = 30, width = 26): string {
  const out: string[] = [];
  for (let i = 0; i < steps; i++) {
    const t = i / steps;
    const sway = Math.sin(t * Math.PI * 3) * 40 * (1 - t);
    const x = from[0] + (to[0] - from[0]) * t + sway;
    const y = from[1] + (to[1] - from[1]) * t;
    const w = width * (1 - t * 0.75);
    out.push(path(brushStroke([[x - w / 2, y], [x + w / 2, y + rng.range(-1, 1)]], { width: 1.8 * (1 - t * 0.5), taperStart: 0.1, taperEnd: 0.3 }), { fill: INK.heavy, opacity: 0.8 - t * 0.4 }));
  }
  return g(out, { filter: 'url(#ink-rough)' });
}

/** 农舍：茅草顶 */
export function hut(rng: Rng, x: number, y: number, scale = 1): string {
  const s = scale;
  const w = 60 * s;
  const roofPts: Pt[] = [
    [x - w / 2 - 8 * s, y - 26 * s],
    [x - 6 * s, y - 50 * s],
    [x + w / 2 + 8 * s, y - 26 * s],
  ];
  const out = [
    rect(x - w / 2, y - 28 * s, w, 28 * s, { fill: INK.paper, opacity: 0.9 }),
    path(polyPath([...roofPts, [x + w / 2 + 8 * s, y - 24 * s], [x - w / 2 - 8 * s, y - 24 * s]], true), { fill: INK.heavy, opacity: 0.6, filter: 'url(#ink-mottle)' }),
    path(brushStroke(roofPts, { width: 3 * s, rng, taperStart: 0.1, taperEnd: 0.1 }), { fill: INK.burnt }),
    path(brushStroke([[x - w / 2, y - 26 * s], [x - w / 2, y]], { width: 2.2 * s, taperStart: 0.05, taperEnd: 0.05 }), { fill: INK.thick }),
    path(brushStroke([[x + w / 2, y - 26 * s], [x + w / 2, y]], { width: 2.2 * s, taperStart: 0.05, taperEnd: 0.05 }), { fill: INK.thick }),
    rect(x - 6 * s, y - 16 * s, 11 * s, 16 * s, { fill: INK.thick, opacity: 0.8 }),
    rect(x + 12 * s, y - 20 * s, 10 * s, 8 * s, { fill: 'none', stroke: INK.thick, 'stroke-width': 1.2 * s }),
  ];
  return g(out, { filter: 'url(#ink-rough)' });
}

/** 石碑 */
export function stele(rng: Rng, x: number, y: number, scale = 1): string {
  const s = scale;
  const w = 56 * s;
  const h = 150 * s;
  const body: Pt[] = [
    [x - w / 2, y],
    [x - w / 2 + 2 * s, y - h + 14 * s],
    [x - w / 4, y - h],
    [x + w / 4, y - h],
    [x + w / 2 - 2 * s, y - h + 14 * s],
    [x + w / 2, y],
  ];
  return g(
    [
      path(polyPath(body, true), { fill: INK.heavy, opacity: 0.7, filter: 'url(#ink-wash)' }),
      path(polyPath(body, true), { fill: INK.thick, opacity: 0.35, filter: 'url(#ink-mottle)' }),
      path(brushStroke(body.slice(0, 3), { width: 3.5 * s, rng }), { fill: INK.burnt }),
      path(brushStroke(body.slice(3), { width: 3.5 * s, rng }), { fill: INK.burnt }),
      rect(x - w / 2 - 10 * s, y - 4 * s, w + 20 * s, 12 * s, { fill: INK.heavy, opacity: 0.6 }),
    ],
    { filter: 'url(#ink-rough)' },
  );
}

/** 洞口：浓墨拱形 */
export function caveMouth(rng: Rng, x: number, y: number, w: number, h: number): string {
  const arch: Pt[] = [];
  for (let i = 0; i <= 16; i++) {
    const a = Math.PI + (i / 16) * Math.PI;
    arch.push([x + Math.cos(a) * w / 2 + rng.range(-4, 4), y + Math.sin(a) * h + rng.range(-3, 3)]);
  }
  return g(
    [
      path(polyPath([...arch, [x + w / 2, y + 10], [x - w / 2, y + 10]], true), { fill: INK.burnt, opacity: 0.92, filter: 'url(#ink-wash)' }),
      path(brushStroke(arch, { width: 7, rng, wobble: 0.6 }), { fill: INK.burnt, filter: 'url(#ink-rough)' }),
    ],
  );
}

/** 插在地上的古剑 */
export function sword(rng: Rng, x: number, y: number, len: number, angle: number, opacity = 0.9): string {
  const dx = Math.sin(angle);
  const dy = -Math.cos(angle);
  const tip: Pt = [x, y];
  const hilt: Pt = [x + dx * len, y + dy * len];
  const guardC: Pt = [x + dx * len * 0.78, y + dy * len * 0.78];
  const gx = -dy * 9;
  const gy = dx * 9;
  return g(
    [
      path(brushStroke([tip, guardC], { width: 4, taperStart: 0.3, taperEnd: 0, rng }), { fill: INK.thick }),
      path(brushStroke([[guardC[0] - gx, guardC[1] - gy], [guardC[0] + gx, guardC[1] + gy]], { width: 3, taperStart: 0.1, taperEnd: 0.1 }), { fill: INK.burnt }),
      path(brushStroke([guardC, hilt], { width: 2.6, taperStart: 0, taperEnd: 0.1 }), { fill: INK.burnt }),
    ],
    { opacity, filter: 'url(#ink-rough)' },
  );
}
