# A 个人博客实施验收

状态：分支实现和本地构建版验证通过，尚未推送或生产部署。不将上一轮 Issue #74 的恢复发布当作本轮优化上线。

## 实际成果

- 写作内核 `2026-10-26.1` 已接入现有生成/repair 请求。按读者问题组织内容，允许有用的小标题、步骤和可复制输入，保留事实与研究限定，不增加“润色模型”阶段。
- 新增 Markdown 字面区域保护，修复目录清理/图片处理/压缩空行误改代码的实际问题。未闭合代码块由既有严重问题分支处理；来源、健康、图片及事实门禁保留。
- Astro 既有 HAST 插件为真正开头段落设置导语角色，构建时生成可聚焦表格滚动容器。不依赖页面 JS 才能包裹表格；前端脚本识别已有容器后不再重复。
- 原生正文 CSS 只增加 30 行：导语桌面 20px/38px、手机 18px/34.2px，正常正文仍 18px/17px；保留字体、宽度、主题 token、配色和页面结构。代码保留空白，表格可键盘聚焦，打印允许代码换行。
- 内部两份样稿 `SAMPLE-AI.md`、`SAMPLE-BIO.md` 展示结构变化；它们不是模型实测生成结果，也没有发布到文章目录。

## 真实自动流程对应

`getBlogPrompt` -> 原 provider 的 system 请求已包含版本号；`generateSingleBlog` -> 原 `normalizeGeneratedMarkdown` 使用新的字面保护 -> 原 `validateBlogDraft`（新增未闭合代码块）-> 原有一次定向 repair -> 原 GitHub/Frontmatter 保存。两个博客类型的实际 handler 均做了 mock 预览，未改主任务或共享传输。

前端仍由 `astro.config.ts` 中原有 `rehypeReadingBlocks` 接入，不新建 MD->HTML 服务；`pnpm build` 先强制同步，因而历史文章用同一个新模板显示，不改旧文章源文件。

## 验证

- 后端 279/279，通过禁止真实联网的测试入口；新测试覆盖两类博客实际 API payload、轻度警告一次调用、严重失败最多一次 repair、零发布写入，以及代码/公式/Frontmatter/URL/数字和幂等。
- 前端 80/80；不仅用手造 HAST，还通过本机实际 Astro Markdown 编译器比较前后代码、来源 URL、数字和标题 ID。
- Astro check：0 errors、0 warnings、3 条既有 hints。完整 `pnpm build` 成功，820 个页面、Pagefind 464 篇索引。
- Wrangler 4.59.2 `deploy --dry-run` 打包成功；只编译，无上传或生产切换。未安装新依赖/运行时，也未改锁文件。
- Impeccable 最终机械扫描返回 `[]`；实际截图另行审阅，不能以扫描替代视觉验收。
- 构建产物 829 个 HTML/JS/JSON 检查没有发现所检查的密钥形态；三个后端镜像文件与实际后端一致。
- 首页、知识库、文章源文件、Frontmatter schema、根主题、主题脚本、共享 Layout、Astro 配置和锁文件相对前端基线 c9455024 不变。A 后端提交 4e858c82 的三个主任务、调度、配置、共享模型传输相对 265b7b07 不变；另行整合的 D 提交会按授权修改 BioAI 三栏目，不能将 A 的隔离结论扩大为整合版完全未改 BioAI。
- 全库原有 lint/格式问题未顺手重写；修改代码定向 lint 通过。全库 lint 仍有 11 个既有错误（镜像 scheduledBlog 的 10 个 console 与 loadGoogleFont 的未用变量）；全库格式检查仍为原有 564 项警告。

## 页面证据

最终浏览器：Playwright Chromium 151.0.7922.34，独立临时上下文。桌面 1365x960、手机 390x960，两个 25 日真实文章、日夜共 8 个状态，再加两个明确标为测试夹具的排版状态，10 项通过、0 页面错误、0 横向溢出。使用真实主题按钮并检查 `performance.timeOrigin` 不变；最终验收屏蔽 51LA 自动访问。没有在本轮安装或实测 Dark Reader 扩展，只确认原 lock 与主题代码保留。

有效原版证据：`D:\CodexReports\blog-reading-20261026\before-playwright\report.json`。有效构建版证据：`D:\CodexReports\blog-reading-20261026\final-preview\report.json` 及同目录 PNG。原版首段桌面 18px/手机 17px，构建版为 20px/18px，实际 HTML 也有 `article-lead`，不是仅修改源码。

早期 BrowserOS 内嵌连接失败、手机截图裁切、开发服务器热缓存未更新，以及预览启动未就绪的失败记录均未计为验收通过；没有为它们修改网站主题。最终检查的是强制同步后的静态构建产物。开发服务器已停止。

可查看本机预览：[BioAI 文章](http://127.0.0.1:4337/posts/bioai-daily-2026-10-25/)；隐藏的 Astro preview 进程 PID 20968，只监听回环，日志保存在上述报告目录。为用户查看保留该服务及其 `D:\CodexCache\previews\blog-reading-20261026` 临时目录，不删除活动缓存。它不是生产部署或自动化调度。

## 提交、成本与剩余项

后端本地提交 `4e858c82`，分支 `codex/personal-blog-writing-20261026`。前端分支 `codex/blog-reading-quality-20261026`，连同本目录协调结果保存为本地检查点，最终提交号可由该分支 `git log` 读取。原有 Wrangler 缓存修改未提交、未还原。

本轮真实模型调用 0，新增模型阶段 0，依赖安装 0，调度修改 0。提示词文字有所增加，实际 token、费用和新规则下真实 provider 的文章质量未测量；不把 mock 或人工样稿称作真实模型通过。

D 的后端提交 f0e41c1e 已在新的本地整合分支中摘取为 91bbbf50，保留 A 提交；分支为 `codex/bioai-editorial-integration-20261026`。首次联合回归发现两个夹具断言只接受 LF，而新 checkout 按 Git 配置使用 CRLF。只将同一处空行断言改为同时接受 LF/CRLF，提交 0fa5f46b，不修改正文、格式保真规则或生产功能。联合完整测试 302/302 通过（禁止真实联网），Worker dry-run 编译成功，651.99 KiB / gzip 156.35 KiB，无上传。随后摘取 D 的文档更正 75c9b007 为 9f24ec6c，说明实际手动入口认证方式；没有改变认证功能。整合 HEAD 为 9f24ec6c。

剩余生产验收：在明确发布授权内统一 Worker 发布和前端部署；上线后核对真实自动生成/发布结果。各项目的预算和发布门禁继续有效，不因协调消息解除。静态本地页面和 mock 不能证明下一次线上 cron、外部来源或实际模型措辞已经通过。
