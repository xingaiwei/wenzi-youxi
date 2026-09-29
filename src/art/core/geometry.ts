export type Pt = [number, number];

/** Catmull-Rom 平滑，返回更密的点列 */
export function smooth(points: Pt[], samples = 6): Pt[] {
  if (points.length < 3) return points;
  const out: Pt[] = [];
  const p = [points[0], ...points, points[points.length - 1]];
  for (let i = 1; i < p.length - 2; i++) {
    const [p0, p1, p2, p3] = [p[i - 1], p[i], p[i + 1], p[i + 2]];
    for (let j = 0; j < samples; j++) {
      const t = j / samples;
      const t2 = t * t;
      const t3 = t2 * t;
      out.push([
        0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
        0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3),
      ]);
    }
  }
  out.push(points[points.length - 1]);
  return out;
}

export const f = (n: number) => (Math.round(n * 10) / 10).toString();

export function polyPath(points: Pt[], close = false): string {
  if (!points.length) return '';
  const [first, ...rest] = points;
  return `M${f(first[0])},${f(first[1])}` + rest.map(([x, y]) => `L${f(x)},${f(y)}`).join('') + (close ? 'Z' : '');
}

/** 通过二次贝塞尔中点法得到更圆润的闭合路径 */
export function roundedPath(points: Pt[], close = true): string {
  if (points.length < 3) return polyPath(points, close);
  const mid = (a: Pt, b: Pt): Pt => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const pts = close ? points : points;
  let d = `M${f(mid(pts[0], pts[1])[0])},${f(mid(pts[0], pts[1])[1])}`;
  const n = pts.length;
  for (let i = 1; i < (close ? n + 1 : n - 1); i++) {
    const p = pts[i % n];
    const m = mid(p, pts[(i + 1) % n]);
    d += `Q${f(p[0])},${f(p[1])} ${f(m[0])},${f(m[1])}`;
  }
  return d + (close ? 'Z' : '');
}

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
