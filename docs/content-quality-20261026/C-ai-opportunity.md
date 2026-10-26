# C AI 商机栏目任务书

AI 主日报完全不修改。

目标会话：codex://threads/019e21f3-a7b9-77e1-9857-44d1e325d07d，已核实标题“AI日报-日常维护”、local、空闲。只优化确认属于本次范围的 AI 商机/账号商机栏目。不要因上下文中的旧任务再次改主日报、问答、生成线路或 Key。

已从近期会话确认：后端 `D:\CodexWorktrees\CloudFlare-AI-Insight-Daily-faq-20261025`，仓库 `dongyu19920904/CloudFlare-AI-Insight-Daily`，Workers JavaScript；前端最近工作区 `D:\CodexWorktrees\Hextra-AI-Insight-Daily-faq-20261026`，仓库预期 `dongyu19920904/Hextra-AI-Insight-Daily`，Hugo/Hextra，须重新核实 remote、干净状态和最新 main。主日报 10.26 已补发，后端 497 项测试曾通过。商机具体 mode/handler/prompt/路由和 CSS 选择器待你实读确认，绝不凭名称猜测。

允许改商机专属 prompt、MD规范化/检查、渲染和文章作用域 CSS。禁止改主日报内容、选题、数据源、生成 prompt、调度、校验、发布、展示、FAQ或主备配置。共享函数/样式优先以商机专属模块和 selector 隔离；无法隔离就该处只交方案，继续其他可做项。不触碰 BioAI、个人主页或商城。

执行：先读 AGENTS/README/依赖/部署配置、保留 dirty；画真实商机链路和主日报边界。检查真实近期样稿，区分内容/MD/解析/CSS；围绕“谁有需求、哪条证据、机会推断、今天能做的验证、成本/售后风险”，不写泛新闻综述或确定收益。来源可信度和待验证假设分别表达，不新增编造的用户需求和价格。

候选完整链接（按实际栈选择，不全装）：

- https://github.com/AgriciDaniel/claude-blog （短商机不灌 SEO 长文）
- https://github.com/ComposioHQ/awesome-claude-skills/blob/master/content-research-writer/SKILL.md
- https://github.com/coreyhaines31/marketingskills
- https://github.com/op7418/Humanizer-zh 或 https://github.com/hardikpandya/stop-slop （已有规则足够则复用，不多轮润色）
- https://github.com/JimLiu/baoyu-skills/tree/main/skills/baoyu-format-markdown
- https://github.com/JimLiu/baoyu-skills/tree/main/skills/baoyu-markdown-to-html （Hugo 已渲染则不重复转）
- https://github.com/sivan/heti 、https://github.com/sindresorhus/github-markdown-css 、https://github.com/tailwindlabs/tailwindcss-typography 、https://github.com/doocs/md 、https://github.com/DavidAnson/markdownlint

选中资源必须读 README/Skill/依赖/许可证，记录版本或 commit；每项候选写采用/借鉴/已有替代/不适用。一个主流程/润色/基础样式即可，保护现有 Hugo 模板和深色模式，不能叠加完整正文皮肤。

真正接入：LLM API 用版本化栏目专属 prompt；格式化和校验在真实生成->保存链路执行，不只安装技能。保持 URL、数字、代码、公式、schema、Frontmatter、slug、日期及 canonical。AST/现有解析器优先，避免正则误改代码。轻度警告无模型调用；严重问题只限既有有界 repair。美化失败用合格原文，不合格则跳过记录，不改 unsafe 或放宽来源门禁。

验收首条：AI 主日报完全不修改。保存主日报受保护路径/基线与固定输入最终输出对比，必要时比渲染页面；只读回归不能触发主日报生成/发布。每类实际商机改动用 fixture/mock/dry-run 测全链路，覆盖幂等、来源/数字/元信息、空内容和失败无写入。构建/测试和桌面手机日夜截图，CSS 必须证明不命中主日报。先离线不付费生成；生产提交/部署沿原明确授权，不擅自新增调度。

不要打断无关任务或重派相同任务。交付本地可核验代码、测试、选型、样稿/页面、额外调用变化、已发布与未发布边界，保存到自己的项目文档。协调者会从该会话取结果，不需未经人类另行授权向其他会话发信。
