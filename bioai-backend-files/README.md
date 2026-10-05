# 博客自动生成功能 - 部署指南

## 当前维护说明（2026-10-05）

正式代码以 `CloudFlare-BioAI-Daily` 仓库为准。本目录只镜像个人博客模块，不是完整 Worker 工程。知识库、质量校验、日期/幂等和调度配套不能省略。

本轮只改个人博客内容输入与质量控制，不改变三个 BioAI 主任务、生产 Secrets 或 cron。下面的两时段 cron、直接覆盖配置和删除文件式回退示例已经过时，只留作历史记录，**不要执行**。当前回退应使用此前正式部署的 Worker 版本，不能删除正在使用的处理器。

个人博客的 `streamChat` 在局部环境副本中设置 `ANTHROPIC_NATIVE_SYSTEM_PROMPT: true`。配套后端 `src/chatapi.js` 的流式 Anthropic 调用必须包含以下分支：

```javascript
if (systemPromptText && systemPromptText.trim() !== '') {
    if (env.ANTHROPIC_NATIVE_SYSTEM_PROMPT === true) {
        payload.system = systemPromptText;
    } else {
        payload.messages[0].content = `${systemPromptText}\n\n${promptText}`;
    }
}
```

该开关不是新 Cloudflare 绑定，不写入生产 vars；其他调用不设置它，保持原请求格式。标准字段见 [Anthropic Messages API](https://platform.claude.com/docs/en/api/messages/create)。不要仅复制本目录的 handler 到不含配套分支的旧后端。

新版本先做 `dryRun`：只读真实来源并生成私人草稿，不写文章与任务 KV。轻度长句不追加调用，严重问题最多一次定向 repair。撤下的六篇仍保留文件，已有文件检查防止自动重写；缺材料或校验失败可以不发表。

## 以下为历史安装记录（不再执行）

## 📁 文件清单

所有需要的文件已生成到 `D:\GitHub\astro-paper\bioai-backend-files\` 目录：

```
bioai-backend-files/
├── src/
│   ├── handlers/
│   │   └── scheduledBlog.js    # 核心逻辑（新建）
│   └── prompt/
│       └── blogPrompt.js       # 博客提示词（新建）
├── index.js.patch.md           # index.js 修改说明
└── wrangler.toml.patch.md      # wrangler.toml 修改说明
```

---

## 🚀 部署步骤

### 步骤 1: 复制新文件

```powershell
# 复制 scheduledBlog.js
Copy-Item "D:\GitHub\astro-paper\bioai-backend-files\src\handlers\scheduledBlog.js" `
          "D:\GitHub\CloudFlare-BioAI-Daily\src\handlers\scheduledBlog.js"

# 复制 blogPrompt.js
Copy-Item "D:\GitHub\astro-paper\bioai-backend-files\src\prompt\blogPrompt.js" `
          "D:\GitHub\CloudFlare-BioAI-Daily\src\prompt\blogPrompt.js"
```

### 步骤 2: 修改 index.js

打开 `D:\GitHub\CloudFlare-BioAI-Daily\src\index.js`，按照 `index.js.patch.md` 中的说明进行修改：

1. **顶部添加 import**（约第 13 行）：
```javascript
import { handleScheduledBlog } from './handlers/scheduledBlog.js';
```

2. **修改 scheduled 函数**（约第 15-18 行）：
```javascript
async scheduled(event, env, ctx) {
    if (event.cron === '0 1 * * *') {
        // UTC 01:00 (北京 09:00) - 博客生成任务
        console.log('[Scheduled] Running blog generation task...');
        await handleScheduledBlog(event, env, ctx);
    } else {
        // 默认任务 - BioAI 日报生成
        console.log('[Scheduled] Running BioAI daily task...');
        await handleScheduled(event, env, ctx);
    }
},
```

3. **添加手动触发路由**（在 `/testTriggerScheduled` 后面添加 `/testTriggerBlog` 路由）

### 步骤 3: 修改 wrangler.toml

打开 `D:\GitHub\CloudFlare-BioAI-Daily\wrangler.toml`：

1. **修改 crons 配置**：
```toml
[triggers]
crons = ["0 23 * * *", "0 1 * * *"]
```

2. **添加博客仓库配置**（在 [vars] 部分末尾）：
```toml
# 博客自动生成配置
BLOG_REPO_NAME = "astro-paper"
BLOG_REPO_BRANCH = "main"
```

### 步骤 4: 本地测试

```powershell
cd D:\GitHub\CloudFlare-BioAI-Daily

# 启动本地开发服务器
npx wrangler dev

# 在浏览器中测试（使用昨天的日期）
# http://127.0.0.1:8787/testTriggerBlog?key=你的密钥&date=2026-01-10
```

### 步骤 5: 部署到 Cloudflare

```powershell
cd D:\GitHub\CloudFlare-BioAI-Daily
npx wrangler deploy
```

---

## ✅ 验证清单

部署后检查以下内容：

- [ ] Cloudflare Dashboard 显示两个 Cron 触发器（0 23 * * * 和 0 1 * * *）
- [ ] 手动触发 `/testTriggerBlog?key=xxx&date=2026-01-10` 返回成功
- [ ] astro-paper 仓库出现新的博客文件（`src/data/blog/ai-daily-2026-01-10.md`）
- [ ] GitHub Actions 自动触发，yuyu.aivora.cn 更新

---

## 🔧 故障排查

### 博客没有生成
1. 检查日报是否存在：访问 `https://raw.githubusercontent.com/dongyu19920904/Hextra-AI-Insight-Daily/main/daily/2026-01-10.md`
2. 检查 Cloudflare Worker 日志：`npx wrangler tail`

### GitHub 推送失败
1. 确认 `GITHUB_TOKEN` 对 `astro-paper` 仓库有写权限
2. 检查仓库名是否正确：`BLOG_REPO_NAME = "astro-paper"`

### AI 生成内容为空
1. 检查 AI API 配置是否正确
2. 查看 Worker 日志中的错误信息

---

## 📅 执行时间表

| 时间 (UTC) | 时间 (北京) | 任务 |
|-----------|------------|------|
| 23:00 | 07:00 次日 | BioAI 日报生成 → 推送到 BioAI-Daily-Web |
| 01:00 | 09:00 | 博客生成 → 推送到 astro-paper |

博客任务在日报生成 2 小时后执行，确保日报已经可用。

---

## 🔄 回滚方案

如果出现问题，快速回滚：

1. **删除新文件**：
```powershell
Remove-Item "D:\GitHub\CloudFlare-BioAI-Daily\src\handlers\scheduledBlog.js"
Remove-Item "D:\GitHub\CloudFlare-BioAI-Daily\src\prompt\blogPrompt.js"
```

2. **恢复 index.js**：删除添加的 import 和 scheduled 修改

3. **恢复 wrangler.toml**：移除 `0 1 * * *` 和博客配置

4. **重新部署**：`npx wrangler deploy`

---

**完成！** 🎉 现在你的博客会每天自动生成两篇文章。
# 2026-10-05 正文媒体补充

`src/blogMedia.js` 是个人博客专用的确定性配图模块，与真实后端保持一致；不需要新增模型调用。仅在生成草稿引用对应来源、来源小节有真实图片时补充，最多两张。三个主日报任务不调用它。历史文章使用前端离线配图清单，不改正文文件。
