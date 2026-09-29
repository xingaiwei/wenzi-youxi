import { brushStroke } from '../core/brush';
import { polyPath, type Pt } from '../core/geometry';
import { INK } from '../core/palette';
import type { Rng } from '../core/rng';
import { circle, ellipse, g, path } from '../core/svg';

export type Pose = 'stand' | 'sit' | 'walk';

export interface FigureOptions {
  pose?: Pose;
  /** 面朝方向 */
  facing?: 1 | -1;
  beard?: boolean;
  staff?: boolean;
  /** 长袍色调 */
  robe?: string;
  /** 飘带 / 衣袂飞扬 */
  flowing?: boolean;
  opacity?: number;
}

/** 写意人物：寥寥几笔的点景人物 */
export function figure(rng: Rng, x: number, y: number, scale = 1, o: FigureOptions = {}): string {
  const s = scale;
  const f = o.facing ?? 1;
  const robe = o.robe ?? INK.heavy;
  const out: string[] = [];

  if (o.pose === 'sit') {
    // 盘坐：三角形衣摆
    const body: Pt[] = [
      [x - 16 * s, y],
      [x - 7 * s, y - 20 * s],
      [x, y - 27 * s],
      [x + 7 * s, y - 20 * s],
      [x + 16 * s, y],
    ];
    out.push(path(polyPath(body, true), { fill: robe, opacity: 0.55 }));
    out.push(path(brushStroke([body[0], body[1], body[2]], { width: 2.6 * s, rng }), { fill: INK.burnt }));
    out.push(path(brushStroke([body[2], body[3], body[4]], { width: 2.6 * s, rng }), { fill: INK.burnt }));
    out.push(path(brushStroke([[x - 17 * s, y], [x, y - 3 * s], [x + 17 * s, y]], { width: 2.4 * s, rng }), { fill: INK.burnt }));
    out.push(circle(x, y - 32 * s, 5 * s, { fill: INK.thick }));
    out.push(ellipse(x, y - 38 * s, 2.6 * s, 2.2 * s, { fill: INK.burnt }));
    return g(out, { opacity: o.opacity ?? 1, filter: 'url(#ink-rough)' });
  }

  const walk = o.pose === 'walk' ? 1 : 0;
  const h = 46 * s;
  const neck: Pt = [x, y - h + 8 * s];
  const hemL: Pt = [x - 11 * s - walk * 4 * s * f, y];
  const hemR: Pt = [x + 10 * s + walk * 6 * s * f, y];
  const robeBody: Pt[] = [neck, [x - 7 * s, y - h * 0.55], hemL, hemR, [x + 7 * s, y - h * 0.55]];
  out.push(path(polyPath(robeBody, true), { fill: robe, opacity: 0.5 }));
  out.push(path(brushStroke([neck, [x - 6 * s, y - h * 0.5], hemL], { width: 2.8 * s, rng }), { fill: INK.burnt }));
  out.push(path(brushStroke([neck, [x + 5 * s * f, y - h * 0.45], hemR], { width: 2.2 * s, rng }), { fill: INK.burnt }));
  out.push(path(brushStroke([hemL, [x, y + 1 * s], hemR], { width: 2 * s, rng }), { fill: INK.burnt }));
  // 衣袖
  out.push(
    path(brushStroke([[x + 2 * s * f, y - h * 0.72], [x + 12 * s * f, y - h * 0.5], [x + 8 * s * f, y - h * 0.35]], { width: 5 * s, rng }), {
      fill: INK.thick,
      opacity: 0.85,
    }),
  );
  if (o.flowing) {
    out.push(
      path(
        brushStroke(
          [
            [x - 4 * s * f, y - h * 0.7],
            [x - 22 * s * f, y - h * 0.6],
            [x - 36 * s * f, y - h * 0.7],
            [x - 48 * s * f, y - h * 0.55],
          ],
          { width: 2.2 * s, rng, taperStart: 0.1, taperEnd: 0.8 },
        ),
        { fill: INK.heavy, opacity: 0.8 },
      ),
    );
  }
  // 头与发髻
  out.push(circle(x + 1 * s * f, y - h + 2 * s, 5 * s, { fill: INK.thick }));
  out.push(ellipse(x, y - h - 4 * s, 2.8 * s, 2.4 * s, { fill: INK.burnt }));
  if (o.beard) {
    out.push(
      path(brushStroke([[x + 3 * s * f, y - h + 5 * s], [x + 5 * s * f, y - h + 14 * s], [x + 4 * s * f, y - h + 22 * s]], { width: 2.6 * s, rng, taperStart: 0.1 }), {
        fill: INK.clear,
        opacity: 0.9,
      }),
    );
  }
  if (o.staff) {
    out.push(path(brushStroke([[x + 14 * s * f, y + 2 * s], [x + 13 * s * f, y - h - 8 * s]], { width: 2 * s, rng, taperStart: 0.02, taperEnd: 0.05 }), { fill: INK.burnt }));
  }
  return g(out, { opacity: o.opacity ?? 1, filter: 'url(#ink-rough)' });
}

