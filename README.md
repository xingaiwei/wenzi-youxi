# 问道 · 水墨修仙文字冒险

一款浏览器里运行的文字修仙冒险游戏。所有插图都由代码实时绘制成水墨风格的 SVG，无需任何图片素材。

- 5 个章节、约 40 个场景、6 种结局（筑基成功 ×2、魔道、归隐、凡人、身死道消）
- 境界、修为、气血、悟性 / 根骨 / 道心 / 因果等属性；属性检定会显示成功率和各项加成
- 行囊与物品使用、游历记录、自动存档
- 适配桌面与手机，支持系统深色模式；数字键 1–9 可快速选择

## 快速开始

```bash
npm install
npm run dev        # 本地开发 http://localhost:5173
npm test           # 引擎单元测试 + 剧情数据校验
npm run build      # 类型检查并打包到 dist/
```

插图画廊（开发时预览全部插图）：`npm run dev` 后打开 <http://localhost:5173/gallery.html>。

## 目录结构

```
src/
├── engine/            游戏引擎（纯逻辑，不依赖 DOM）
│   ├── types.ts       核心类型：Scene / Choice / Effect / Condition / GameState
│   ├── engine.ts      Game 类：视图、选择、使用物品
│   ├── conditions.ts  条件求值
│   ├── effects.ts     效果执行（属性、物品、境界突破……）
│   ├── checks.ts      属性检定与成功率
│   ├── text.ts        文本模板 {{name}} {{realm}} ……
│   ├── rng.ts         可复现的随机数（种子存在存档里）
│   └── state.ts       初始状态
├── data/              游戏内容（策划主要修改这里）
│   ├── stats.ts       属性定义与初始值
│   ├── realms.ts      境界表
│   ├── items.ts       物品表
│   └── story/         剧情，按章节拆分
│       ├── dsl.ts     编写剧情用的工具函数
│       ├── common.ts  跨章节共享的常量与条件
│       ├── ch1_village.ts … ch5_foundation.ts
│       └── index.ts   章节登记
├── art/               程序化水墨插图
│   ├── core/          随机数、几何、毛笔笔触、SVG 滤镜（宣纸、晕染、飞白）
│   ├── elements/      画面元素：山峦、云雾、松竹、亭台、人物、仙鹤、印章……
│   ├── scenes/        每幅插图的构图
│   └── registry.ts    插图登记与渲染入口
├── ui/                界面（原生 TypeScript + DOM，无框架）
│   ├── App.ts         标题画面 ↔ 游戏画面
│   ├── save.ts        存档（localStorage，带版本号）
│   └── components/    状态栏、插图框、选项、行囊抽屉……
└── styles/main.css    水墨主题样式（CSS 变量，含深色模式）
tests/
├── engine.test.ts     引擎单元测试
└── story.test.ts      剧情校验：引用合法、全部可达、随机游玩 1500 次无卡死且触达所有结局
```

## 如何扩展

### 新增场景

在 `src/data/story/` 对应章节里追加一个 `Scene`：

```ts
{
  id: 'tea_house',
  chapter: CH,
  title: '茶寮',
  art: 'pavilion',                       // 插图 id
  text: [
    '山道旁有一间茶寮。',
    when(flag('met_su'), '苏清寒正坐在窗边饮茶。'),   // 条件段落
  ],
  onFirstEnter: [log('路过茶寮。')],
  choices: [
    { text: '喝碗茶再走', to: 'sect_hub', effects: [stat('hp', 5), days(1)] },
    {
      text: '与茶客比试',
      requires: realmAtLeast(1),        // 不满足则隐藏
      showWhenLocked: true,              // ……或者置灰显示
      lockedHint: '需炼气境',
      check: {                           // 属性检定
        stat: 'constitution',
        difficulty: 5,
        modifiers: WEAPON_BONUS,
        success: { to: 'sect_hub', result: '你赢了。', effects: [stat('stones', 10)] },
        failure: { to: 'sect_hub', result: '你输了。', effects: [stat('hp', -8)] },
      },
    },
  ],
}
```

然后从其他场景的选项 `to: 'tea_house'` 跳转过来即可。运行 `npm test`，校验会检查跳转目标、物品、插图是否都存在，场景是否可达，以及随机游玩会不会卡住。

### 新增章节

新建 `src/data/story/ch6_xxx.ts` 导出一个 `Chapter`，并在 `src/data/story/index.ts` 的 `CHAPTERS` 中登记。

### 新增物品 / 境界 / 属性

- 物品：`src/data/items.ts`，带 `use` 字段的物品可以在行囊里使用
- 境界：`src/data/realms.ts`，`toNext` 为突破到下一境界所需修为
- 属性：`src/engine/types.ts` 的 `StatKey` + `src/data/stats.ts`

### 新增插图

在 `src/art/scenes/` 里写一个 `ArtScene`，用 `elements/` 里的元素组合构图，再在 `registry.ts` 中登记：

```ts
tea_house: {
  inscription: '茶寮',               // 竖排题字，自动加盖印章
  draw: (r) => {
    const hill = spire(r, 400, 480, 200, 200, 'near');   // 地形可查询高度
    return [
      mountainRange(r, { baseY: 260, depth: 'far', peaks: [{ x: 300, height: 150, width: 240 }] }),
      mistBand(r, 270, 5),
      hill.svg,
      pavilion(r, 400, hill.y(400) + 6, 0.8, 1),          // 放在山顶上
      pine(r, 300, hill.y(300) + 8, 0.6),
    ];
  },
},
```

同一 id 每次渲染结果都一样（按 id 做随机种子）。也可以用外部图片替换任意插图：把图片放到 `public/art/` 下，然后登记为 `{ image: 'art/xxx.webp' }`。

## 存档

存档保存在浏览器 `localStorage` 中（键名 `wenzi-youxi:save`），每次选择后自动保存。`GameState.version` 用于将来结构变化时迁移旧存档，见 `src/ui/save.ts`。

## 部署

`npm run build` 生成的 `dist/` 是纯静态文件（使用相对路径），可以直接部署到 GitHub Pages、Vercel、Netlify 或任意静态服务器。
