import type { Rng } from './rng';
import { clamp, polyPath, smooth, type Pt } from './geometry';

export interface BrushOptions {
  width: number;
  /** 起笔 / 收笔的锋长（占全长比例） */
  taperStart?: number;
  taperEnd?: number;
  /** 宽度抖动 0..1，模拟笔毫的不均 */
  wobble?: number;
  /** 起笔时的「顿笔」加粗 */
  press?: number;
  rng?: Rng;
}

/**
 * 毛笔笔触：沿中心线生成宽度可变的闭合轮廓。
 * 这是所有树干、衣纹、人物、雷电等元素的基础。
 */
export function brushStroke(points: Pt[], opts: BrushOptions): string {
  const pts = smooth(points, 8);
  const n = pts.length;
  if (n < 2) return '';
  const { width, taperStart = 0.15, taperEnd = 0.35, wobble = 0.25, press = 0.2, rng } = opts;

  const left: Pt[] = [];
  const right: Pt[] = [];
  let noise = 0;
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(n - 1, i + 1)];
    let dx = b[0] - a[0];
    let dy = b[1] - a[1];
    const len = Math.hypot(dx, dy) || 1;
    dx /= len;
    dy /= len;

    let w = width;
    if (taperStart > 0) w *= Math.pow(clamp(t / taperStart, 0.08, 1), 0.6);
    if (taperEnd > 0) w *= Math.pow(clamp((1 - t) / taperEnd, 0.04, 1), 0.8);
    w *= 1 + press * Math.exp(-Math.pow((t - 0.08) / 0.06, 2));
    if (rng) {
      noise = noise * 0.7 + (rng() - 0.5) * 0.6;
      w *= 1 + noise * wobble;
    }
    const hw = Math.max(0.15, w / 2);
    left.push([pts[i][0] - dy * hw, pts[i][1] + dx * hw]);
    right.push([pts[i][0] + dy * hw, pts[i][1] - dx * hw]);
  }
  return polyPath([...left, ...right.reverse()], true);
}

/** 生成一条带随机弯曲的线（用于树枝、衣纹等） */
export function wanderLine(start: Pt, angle: number, length: number, rng: Rng, segments = 5, bend = 0.25): Pt[] {
  const pts: Pt[] = [start];
  let [x, y] = start;
  let a = angle;
  const step = length / segments;
  for (let i = 0; i < segments; i++) {
    a += (rng() - 0.5) * bend;
    x += Math.cos(a) * step;
    y += Math.sin(a) * step;
    pts.push([x, y]);
  }
  return pts;
}
