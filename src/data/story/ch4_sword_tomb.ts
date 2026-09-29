import type { Chapter } from '@/engine/types';
import { all, bonus, cultivate, days, flag, give, hasItem, log, not, setFlag, stat, statAtLeast, when, WEAPON_BONUS } from './dsl';

const CH = '第三章 · 剑冢';

const allySu = bonus(flag('ally_su'), 1, '苏清寒相助 +1');

export const chapter4: Chapter = {
  id: 'ch4',
  title: CH,
  scenes: [
    {
      id: 'realm_open',
      chapter: CH,
      title: '剑冢开启',
      art: 'secret_realm',
      text: [
        '这一日，后山忽然响起一声剑鸣，清越悠长，满山的松针都簌簌落下。',
        '云海裂开一道缝隙，缝隙后是一片悬浮在虚空中的山峦，山上插满了锈迹斑斑的古剑，密如荒草。',
        '剑冢开了。',
        '苏清寒找到了你：「剑冢凶险，我们结伴而行，彼此也有个照应。」',
        '不远处，赵乾正带着几个跟班，朝你这边冷冷地看了一眼。',
      ],
      onFirstEnter: [log('剑冢开启。')],
      choices: [
        {
          text: '与苏师姐同行',
          to: 'tomb_entrance',
          effects: [setFlag('ally_su')],
        },
        {
          text: '「多谢师姐，我想一个人走走。」',
          to: 'tomb_entrance',
          effects: [stat('daoHeart', 1)],
        },
      ],
    },
    {
      id: 'tomb_entrance',
      chapter: CH,
      title: '万剑归冢',
      art: 'sword_tomb',
      text: [
        '踏入剑冢的一刹那，四面八方都是剑意。有的锋锐，有的厚重，有的悲凉——每一柄剑下，都埋着一位剑修的一生。',
        when(flag('ally_su'), '苏清寒按剑走在你身侧，神情凝重：「不要看太久，会被剑意所伤。」'),
        '前方分出两条路：左边是一道长长的剑廊，剑气纵横；右边的荒草中，立着一块无字石碑。',
      ],
      choices: [
        { text: '走左边的剑廊', to: 'sword_trial' },
        { text: '去看那块无字碑', to: 'stele' },
      ],
    },
    {
      id: 'sword_trial',
      chapter: CH,
      title: '剑意',
      art: 'sword_tomb',
      text: [
        '剑廊尽头，有一柄剑斜插在石中，剑身青碧，不染一丝锈迹。',
        '你走近时，它忽然轻轻震颤了一下，发出一声低吟——像是在问你什么。',
      ],
      choices: [
        {
          text: '以心相应，握住剑柄',
          check: {
            stat: 'daoHeart',
            difficulty: 5,
            modifiers: [bonus(flag('pendant_awakened'), 2, '残月共鸣 +2'), allySu],
            success: {
              to: 'tomb_heart',
              result: '你握住剑柄的一瞬，一道苍老的剑意涌入识海——那是一个剑修漫长的一生。等你回过神来，青锋剑已安静地躺在你掌心。',
              effects: [give('azure_sword'), log('于剑冢得青锋剑。')],
            },
            failure: {
              to: 'tomb_heart',
              result: '剑意如万千寒针，刺得你浑身是血。那柄剑沉寂下去，再无回应。',
              effects: [stat('hp', -15)],
            },
          },
        },
        {
          text: '以力拔剑',
          check: {
            stat: 'constitution',
            difficulty: 6,
            modifiers: [allySu],
            success: {
              to: 'tomb_heart',
              result: '你怒喝一声，硬生生把剑从石中拔了出来。剑身嗡鸣不止，似有不甘，却终究认了你。',
              effects: [give('azure_sword'), stat('constitution', 1), log('于剑冢强夺青锋剑。')],
            },
            failure: {
              to: 'tomb_heart',
              result: '剑纹丝不动，反震之力让你虎口崩裂。',
              effects: [stat('hp', -12)],
            },
          },
        },
      ],
    },
    {
      id: 'stele',
      chapter: CH,
      title: '无字碑',
      art: 'stele',
      text: [
        '石碑上一个字也没有。可你看得久了，那光滑的石面上似乎有剑痕在游走，一横，一竖，一撇，一捺。',
        '那不是字。那是剑招。',
      ],
      choices: [
        {
          text: '静坐参悟',
          check: {
            stat: 'insight',
            difficulty: 5,
            modifiers: [bonus(flag('librarian_blessing'), 2, '守阁人点化 +2')],
            success: {
              to: 'tomb_heart',
              result: '三天三夜。当你终于站起身，一剑递出，身前的荒草齐齐断作两截。',
              effects: [stat('insight', 1), cultivate(15), days(3), log('于无字碑前悟得一式剑招。')],
            },
            failure: {
              to: 'tomb_heart',
              result: '剑痕越游越快，你看得头痛欲裂，只得强行移开目光。',
              effects: [stat('hp', -8), days(1)],
            },
          },
        },
      ],
    },
    {
      id: 'tomb_heart',
      chapter: CH,
      title: '剑冢深处',
      art: 'cave',
      text: [
        '剑冢最深处，是一座坍塌了一半的石室。石室正中的石台上，放着一只白玉匣子。',
        '你打开玉匣，一股清香扑面而来——是一枚筑基丹。',
        '身后响起了脚步声。',
        '「师弟好运气。」赵乾带着两个跟班堵住了石室的门，「把丹药交出来，我可以当作没看见你。」',
        when(flag('ally_su'), '苏清寒拔剑出鞘，挡在你身前：「赵乾，你敢在剑冢里对同门动手？」'),
      ],
      choices: [
        {
          text: '拔剑，寸步不让',
          check: {
            stat: 'constitution',
            difficulty: 6,
            modifiers: [...WEAPON_BONUS, bonus(flag('ally_su'), 2, '苏清寒并肩 +2')],
            success: {
              to: 'tomb_exit',
              result: '剑光交错。十招之后，赵乾的剑被你挑飞，钉在石壁上嗡嗡作响。他脸色铁青，带着跟班退了出去。',
              effects: [give('foundation_pill'), setFlag('beat_zhao'), log('剑冢中击退赵乾，得筑基丹。')],
            },
            failure: {
              to: 'tomb_exit',
              result: '你终究不是赵乾的对手。他一掌将你击飞，拿走玉匣，扬长而去。',
              effects: [stat('hp', -20), setFlag('zhao_took_pill')],
            },
          },
        },
        {
          text: '晓之以理：「宗门规矩，秘境所得，各凭机缘。」',
          check: {
            stat: 'daoHeart',
            difficulty: 5,
            modifiers: [bonus(flag('zhao_respect'), 2, '昔日之礼 +2'), bonus(statAtLeast('karma', 3), 1, '善缘 +1')],
            success: {
              to: 'tomb_exit',
              result: '赵乾盯着你看了很久，忽然大笑：「好，好一个各凭机缘。今日算我欠你一次。」他竟真的转身走了。',
              effects: [give('foundation_pill'), setFlag('zhao_reconciled'), stat('karma', 1), log('以理服人，赵乾退走。')],
            },
            failure: {
              to: 'tomb_exit',
              result: '「规矩？」赵乾冷笑，「在这里，我就是规矩。」他夺过玉匣，扬长而去。',
              effects: [setFlag('zhao_took_pill'), stat('daoHeart', -1)],
            },
          },
        },
        {
          text: '把玉匣扔给他',
          to: 'tomb_exit',
          result: '赵乾接住玉匣，有些意外地看了你一眼，走了。',
          effects: [setFlag('zhao_took_pill'), stat('daoHeart', -1)],
        },
      ],
    },
    {
      id: 'tomb_exit',
      chapter: CH,
      title: '血煞',
      art: 'demon',
      text: [
        '走出石室时，剑冢中的天色变了。',
        '血雾。漫天的血雾从裂缝中灌进来，那些插在地上的古剑一柄接一柄地哀鸣着折断。',
        '血雾中走出一个黑袍人。',
        when(flag('saved_old_man'), '你认得他——那夜在断崖下，追杀玄微子的，正是此人。'),
        '「小子，」他的声音像是生锈的刀刮过骨头，「玄微老儿留下的东西，在你身上吧？」',
        '他忽然笑了：「交出来，本座收你为徒。血煞门的功法，比你那什么《青木诀》强上百倍——你想要的，本座都能给你。」',
      ],
      choices: [
        {
          text: '以残月玉佩相抗',
          requires: hasItem('jade_pendant'),
          check: {
            stat: 'daoHeart',
            difficulty: 6,
            modifiers: [bonus(flag('pendant_awakened'), 2, '残月曾醒 +2'), allySu, bonus(hasItem('azure_sword'), 1, '青锋剑 +1')],
            success: {
              to: 'return_sect',
              result: '你将玉佩高高举起。一轮残月从玉中升起，清辉如水，所到之处血雾尽散。黑袍人惨叫着化作一道血光遁走，临走前留下一句：「本座记住你了。」',
              effects: [setFlag('demon_repelled'), stat('karma', 1), stat('daoHeart', 1), log('以残月玉佩击退血煞门魔修。')],
            },
            failure: {
              to: 'return_sect',
              result: '玉佩只亮了一瞬便暗了下去。血光如刀，你被击飞十余丈。好在剑冢外的长老们感应到异变，及时赶来，魔修才仓皇退去。',
              effects: [stat('hp', -25)],
            },
          },
        },
        {
          text: '……接受他的魔功',
          to: 'return_sect',
          result: '你伸出了手。一缕血色的气息顺着指尖钻入你的经脉，冰冷，却强大得令人战栗。黑袍人满意地笑着，消失在血雾中。',
          effects: [setFlag('demonic'), cultivate(40), stat('karma', -4), stat('daoHeart', -2), log('接受了血煞门的魔功。')],
        },
        {
          text: '转身就跑',
          check: {
            stat: 'constitution',
            difficulty: 5,
            modifiers: [allySu],
            success: {
              to: 'return_sect',
              result: '你拼了命地跑，一直跑到剑冢的出口，被闻讯赶来的长老们接住。',
            },
            failure: {
              to: 'return_sect',
              result: '一道血光追上了你。你摔出剑冢时，已是奄奄一息。',
              effects: [stat('hp', -20)],
            },
          },
        },
      ],
    },
    {
      id: 'return_sect',
      chapter: CH,
      title: '归山',
      art: 'sect_gate',
      text: [
        '剑冢关闭了。血煞门魔修现身之事震动了整个云岫宗，掌门亲自下令封山三月。',
        when(flag('ally_su'), '苏清寒来看过你一次，留下一瓶丹药，什么也没说。'),
        when(flag('zhao_reconciled'), '赵乾托人送来一瓶回春丹，附了张纸条：「欠你的。」'),
        when(flag('zhao_took_pill'), '听说赵乾出关后便闭了死关，想必是要冲击筑基了。'),
        when(not(hasItem('foundation_pill')), '没有筑基丹，筑基之路只会更加艰险。或许可以去坊市碰碰运气。'),
      ],
      onFirstEnter: [
        setFlag('tomb_done'),
        days(5),
        stat('hp', 20),
        cultivate(10),
        log('自剑冢归来。'),
      ],
      choices: [
        {
          text: '收下赵乾的丹药',
          requires: all(flag('zhao_reconciled'), not(flag('got_zhao_gift'))),
          result: '回春丹，成色极好。',
          effects: [give('healing_pill'), setFlag('got_zhao_gift')],
        },
        {
          text: '打开苏师姐留下的瓷瓶',
          requires: all(flag('ally_su'), not(flag('got_su_gift'))),
          result: '瓶中是一枚聚气丹、一枚回春丹，瓶底压着一张字条：「保重。」',
          effects: [give('qi_pill'), give('healing_pill'), setFlag('got_su_gift')],
        },
        { text: '回洞府', to: 'sect_hub' },
      ],
    },
  ],
};
