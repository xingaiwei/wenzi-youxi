import type { Chapter } from '@/engine/types';
import { REALM } from '@/data/realms';
import {
  all,
  bonus,
  canBreak,
  cultivate,
  breakthrough,
  dayAtLeast,
  days,
  flag,
  give,
  hasItem,
  log,
  not,
  realmAtLeast,
  realmIs,
  setFlag,
  stat,
  statAtLeast,
  take,
  visited,
  when,
  WEAPON_BONUS,
} from './dsl';
import { isDisciple, isServant, tombDone, TOMB_OPEN_DAY } from './common';

const CH = '第二章 · 山中岁月';

export const chapter3: Chapter = {
  id: 'ch3',
  title: CH,
  scenes: [
    {
      id: 'sect_hub',
      chapter: CH,
      title: '洞府',
      art: 'meditation',
      text: [
        '第{{day}}日。',
        when(isServant, '柴房里只有一张木板床、一个蒲团。窗外是沙沙作响的竹林。'),
        when(isDisciple, '洞府虽小，推窗却能望见云海翻涌，松涛阵阵。'),
        when(realmIs(REALM.MORTAL), '你尚未引气入体，仍是凡人之躯。'),
        when(all(realmIs(REALM.MORTAL), canBreak()), '丹田中的气感已如春潮涨满，或许可以尝试引气入体了。'),
        when(all(realmIs(REALM.QI_REFINING), not(tombDone)), '你已是炼气修士。听师兄们说，后山的剑冢每隔六十年开启一次，就在这些日子。'),
        when(all(realmIs(REALM.QI_REFINING), tombDone, canBreak()), '修为已至炼气圆满，是时候冲击筑基了。'),
        when(flag('demonic'), '夜深人静时，你体内那缕血色魔气便会蠢蠢欲动。'),
      ],
      choices: [
        { text: '闭关修炼（三日）', to: 'hub_meditate' },
        { text: '去后山采药（一日）', to: 'hub_herbs' },
        { text: '去坊市逛逛', to: 'market' },
        {
          text: '去任务堂领斩妖任务（两日）',
          to: 'hunt_beast',
          requires: realmAtLeast(REALM.QI_REFINING),
          showWhenLocked: true,
          lockedHint: '需炼气境',
        },
        {
          text: '去藏经阁读书（两日）',
          to: 'library',
          requires: all(isDisciple, not(visited('library', 3))),
          showWhenLocked: true,
          lockedHint: '杂役弟子不得入内',
        },
        {
          text: '静养调息（一日）',
          to: 'sect_hub',
          result: '你睡了个好觉，气血恢复了不少。',
          effects: [days(1), stat('hp', 15)],
        },
        {
          text: '尝试引气入体',
          to: 'breakthrough_qi',
          requires: all(realmIs(REALM.MORTAL), canBreak()),
        },
        {
          text: '参加外门小比',
          to: 'outer_exam',
          requires: all(isServant, realmAtLeast(REALM.QI_REFINING)),
        },
        {
          text: '前往后山剑冢',
          to: 'realm_open',
          requires: all(realmAtLeast(REALM.QI_REFINING), dayAtLeast(TOMB_OPEN_DAY), not(tombDone)),
          showWhenLocked: true,
          lockedHint: `剑冢尚未开启（需炼气境，第${TOMB_OPEN_DAY}日后）`,
        },
        {
          text: '闭死关，冲击筑基',
          to: 'foundation_attempt',
          requires: all(realmIs(REALM.QI_REFINING), tombDone, canBreak()),
          showWhenLocked: true,
          lockedHint: '需炼气圆满，且经历剑冢',
        },
      ],
    },
    {
      id: 'hub_meditate',
      chapter: CH,
      title: '吐纳',
      art: 'waterfall',
      text: [
        '你寻了一处瀑布边的青石坐下。水声轰鸣，久了反倒听不见了，只剩下自己的呼吸。',
        '《青木诀》讲究「如草木生长，不急不缓」。',
        when(hasItem('jade_pendant'), '怀中的玉佩微微发凉，让你的心格外沉静。'),
      ],
      onEnter: [days(3)],
      choices: [
        {
          text: '循序渐进，稳扎稳打',
          to: 'sect_hub',
          result: '三日吐纳，灵气如涓涓细流汇入丹田。',
          effects: [cultivate(8)],
        },
        {
          text: '引瀑布之势冲刷经脉',
          check: {
            stat: 'insight',
            difficulty: 5,
            modifiers: [bonus(hasItem('jade_pendant'), 1, '玉佩静心 +1')],
            success: {
              to: 'sect_hub',
              result: '水势如雷，灵气如潮，你的经脉在冲刷中拓宽了一分。此番收获颇丰。',
              effects: [cultivate(18)],
            },
            failure: {
              to: 'sect_hub',
              result: '灵气在经脉中乱窜，你喷出一口血，不得不中途收功。',
              effects: [cultivate(3), stat('hp', -10)],
            },
          },
        },
      ],
    },
    {
      id: 'hub_herbs',
      chapter: CH,
      title: '后山',
      art: 'bamboo',
      text: [
        '后山竹海连绵，雾气终日不散。凝露草就生在竹根下的阴湿处，叶尖总挂着一滴不落的露珠。',
        '竹林深处立着一块石碑，上书「禁地」二字，笔锋如刀。',
      ],
      onEnter: [days(1)],
      choices: [
        {
          text: '沿着溪涧仔细搜寻',
          check: {
            stat: 'insight',
            difficulty: 3,
            success: { to: 'sect_hub', result: '你采到了两株上好的凝露草。', effects: [give('spirit_herb', 2)] },
            failure: { to: 'sect_hub', result: '转了一整天，只找到一株。', effects: [give('spirit_herb')] },
          },
        },
        {
          text: '越过石碑，深入禁地',
          check: {
            stat: 'constitution',
            difficulty: 5,
            modifiers: WEAPON_BONUS,
            success: {
              to: 'sect_hub',
              result: '禁地中灵气浓郁得几乎化不开。你避过一条碗口粗的青鳞蛇，在一处崖缝里采到了一大把凝露草，还捡到一只前人遗落的药瓶。',
              effects: [give('spirit_herb', 3), give('healing_pill'), stat('constitution', 1)],
            },
            failure: {
              to: 'sect_hub',
              result: '一条青鳞蛇从竹梢上扑下，你拼尽全力才逃了出来，腿上留下两个乌黑的牙印。',
              effects: [stat('hp', -12)],
            },
          },
        },
      ],
    },
    {
      id: 'market',
      chapter: CH,
      title: '云岫坊市',
      art: 'market',
      text: [
        '坊市设在两峰之间的一片平台上，飞檐斗拱，灯笼成串。卖丹药的、卖符箓的、卖法器的，吆喝声此起彼伏。',
        '你摸了摸钱袋：还有{{stat.stones}}块灵石。',
      ],
      choices: [
        {
          text: '买一枚回春丹（8 灵石）',
          requires: statAtLeast('stones', 8),
          showWhenLocked: true,
          lockedHint: '灵石不足',
          result: '你买下了一枚回春丹。',
          effects: [stat('stones', -8), give('healing_pill')],
        },
        {
          text: '买一枚聚气丹（12 灵石）',
          requires: statAtLeast('stones', 12),
          showWhenLocked: true,
          lockedHint: '灵石不足',
          result: '你买下了一枚聚气丹。',
          effects: [stat('stones', -12), give('qi_pill')],
        },
        {
          text: '买一枚筑基丹（60 灵石）',
          requires: statAtLeast('stones', 60),
          showWhenLocked: true,
          lockedHint: '灵石不足',
          result: '掌柜的眼睛亮了，小心翼翼地从柜底捧出一只玉盒。',
          effects: [stat('stones', -60), give('foundation_pill'), log('于坊市购得筑基丹。')],
        },
        {
          text: '卖一株凝露草（+4 灵石）',
          requires: hasItem('spirit_herb'),
          result: '药铺伙计收下了凝露草。',
          effects: [take('spirit_herb'), stat('stones', 4)],
        },
        {
          text: '卖一枚妖丹（+20 灵石）',
          requires: hasItem('beast_core'),
          result: '妖丹一亮出来，好几个掌柜都围了上来。',
          effects: [take('beast_core'), stat('stones', 20)],
        },
        { text: '离开坊市', to: 'sect_hub' },
      ],
    },
    {
      id: 'hunt_beast',
      chapter: CH,
      title: '黑风林',
      art: 'beast',
      text: [
        '任务堂的木牌上写着：黑风林有妖狼作祟，伤及山下樵夫，悬赏十五灵石。',
        '你循着血迹深入林中。天色越来越暗，林间弥漫着腥臭的雾。',
        '忽然，一双幽绿的眼睛在雾中亮起。',
      ],
      onEnter: [days(2)],
      choices: [
        {
          text: '拔剑迎敌',
          check: {
            stat: 'constitution',
            difficulty: 5,
            modifiers: [...WEAPON_BONUS, bonus(realmAtLeast(REALM.FOUNDATION), 3, '筑基修为 +3')],
            success: {
              to: 'sect_hub',
              result: '剑光一闪，妖狼的头颅滚落在地。你剖开它的腹腔，取出一枚鸽蛋大小的妖丹。',
              effects: [stat('stones', 15), give('beast_core'), stat('karma', 1), log('斩杀黑风林妖狼。')],
            },
            failure: {
              to: 'sect_hub',
              result: '妖狼比你想的更快。你被它一爪撕开了肩头，只能狼狈退走。',
              effects: [stat('hp', -18)],
            },
          },
        },
        {
          text: '设下陷阱，以智取胜',
          check: {
            stat: 'insight',
            difficulty: 5,
            success: {
              to: 'sect_hub',
              result: '你用凝露草的香气引妖狼入了套索，又以山石压住。不费一剑，便取了它的妖丹。',
              effects: [stat('stones', 15), give('beast_core'), log('智取黑风林妖狼。')],
            },
            failure: {
              to: 'sect_hub',
              result: '妖狼识破了陷阱，反扑过来。你滚下山坡才侥幸逃脱。',
              effects: [stat('hp', -12)],
            },
          },
        },
        { text: '此妖不可力敌，撤', to: 'sect_hub', result: '你悄悄退出了黑风林。', effects: [stat('hp', -3)] },
      ],
    },
    {
      id: 'library',
      chapter: CH,
      title: '藏经阁',
      art: 'pavilion',
      text: [
        '藏经阁七层，越往上，书越少，也越旧。一楼的看守老头终日打盹，据说他在这里已经坐了三百年。',
        '你在一排落满灰尘的书架前停下。',
      ],
      onEnter: [days(2)],
      choices: [
        {
          text: '研读前人手札',
          check: {
            stat: 'insight',
            difficulty: 4,
            success: {
              to: 'sect_hub',
              result: '手札的主人在页边写满了批注，字迹潦草，却字字珠玑。你茅塞顿开。',
              effects: [stat('insight', 1), cultivate(6)],
            },
            failure: { to: 'sect_hub', result: '读了两日，头昏脑涨，所获寥寥。', effects: [cultivate(2)] },
          },
        },
        {
          text: '向看守老头请教',
          requires: hasItem('jade_pendant'),
          to: 'sect_hub',
          result: '老头睁开一只眼，瞥见你腰间的玉佩，沉默良久：「玄微那小子……罢了。」他伸指在你眉心一点，你只觉识海中多了些什么。',
          effects: [stat('daoHeart', 1), cultivate(10), setFlag('librarian_blessing')],
        },
      ],
    },
    {
      id: 'breakthrough_qi',
      chapter: CH,
      title: '引气入体',
      art: 'meditation',
      text: [
        '夜深了。你盘膝而坐，按照《青木诀》所载，引导丹田中的那一缕气感，去冲击周身经脉。',
        '这是凡人与修士之间的第一道门槛。',
      ],
      choices: [
        {
          text: '运转青木诀，冲关',
          check: {
            stat: 'daoHeart',
            difficulty: 2,
            modifiers: [bonus(hasItem('qingmu_scroll'), 2, '青木诀 +2')],
            success: {
              to: 'sect_hub',
              result: '一声轻响，仿佛有什么东西在体内破开了。天地间的灵气如百川归海，涌入你的四肢百骸。从今日起，你便是修士了。',
              effects: [breakthrough()],
            },
            failure: {
              to: 'sect_hub',
              result: '气感在半途溃散，你浑身冷汗，修为也散去了一些。',
              effects: [stat('hp', -10), stat('cultivation', -6)],
            },
          },
        },
        { text: '再等等', to: 'sect_hub' },
      ],
    },
    {
      id: 'outer_exam',
      chapter: CH,
      title: '外门小比',
      art: 'sect_gate',
      text: [
        '外门小比在演武场举行，杂役弟子若能胜过一名外门弟子，便可破格晋升。',
        '你的对手是个高你半头的外门弟子，他看着你身上的粗布衣裳，笑出了声。',
      ],
      choices: [
        {
          text: '上台',
          check: {
            stat: 'constitution',
            difficulty: 4,
            modifiers: WEAPON_BONUS,
            success: {
              to: 'sect_hub',
              result: '三招。你只用了三招，就把他送下了台。满场寂静之后，是雷鸣般的喝彩。你终于换上了外门弟子的青衫。',
              effects: [setFlag('disciple', 'outer'), give('iron_sword'), stat('daoHeart', 1), log('外门小比获胜，晋升外门弟子。')],
            },
            failure: {
              to: 'sect_hub',
              result: '你输了，输得很难看。但你站起来时，台下有几个杂役弟子在为你鼓掌。',
              effects: [stat('hp', -10), stat('constitution', 1)],
            },
          },
        },
        { text: '改日再来', to: 'sect_hub' },
      ],
    },
  ],
};