/** 黑袍魔修：高大、面目隐于阴影 */
export function demonFigure(rng: Rng, x: number, y: number, scale = 1): string {
  const s = scale;
  const h = 150 * s;
  const cloak: Pt[] = [
    [x, y - h],
    [x - 20 * s, y - h * 0.8],
    [x - 34 * s, y - h * 0.3],
    [x - 58 * s, y + 4 * s],
    [x + 58 * s, y + 4 * s],
    [x + 34 * s, y - h * 0.3],
    [x + 20 * s, y - h * 0.8],
  ];
  const tatters: string[] = [];
  for (let i = 0; i < 9; i++) {
    const bx = x - 55 * s + (i / 8) * 110 * s;
    tatters.push(
      path(brushStroke([[bx, y - 10 * s], [bx + rng.range(-10, 10) * s, y + rng.range(10, 30) * s]], { width: 5 * s, rng, taperStart: 0, taperEnd: 0.9 }), {
        fill: INK.burnt,
        opacity: 0.8,
      }),
    );
  }
  return g([
    ellipse(x, y - h * 0.5, 130 * s, 110 * s, { fill: 'url(#ink-blood)', filter: 'url(#ink-blur-md)' }),
    path(polyPath(cloak, true), { fill: INK.burnt, opacity: 0.92, filter: 'url(#ink-wash)' }),
    g(tatters, { filter: 'url(#ink-rough)' }),
    // 兜帽下的眼
    ellipse(x - 6 * s, y - h * 0.83, 3 * s, 1.3 * s, { fill: INK.cinnabar }),
    ellipse(x + 6 * s, y - h * 0.83, 3 * s, 1.3 * s, { fill: INK.cinnabar }),
  ]);
}

/** 扁舟 */
export function boat(rng: Rng, x: number, y: number, scale = 1, withFisher = true): string {
  const s = scale;
  const hull: Pt[] = [
    [x - 50 * s, y - 8 * s],
    [x - 30 * s, y + 4 * s],
    [x + 30 * s, y + 4 * s],
    [x + 52 * s, y - 10 * s],
  ];
  const out = [
    path(polyPath([...hull, [x + 40 * s, y - 4 * s], [x - 40 * s, y - 3 * s]], true), { fill: INK.thick, opacity: 0.8 }),
    path(brushStroke(hull, { width: 3 * s, rng, taperStart: 0.2, taperEnd: 0.2 }), { fill: INK.burnt }),
    // 篷
    path(brushStroke([[x - 20 * s, y - 4 * s], [x - 8 * s, y - 18 * s], [x + 8 * s, y - 18 * s], [x + 18 * s, y - 4 * s]], { width: 5 * s, rng }), {
      fill: INK.heavy,
      opacity: 0.85,
    }),
  ];
  if (withFisher) {
    out.push(figure(rng, x + 32 * s, y - 4 * s, 0.45 * s, { pose: 'sit' }));
    out.push(path(brushStroke([[x + 36 * s, y - 14 * s], [x + 70 * s, y - 50 * s], [x + 100 * s, y - 60 * s]], { width: 1.2 * s, taperStart: 0, taperEnd: 0.6 }), { fill: INK.burnt }));
  }
  out.push(ellipse(x, y + 6 * s, 70 * s, 4 * s, { fill: INK.light, opacity: 0.3, filter: 'url(#ink-blur-sm)' }));
  return g(out, { filter: 'url(#ink-rough)' });
}

/** 远飞的鸟群 */
export function birds(rng: Rng, x: number, y: number, count = 5, scale = 1): string {
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    const bx = x + rng.range(-60, 60) * scale;
    const by = y + rng.range(-25, 25) * scale;
    const w = rng.range(6, 10) * scale;
    out.push(
      path(brushStroke([[bx - w, by - w * 0.3], [bx - w * 0.3, by - w * 0.4], [bx, by]], { width: 1.8 * scale, taperStart: 0.6, taperEnd: 0 }), { fill: INK.thick }),
      path(brushStroke([[bx, by], [bx + w * 0.4, by - w * 0.5], [bx + w, by - w * 0.4]], { width: 1.8 * scale, taperStart: 0, taperEnd: 0.6 }), { fill: INK.thick }),
    );
  }
  return g(out);
}

