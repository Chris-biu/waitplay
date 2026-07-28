# Waitplay 开发规则

## 技术栈

- Windows Chrome 扩展，Manifest V3；
- WXT、TypeScript 与 React；
- 浏览器扩展本地存储用于后续本地设置和会话状态；
- 首版不使用服务端、数据库、登录或第三方分析服务。

## 常用命令

- `npm install`：安装依赖；
- `npm run dev`：启动 Chrome 扩展开发构建；
- `npm run build`：生成生产扩展；
- `npm run typecheck`：运行 TypeScript 检查；
- `npm run zip`：生成可分发压缩包。

## 代码约定

- 使用 TypeScript 严格类型，组件保持小而聚焦；
- 按 WXT 的 `entrypoints/` 目录约定组织入口；
- 仅在确有复用价值时抽取共享模块；
- 修改前先检查现有实现与测试，完成后运行最相关的检查。

## 隐私与范围

- 不读取、保存或上传网页正文、表单输入、提示词、代码、模型输出或剪贴板内容；
- 不注入 AI 页面状态识别逻辑；该能力仅属于后续 Beta PoC；
- 不接入未经明确权利确认的第三方游戏、广告、商家福利或云游戏；
- Alpha 之外的账号、积分、排行榜、社交、自动点击和自动打开游戏均不在范围内。

