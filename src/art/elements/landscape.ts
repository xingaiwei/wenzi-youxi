import { brushStroke } from '../core/brush';
import { polyPath, type Pt } from '../core/geometry';
import { INK } from '../core/palette';
import type { Rng } from '../core/rng';
import { ellipse, g, path, rect } from '../core/svg';

export type Depth = 'far' | 'mid' | 'near';

export interface Peak {
  x: number;
  height: number;
  /** 半宽 */
  width: number;
}

export interface RangeOptions {
  x0?: number;
  x1?: number;
  baseY: number;
  peaks: Peak[];
  depth: Depth;
  /** 着色：墨 / 花青 / 赭石 */
  tint?: 'ink' | 'indigo' | 'ochre';
}

/** 生成山脊线：主峰自动衍生若干次峰，侧坡内凹，叠加分形起伏 */
function ridgeLine(rng: Rng, o: RangeOptions): Pt[] {
  const x0 = o.x0 ?? -20;
  const x1 = o.x1 ?? 820;
  const bumps: (Peak & { k: number })[] = [];
  for (const p of o.peaks) {
    bumps.push({ ...p, k: rng.range(1.5, 2.1) });
    const subs = 2 + Math.floor(rng() * 3);
    for (let i = 0; i < subs; i++) {
      const side = rng.chance(0.5) ? -1 : 1;
      bumps.push({
        x: p.x + side * p.width * rng.range(0.15, 0.55),
        height: p.height * rng.range(0.35, 0.78),
        width: p.width * rng.range(0.3, 0.6),
        k: rng.range(1.3, 2),
      });
    }
  }
  // 预生成多层噪声
  const octaves = [0.02, 0.05, 0.12].map((freq, i) => ({
    freq,
    amp: [0.07, 0.035, 0.015][i],
    phase: rng.range(0, 100),
  }));
  const pts: Pt[] = [];
  for (let x = x0; x <= x1; x += 4) {
    let h = 0;
    for (const b of bumps) {
      const d = Math.abs(x - b.x) / b.width;
      if (d < 1) h = Math.max(h, b.height * Math.pow(1 - d, b.k));
    }
    let n = 0;
    for (const oc of octaves) n += Math.sin(x * oc.freq + oc.phase) * Math.sin(x * oc.freq * 1.7 + oc.phase * 2) * oc.amp;
    pts.push([x, o.baseY - h * (1 + n) - (h > 2 ? rng.range(-0.6, 0.6) : 0)]);
  }
  return pts;
}

/** 地形：画面 + 可查询任意 x 处的地面高度，便于在山上「放」东西 */
export interface Terrain {
  svg: string;
  /** 给定 x，返回山脊 y（超出范围返回 baseY） */
  y(x: number): number;
  toString(): string;
}

export function terrain(rng: Rng, o: RangeOptions): Terrain {
  const ridge = ridgeLine(rng, o);
  const svg = drawRange(rng, o, ridge);
  const y = (x: number) => {
    if (x <= ridge[0][0] || x >= ridge[ridge.length - 1][0]) return o.baseY;
    const i = Math.floor((x - ridge[0][0]) / 4);
    const a = ridge[i];
    const b = ridge[Math.min(ridge.length - 1, i + 1)];
    const t = (x - a[0]) / Math.max(1e-6, b[0] - a[0]);
    return a[1] + (b[1] - a[1]) * t;
  };
  return { svg, y, toString: () => svg };
}

/** 山峦：远山淡而虚，近山浓而实，并加皴擦与苔点 */
export function mountainRange(rng: Rng, o: RangeOptions): string {
  return terrain(rng, o).svg;
}

