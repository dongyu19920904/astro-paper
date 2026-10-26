# D AI 生命延续学三个栏目任务书

目标会话：codex://threads/019e1b44-97b7-7a02-aa2b-d8d82c6131bf，已核实标题“ai生命延续学日报-优化和改进”、local、空闲。负责日报、延续学商机、延续学资讯商机三个栏目，先核实实际名称、含义、mode 和入口，分别优化，不合并或改名。

已从会话/remote 核实：后端 `D:\GitHub\_worktrees\bioai-opportunity-gate-20261026`，仓库 `dongyu19920904/CloudFlare-BioAI-Daily`，Workers JavaScript。前端预期 `D:\GitHub\BioAI-Daily-Web` / `dongyu19920904/BioAI-Daily-Web`，Hugo/Hextra，remote 与最新工作区须实查。你的旧基线 627b3453 之后，协调会话已发布个人博客修复，main 265b7b07、生产 Worker 9c0cc8d5；不能将旧 6fb8f974 当当前生产后覆盖。请先 fetch 并确认新基线。

并发所有权：同一仓库三个栏目均由你负责；个人博客由 A 负责。A 的工作区 `D:\GitHub\_worktrees\bioai-knowledge-rebuild-20261005`，分支 `codex/personal-blog-writing-20261026`。A 独占 `src/prompt/blogPrompt.js`、`src/blogQuality.js`、`src/handlers/scheduledBlog.js`、新博客专属模块及相关测试。你不改这些、blogPersona/知识库/作者资料；A 不改你的三个主任务。共享 transport、入口/cron/Secrets 本轮双方都不改；若确需共享改动，先在结果里交明确方案而不竞争写文件。共享 Worker 本轮不要独立部署；完成可逆实现、测试和提交/补丁后交结果，协调者整合并按既有明确发布授权统一一次发布。前端发布亦遵原授权。

现有证据：你上一轮修复软件“自测”误判、来源/DOI 与定向重试，已上线并保留。本次不是再解除健康门禁。#73 不完整失败草稿不能伪造还原；25 日个人博客缺稿已恢复，与原日报抓取为空不同，不补跑旧日报来做排版测试。

执行顺序：读 AGENTS/README/依赖/部署配置、git status；定位三个栏目的真实定时->抓取->筛选->模型->结构化输出->MD->门禁->保存/展示链路；取各自真实样稿区分内容/语法/解析/CSS。自主选择少量适合资源，将 API 规则变为版本化栏目 prompt 接到实际请求，将确定性格式化/检查接到保存/构建。Worker 不加 Bun/Python/浏览器，不每天安装依赖或拉上游。保留已有包管理器/锁文件。

编辑标准：日报解释研究事实与证据阶段；商机明确目标用户、需求证据、验证动作、成本风险；资讯商机明确新闻事实与机会推断。区分预印本/同行评议、细胞/动物/人体、相关/因果。必要限定就近保留，不能为了口语化删掉。不生成个人诊断、用药指导、寿命承诺或确定收益，不造个人使用/客户/实验经历。

相关候选完整链接：

- https://github.com/AgriciDaniel/claude-blog （研究/引用/审核方法，短日报不扩成 SEO 长文）
- https://github.com/ComposioHQ/awesome-claude-skills/blob/master/content-research-writer/SKILL.md
- https://github.com/coreyhaines31/marketingskills （只用于商机）
- https://github.com/op7418/Humanizer-zh 或 https://github.com/Hyacehila/humanizer-zh-next 或 https://github.com/hardikpandya/stop-slop （一套即可，不改科学确定程度）
- https://github.com/JimLiu/baoyu-skills/tree/main/skills/baoyu-format-markdown
- https://github.com/JimLiu/baoyu-skills/tree/main/skills/baoyu-markdown-to-html （已有 Hugo 渲染则不重复）
- https://github.com/tailwindlabs/tailwindcss-typography 、https://github.com/sivan/heti 、https://github.com/sindresorhus/github-markdown-css 、https://github.com/doocs/md 、https://github.com/DavidAnson/markdownlint

读最终所选 README/Skill/依赖/许可证并记录 pin；候选分别给采用/借鉴/已有替代/不适用。只用一个主要流程/润色/基础样式。样式限制到三个栏目文章容器，保留手机/桌面/深色。

验收：三类栏目各有固定 fixture/mock 完整链路与代表性 MD/渲染；格式幂等，URL、数字、证据限定、代码/公式、Frontmatter/schema/slug/日期/canonical 不变；健康/来源/unsafe 门禁不削弱；轻度警告不加模型调用，严重问题保留有界定向 repair；格式美化失败回到合格稿，没合格稿则跳过且零发布写入。真实调用不超原预算，本轮先离线不触发生产。构建、相关回归、桌面手机日夜截图及调用成本变化须记录。不要批量重写旧文。

请完成当前授权内所有可逆实施与验证；阻塞只停止相应发布。交付目录/仓库/实际栏目映射、变更文件/commit、选型、前后样稿、测试和发布状态、无法隔离处。协调者通过本会话 wait/read 收取，不要求你给其他会话回信，不以此任务书扩大消息权限。
