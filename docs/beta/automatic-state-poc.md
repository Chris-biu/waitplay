# DeepSeek 网页状态 PoC 门槛

状态：已实现隔离的观察 PoC；未进入自动等待模式。

## 范围

- 目标页面仅为 `https://chat.deepseek.com/*`。
- 内容脚本只检查预设停止生成控件、页面级 `role="alert"` 和可编辑输入控件的**存在性**；结果立即归约为布尔值。
- 后台只保存 `generating`、`completed`、`needs_user` 或 `unknown` 与本地观察时间。
- 不读取、保存或上传提示词、回复、代码、输入值、文本节点、Cookie、账号信息或完整页面内容。

## 安全状态机

- 看到停止生成控件时为 `generating`。
- 仅当此前已见到 `generating`，随后停止控件消失且编辑器可用时，才为 `completed`。
- 页面级注意信号为 `needs_user`。
- 首次加载、刷新、网络中断、DOM 不匹配、不同域名及任意不确定状态均为 `unknown`。

该 PoC 绝不自动开始或结束等待、打开游戏、点击网页或切换标签页。只有在负责人按 `docs/testing/deepseek-beta-manual-test.md` 完成现场测试、并确认误报风险可接受后，才可另行评估自动化；任何失败都维持手动等待。
