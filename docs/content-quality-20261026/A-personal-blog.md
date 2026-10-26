# A 个人主页博客任务书

目标会话：codex://threads/019ec422-a63f-78c2-8964-5574557a0af5。本会话负责实施并协调 B/C/D，保留 yuyu 品牌和整站设计。

已核实：前端 `D:\GitHub\_worktrees\astro-knowledge-rebuild-20261005`，仓库 `dongyu19920904/astro-paper`，Astro 5、Tailwind 4、pnpm、既有 Typography 插件。后端 `D:\GitHub\_worktrees\bioai-knowledge-rebuild-20261005`，仓库 `dongyu19920904/CloudFlare-BioAI-Daily`，Workers JavaScript。当前独立分支分别为 `codex/blog-reading-quality-20261026`、`codex/personal-blog-writing-20261026`。

真实链路：cron/个人博客 guard -> `src/handlers/scheduledBlog.js` -> 已生成日报或合格缓存/有限原文恢复 -> 选材/资格 -> 原文回执 -> `src/prompt/blogPrompt.js:getBlogPrompt` -> 模型 -> `src/blogQuality.js` 规范化及门禁 -> 必要时一次定向 repair -> Frontmatter/GitHub -> Astro collection/render -> remark/rehype -> `src/layouts/PostDetails.astro` -> `reading.css`、`article-prose.css` -> Pages。现有参考资料、图片、目录和主题插件须保留。

诊断重点：当前提示词强制通常零到一个小标题，难为实用型文章提供适当结构；需要确认 Markdown 异常是否已被确定性处理。CSS 已有多套历史分层，只在真正生效的文章区域改善，不重启已解决的主题问题。缺稿修复刚上线，不能回退覆盖。

执行顺序：读 AGENTS/README/依赖及真实样稿；区分内容、语法、解析、CSS；选一个主要写作流程、一套中文润色规则和既有原生正文样式；将简短版本化规则接入实际 API 提示词，将安全确定性校验接入真实链路；做固定输入的前后对比和失败用例；构建、桌面/手机日夜页面截图并审阅。

选型候选完整链接：

- https://github.com/AgriciDaniel/claude-blog （已安装适配器，按需读取分析模块）
- https://github.com/ComposioHQ/awesome-claude-skills/blob/master/content-research-writer/SKILL.md （研究与引用组织）
- https://github.com/blader/humanizer 和 https://github.com/op7418/Humanizer-zh 和 https://github.com/Hyacehila/humanizer-zh-next 和 https://github.com/hardikpandya/stop-slop （与已有 human-writing 比较，只选一套，不叠加润色调用）
- https://github.com/JimLiu/baoyu-skills/tree/main/skills/baoyu-format-markdown （借鉴结构保护，不能破坏 Frontmatter/代码）
- https://github.com/JimLiu/baoyu-skills/tree/main/skills/baoyu-markdown-to-html （已有 Astro 渲染时不二次转换）
- https://github.com/tailwindlabs/tailwindcss-typography 、https://github.com/sivan/heti 、https://github.com/sindresorhus/github-markdown-css 、https://github.com/doocs/md 、https://github.com/DavidAnson/markdownlint （优先复用，不叠加完整正文皮肤）
- https://github.com/TheCraigHewitt/seomachine 和 https://github.com/coreyhaines31/marketingskills （只借相关方法，不迁移系统）

编辑标准：中心为用 AI 做具体事情，将时间留给长期探索。普通读者看完能理解一个问题或完成一个小动作。第一人称判断必须有理由，经历必须有作者材料；不用收入/学历/外卖故事硬塑人设。术语就近解释，研究保留证据阶段，不虚构使用和效果。短随笔无需强塞标题；教程有真实步骤时允许恰当小标题/列表/代码。引用保留 URL、数字、限定与关系。

边界：不改 AI 主日报项目，不重写历史文章，不改主题开关/全站布局/统计/SEO元信息，不改抓取、三个 BioAI 主任务、共享模型传输、Secrets、cron 或健康门禁。A 独占个人博客 prompt/quality/handler 及新博客专属模块；D 不改这些。双方均先交付本地可核验结果，共享 Worker 不独立部署；整合后按明确发布授权单次发布。

验收：规则可追到真实 API 请求；格式化幂等，URL/数字/代码/元信息保留；两类博客 mock 全链路通过，轻度警告零额外调用，严重问题最多一次 repair，失败不发布；前后端镜像一致；必要构建与主题回归；桌面和手机截图。禁止把安装完成当作自动流程接入完成。只做 fixture/mock/dry-run，不为排版付费反复生成或改已上线稿。
