import type { Chapter } from '@/engine/types';
import { all, bonus, breakthrough, days, flag, hasItem, log, not, stat, statAtLeast, take, when } from './dsl';

const CH = '第四章 · 筑基';

export const chapter5: Chapter = {
  id: 'ch5',
  title: CH,
  scenes: [
    {
      id: 'foundation_attempt',
      chapter: CH,
      title: '雷云',
      art: 'thunder',
      text: [
        '你在后山最高的一座孤峰上开辟了一间石室，封了洞口。',
        '炼气圆满，丹田中的灵气已凝如液态，只差最后一步——将它们压实、铸成道基。',
        '筑基，是修士的第二道门槛。门槛那边，寿元五百载；门槛这边，十人中有九人，终其一生都跨不过去。',
        when(hasItem('foundation_pill'), '你取出那枚筑基丹，清香满室。'),
        when(flag('demonic'), '经脉里那缕血色魔气蠢蠢欲动，它在低声告诉你：用我，用我便能成。'),
        '洞外，不知何时聚起了一片铅灰色的雷云。',
      ],
      choices: [
        {
          text: '服下筑基丹，冲关',
          requires: hasItem('foundation_pill'),
          check: {
            stat: 'daoHeart',
            difficulty: 4,
            modifiers: [
              bonus(flag('pendant_awakened'), 1, '残月护心 +1'),
              bonus(statAtLeast('insight', 6), 1, '悟性通达 +1'),
            ],
            success: { to: 'ending_foundation', effects: [take('foundation_pill'), breakthrough()] },
            failure: { to: 'foundation_fail', effects: [take('foundation_pill')] },
          },
        },
        {
          text: '不借外物，以道心硬撼天关',
          check: {
            stat: 'daoHeart',
            difficulty: 7,
            modifiers: [
              bonus(flag('pendant_awakened'), 1, '残月护心 +1'),
              bonus(statAtLeast('insight', 6), 1, '悟性通达 +1'),
              bonus(statAtLeast('karma', 4), 1, '善缘护佑 +1'),
            ],
            success: { to: 'ending_foundation_pure', effects: [breakthrough()] },
            failure: { to: 'foundation_fail' },
          },
        },
        {
          text: '引魔气入丹田，强行筑基',
          requires: flag('demonic'),
          to: 'ending_demon',
          effects: [breakthrough()],
        },
        { text: '时机未到，出关', to: 'sect_hub' },
      ],
    },
    {
      id: 'foundation_fail',
      chapter: CH,
      title: '走火',
      art: 'thunder',
      text: [
        '灵气在半途失控了。',
        '它们在你的经脉中横冲直撞，像一群脱缰的野马。你咬碎了牙，拼死收束，终于在经脉寸断之前，把它们压回了丹田。',
        '筑基失败。修为散去大半，经脉也受了重创。',
      ],
      onEnter: [stat('hp', -20), { type: 'setStat', stat: 'cultivation', value: 30 }, log('冲击筑基失败。')],
      choices: [
        {
          text: '养好伤，再来一次',
          to: 'sect_hub',
          result: '你在石室中躺了十日，才勉强能下地。但你的眼神，比从前更亮了。',
          effects: [days(10), stat('daoHeart', 1)],
        },
        { text: '……罢了，下山去', to: 'ending_hermit' },
      ],
    },
    {
      id: 'ending_foundation',
      chapter: CH,
      title: '道基初成',
      art: 'ascend',
      text: [
        '丹药化开的一瞬，雷云中劈下第一道天雷。',
        '你没有躲。雷光贯体，将丹田中的灵液一寸寸锤炼、压实，如同铁匠在砧上锻打一块精铁。',
        '九道天雷之后，云开月出。',
        '你推开石门，整座云岫山在你眼中都变了模样：你能看见松针上的每一滴露水，听见百里外的溪流，嗅到风中灵气的流向。',
        when(flag('ally_su'), '苏清寒站在峰下，仰头望着你，嘴角微微弯起。'),
        when(hasItem('jade_pendant'), '怀中的残月玉佩轻轻一颤，你似乎听见了玄微子的笑声。'),
        '筑基，成了。',
        '而山外还有山，天外还有天。血煞门的魔修仍在暗处，玉佩的秘密尚未揭开。你的道，才刚刚开始。',
      ],
      ending: { kind: 'good', title: '道基初成' },
      choices: [],
    },
    {
      id: 'ending_foundation_pure',
      chapter: CH,
      title: '道心通明',
      art: 'ascend',
      text: [
        '你没有服用任何丹药。',
        '天雷落下时，你想起了青石村的晨雾，想起了阿婆的烙饼，想起了断崖下那个人形的墨痕。',
        '「我为何修仙？」',
        '不为长生，不为力量。只为去看看——山上的风景。',
        '第九道天雷消散时，你的道基上浮现出一枚淡淡的青色纹路，如一片新生的木叶。',
        '宗门长老们看着孤峰上方久久不散的祥云，面面相觑：不借外物而筑成无瑕道基，云岫宗已有八百年不曾出过这样的弟子了。',
        '你的道，才刚刚开始。',
      ],
      ending: { kind: 'good', title: '道心通明' },
      choices: [],
    },
    {
      id: 'ending_demon',
      chapter: CH,
      title: '血色道基',
      art: 'demon',
      text: [
        '魔气入丹田的一瞬，你听见了无数人的哭嚎。',
        '天雷落下，却在触及你头顶三尺时被一层血光吞噬。你筑基了——以一种从未有过的、可怖的速度。',
        '你推开石门。月光照在你脸上，是红色的。',
        '远处的黑暗中，有一个声音在笑：「好徒儿。」',
        when(all(not(flag('saved_old_man')), not(flag('grandma_blessing'))), '你发现自己已经记不清阿婆的模样了。'),
        '从此世间多了一个魔头。至于他从前叫什么名字，已经没有人记得了。',
      ],
      ending: { kind: 'bad', title: '血色道基' },
      choices: [],
    },
    {
      id: 'ending_hermit',
      chapter: CH,
      title: '江湖归隐',
      art: 'river_boat',
      text: [
        '你下了云岫山，在大江边买了一条小船。',
        '白天打鱼，夜里看星。偶尔有修士御剑从头顶掠过，你便抬头看一眼，然后继续收网。',
        '修为一日日散去，你老了，头发白了，却再也没有做过那些关于雷云的噩梦。',
        '或许，这也是一种道。',
      ],
      ending: { kind: 'neutral', title: '江湖归隐' },
      choices: [],
    },
    {
      id: 'death',
      chapter: '终',
      title: '身死道消',
      art: 'withered',
      text: [
        '眼前的一切渐渐暗了下去。',
        '你想起青石村的晨雾，想起阿婆的烙饼。原来人死之前，想起的都是这些小事。',
        '修仙路上，白骨累累。你不过是其中之一。',
      ],
      ending: { kind: 'bad', title: '身死道消' },
      choices: [],
    },
  ],
};
