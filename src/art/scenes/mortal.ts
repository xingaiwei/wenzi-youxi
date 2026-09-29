/** 凡尘篇：青石村与山野 */
import { INK } from '../core/palette';
import { g } from '../core/svg';
import { hut } from '../elements/architecture';
import { birds, boat, demonFigure, figure } from '../elements/figures';
import { bamboo, distantTrees, grass, pine, witheredTree } from '../elements/flora';
import { bank, darkClouds, mist, mistBand, mountainRange, spire, terrain, waterLines } from '../elements/landscape';
import { bloodMist, glow, moon } from '../elements/marks';
import type { ArtScene } from './types';

export const mortalScenes: Record<string, ArtScene> = {
  village: {
    inscription: '青石晨雾',
    draw: (r) => [
      mountainRange(r, { baseY: 250, depth: 'far', peaks: [{ x: 150, height: 150, width: 170 }, { x: 420, height: 200, width: 200 }, { x: 700, height: 130, width: 160 }] }),
      mistBand(r, 250, 6),
      mountainRange(r, { baseY: 330, depth: 'mid', tint: 'indigo', peaks: [{ x: 90, height: 110, width: 140 }, { x: 600, height: 90, width: 180 }] }),
      mistBand(r, 330, 5),
      distantTrees(r, 420, 760, 352, 0.45),
      bank(r, -20, 820, 420, 20),
      hut(r, 470, 412, 1.1),
      hut(r, 560, 418, 0.8),
      witheredTree(r, 250, 430, 1.1),
      bamboo(r, 700, 440, 170, 0.8),
      bamboo(r, 728, 440, 140, 0.7),
      figure(r, 380, 440, 0.7, { pose: 'walk' }),
      birds(r, 300, 110, 4, 0.8),
    ],
  },
  mountain_path: {
    inscription: '山雨欲来',
    tone: 'dusk',
    draw: (r) => {
      const far = mountainRange(r, { baseY: 300, depth: 'far', peaks: [{ x: 200, height: 160, width: 220 }] });
      const mid = spire(r, 580, 470, 150, 360, 'mid');
      const near = spire(r, 170, 500, 190, 300, 'near');
      return [
        darkClouds(r, 40, 12, 0.8),
        far,
        mid.svg,
        mistBand(r, 320, 5),
        glow(620, 380, 50, 30),
        near.svg,
        pine(r, 250, near.y(250) + 8, 0.8, 0.4),
        g(
          Array.from({ length: 80 }, () => {
            const x = r.range(0, 800);
            const y = r.range(0, 500);
            return `<line x1="${x}" y1="${y}" x2="${x - 8}" y2="${y + 32}" stroke="${INK.light}" stroke-width="0.8" opacity="0.5"/>`;
          }),
        ),
        figure(r, 400, 480, 0.8, { pose: 'walk', facing: 1 }),
      ];
    },
  },
  old_immortal: {
    inscription: '玄微子',
    inscriptionAt: 'left',
    draw: (r) => {
      const cliff = terrain(r, { baseY: 480, depth: 'near', x0: 540, x1: 820, peaks: [{ x: 760, height: 380, width: 200 }] });
      return [
        mountainRange(r, { baseY: 280, depth: 'far', peaks: [{ x: 400, height: 180, width: 260 }] }),
        mistBand(r, 280, 4),
        cliff.svg,
        bank(r, 100, 700, 440, 30),
        pine(r, 650, cliff.y(650) + 10, 1.0, -0.4),
        glow(430, 390, 130, 80),
        figure(r, 430, 430, 1.8, { pose: 'sit', robe: INK.clear, opacity: 0.95 }),
        figure(r, 300, 438, 1.3, { pose: 'stand', facing: 1 }),
        grass(r, 520, 438, 1.2),
        grass(r, 200, 440, 1),
      ];
    },
  },
  demon: {
    inscription: '血煞',
    tone: 'night',
    draw: (r) => [
      darkClouds(r, 60, 14, 0.9),
      bloodMist(400, 260, 280, 180),
      mountainRange(r, { baseY: 360, depth: 'mid', peaks: [{ x: 120, height: 180, width: 160 }, { x: 700, height: 200, width: 170 }] }),
      demonFigure(r, 400, 440, 1.4),
      witheredTree(r, 110, 470, 0.9),
      mist(400, 480, 900, 80, 0.5),
      figure(r, 640, 470, 0.9, { pose: 'stand', facing: -1 }),
    ],
  },
  moon_cliff: {
    inscription: '残月',
    tone: 'night',
    draw: (r) => {
      const cliff = spire(r, 150, 520, 220, 380, 'near');
      return [
        moon(560, 120, 48, true),
        mountainRange(r, { baseY: 300, depth: 'far', peaks: [{ x: 420, height: 140, width: 260 }] }),
        mistBand(r, 320, 5, 0.7),
        cliff.svg,
        pine(r, 250, cliff.y(250) + 10, 0.6, 0.6),
        glow(150, cliff.y(150) - 30, 60, 60),
        figure(r, 150, cliff.y(150) + 4, 0.6, { pose: 'sit', opacity: 0.45, robe: INK.clear }),
        birds(r, 650, 220, 3, 0.7),
        mistBand(r, 470, 5, 0.8),
      ];
    },
  },
  withered: {
    inscription: '枯荣',
    tone: 'dusk',
    draw: (r) => [
      mountainRange(r, { baseY: 330, depth: 'far', peaks: [{ x: 600, height: 120, width: 260 }] }),
      mistBand(r, 340, 4),
      bank(r, 100, 700, 430, 30),
      witheredTree(r, 400, 420, 1.6),
      birds(r, 520, 150, 3, 1.2),
      grass(r, 250, 430, 1.2),
      grass(r, 560, 428, 1),
    ],
  },
  river_boat: {
    inscription: '一路向西',
    draw: (r) => [
      mountainRange(r, { baseY: 240, depth: 'far', peaks: [{ x: 200, height: 120, width: 200 }, { x: 560, height: 160, width: 220 }] }),
      mistBand(r, 250, 5),
      mountainRange(r, { baseY: 290, depth: 'mid', x0: 480, x1: 820, peaks: [{ x: 720, height: 150, width: 170 }] }),
      mist(700, 300, 400, 60),
      waterLines(r, 300, 490, 0, 800, 26),
      boat(r, 330, 380, 1.2),
      bank(r, -20, 200, 470, 40),
      bamboo(r, 60, 460, 220, 0.8),
      bamboo(r, 110, 462, 170, 0.7),
      birds(r, 480, 140, 5, 0.8),
    ],
  },
};
