/** 秘境篇：剑冢、雷劫、飞升 */
import { INK } from '../core/palette';
import { g } from '../core/svg';
import { caveMouth, pavilion, stele, sword } from '../elements/architecture';
import { birds, crane, figure } from '../elements/figures';
import { pine, witheredTree } from '../elements/flora';
import { auspiciousCloud, bank, darkClouds, mist, mistBand, mountainRange, spire, terrain } from '../elements/landscape';
import { glow, lightning, sun } from '../elements/marks';
import type { ArtScene } from './types';

export const mysticScenes: Record<string, ArtScene> = {
  secret_realm: {
    inscription: '剑冢开启',
    draw: (r) => [
      mistBand(r, 120, 5, 0.6),
      // 悬浮山峦：山体下方倒垂的岩根
      g(
        [
          [220, 220, 110],
          [520, 170, 150],
          [700, 280, 80],
        ].map(([x, y, w]) => {
          const isle = spire(r, x, y, w, w * 0.9, 'mid');
          return g([
            `<path d="M${x - w * 0.9},${y} Q${x - w * 0.2},${y + w * 0.5} ${x},${y + w * 1.2} Q${x + w * 0.3},${y + w * 0.5} ${x + w * 0.9},${y} Z" fill="url(#ink-fade-up)" opacity="0.55" filter="url(#ink-mottle)"/>`,
            isle.svg,
            ...Array.from({ length: 6 }, () => {
              const sx = x + r.range(-w * 0.5, w * 0.5);
              return sword(r, sx, isle.y(sx) + 6, r.range(26, 44), r.range(-0.3, 0.3), 0.85);
            }),
          ]);
        }),
      ),
      auspiciousCloud(r, 360, 320, 1.4),
      auspiciousCloud(r, 620, 400, 1),
      mistBand(r, 430, 6),
      mountainRange(r, { baseY: 500, depth: 'near', peaks: [{ x: 100, height: 80, width: 200 }, { x: 700, height: 60, width: 200 }] }),
      figure(r, 170, 452, 0.8, { pose: 'stand', flowing: true }),
      figure(r, 206, 456, 0.75, { pose: 'stand', robe: INK.clear }),
    ],
  },
  sword_tomb: {
    inscription: '万剑归冢',
    tone: 'dusk',
    draw: (r) => {
      const swords = Array.from({ length: 34 }, () => {
        const y = r.range(350, 500);
        return { y, x: r.range(0, 800) };
      }).sort((a, b) => a.y - b.y);
      return [
        sun(620, 120, 40),
        mountainRange(r, { baseY: 260, depth: 'far', peaks: [{ x: 300, height: 130, width: 280 }] }),
        mistBand(r, 270, 5),
        bank(r, -20, 820, 360, 20),
        g(swords.map(({ x, y }) => {
          const t = (y - 350) / 150;
          return sword(r, x, y, 40 + t * 70, r.range(-0.35, 0.35), 0.4 + t * 0.55);
        })),
        mistBand(r, 380, 4, 0.5),
        figure(r, 400, 470, 1.0, { pose: 'walk', flowing: true }),
        sword(r, 120, 500, 200, 0.2, 0.95),
        sword(r, 700, 500, 170, -0.15, 0.9),
      ];
    },
  },
  stele: {
    inscription: '无字碑',
    inscriptionAt: 'left',
    draw: (r) => [
      mountainRange(r, { baseY: 280, depth: 'far', peaks: [{ x: 500, height: 150, width: 300 }] }),
      mistBand(r, 280, 5),
      bank(r, -20, 820, 450, 20),
      stele(r, 450, 440, 1.5),
      witheredTree(r, 640, 450, 0.9),
      figure(r, 300, 450, 1.0, { pose: 'sit' }),
      g(Array.from({ length: 5 }, () => sword(r, r.range(80, 760), r.range(450, 490), 40, r.range(-0.5, 0.5), 0.5))),
    ],
  },
  cave: {
    inscription: '剑冢深处',
    tone: 'night',
    draw: (r) => [
      `<rect x="0" y="0" width="800" height="500" fill="${INK.thick}" opacity="0.6" filter="url(#ink-mottle)"/>`,
      caveMouth(r, 400, 480, 520, 400),
      glow(400, 360, 160, 110),
      `<rect x="360" y="380" width="80" height="40" fill="${INK.heavy}" opacity="0.8" filter="url(#ink-rough)"/>`,
      `<rect x="382" y="366" width="36" height="16" rx="2" fill="#f5f0e0" opacity="0.95" filter="url(#ink-rough)"/>`,
      figure(r, 290, 470, 1.1, { pose: 'stand', facing: 1 }),
      figure(r, 560, 470, 1.2, { pose: 'stand', facing: -1, robe: INK.thick }),
    ],
  },
  thunder: {
    inscription: '雷劫',
    tone: 'night',
    draw: (r) => {
      const peak = spire(r, 400, 520, 170, 220, 'near');
      return [
        darkClouds(r, 40, 16, 1),
        darkClouds(r, 110, 10, 0.7),
        lightning(r, 400, 120, 160),
        lightning(r, 180, 90, 150),
        mountainRange(r, { baseY: 420, depth: 'far', peaks: [{ x: 120, height: 140, width: 160 }, { x: 700, height: 160, width: 170 }] }),
        peak.svg,
        glow(400, peak.y(400) - 20, 60, 40),
        figure(r, 400, peak.y(400) + 4, 0.9, { pose: 'sit' }),
        mistBand(r, 480, 5, 0.7),
      ];
    },
  },
  ascend: {
    inscription: '道基初成',
    draw: (r) => {
      const peak = spire(r, 400, 520, 170, 200, 'near');
      return [
        sun(400, 150, 55),
        glow(400, 150, 200, 140),
        auspiciousCloud(r, 200, 200, 1.6),
        auspiciousCloud(r, 580, 240, 1.3),
        mountainRange(r, { baseY: 330, depth: 'far', peaks: [{ x: 150, height: 150, width: 200 }, { x: 650, height: 170, width: 200 }] }),
        mistBand(r, 340, 6),
        peak.svg,
        pine(r, 330, peak.y(330) + 10, 0.6, 0.3),
        figure(r, 410, peak.y(410) + 3, 1.0, { pose: 'stand', flowing: true }),
        crane(r, 600, 120, 0.9, -1),
        crane(r, 220, 100, 0.7, 1),
        birds(r, 700, 300, 3, 0.6),
      ];
    },
  },
  title: {
    inscription: '问道',
    draw: (r) => {
      const main = spire(r, 560, 470, 160, 340, 'mid');
      const near = terrain(r, { baseY: 520, depth: 'near', x0: -20, x1: 380, peaks: [{ x: 120, height: 280, width: 230 }] });
      return [
        sun(660, 100, 34),
        mountainRange(r, { baseY: 250, depth: 'far', peaks: [{ x: 120, height: 170, width: 180 }, { x: 400, height: 210, width: 220 }, { x: 740, height: 150, width: 180 }] }),
        mistBand(r, 260, 6),
        main.svg,
        pavilion(r, 560, main.y(560) + 6, 0.45, 2),
        mistBand(r, 370, 6),
        near.svg,
        pine(r, 220, near.y(220) + 10, 0.8, 0.3),
        figure(r, 130, near.y(130) + 3, 0.7, { pose: 'stand', flowing: true, facing: 1 }),
        crane(r, 390, 170, 0.8, 1),
        birds(r, 470, 120, 4, 0.7),
        mist(500, 500, 900, 80, 0.8),
      ];
    },
  },
};
