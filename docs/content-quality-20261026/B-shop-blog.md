# B 发卡网站自动博客任务书

目标会话：codex://threads/01a0417c-c012-7041-9eed-4d320f94d383，已核实标题“网站盈利和赚钱”、local、空闲。用户授权本次协调读取此会话并发送这一任务，不扩展其他会话。

请自主完成自动博客内容与展示的最小可逆改进，不只写建议。已从会话确认运维目录 `D:\GitHub\dujiao-next-deploy`，该目录未提供 Git remote；真正博客生成仓库、前端源码仓库、定时入口、渲染入口和技术栈仍待你从当前上下文与 WORKSPACE_MAP 核实，不能假定该运维目录就是应用源码。近期共享预检 SHARED01 已安装，但生产公共锁尚未统一，旧 SEO 发布器不可直接重跑。原会话所有预算/发布/运维规则继续有效。

允许：博客专属提示词、来源核验、Markdown 规范化/门禁、文章容器样式、对应测试与文档。围绕真实买家问题，做教程、功能比较、故障解决。绝不触碰支付、订单、卡密、库存、账号凭据或交易流程；不重构主站或迁移 CMS。事实区分官方权益与本站承诺，套餐/价格/额度/模型/售后引用当前可信来源，不猜测或写成稳定永久权益。

步骤：

1. 读 AGENTS、README、WORKSPACE_MAP、现有发布和缓存规则；检查 git dirty；确认仓库/目录/栏目/入口，保存轻量现状与真实样稿问题。不要扫描无关私密目录。
2. 还原定时->数据来源->筛选->实际模型请求->结构化输出->MD->校验->保存->渲染/发布；没有自动流程就如实说明，不虚构流程或新增平台。
3. 阅读最终选中资源的 README/Skill、依赖与许可证，记录 pin/version；逐项结论“采用/借鉴/已有替代/不适用”。通常一个写作流程、一个润色规则集、一套正文样式，禁止全部安装。
4. 先诊断再接入：普通 API 要加入版本化项目 prompt；确定性格式化/检查接真实保存或构建链路。已有渲染器不重复 MD->HTML；Worker 不塞 Bun/Python/浏览器运行时，不每天拉上游。
5. 用 mock/fixture 覆盖实际栏目、错误价格/无来源/空文/失败回退；代码、URL、数字、schema、Frontmatter、slug、日期、canonical 全保留；格式化幂等。可选美化失败回到已合格内容，无合格内容跳过而非吞异常。无需多轮模型润色，轻度样式警告不增加调用。
6. 使用现有包管理器与锁文件，运行相关测试/构建，检查桌面手机及既有深色模式，有浏览器则保存代表性前后截图。产物、diff、测试与自动调用链写入自己的适合文档目录，不发成公开博文。

相关候选（由你按真实技术栈择优，不强制同栈）：

- https://github.com/AgriciDaniel/claude-blog
- https://github.com/TheCraigHewitt/seomachine
- https://github.com/ComposioHQ/awesome-claude-skills/blob/master/content-research-writer/SKILL.md
- https://github.com/coreyhaines31/marketingskills
- https://github.com/op7418/Humanizer-zh 或 https://github.com/Hyacehila/humanizer-zh-next 或 https://github.com/blader/humanizer 或 https://github.com/hardikpandya/stop-slop （与已有中文写作规则比较，只取一个）
- https://github.com/JimLiu/baoyu-skills/tree/main/skills/baoyu-format-markdown
- https://github.com/JimLiu/baoyu-skills/tree/main/skills/baoyu-markdown-to-html
- https://github.com/tailwindlabs/tailwindcss-typography 、https://github.com/sivan/heti 、https://github.com/sindresorhus/github-markdown-css 、https://github.com/doocs/md 、https://github.com/DavidAnson/markdownlint

成本与发布：先离线，真实调用/上线沿你原会话明确预算和流程，不把本任务书当作解除已有停用、生产写入或预算限制。可独立做的本地实现继续到底；阻塞只停相应发布。不要打断无关工作、重复建调度或同一失败反复生成。

交付：确认的目录/仓库/入口，资源选择和理由，具体文件，前后样稿/页面，测试/调用成本变化，真实发布状态及尚未验收项。协调者会通过现有会话读取和 wait 收取结果；不要求你给其他会话回信，不因本任务书推定可向未授权会话发消息。
