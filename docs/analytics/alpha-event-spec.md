# Alpha 本地体验事件规范

所有事件仅保存在浏览器扩展本地存储；默认关闭，启用后最多保留最近 200 条。没有后端、第三方统计 SDK 或网络上传。

| 事件 | 触发时机 | 允许字段 |
| --- | --- | --- |
| `wait_started` | 用户开始手动等待 | `name`、`occurredAt`、`sessionId` |
| `threshold_reached` | 到达本会话阈值 | 同上 |
| `card_shown` | Popup 显示推荐卡 | 同上 |
| `game_opened` | 用户主动打开本地占位游戏页 | 同上 |
| `game_load_failed` | 受控游戏页加载失败 | 同上 |
| `wait_ended` | 用户结束等待 | 同上 |
| `return_clicked` | 用户点击返回任务 | 同上 |
| `original_tab_focused` | 原始标签页聚焦成功 | 同上 |
| `recommendation_disabled` | 用户关闭本次推荐 | 同上 |

禁止字段包括网页正文、URL（及查询参数）、提示词、代码、模型输出、账号标识、完整浏览历史、表单输入和剪贴板内容。`sessionId` 是本地随机会话引用，不与账号或设备标识关联。

