import { INK } from './palette';

export const VIEW_W = 800;
export const VIEW_H = 500;

type Attrs = Record<string, string | number | undefined>;

export function attrs(a: Attrs): string {
  return Object.entries(a)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${k}="${v}"`)
    .join(' ');
}

export const path = (d: string, a: Attrs = {}) => `<path d="${d}" ${attrs(a)}/>`;
export const g = (children: string | string[], a: Attrs = {}) =>
  `<g ${attrs(a)}>${Array.isArray(children) ? children.join('') : children}</g>`;
export const ellipse = (cx: number, cy: number, rx: number, ry: number, a: Attrs = {}) =>
  `<ellipse ${attrs({ cx, cy, rx, ry, ...a })}/>`;
export const circle = (cx: number, cy: number, r: number, a: Attrs = {}) => `<circle ${attrs({ cx, cy, r, ...a })}/>`;
export const rect = (x: number, y: number, width: number, height: number, a: Attrs = {}) =>
  `<rect ${attrs({ x, y, width, height, ...a })}/>`;

/**
 * 全局共享的滤镜与渐变。插入文档一次后，页面中所有插图都可以 url(#ink-xxx) 引用。
 */
export const INK_DEFS = `
<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style="position:absolute" aria-hidden="true">
<defs>
  <!-- 墨迹边缘的毛糙感 -->
  <filter id="ink-rough" x="-10%" y="-10%" width="120%" height="120%">
    <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" seed="3" result="n"/>
    <feDisplacementMap in="SourceGraphic" in2="n" scale="4" xChannelSelector="R" yChannelSelector="G"/>
  </filter>
  <!-- 晕染：边缘毛糙 + 轻微模糊 -->
  <filter id="ink-wash" x="-10%" y="-10%" width="120%" height="120%">
    <feTurbulence type="fractalNoise" baseFrequency="0.025" numOctaves="4" seed="7" result="n"/>
    <feDisplacementMap in="SourceGraphic" in2="n" scale="10" xChannelSelector="R" yChannelSelector="G" result="d"/>
    <feGaussianBlur in="d" stdDeviation="1.4"/>
  </filter>
  <!-- 斑驳墨色：以噪声调制透明度，模拟宣纸吃墨不均 -->
  <filter id="ink-mottle" x="-5%" y="-5%" width="110%" height="110%">
    <feTurbulence type="fractalNoise" baseFrequency="0.018 0.05" numOctaves="4" seed="11" result="n"/>
    <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1.6 -0.35" result="a"/>
    <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" seed="5" result="n2"/>
    <feDisplacementMap in="SourceGraphic" in2="n2" scale="8" xChannelSelector="R" yChannelSelector="G" result="d"/>
    <feComposite in="d" in2="a" operator="in" result="c"/>
    <feGaussianBlur in="c" stdDeviation="0.6"/>
  </filter>
  <!-- 远景 / 雾 -->
  <filter id="ink-blur-sm"><feGaussianBlur stdDeviation="2.5"/></filter>
  <filter id="ink-blur-md"><feGaussianBlur stdDeviation="6"/></filter>
  <filter id="ink-mist" x="-30%" y="-100%" width="160%" height="300%"><feGaussianBlur stdDeviation="16"/></filter>
  <!-- 宣纸纹理 -->
  <filter id="ink-paper" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed="2" result="grain"/>
    <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0.35  0 0 0 0 0.3  0 0 0 0 0.22  0 0 0 0.9 -0.38"/>
  </filter>
  <filter id="ink-fiber" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.004 0.09" numOctaves="2" seed="9" result="f"/>
    <feColorMatrix in="f" type="matrix" values="0 0 0 0 0.4  0 0 0 0 0.33  0 0 0 0 0.22  0 0 0 0.5 -0.2"/>
  </filter>

  <linearGradient id="ink-fade" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${INK.burnt}" stop-opacity="0.95"/>
    <stop offset="0.45" stop-color="${INK.heavy}" stop-opacity="0.55"/>
    <stop offset="1" stop-color="${INK.light}" stop-opacity="0"/>
  </linearGradient>
  <linearGradient id="ink-fade-soft" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${INK.heavy}" stop-opacity="0.75"/>
    <stop offset="0.6" stop-color="${INK.light}" stop-opacity="0.25"/>
    <stop offset="1" stop-color="${INK.clear}" stop-opacity="0"/>
  </linearGradient>
  <linearGradient id="ink-fade-up" x1="0" y1="1" x2="0" y2="0">
    <stop offset="0" stop-color="${INK.burnt}" stop-opacity="0.9"/>
    <stop offset="1" stop-color="${INK.heavy}" stop-opacity="0"/>
  </linearGradient>
  <linearGradient id="ink-indigo-fade" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${INK.indigo}" stop-opacity="0.55"/>
    <stop offset="1" stop-color="${INK.indigo}" stop-opacity="0"/>
  </linearGradient>
  <linearGradient id="ink-ochre-fade" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${INK.ochre}" stop-opacity="0.5"/>
    <stop offset="1" stop-color="${INK.ochre}" stop-opacity="0"/>
  </linearGradient>
  <radialGradient id="ink-vignette" cx="0.5" cy="0.5" r="0.75">
    <stop offset="0.55" stop-color="${INK.paperDeep}" stop-opacity="0"/>
    <stop offset="1" stop-color="#9c8a66" stop-opacity="0.55"/>
  </radialGradient>
  <radialGradient id="ink-glow" cx="0.5" cy="0.5" r="0.5">
    <stop offset="0" stop-color="#fffaf0" stop-opacity="0.95"/>
    <stop offset="0.5" stop-color="#fff6e2" stop-opacity="0.4"/>
    <stop offset="1" stop-color="#fff6e2" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="ink-blood" cx="0.5" cy="0.5" r="0.5">
    <stop offset="0" stop-color="${INK.cinnabar}" stop-opacity="0.55"/>
    <stop offset="1" stop-color="${INK.cinnabar}" stop-opacity="0"/>
  </radialGradient>
</defs>
</svg>`;

export interface CanvasOptions {
  /** 背景色调：宣纸 / 夜色 */
  tone?: 'paper' | 'dusk' | 'night';
  title?: string;
}

/** 把一组元素包装成一幅完整的画（含宣纸底与暗角） */
export function canvas(content: string[], opts: CanvasOptions = {}): string {
  const base =
    opts.tone === 'night' ? '#cfc6b2' : opts.tone === 'dusk' ? '#e8d9bb' : INK.paper;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VIEW_W} ${VIEW_H}" preserveAspectRatio="xMidYMid slice" role="img"${
    opts.title ? ` aria-label="${opts.title}"` : ''
  }>
${rect(0, 0, VIEW_W, VIEW_H, { fill: base })}
${rect(0, 0, VIEW_W, VIEW_H, { filter: 'url(#ink-fiber)' })}
${content.join('\n')}
${rect(0, 0, VIEW_W, VIEW_H, { filter: 'url(#ink-paper)', opacity: 0.8 })}
${rect(0, 0, VIEW_W, VIEW_H, { fill: 'url(#ink-vignette)' })}
</svg>`;
}
