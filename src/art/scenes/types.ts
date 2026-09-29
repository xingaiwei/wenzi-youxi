import type { Rng } from '../core/rng';
import type { CanvasOptions } from '../core/svg';

/**
 * 一幅插图。两种来源任选其一：
 * - draw：程序化生成的水墨 SVG（默认）
 * - image：外部位图，路径相对于 public/，如 'art/village.webp'
 *   （可用 AI 绘图工具生成后放入 public/art/，便于逐步替换）
 */
export interface ArtScene {
  /** 画上的竖排题字（仅 SVG 插图） */
  inscription?: string;
  /** 题字位置，默认右上 */
  inscriptionAt?: 'left' | 'right';
  tone?: CanvasOptions['tone'];
  draw?(rng: Rng): string[];
  image?: string;
  /** 位图的替代文字 */
  alt?: string;
}
