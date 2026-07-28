# 2048 内容准入审查记录

状态：优先候选，未批准接入。

本记录只整理公开源码仓库的证据，不能替代权利人授权、法律意见或人工体验验收。Waitplay 当前不会加载、嵌入、分发或推荐 2048。

## 已核对的公开证据

| 项目 | 结果 | 证据 |
| --- | --- | --- |
| 源码仓库 | `gabrielecirulli/2048`，默认分支 `master`，未归档 | https://github.com/gabrielecirulli/2048 |
| 源码许可证 | GitHub API 报告为 MIT；许可证文件 SHA 为 `b0dbfa4d7526587bcc21a4883222b20805d5c065` | https://github.com/gabrielecirulli/2048/blob/master/LICENSE.txt |
| 官方主页 | 仓库声明主页为 `https://play2048.co` | https://play2048.co |
| 仓库内资源 | 文件清单包含 Clear Sans 的 EOT、SVG、WOFF 字体及站点图标 | https://github.com/gabrielecirulli/2048/tree/master/style/fonts |

## 必须由负责人完成的准入闸门

1. 审阅计划使用的确切源码版本，确认保留 MIT 许可证与所需署名。
2. 获取或核对 Clear Sans 字体、图标和其他非代码资源可重新分发的证据。
3. 核对 `play2048.co` 的条款、隐私政策、广告与外部跳转；官网可访问不等同于可嵌入或可分发。
4. 在目标 Windows Chrome 环境测量首次可交互时间，确认不要求注册、无未审核广告、可安全退出。
5. 核对适龄、地区、下线联系人与本地化需求，并在 `game-rights-ledger.md` 记录负责人和日期。

只有全部闸门通过并由负责人把台账结论改为“通过”后，才可以为 Waitplay 添加任何 2048 启动 URL 或目录条目。
