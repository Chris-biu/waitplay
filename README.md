# Waitplay

Waitplay 是一个面向 Windows Chrome 的 Manifest V3 扩展。它将验证用户能否在等待 AI 编程任务时，主动选择短暂、可中断的游戏体验，并在任务需要处理时可靠回到原标签页。

当前仓库仅完成项目规则与可构建的扩展骨架；尚未实现等待模式、游戏推荐、通知、内容脚本或自动状态识别。

## 技术栈

- WXT
- TypeScript
- React
- Chrome Manifest V3

## 本地开发

```powershell
npm install
npm run dev
```

打开 Chrome 的 `chrome://extensions`，启用“开发者模式”，选择“加载已解压的扩展程序”，然后选择 `.output/chrome-mv3-dev` 目录。

## 构建与检查

```powershell
npm run typecheck
npm run build
npm run zip
```

生产构建输出在 `.output/chrome-mv3`；压缩包输出在 `.output`。

## 隐私与范围

- 不读取、保存或上传提示词、代码、模型输出、网页正文、表单输入或剪贴板内容。
- 不接入未获得明确权利确认的第三方游戏。
- 不包含账号、广告、积分、排行榜、自动点击或自动打开游戏。
