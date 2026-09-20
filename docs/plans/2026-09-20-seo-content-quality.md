# yuyu 个人主页 SEO/GEO 优化实施方案

日期：2026-09-20

## 目标

在不批量重写历史文章、不虚构 yuyu 第一手经历、不影响个人博客与 BioAI 三个定时任务隔离的前提下，提升 `https://yuyu.aivora.cn/` 的索引质量、主题相关性、作者可信度和内容可引用性。

## 审计基线

- 线上 sitemap 共 658 个 URL，其中博客分页 68 个、标签分页 166 个。
- 个人博客源文件 412 篇。
- 5 篇文章标题为模型拒答，2 篇为模型身份串线。
- 42 篇源文件 description 为 `Table of contents`。
- 331 篇出现“第一反应”，249 篇出现“大理”或“咖啡馆”，历史内容模板化明显。
- `/posts/2/` 等分页页错误 canonical 到 `/posts/`。
- `life.aivora.cn` 当前证书校验失败，不能继续作为首页主要出口。
- 技术基础已具备：HTTPS、robots、sitemap、canonical、RSS、Person/WebSite/BlogPosting/ProfilePage 结构化数据、可见引用说明和 AI 爬虫访问策略。

## 实施顺序

### 阶段 1：确定性止损

- [x] 分页页使用自引用 canonical、独立标题和独立描述。
- [x] 7 篇明确失败文章改为草稿，停止生成路由和进入 sitemap。
- [x] 修复公开文章中的 `Table of contents` 占位 description；空 description 只保留在已下线草稿中。
- [x] 历史文章已有手写“AI 引用摘要”时不再重复输出通用信息卡。
- [x] 将失效的 `life.aivora.cn` 首页入口替换为站内 AI 生命延续学主题中心。
- [x] 添加 `max-image-preview:large`，允许合格文章图片获得更完整的搜索预览。

### 阶段 2：主题架构与内链

- [x] 建立 AI 账号店经营、AI 一人公司、AI 生命延续学三个主题中心。
- [x] 首页和主导航增加主题入口。
- [x] 相关文章优先按具体主题匹配，不再只依赖 `ai`、`ai-daily`、`bioai-daily`、`biotech` 泛标签。
- [x] 主题中心明确内容范围、证据边界、可验证项目和相关文章。

### 阶段 3：生成质量门

- [x] 新文章不再生成第二份“AI 引用摘要”，由前端统一提供信息卡。
- [x] 拒答、模型身份串线、占位过程文本进入一次定向 repair；repair 后仍失败则跳过发布。
- [x] BioAI 文章必须保留可核验来源，不得凭空给出临床或商业化精确时间预测。
- [x] 轻度长句只警告，不增加模型调用；严重问题沿用单次定向 repair。
- [x] 个人博客失败继续与 daily、opportunity、project-opportunity 三个定时任务隔离。

### 阶段 4：发布后验证

- [x] Astro check、前端 19 项测试、后端 74 项测试和生产 build 通过。
- [ ] 全库 lint/format 基线清理：当前被旧 `bioai-backend-files` 快照的 12 条 lint 错误和 496 个既有格式文件阻塞，不纳入本次批量改写。
- [x] 构建产物检查 canonical、robots、JSON-LD、主题页和坏页面退出情况。
- [ ] 推送后检查 GitHub Pages 部署和线上主要 URL。
- [ ] 保留 Search Console 数据驱动阶段：查询词、索引覆盖、页面表现、AI 搜索曝光、外链和 Core Web Vitals 未经数据不得臆测。

## 不做事项

- 不购买外链或批量交换链接。
- 不使用隐藏提示词、爬虫伪装或权重操控语。
- 不为“新鲜度”虚假更新日期。
- 不批量重写或删除 412 篇历史文章。
- 不把 `llms.txt`、Schema 或 Meta Description 当作内容质量替代品。
- 不在没有 Search Console 数据前大规模 noindex 标签页或日报页。

## 后续内容策略

日报只承担信号发现。只有同时具备明确搜索意图、可靠原始来源、真实个人材料和持续更新价值的主题，才升级为长期页面。优先沉淀客服问题匿名统计、自动化实验、项目复盘、衰老时钟项目数据和 BioAI 证据等级表等第一方资产。