/** 仙鹤 */
export function crane(rng: Rng, x: number, y: number, scale = 1, facing: 1 | -1 = 1): string {
  const s = scale;
  const f = facing;
  const body: Pt[] = [
    [x - 22 * s * f, y],
    [x, y - 6 * s],
    [x + 18 * s * f, y - 2 * s],
  ];
  return g(
    [
      // 翅膀
      path(brushStroke([[x - 4 * s * f, y - 4 * s], [x - 14 * s * f, y - 30 * s], [x - 40 * s * f, y - 44 * s]], { width: 9 * s, rng, taperStart: 0, taperEnd: 0.5 }), {
        fill: INK.light,
        opacity: 0.5,
      }),
      path(brushStroke([[x - 26 * s * f, y - 38 * s], [x - 40 * s * f, y - 44 * s]], { width: 5 * s, taperStart: 0.1, taperEnd: 0.6 }), { fill: INK.burnt }),
      path(brushStroke([[x + 4 * s * f, y - 4 * s], [x + 10 * s * f, y - 26 * s], [x + 2 * s * f, y - 46 * s]], { width: 8 * s, rng, taperStart: 0, taperEnd: 0.5 }), {
        fill: INK.light,
        opacity: 0.4,
      }),
      path(brushStroke([[x + 6 * s * f, y - 36 * s], [x + 2 * s * f, y - 46 * s]], { width: 4 * s, taperStart: 0.1, taperEnd: 0.6 }), { fill: INK.burnt }),
      // 身、颈、腿
      path(brushStroke(body, { width: 7 * s, rng, taperStart: 0.4, taperEnd: 0.4 }), { fill: INK.clear, opacity: 0.9 }),
      path(brushStroke([[x + 18 * s * f, y - 2 * s], [x + 30 * s * f, y - 4 * s], [x + 42 * s * f, y - 3 * s]], { width: 2.2 * s, taperStart: 0, taperEnd: 0.4 }), { fill: INK.burnt }),
      path(brushStroke([[x - 22 * s * f, y], [x - 46 * s * f, y + 6 * s]], { width: 1.4 * s, taperStart: 0, taperEnd: 0.2 }), { fill: INK.burnt }),
      circle(x + 41 * s * f, y - 4 * s, 2 * s, { fill: INK.cinnabar }),
    ],
    { filter: 'url(#ink-rough)' },
  );
}

/** 妖兽：雾中若隐若现的狼首、一双幽绿的眼与爪痕 */
export function beastInMist(rng: Rng, x: number, y: number, scale = 1): string {
  const s = scale;
  const washes: string[] = [];
  for (let i = 0; i < 9; i++) {
    washes.push(
      ellipse(x + rng.range(-120, 120) * s, y + rng.range(-10, 60) * s, rng.range(60, 120) * s, rng.range(30, 60) * s, {
        fill: INK.burnt,
        opacity: rng.range(0.25, 0.5),
      }),
    );
  }
  // 狼首轮廓：吻部朝左
  const head: Pt[] = [
    [x + 40 * s, y + 30 * s],
    [x + 30 * s, y - 40 * s],
    [x + 18 * s, y - 88 * s],
    [x - 2 * s, y - 52 * s],
    [x - 30 * s, y - 50 * s],
    [x - 44 * s, y - 92 * s],
    [x - 56 * s, y - 40 * s],
    [x - 110 * s, y - 10 * s],
    [x - 118 * s, y + 4 * s],
    [x - 70 * s, y + 16 * s],
    [x - 40 * s, y + 40 * s],
  ];
  const out: string[] = [
    g(washes, { filter: 'url(#ink-wash)' }),
    path(polyPath(head, true), { fill: INK.burnt, opacity: 0.88, filter: 'url(#ink-wash)' }),
    path(brushStroke(head.slice(1, 8), { width: 5 * s, rng, wobble: 0.6 }), { fill: INK.burnt, filter: 'url(#ink-rough)' }),
    // 獠牙
    path(brushStroke([[x - 96 * s, y + 4 * s], [x - 92 * s, y + 16 * s]], { width: 3 * s, taperStart: 0, taperEnd: 1 }), { fill: INK.paper }),
    path(brushStroke([[x - 80 * s, y + 6 * s], [x - 77 * s, y + 18 * s]], { width: 3 * s, taperStart: 0, taperEnd: 1 }), { fill: INK.paper }),
    // 眼
    ellipse(x - 40 * s, y - 30 * s, 22 * s, 10 * s, { fill: '#e8f0a0', opacity: 0.25, filter: 'url(#ink-blur-sm)' }),
    path(brushStroke([[x - 52 * s, y - 28 * s], [x - 40 * s, y - 33 * s], [x - 28 * s, y - 30 * s]], { width: 6 * s, taperStart: 0.3, taperEnd: 0.5 }), { fill: '#c9d27a' }),
    ellipse(x - 40 * s, y - 31 * s, 1.6 * s, 3 * s, { fill: INK.burnt }),
  ];
  // 爪痕
  for (let i = 0; i < 3; i++) {
    const ox = x + 120 * s + i * 18 * s;
    out.push(
      path(brushStroke([[ox, y - 70 * s], [ox + 20 * s, y - 10 * s], [ox + 26 * s, y + 40 * s]], { width: 7 * s, rng, taperStart: 0.3, taperEnd: 0.8 }), {
        fill: INK.burnt,
        opacity: 0.85,
        filter: 'url(#ink-rough)',
      }),
    );
  }
  return g(out);
}
