# Waitplay

> 在等待 AI 任务时，给自己一段可随时放下的休息；任务需要你时，一键回到原页面。

Waitplay 是面向 Windows Chrome 的 Manifest V3 扩展。它优先验证一件事：用户能否在等待 AI 编程任务时，**主动**选择短暂、可中断的游戏体验，同时不耽误回到工作。

> 当前为 Alpha / Beta PoC 阶段。它不是游戏聚合站、广告产品，也不承诺预测 AI 的剩余完成时间。

## 当前能力

| 能力 | 状态 | 说明 |
| --- | --- | --- |
| 手动等待 | 已实现 | 在任意网页开始或结束等待，阈值可选 60 / 90 / 120 秒 |
| 恢复与通知 | 已实现 | Service Worker 休眠后恢复计时；通知可一键聚焦原标签页 |
| 推荐体验 | 已实现 | 到时显示非阻断推荐卡；游戏永远由用户主动打开 |
| 游戏内容 | 本地占位页 | 当前没有接入任何真实第三方游戏 |
| 本地隐私事件 | 已实现 | 可关闭、可清除，仅记录最小体验事件 |
| DeepSeek 网页状态 PoC | 已实现，待现场验证 | 仅观察 `chat.deepseek.com` 的最少 UI 状态信号，不读取对话内容 |

## 体验流程

```text
开始等待 → 达到阈值 → 自主选择休息或跳过
    ↑                         ↓
手动结束 ← 通知提醒 ← 主动打开独立本地游戏页
```

- 推荐不会自动打开游戏、跳转页面或抢占键盘焦点。
- “回到任务”优先于完成一局游戏；原标签关闭时会安全降级。
- 所有设置、会话与调试事件都保存在浏览器本地。

## 快速开始

### 1. 安装依赖

```powershell
npm install
```

### 2. 构建扩展

```powershell
npm run build
```

### 3. 加载到 Chrome

1. 打开 `chrome://extensions`。
2. 启用右上角的“开发者模式”。
3. 点击“加载已解压的扩展程序”。
4. 选择 `.output/chrome-mv3`。

开发时可运行 `npm run dev`，然后加载 `.output/chrome-mv3-dev`。

## 开发命令

```powershell
npm test          # 单元测试
npm run typecheck # TypeScript 检查
npm run build     # 生产构建
npm run zip       # 生成 .output/waitplay-0.1.0-chrome.zip
```

技术栈：WXT、TypeScript、React、Chrome Manifest V3。

## 隐私与控制

Waitplay 不读取、保存或上传：

- 提示词、代码、模型回复、网页正文或表单输入；
- 剪贴板、Cookie、账号信息或完整浏览历史；
- 任何第三方分析服务所需的用户内容。

DeepSeek PoC 仅将预设控件是否存在归约为 `generating`、`completed`、`needs_user` 或 `unknown`，并只在本地保存该枚举状态与时间。状态未知时绝不推断“已完成”。

## 内容准入

真实游戏必须先通过权利、素材、适龄、地区、广告、加载速度与安全退出的人工核验，才能接入。当前 `2048` 是优先审查候选，**尚未获得接入批准**。

- [游戏权利台账](docs/content/game-rights-ledger.md)
- [2048 审查记录](docs/content/2048-review.md)
- [DeepSeek 自动状态 PoC 闸门](docs/beta/automatic-state-poc.md)

## 路线图

### Alpha 收尾

- [x] 手动等待、通知召回与原标签页回归
- [x] 本地设置、最小事件与清除数据
- [ ] 完成 3 款真实网页游戏的人工权利与体验核验
- [ ] 在试用中验证“不会错过 AI 结果”的回归体验

### Beta：一个网页 AI 入口

- [x] DeepSeek 网页端隔离状态适配器
- [ ] 在受控 DeepSeek 页面验证生成、完成、错误、刷新与网络异常
- [ ] 只有误报风险可接受时，才评估自动等待；否则始终保留手动模式
- [ ] 不稳定或页面结构变化时自动停用适配器，不猜测完成状态

### 后续探索

- 评估 Codex 桌面端集成的可行性：仅使用官方允许的接口或扩展机制，绝不读取提示词、代码或模型输出。
- 在权利明确且试用验证成立后，扩充少量可快速开始、可安全退出的内容。
- 基于真实试用反馈改善可访问性、错误提示与返回工作流。
- 讨论接入商务广告游戏的可能性。
- 讨论接入steam上一些游戏的demo的可能性。

## 明确不做

账号体系、广告、奖励、积分、排行榜、自动点击、自动打开游戏、云游戏、第三方内容抓取或未经核验的游戏接入，均不在当前范围内。

## 文档

- [产品需求](docs/ideas/ai-wait-instant-game-assistant-prd.md)
- [跨职能评审](docs/ideas/ai-wait-mvp-cross-functional-review.md)
- [开发流程](docs/ideas/ai-wait-vibecoding-development-playbook.md)
- [手动测试计划](docs/testing/alpha-manual-test-plan.md)

---

如果你也在等待 AI 完成一项长任务，希望 Waitplay 能让这段空档既轻松又不失控。