function drawRange(rng: Rng, o: RangeOptions, ridge: Pt[]): string {
  const bottom = o.baseY + 60;
  const body: Pt[] = [...ridge, [ridge[ridge.length - 1][0], bottom], [ridge[0][0], bottom]];
  const d = polyPath(body, true);
  const parts: string[] = [];

  if (o.depth === 'far') {
    const fill = o.tint === 'indigo' ? 'url(#ink-indigo-fade)' : 'url(#ink-fade-soft)';
    parts.push(path(d, { fill, opacity: 0.45, filter: 'url(#ink-blur-sm)' }));
    return g(parts);
  }

  const fill = o.tint === 'indigo' ? 'url(#ink-indigo-fade)' : o.tint === 'ochre' ? 'url(#ink-ochre-fade)' : 'url(#ink-fade)';
  parts.push(path(d, { fill, opacity: o.depth === 'mid' ? 0.6 : 0.85, filter: 'url(#ink-mottle)' }));
  if (o.tint && o.tint !== 'ink') parts.push(path(d, { fill: 'url(#ink-fade-soft)', opacity: 0.45, filter: 'url(#ink-mottle)' }));

  // 山脊勾勒：只在较高处用笔
  const strokes: string[] = [];
  let seg: Pt[] = [];
  const flush = () => {
    if (seg.length > 4) {
      strokes.push(
        path(brushStroke(seg, { width: o.depth === 'near' ? 4.5 : 2.6, rng, wobble: 0.5, taperStart: 0.1, taperEnd: 0.2 }), {
          fill: INK.burnt,
          opacity: o.depth === 'near' ? 0.85 : 0.55,
        }),
      );
    }
    seg = [];
  };
  for (const p of ridge) {
    if (p[1] < o.baseY - 12 && rng() > 0.02) seg.push(p);
    else flush();
    if (seg.length > 18) flush();
  }
  flush();

  // 皴法：沿山坡向下的短笔
  const texture: string[] = [];
  const count = o.depth === 'near' ? 40 : 18;
  for (let i = 0; i < count; i++) {
    const p = ridge[Math.floor(rng() * ridge.length)];
    const height = o.baseY - p[1];
    if (height < 25) continue;
    const len = rng.range(12, Math.min(70, height * 0.7));
    const lean = rng.range(-0.5, 0.5);
    const y = p[1] + rng.range(4, height * 0.35);
    const x = p[0] + rng.range(-8, 8);
    texture.push(
      path(
        brushStroke(
          [
            [x, y],
            [x + lean * len * 0.5, y + len * 0.5],
            [x + lean * len, y + len],
          ],
          { width: rng.range(1.2, 3), rng, taperStart: 0.3, taperEnd: 0.6 },
        ),
        { fill: INK.heavy, opacity: rng.range(0.25, 0.55) },
      ),
    );
  }

  // 苔点：山脊上的焦墨点
  const dots: string[] = [];
  if (o.depth === 'near') {
    for (let i = 0; i < 28; i++) {
      const p = ridge[Math.floor(rng() * ridge.length)];
      if (o.baseY - p[1] < 30) continue;
      dots.push(
        ellipse(p[0] + rng.range(-3, 3), p[1] + rng.range(-1, 4), rng.range(1.2, 3), rng.range(1, 2.2), {
          fill: INK.burnt,
          opacity: 0.8,
          transform: `rotate(${rng.range(-40, 40)} ${p[0]} ${p[1]})`,
        }),
      );
    }
  }
  parts.push(g(texture, { filter: 'url(#ink-rough)' }), g(strokes, { filter: 'url(#ink-rough)' }), g(dots));
  return g(parts);
}

/** 独立的高耸山峰（如擎天之柱） */
export function spire(rng: Rng, x: number, baseY: number, width: number, height: number, depth: Depth = 'mid'): Terrain {
  return terrain(rng, {
    x0: x - width - 10,
    x1: x + width + 10,
    baseY,
    depth,
    peaks: [
      { x, height, width },
      { x: x + rng.range(-width * 0.4, width * 0.4), height: height * rng.range(0.55, 0.8), width: width * 0.6 },
    ],
  });
}

/** 云雾：用纸色的模糊椭圆「留白」 */
export function mist(x: number, y: number, w: number, h: number, opacity = 0.9): string {
  return ellipse(x, y, w / 2, h / 2, { fill: INK.paper, opacity, filter: 'url(#ink-mist)' });
}

export function mistBand(rng: Rng, y: number, count = 5, opacity = 0.85): string {
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    out.push(mist(rng.range(-50, 850), y + rng.range(-15, 15), rng.range(220, 420), rng.range(40, 80), opacity));
  }
  return g(out);
}

