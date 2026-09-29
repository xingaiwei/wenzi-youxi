import type { Chapter } from '@/engine/types';
import { bonus, flag, give, hasItem, log, setFlag, stat, cultivate, statAtLeast, days, when } from './dsl';

const CH = '序章 · 青石村';

export const chapter1: Chapter = {
  id: 'ch1',
  title: CH,
  scenes: [
    {
      id: 'village_dawn',
      chapter: CH,
      title: '青石晨雾',
      art: 'village',
      text: [
        '青石村卧在云岫山脚下，终年有雾。',
        '你叫{{name}}，自幼父母双亡，由隔壁的阿婆拉扯长大。十六岁这年，你已是村里最好的樵夫，一担柴能从山腰挑到镇上，不歇一口气。',
        '今晨雾色格外浓，远处的山峰像是被人用淡墨轻轻抹过一笔，只余一痕青影。村口的老槐树下，几只乌鸦叫得人心烦。',
        '据说云岫山上住着仙人。可十六年来，你从未见过。',
      ],
      onFirstEnter: [log('于青石村醒来，一如往常。')],
      choices: [
        { text: '背起柴刀，趁早上山', to: 'mountain_storm' },
        { text: '先去阿婆家看看', to: 'grandma' },
      ],
    },
    {
      id: 'grandma',
      chapter: CH,
      title: '阿婆',
      art: 'village',
      text: [
        '阿婆正坐在门槛上剥豆子，见你来了，眯着眼笑。',
        '「今儿雾大，山里怕是要落雨。」她从怀里摸出一个布包，塞进你手心，「前几日卖鸡蛋攒的，你收着。人这一辈子啊，钱是身外物，心正了，路就正了。」',
        '布包里是几块碎灵石——村里人拿它当银钱用，据说山上的仙人们拿它修炼。',
        '「阿婆，这是你的……」',
        '「拿着。」她摆摆手，又低头剥豆子，「早去早回。」',
      ],
      onFirstEnter: [stat('stones', 3), stat('daoHeart', 1), setFlag('grandma_blessing'), log('阿婆赠了几块碎灵石。')],
      choices: [{ text: '收好布包，上山去', to: 'mountain_storm' }],
    },
    {
      id: 'mountain_storm',
      chapter: CH,
      title: '山雨欲来',
      art: 'mountain_path',
      text: [
        '行至半山，天色骤暗。墨云从山顶翻涌而下，像是有人在天上泼翻了砚台。',
        '雷声滚过山脊时，你看见了一道光——不是闪电，是一道青色的光，从云里坠下，落进了前方的断崖下。',
        '你攀下崖去，只见乱石之间躺着一位白发老者。他道袍染血，胸口有一个焦黑的掌印，手中却还死死攥着一只青布包袱。',
        '老者气若游丝，似乎尚未察觉你的到来。',
      ],
      choices: [
        {
          text: '上前救人',
          to: 'old_man',
          effects: [stat('karma', 2), setFlag('saved_old_man'), log('于断崖下救起一位受伤的老者。')],
        },
        {
          text: '先看看他的包袱里有什么',
          to: 'old_man_rob',
          effects: [stat('karma', -2), stat('stones', 10), log('翻了老者的包袱。')],
        },
        { text: '此事蹊跷，转身离开', to: 'flee_home', effects: [stat('karma', -1)] },
      ],
    },
    {
      id: 'old_man',
      chapter: CH,
      title: '玄微子',
      art: 'old_immortal',
      text: [
        '你撕下衣襟替他裹伤，又把他背到一处岩穴中避雨。半个时辰后，老者悠悠醒转。',
        '「小友心善。」他望了你许久，忽然笑了，「贫道玄微子，本是云岫宗的一个闲散长老。今日遭血煞门的妖人暗算，本以为要葬身此地，不想遇见了你。」',
        '他从怀中取出一枚缺了一角的玉佩和一卷残破的书册，放在你掌心。',
        '「这卷《青木诀》，你且拿去吐纳。这玉佩……替我收好，莫让旁人瞧见。」',
        '话音未落，岩穴外的雨幕里，响起了一声冷笑。',
      ],
      onFirstEnter: [give('jade_pendant'), give('qingmu_scroll'), log('玄微子赠残月玉佩与《青木诀》。')],
      choices: [{ text: '握紧玉佩，看向洞外', to: 'demon_pursuit' }],
    },
    {
      id: 'old_man_rob',
      chapter: CH,
      title: '贪念',
      art: 'old_immortal',
      text: [
        '包袱里有十来块灵石，成色比阿婆给的好上百倍；还有一卷破书、一枚缺角的玉佩。',
        '你正要把玉佩也揣进怀里，一只枯瘦的手按住了你的手腕。',
        '老者不知何时睁开了眼。他没有发怒，只是长长地叹了口气：「贪念一起，便是一重关。你拿灵石去吧，这玉佩……不是你的缘法。」',
        '他将那卷破书推到你面前：「但这《青木诀》，贫道还是想赌一赌。」',
        '洞外的雨幕里，忽然响起一声冷笑。',
      ],
      onFirstEnter: [give('qingmu_scroll'), stat('daoHeart', -1), log('得《青木诀》，老者收回了玉佩。')],
      choices: [{ text: '惊惶地看向洞外', to: 'demon_pursuit' }],
    },
    {
      id: 'flee_home',
      chapter: CH,
      title: '一夜无眠',
      art: 'withered',
      text: [
        '你一路跑回村里，蒙头躺下，却怎么也睡不着。',
        '夜半，山上传来一声惊天动地的巨响，整座村子都在颤。第二天一早，你鬼使神差地又上了山。',
        '断崖下只剩一片焦土，老者已不知所踪。泥水里半埋着一卷破书，封皮上写着三个字：青木诀。',
        '你把它捡了起来。不知为何，心里空落落的。',
      ],
      onFirstEnter: [give('qingmu_scroll'), stat('daoHeart', -1), setFlag('fled'), log('在焦土中捡到《青木诀》残卷。')],
      choices: [{ text: '回村', to: 'leave_village' }],
    },
    {
      id: 'demon_pursuit',
      chapter: CH,
      title: '黑袍',
      art: 'demon',
      text: [
        '雨中立着一个黑袍人，看不清面目，周身缠绕着淡淡的血雾。',
        '「玄微老儿，把东西交出来，本座留你个全尸。」',
        '玄微子挣扎着想要起身，却又咳出一口血。',
        when(hasItem('jade_pendant'), '你怀中的玉佩忽然变得滚烫，像一颗在跳动的心。'),
      ],
      choices: [
        {
          text: '冲出去引开他',
          check: {
            stat: 'constitution',
            difficulty: 4,
            modifiers: [bonus(flag('grandma_blessing'), 1, '阿婆的叮嘱 +1')],
            success: {
              to: 'old_man_farewell',
              result: '你抓起一把碎石砸向黑袍人，转身钻进密林。你自小在这山里长大，哪里有沟、哪里有藤，闭着眼都知道。黑袍人追了半座山，最终骂骂咧咧地失了你的踪迹。',
              effects: [stat('karma', 1), stat('constitution', 1), setFlag('led_demon_away')],
            },
            failure: {
              to: 'old_man_farewell',
              result: '你才冲出几步，一道血光便击中了你的后背。你滚下山坡，昏死过去。醒来时，雨已经停了。',
              effects: [stat('hp', -15)],
            },
          },
        },
        {
          text: '举起玉佩',
          requires: hasItem('jade_pendant'),
          to: 'old_man_farewell',
          effects: [setFlag('pendant_awakened'), stat('daoHeart', 1), log('残月玉佩第一次苏醒。')],
        },
        {
          text: '屏住呼吸，躲在石后',
          to: 'old_man_farewell',
          effects: [stat('karma', -1), setFlag('hid')],
        },
      ],
    },
    {
      id: 'old_man_farewell',
      chapter: CH,
      title: '残月',
      art: 'moon_cliff',
      text: [
        when(flag('pendant_awakened'), '玉佩中迸出一道清冷的月光，黑袍人惨叫一声，化作血雾遁走。那光芒转瞬即逝，玉佩又变回了温润的模样。'),
        when(flag('hid'), '你缩在石后，听着洞中传来激烈的斗法声、骨裂声，然后是一声悠长的叹息。许久之后，一切归于寂静。'),
        '雨停了。云破处，一轮残月悬在崖顶。',
        '玄微子靠着岩壁坐着，身形正一点一点地变淡，像宣纸上的墨迹遇了水。',
        '「贫道的时辰到了。」他望着你，目光温和，「三月之后，云岫宗开山收徒。去吧，去看看山上的风景。」',
        '一阵风过，他便散了。岩壁上只留下一个浅浅的人形墨痕。',
      ],
      onFirstEnter: [log('玄微子坐化于残月之下。')],
      choices: [{ text: '朝着那墨痕，深深一拜', to: 'leave_village', effects: [stat('daoHeart', 1)] }],
    },
    {
      id: 'leave_village',
      chapter: CH,
      title: '别离',
      art: 'village',
      text: [
        '你把山上的事说给阿婆听。阿婆沉默了很久，起身去灶房，给你烙了一整摞饼。',
        '「去吧。」她说，「阿婆老了，走不动了，可你还年轻。」',
        when(flag('fled'), '你想起断崖下那片焦土，心里一阵发紧。有些东西，错过了就再也追不回来。'),
        '村口的老槐树下，晨雾又起来了。',
      ],
      choices: [
        {
          text: '把身上的灵石都留给阿婆',
          requires: statAtLeast('stones', 1),
          to: 'journey',
          effects: [stat('karma', 2), { type: 'setStat', stat: 'stones', value: 0 }, log('将灵石尽数留给了阿婆。')],
        },
        { text: '背上烙饼，头也不回地出发', to: 'journey', effects: [stat('daoHeart', 1)] },
        { text: '……不走了，留下来陪阿婆', to: 'ending_mortal' },
      ],
    },
    {
      id: 'journey',
      chapter: CH,
      title: '一路向西',
      art: 'river_boat',
      text: [
        '云岫宗在三千里外的云岫主峰。你沿着大江一路西行，搭过商船，睡过破庙，也在荒村里帮人砍过柴。',
        '三个月，说长不长，说短不短。',
      ],
      onFirstEnter: [days(90)],
      choices: [
        {
          text: '夜夜打坐，参悟《青木诀》',
          check: {
            stat: 'insight',
            difficulty: 4,
            modifiers: [bonus(flag('pendant_awakened'), 1, '玉佩共鸣 +1')],
            success: {
              to: 'sect_gate',
              result: '某夜江上起雾，你忽觉一缕清凉之气自眉心沉入丹田——这便是「气感」。你欣喜若狂，一夜未眠。',
              effects: [cultivate(12), stat('insight', 1), log('途中初得气感。')],
            },
            failure: {
              to: 'sect_gate',
              result: '残卷上的字你都认得，连起来却如天书。三个月下来，只摸到一点模糊的门道。',
              effects: [cultivate(4)],
            },
          },
        },
        {
          text: '沿途做工，攒些盘缠',
          to: 'sect_gate',
          result: '你在码头扛过包，在药铺碾过药。手上的茧又厚了一层，腰包也鼓了些。',
          effects: [stat('stones', 8), stat('constitution', 1)],
        },
        {
          text: '路遇狼患，出手相助',
          check: {
            stat: 'constitution',
            difficulty: 4,
            success: {
              to: 'sect_gate',
              result: '你领着几个猎户守了三夜，终于用火把和陷阱赶跑了狼群。村长硬塞给你一枚家传的丹药。',
              effects: [stat('karma', 2), give('healing_pill'), log('于途中驱赶狼患，得回春丹。')],
            },
            failure: {
              to: 'sect_gate',
              result: '狼群比想象中凶悍，你被咬伤了腿，好在村民们终究守住了村子。',
              effects: [stat('karma', 1), stat('hp', -12)],
            },
          },
        },
      ],
    },
    {
      id: 'ending_mortal',
      chapter: CH,
      title: '一世凡人',
      art: 'village',
      text: [
        '你把《青木诀》压在了箱底。',
        '后来你娶了邻村的姑娘，给阿婆送了终，儿孙绕膝。每逢雾天，你都会站在村口的老槐树下，望一望云岫山。',
        '山上有没有仙人，你终究不知道。',
        '但这一生，也算圆满。',
      ],
      ending: { kind: 'neutral', title: '一世凡人' },
      choices: [],
    },
  ],
};
