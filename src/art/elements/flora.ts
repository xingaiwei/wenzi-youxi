import { brushStroke, wanderLine } from '../core/brush';
import type { Pt } from '../core/geometry';
import { INK } from '../core/palette';
import type { Rng } from '../core/rng';
import { ellipse, g, path } from '../core/svg';

/** 松：虬干、平枝、扇形松针 */
export function pine(rng: Rng, x: number, y: number, scale = 1, lean = 0): string {
  const h = 150 * scale;
  const trunk: Pt[] = [];
  for (let i = 0; i <= 5; i++) {
    const t = i / 5;
    trunk.push([x + Math.sin(t * 3 + rng()) * 10 * scale + lean * t * h * 0.4, y - t * h]);
  }
  const parts: string[] = [
    path(brushStroke(trunk, { width: 11 * scale, rng, taperStart: 0, taperEnd: 0.5, wobble: 0.5 }), {
      fill: INK.thick,
      opacity: 0.9,
    }),
  ];
  // 树皮鳞纹
  for (let i = 0; i < 6; i++) {
    const p = trunk[1 + Math.floor(rng() * 3)];
    parts.push(ellipse(p[0] + rng.range(-3, 3) * scale, p[1] + rng.range(-10, 10) * scale, 3 * scale, 1.6 * scale, { fill: INK.paper, opacity: 0.5 }));
  }

  const clusters: Pt[] = [];
  const branchCount = 4 + Math.floor(rng() * 2);
  for (let i = 0; i < branchCount; i++) {
    const t = 0.35 + (i / branchCount) * 0.65;
    const idx = Math.min(trunk.length - 1, Math.round(t * (trunk.length - 1)));
    const base = trunk[idx];
    const dir = i % 2 === 0 ? -1 : 1;
    const len = (60 - i * 6) * scale * rng.range(0.8, 1.2);
    const angle = dir < 0 ? Math.PI + rng.range(-0.25, 0.1) : rng.range(-0.1, 0.25);
    const branch = wanderLine(base, angle, len, rng, 3, 0.4);
    parts.push(path(brushStroke(branch, { width: 4 * scale, rng, taperStart: 0, taperEnd: 0.8 }), { fill: INK.thick }));
    clusters.push(branch[branch.length - 1], branch[Math.floor(branch.length / 2)]);
  }
  clusters.push(trunk[trunk.length - 1]);

  for (const c of clusters) parts.push(needleCluster(rng, c[0], c[1], scale));
  return g(parts, { filter: 'url(#ink-rough)' });
}

function needleCluster(rng: Rng, x: number, y: number, scale: number): string {
  const out: string[] = [ellipse(x, y - 4 * scale, 30 * scale, 11 * scale, { fill: INK.heavy, opacity: 0.35, filter: 'url(#ink-blur-sm)' })];
  const fans = 2 + Math.floor(rng() * 2);
  for (let f = 0; f < fans; f++) {
    const cx = x + rng.range(-18, 18) * scale;
    const cy = y + rng.range(-8, 2) * scale;
    for (let i = 0; i < 11; i++) {
      const a = Math.PI + (i / 10) * Math.PI + rng.range(-0.08, 0.08);
      const len = rng.range(12, 18) * scale;
      out.push(
        path(
          brushStroke(
            [
              [cx, cy],
              [cx + Math.cos(a) * len, cy + Math.sin(a) * len * 0.55],
            ],
            { width: 1.4 * scale, taperStart: 0, taperEnd: 0.9, press: 0 },
          ),
          { fill: INK.burnt, opacity: 0.85 },
        ),
      );
    }
  }
  return g(out);
}

