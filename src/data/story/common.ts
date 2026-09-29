/** 跨章节共享的剧情常量与条件 */
import { flag, not } from './dsl';

/** 剑冢秘境开启的日子（启程前往云岫宗约耗时 90 日） */
export const TOMB_OPEN_DAY = 110;

export const isServant = flag('disciple', 'servant');
export const isDisciple = not(isServant);
export const tombDone = flag('tomb_done');
