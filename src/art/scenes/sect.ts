/** 宗门篇：云岫山与宗门日常 */
import { INK } from '../core/palette';
import { g } from '../core/svg';
import { gate, pavilion, stairs } from '../elements/architecture';
import { beastInMist, birds, crane, figure } from '../elements/figures';
import { bamboo, distantTrees, grass, pine } from '../elements/flora';
import { bank, mist, mistBand, mountainRange, spire, terrain, waterfall } from '../elements/landscape';
import { glow, moon } from '../elements/marks';
import type { ArtScene } from './types';

export const sectScenes: Record<string, ArtScene> = {
  sect_gate: {
    inscription: '云岫山门',
    draw: (r) => {
      const main = spire(r, 420, 400, 190, 350, 'mid');
      const left = terrain(r, { baseY: 500, depth: 'near', x0: -20, x1: 260, peaks: [{ x: 60, height: 240, width: 170 }] });
      const right = terrain(r, { baseY: 500, depth: 'near', x0: 580, x1: 820, peaks: [{ x: 770, height: 270, width: 170 }] });
      return [
        mountainRange(r, { baseY: 260, depth: 'far', peaks: [{ x: 150, height: 120, width: 200 }, { x: 680, height: 140, width: 200 }] }),
        main.svg,
        pavilion(r, 420, main.y(420) + 6, 0.5, 2),
        mistBand(r, 170, 4, 0.7),
        mistBand(r, 310, 6),
        stairs(r, [420, 470], [420, main.y(420) + 20], 44, 60),
        left.svg,
        right.svg,
        pine(r, 110, left.y(110) + 8, 0.7, 0.3),
        pine(r, 720, right.y(720) + 8, 0.6, -0.3),
        gate(r, 420, 475, 0.9),
        crane(r, 610, 120, 0.8, -1),
      ];
    },
  },
  meditation: {
    inscription: '吐纳',
    inscriptionAt: 'left',
    tone: 'night',
    draw: (r) => {
      const rock = spire(r, 420, 520, 200, 190, 'near');
      return [
        moon(600, 110, 40),
        mountainRange(r, { baseY: 280, depth: 'far', peaks: [{ x: 250, height: 150, width: 220 }, { x: 560, height: 110, width: 200 }] }),
        mistBand(r, 290, 6),
        rock.svg,
        glow(420, rock.y(420) - 20, 80, 60),
        figure(r, 420, rock.y(420) + 4, 1.3, { pose: 'sit' }),
        pine(r, 310, rock.y(310) + 10, 0.6, -0.5),
        mistBand(r, 460, 5, 0.8),
      ];
    },
  },
  pavilion: {
    inscription: '听松',
    draw: (r) => {
      const hill = spire(r, 300, 490, 220, 230, 'near');
      return [
        mountainRange(r, { baseY: 260, depth: 'far', peaks: [{ x: 600, height: 170, width: 240 }] }),
        mistBand(r, 270, 5),
        hill.svg,
        pavilion(r, 300, hill.y(300) + 8, 1.0, 3),
        pine(r, 170, hill.y(170) + 10, 0.8, 0.2),
        pine(r, 430, hill.y(430) + 10, 0.7, -0.3),
        mistBand(r, 440, 5),
        birds(r, 620, 150, 4, 0.8),
      ];
    },
  },
  bamboo: {
    inscription: '竹里馆',
    draw: (r) => [
      g(Array.from({ length: 10 }, (_, i) => bamboo(r, 40 + i * 80 + r.range(-20, 20), 520, r.range(380, 520), 0.8, INK.clear))),
      mist(400, 300, 900, 200, 0.6),
      g(Array.from({ length: 6 }, (_, i) => bamboo(r, 60 + i * 140 + r.range(-30, 30), 520, r.range(300, 480), 1.1, INK.thick))),
      bank(r, -20, 820, 480, 10),
      figure(r, 460, 470, 0.8, { pose: 'walk', facing: -1 }),
      grass(r, 300, 480, 1),
    ],
  },
  waterfall: {
    inscription: '飞泉',
    inscriptionAt: 'left',
    draw: (r) => {
      const left = terrain(r, { baseY: 520, depth: 'near', x0: 60, x1: 400, peaks: [{ x: 260, height: 460, width: 170 }] });
      const right = terrain(r, { baseY: 520, depth: 'near', x0: 440, x1: 820, peaks: [{ x: 600, height: 430, width: 190 }] });
      // 瀑布后的岩壁
      const back = terrain(r, { baseY: 520, depth: 'mid', x0: 300, x1: 540, peaks: [{ x: 420, height: 420, width: 130 }] });
      return [
        mountainRange(r, { baseY: 200, depth: 'far', peaks: [{ x: 420, height: 140, width: 260 }] }),
        mistBand(r, 200, 4),
        back.svg,
        waterfall(r, 420, back.y(420) + 20, 440, 30),
        left.svg,
        right.svg,
        pine(r, 560, right.y(560) + 10, 0.6, -0.4),
        bank(r, 200, 700, 480, 20),
        figure(r, 540, 468, 0.9, { pose: 'sit' }),
      ];
    },
  },
  market: {
    inscription: '坊市',
    draw: (r) => [
      mountainRange(r, { baseY: 230, depth: 'far', peaks: [{ x: 150, height: 140, width: 200 }, { x: 650, height: 160, width: 200 }] }),
      mistBand(r, 230, 5),
      pavilion(r, 180, 380, 0.9, 2),
      pavilion(r, 400, 360, 1.1, 3),
      pavilion(r, 620, 385, 0.9, 2),
      mistBand(r, 400, 4, 0.6),
      bank(r, -20, 820, 450, 10),
      g(Array.from({ length: 7 }, (_, i) => figure(r, 120 + i * 95 + r.range(-20, 20), 455, r.range(0.5, 0.7), { pose: r.chance(0.5) ? 'walk' : 'stand', facing: r.chance(0.5) ? 1 : -1 }))),
      g(Array.from({ length: 8 }, (_, i) => `<ellipse cx="${150 + i * 70}" cy="${300 + (i % 2) * 20}" rx="5" ry="7" fill="${INK.cinnabar}" opacity="0.7"/>`)),
    ],
  },
  beast: {
    inscription: '黑风林',
    tone: 'night',
    draw: (r) => [
      g(Array.from({ length: 12 }, () => pine(r, r.range(0, 800), r.range(380, 460), r.range(0.6, 1), r.range(-0.3, 0.3))), { opacity: 0.35 }),
      mist(400, 350, 900, 200, 0.5),
      beastInMist(r, 400, 320, 1.4),
      mist(300, 420, 700, 90, 0.6),
      distantTrees(r, 0, 800, 480, 0.7),
      figure(r, 690, 470, 0.9, { pose: 'stand', facing: -1 }),
    ],
  },
};