/** 竹：分节的竿，「个」「介」字形竹叶 */
export function bamboo(rng: Rng, x: number, y: number, height: number, scale = 1, tone: string = INK.thick): string {
  const out: string[] = [];
  const nodes = Math.max(3, Math.round(height / (55 * scale)));
  const bend = rng.range(-12, 12) * scale;
  let prev: Pt = [x, y];
  const w = 6 * scale;
  for (let i = 1; i <= nodes; i++) {
    const t = i / nodes;
    const p: Pt = [x + bend * t * t, y - height * t];
    const a: Pt = [prev[0], prev[1] - 2];
    const b: Pt = [p[0], p[1] + 2];
    out.push(path(brushStroke([a, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], b], { width: w, taperStart: 0.04, taperEnd: 0.04, press: 0.35, rng, wobble: 0.1 }), { fill: tone }));
    // 竹节
    out.push(path(brushStroke([[p[0] - w * 0.8, p[1] + 1], [p[0], p[1] - 1], [p[0] + w * 0.8, p[1] + 1]], { width: 1.6 * scale, taperStart: 0.2, taperEnd: 0.2 }), { fill: INK.burnt }));
    if (i > nodes * 0.4 && rng.chance(0.6)) out.push(leafGroup(rng, p[0], p[1], scale, rng.chance(0.5) ? -1 : 1, tone));
    prev = p;
  }
  return g(out, { filter: 'url(#ink-rough)' });
}

function leafGroup(rng: Rng, x: number, y: number, scale: number, dir: number, tone: string): string {
  const out: string[] = [];
  const count = 3 + Math.floor(rng() * 2);
  for (let i = 0; i < count; i++) {
    const a = (dir > 0 ? 0.3 : Math.PI - 0.3) + (i - count / 2) * 0.45 * dir + rng.range(-0.15, 0.15);
    const len = rng.range(28, 42) * scale;
    const mid: Pt = [x + Math.cos(a) * len * 0.5, y + Math.sin(a) * len * 0.5 + 3 * scale];
    const end: Pt = [x + Math.cos(a) * len, y + Math.sin(a) * len + 6 * scale];
    out.push(path(brushStroke([[x, y], mid, end], { width: 6 * scale, taperStart: 0.25, taperEnd: 0.7, press: 0.1, rng }), { fill: tone, opacity: rng.range(0.7, 0.95) }));
  }
  return g(out);
}

/** 枯树：递归枝杈，无叶 */
export function witheredTree(rng: Rng, x: number, y: number, scale = 1): string {
  const out: string[] = [];
  const grow = (start: Pt, angle: number, len: number, width: number, depth: number) => {
    const line = wanderLine(start, angle, len, rng, 3, 0.5);
    out.push(path(brushStroke(line, { width, rng, taperStart: 0, taperEnd: 0.7, wobble: 0.5 }), { fill: INK.thick, opacity: 0.9 }));
    if (depth <= 0) return;
    const end = line[line.length - 1];
    const n = 2 + (rng.chance(0.4) ? 1 : 0);
    for (let i = 0; i < n; i++) {
      grow(end, angle + rng.range(-0.9, 0.9), len * rng.range(0.55, 0.75), width * 0.6, depth - 1);
    }
  };
  grow([x, y], -Math.PI / 2 + rng.range(-0.2, 0.2), 90 * scale, 12 * scale, 4);
  return g(out, { filter: 'url(#ink-rough)' });
}

/** 草：几笔兰叶式的细草 */
export function grass(rng: Rng, x: number, y: number, scale = 1, count = 6): string {
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    const a = -Math.PI / 2 + rng.range(-0.9, 0.9);
    const len = rng.range(14, 34) * scale;
    const end: Pt = [x + Math.cos(a) * len, y + Math.sin(a) * len];
    const mid: Pt = [x + Math.cos(a) * len * 0.5 + rng.range(-3, 3), y + Math.sin(a) * len * 0.5];
    out.push(path(brushStroke([[x + rng.range(-4, 4), y], mid, end], { width: 1.8 * scale, taperStart: 0.1, taperEnd: 0.8, rng }), { fill: INK.thick, opacity: 0.8 }));
  }
  return g(out);
}

/** 远树：一排点状的小树 */
export function distantTrees(rng: Rng, x0: number, x1: number, y: number, opacity = 0.5): string {
  const out: string[] = [];
  for (let x = x0; x < x1; x += rng.range(8, 18)) {
    const h = rng.range(8, 20);
    out.push(path(brushStroke([[x, y], [x + rng.range(-1, 1), y - h]], { width: rng.range(4, 8), taperStart: 0.1, taperEnd: 0.8 }), { fill: INK.heavy, opacity: opacity * rng.range(0.6, 1) }));
  }
  return g(out, { filter: 'url(#ink-blur-sm)' });
}
