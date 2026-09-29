import type { Chapter, Scene, Story } from '@/engine/types';
import { chapter1 } from './ch1_village';
import { chapter2 } from './ch2_sect';
import { chapter3 } from './ch3_cultivation';
import { chapter4 } from './ch4_sword_tomb';
import { chapter5 } from './ch5_foundation';

/** 新增章节时在这里登记即可 */
export const CHAPTERS: Chapter[] = [chapter1, chapter2, chapter3, chapter4, chapter5];

function buildStory(chapters: Chapter[]): Story {
  const scenes: Record<string, Scene> = {};
  for (const ch of chapters) {
    for (const scene of ch.scenes) {
      if (scenes[scene.id]) throw new Error(`场景 id 重复：${scene.id}`);
      scenes[scene.id] = scene;
    }
  }
  return { startScene: 'village_dawn', deathScene: 'death', scenes };
}

export const STORY: Story = buildStory(CHAPTERS);
