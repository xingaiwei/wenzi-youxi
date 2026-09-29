# 开发约定

项目说明与目录结构见 README.md。

## 分层

- `src/engine/` 只含纯逻辑，不得引用 DOM、`src/data`、`src/ui`；需要的数据通过 `GameData` 注入。
- `src/data/` 是内容层，只描述数据，剧情用 `src/data/story/dsl.ts` 中的工具函数书写。
- `src/art/` 只输出 SVG 字符串，不操作 DOM（`installInkDefs` 除外）。
- `src/ui/` 通过 `Game` 的公开接口（`view()` / `choose()` / `useItem()` / `subscribe()`）驱动界面。

## 修改后必须运行

```bash
npm run typecheck
npm test
```

`tests/story.test.ts` 会校验所有跳转、物品和插图引用，检查所有场景可达，并随机游玩 1500 次确认无卡死且每个结局都能触达。新增结局如果难以随机触达，调整剧情或检定难度，而不是放宽测试。

## 约定

- 场景 id、物品 id、插图 id、flag 名一律使用 snake_case 英文。
- 玩家可见文本使用中文，引号用「」。
- Choice 的 `text` 是选项文字，`result` 是选择后显示的结果描述。
- 修改 `GameState` 结构时，递增 `SAVE_VERSION`（`src/engine/state.ts`）并在 `src/ui/save.ts` 的 `migrate()` 中处理旧存档。
- 插图随机数以插图 id 为种子，修改构图会改变该图的所有随机细节，属正常现象。
