import type { GameData } from './data';
import type { GameState } from './types';
import { randomSeed } from './rng';

export const SAVE_VERSION = 1;

export function createInitialState(data: GameData, name: string, seed = randomSeed()): GameState {
  return {
    version: SAVE_VERSION,
    name: name.trim() || '无名',
    sceneId: data.story.startScene,
    stats: { ...data.initialStats },
    realm: 0,
    day: 1,
    inventory: {},
    flags: {},
    visited: {},
    journal: [],
    seed,
  };
}

export function cloneState(state: GameState): GameState {
  return structuredClone(state);
}
