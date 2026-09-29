/** 插图专用的可复现随机数：同一幅画每次渲染都一样 */
export interface Rng {
  (): number;
  range(min: number, max: number): number;
  int(min: number, max: number): number;
  pick<T>(arr: readonly T[]): T;
  /** 以 v 为中心，±spread 的抖动 */
  jitter(v: number, spread: number): number;
  chance(p: number): boolean;
}

export function createRng(seed: number | string): Rng {
  let s = typeof seed === 'number' ? seed >>> 0 : hashString(seed);
  const next = (() => {
    s = (s + 0x6d2b79f5) >>> 0;
    let r = Math.imul(s ^ (s >>> 15), s | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  }) as Rng;
  next.range = (min, max) => min + next() * (max - min);
  next.int = (min, max) => Math.floor(next.range(min, max + 1));
  next.pick = (arr) => arr[Math.floor(next() * arr.length)];
  next.jitter = (v, spread) => v + (next() * 2 - 1) * spread;
  next.chance = (p) => next() < p;
  return next;
}

function hashString(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
