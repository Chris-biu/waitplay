# Alpha 发布前检查清单

- [x] `npm test`、`npm run typecheck` 与 `npm run build` 已运行。
- [x] 产物为 Chrome Manifest V3，且仅声明 `alarms`、`notifications`、`storage`、`tabs` 权限。
- [x] README 说明本地构建与加载方式。
- [x] 隐私说明禁止读取提示词、代码、模型输出、网页正文、表单与剪贴板。
- [x] 权利台账存在，且未将任何未核验内容标记为通过。
- [x] 游戏体验保持为本地占位页；没有第三方游戏、广告或云游戏。
- [ ] 在目标 Windows Chrome 中完成通知权限、焦点返回、关闭标签页和卸载测试。
- [ ] 获得 3 款游戏的人工权利核验与体验验收后，才可替换占位页。
- [ ] 收集试用反馈并确认不存在严重“错过 AI 完成”的问题。

当前构建**不具备对外 Alpha 发布资格**：内容权利与目标 Chrome 人工验证尚未完成。

