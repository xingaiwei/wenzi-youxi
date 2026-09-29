import type { Chapter } from '@/engine/types';
import { bonus, flag, give, hasItem, log, setFlag, stat, statAtMost, when } from './dsl';

const CH = '第一章 · 云岫问道';

export const chapter2: Chapter = {
  id: 'ch2',
  title: CH,
  scenes: [
    {
      id: 'sect_gate',
      chapter: CH,
      title: '云岫山门',
      art: 'sect_gate',
      text: [
        '云岫主峰拔地而起，峰顶隐在云海之中。一条白玉石阶从山脚蜿蜒而上，直入云端——这便是云岫宗的「登天梯」。',
        '山门前人头攒动，少说也有上千名少年少女，有锦衣玉带的世家子，也有和你一样的草鞋布衣。',
        '一位白衣执事立于云端，声音不大，却清清楚楚地落进每个人耳中：',
        '「九百九十九阶，日落前登顶者，方有资格问心。」',
      ],
      onFirstEnter: [log('抵达云岫宗山门。')],
      choices: [
        {
          text: '咬紧牙关，一步一步往上爬',
          check: {
            stat: 'constitution',
            difficulty: 4,
            modifiers: [bonus(flag('pendant_awakened'), 1, '玉佩护身 +1')],
            success: {
              to: 'trial_heart',
              result: '越往上，石阶越重，仿佛背上压着一座山。你想起挑柴下山的那些清晨，一口气也没有歇。登顶时，夕阳正落在云海上。',
            },
            failure: { to: 'trial_stair_fail', effects: [stat('hp', -8)] },
          },
        },
        {
          text: '以《青木诀》调息，借力而上',
          requires: hasItem('qingmu_scroll'),
          check: {
            stat: 'insight',
            difficulty: 4,
            success: {
              to: 'trial_heart',
              result: '你按残卷所载，一呼一吸与脚步相合。石阶的重压如潮水般涌来，又被你的呼吸一寸寸化开。',
              effects: [stat('insight', 1)],
            },
            failure: { to: 'trial_stair_fail', effects: [stat('hp', -8)] },
          },
        },
      ],
    },
    {
      id: 'trial_stair_fail',
      chapter: CH,
      title: '差之一步',
      art: 'sect_gate',
      text: [
        '第九百六十阶。你的腿再也抬不起来了。',
        '日头沉下山去，执事的声音响起：「时辰已到。」',
        '你趴在石阶上，眼前一阵阵发黑。忽然有人在你身旁蹲下，是一位青衣女子，眉目清冷。',
        '「你爬到这里，没有停过一次。」她说，「宗门杂役院缺人，你可愿意留下？做得好，三年后还有外门考核。」',
      ],
      choices: [
        {
          text: '愿意',
          to: 'servant_entry',
          effects: [setFlag('disciple', 'servant'), setFlag('met_su'), stat('daoHeart', 1)],
        },
      ],
    },
    {
      id: 'servant_entry',
      chapter: CH,
      title: '杂役院',
      art: 'bamboo',
      text: [
        '那青衣女子名叫苏清寒，是内门的师姐。她替你安排了住处：后山竹林边的一间柴房。',
        '杂役弟子的日子，是砍柴、挑水、扫落叶。可你本就是樵夫出身，这些活计做起来得心应手，闲下来的时辰，便对着《青木诀》打坐。',
        '竹林很静，风过时沙沙作响，像是有人在低声念经。',
      ],
      onFirstEnter: [stat('constitution', 1), give('healing_pill'), log('成为云岫宗杂役弟子。')],
      choices: [{ text: '开始山中岁月', to: 'sect_hub' }],
    },
    {
      id: 'trial_heart',
      chapter: CH,
      title: '问心',
      art: 'meditation',
      text: [
        '登顶之后，你被领进一座空荡荡的石殿。殿中只有一面古镜，镜面蒙着一层雾。',
        '「看着它。」执事说。',
        '雾散了。镜中是青石村的村口，阿婆站在老槐树下，佝偻着背，一声一声地唤你的名字。',
        when(flag('saved_old_man'), '镜中画面一转，是断崖下的玄微子，他望着你，似乎在问：你为何修仙？'),
        when(statAtMost('karma', -1), '镜中画面一转，是堆积如山的灵石，闪闪发光，触手可及。'),
      ],
      choices: [
        {
          text: '闭上眼，斩断幻象',
          check: {
            stat: 'daoHeart',
            difficulty: 4,
            modifiers: [bonus(flag('saved_old_man'), 1, '侠义之心 +1')],
            success: {
              to: 'sect_accepted',
              result: '「阿婆，等我。」你在心里说完这一句，睁开眼，镜子碎了。执事愣了一愣，在名册上你的名字旁点了一个朱砂红点——那是内门的标记。',
              effects: [setFlag('disciple', 'inner'), stat('daoHeart', 1), log('问心通过，入内门。')],
            },
            failure: {
              to: 'sect_accepted',
              result: '你在镜前站了整整一炷香，终究没能迈过去。执事叹了口气：「心有挂碍。外门吧。」',
              effects: [setFlag('disciple', 'outer'), log('问心未过，入外门。')],
            },
          },
        },
        {
          text: '应一声「阿婆，我在」',
          to: 'sect_accepted',
          result: '你忍不住应了一声。镜中的阿婆笑了，雾气重新合拢。执事看了你一眼，没说什么，把你的名字写进了外门的名册。',
          effects: [setFlag('disciple', 'outer'), stat('karma', 1), log('问心时应了阿婆一声，入外门。')],
        },
        {
          text: '伸手去触碰那堆灵石',
          requires: statAtMost('karma', -1),
          to: 'sect_accepted',
          result: '指尖触到镜面，冰冷刺骨。执事冷冷地说：「外门。」',
          effects: [setFlag('disciple', 'outer'), stat('daoHeart', -1)],
        },
      ],
    },
    {
      id: 'sect_accepted',
      chapter: CH,
      title: '入门',
      art: 'pavilion',
      text: [
        when(flag('disciple', 'inner'), '内门弟子居于半山的听松阁，推窗便是万丈云海。'),
        when(flag('disciple', 'outer'), '外门弟子住在山腰的一排排木屋里，虽然简陋，却也干净。'),
        '领了弟子服与一柄铁剑，你正要回住处，却被人拦住了去路。',
        '来人锦衣玉冠，是外门大师兄赵乾。他上下打量你一番，嗤笑一声：「乡下来的樵夫，也配入我云岫宗？」',
        '他身后站着一位青衣女子，淡淡开口：「赵乾，宗门规矩，不得欺凌新人。」',
        '赵乾撇了撇嘴，却也没再多说。那女子朝你点点头：「我叫苏清寒。有事可以来找我。」',
      ],
      onFirstEnter: [give('iron_sword'), give('healing_pill', 2), setFlag('met_su'), log('入云岫宗，结识苏清寒，得罪了赵乾。')],
      choices: [
        {
          text: '向赵乾拱手行礼，不卑不亢',
          to: 'sect_hub',
          result: '赵乾没想到你会行礼，愣了一瞬，哼了一声走了。',
          effects: [setFlag('zhao_respect')],
        },
        {
          text: '径直从他身边走过',
          to: 'sect_hub',
          result: '擦肩而过时，你听见赵乾在身后冷冷地说：「走着瞧。」',
          effects: [setFlag('zhao_grudge'), stat('daoHeart', 1)],
        },
      ],
    },
  ],
};