/** 水波：断续的横向淡墨线 */
export function waterLines(rng: Rng, y0: number, y1: number, x0 = 0, x1 = 800, density = 18): string {
  const out: string[] = [];
  for (let i = 0; i < density; i++) {
    const y = rng.range(y0, y1);
    const t = (y - y0) / Math.max(1, y1 - y0);
    const len = rng.range(30, 110) * (0.6 + t);
    const x = rng.range(x0, x1 - len);
    const wave = rng.range(1, 3);
    out.push(
      path(
        brushStroke(
          [
            [x, y],
            [x + len * 0.33, y - wave],
            [x + len * 0.66, y + wave],
            [x + len, y],
          ],
          { width: 1 + t * 1.5, rng, taperStart: 0.3, taperEnd: 0.4 },
        ),
        { fill: INK.light, opacity: 0.3 + t * 0.35 },
      ),
    );
  }
  return g(out, { filter: 'url(#ink-rough)' });
}

/** 瀑布：一道留白的水帘、纵向细线与底部水雾（崖壁由地形负责） */
export function waterfall(rng: Rng, x: number, top: number, bottom: number, width: number): string {
  const lines: string[] = [];
  for (let i = 0; i < 22; i++) {
    const lx = x + rng.range(-width / 2, width / 2);
    const ly = rng.range(top, bottom - 40);
    const len = rng.range(40, 140);
    lines.push(
      path(
        brushStroke(
          [
            [lx, ly],
            [lx + rng.range(-1, 1), ly + len / 2],
            [lx + rng.range(-2, 2), ly + len],
          ],
          { width: rng.range(0.6, 1.6), rng, taperStart: 0.4, taperEnd: 0.5 },
        ),
        { fill: INK.light, opacity: 0.5 },
      ),
    );
  }
  return g([
    rect(x - width / 2, top, width, bottom - top, { fill: INK.paper, opacity: 0.92, filter: 'url(#ink-blur-sm)' }),
    g(lines, { filter: 'url(#ink-rough)' }),
    mist(x, bottom, width * 5, 90, 0.95),
    mist(x, bottom - 20, width * 3, 60, 0.9),
  ]);
}

/** 浓云：层层叠加的斑驳墨团 */
export function darkClouds(rng: Rng, y: number, count = 10, opacity = 0.75): string {
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    const cx = rng.range(-40, 840);
    const cy = y + rng.range(-40, 40);
    out.push(
      ellipse(cx, cy, rng.range(90, 180), rng.range(30, 60), {
        fill: rng.chance(0.5) ? INK.thick : INK.heavy,
        opacity: rng.range(0.4, 1) * opacity,
      }),
    );
  }
  return g(out, { filter: 'url(#ink-wash)' });
}

/** 祥云：卷曲的云纹 */
export function auspiciousCloud(rng: Rng, x: number, y: number, scale = 1): string {
  const s = scale;
  const curl = (cx: number, cy: number, r: number, dir: number) => {
    const pts: Pt[] = [];
    for (let a = 0; a < Math.PI * 1.6; a += 0.3) {
      const rr = r * (1 - a / (Math.PI * 2.2));
      pts.push([cx + Math.cos(a * dir + Math.PI) * rr, cy + Math.sin(a * dir + Math.PI) * rr]);
    }
    return pts;
  };
  const strokes = [
    curl(x, y, 14 * s, 1),
    curl(x + 26 * s, y - 6 * s, 18 * s, -1),
    [
      [x - 40 * s, y + 10 * s],
      [x, y + 14 * s],
      [x + 40 * s, y + 12 * s],
      [x + 70 * s, y + 6 * s],
    ] as Pt[],
  ];
  return g(
    strokes.map((p) => path(brushStroke(p, { width: 2.4 * s, rng, taperStart: 0.2, taperEnd: 0.5 }), { fill: INK.heavy, opacity: 0.7 })),
    { filter: 'url(#ink-rough)' },
  );
}

/** 地面 / 坡岸 */
export function bank(rng: Rng, x0: number, x1: number, y: number, rise = 20, tone: string = INK.heavy): string {
  const pts: Pt[] = [];
  for (let x = x0; x <= x1; x += 20) {
    const t = (x - x0) / (x1 - x0);
    pts.push([x, y - Math.sin(t * Math.PI) * rise + rng.range(-2, 2)]);
  }
  const body = [...pts, [x1, y + 80], [x0, y + 80]] as Pt[];
  return g([
    path(polyPath(body, true), { fill: 'url(#ink-fade)', opacity: 0.55, filter: 'url(#ink-mottle)' }),
    path(brushStroke(pts, { width: 3, rng, wobble: 0.6 }), { fill: tone, opacity: 0.75, filter: 'url(#ink-rough)' }),
  ]);
}
