# 个人博客诊断、选型与实施

## 本轮目标

保留个人主页品牌、首页和已修复的主题切换。改善博客“讲一件读者能用的事”的写法，支持合适的 Markdown 结构，并让既有正文容器更易读。不是给整站换皮，不批量改旧文，也不是新建内容后台。

## 现状证据

1. `getBlogPrompt` 原来要求“通常零到一个正文小标题”。10 月 25 日 AI 文有多个使用、检查和费用话题，却只有一节正文小标题；BioAI 文完全是连续段落。检索当前文章目录没有发现行首围栏代码或表格，说明这些基础能力并未在样稿中得到使用。不能靠 CSS 自动补出有用步骤。
2. `normalizeGeneratedMarkdown` 原先直接对全文处理目录、图片和空行。新测试实际复现：代码里的 `## 目录` 会被删除，演示用图片语法会被降级/删除，代码空行也会缩减。它不是视觉问题，而是内容保真问题。
3. Astro 已有 remark/rehype、来源、图片、提示块、原生文章 CSS、复制代码、目录和表格脚本。无需再安装一套编辑器或 MD->HTML 转换器。正文刻意不用 Typography 的 prose 别名，须保留这一主题兼容边界。
4. 实用型文章需要能复制的输入和核对方式；随笔不必硬塞固定模板。研究文章需要就近保留对象、比例含义和证据阶段，口语化不能变成过度解读。
5. 最新 AI 样稿中的固定 token/汉字/书籍换算缺少通用保证。新规则要求保留单位和条件，不能为了直观补换算。本轮不擅自重写已发布旧文。

## 候选资源结论

| 资源                                                                                                                        | 结论           | 本项目用法                                                                                           |
| --------------------------------------------------------------------------------------------------------------------------- | -------------- | ---------------------------------------------------------------------------------------------------- |
| [claude-blog](https://github.com/AgriciDaniel/claude-blog)                                                                  | 采用已有适配器 | 本地分析和引用审阅；API 运行时使用本项目的版本化内核，不额外启动模型审稿                             |
| [SEO Machine](https://github.com/TheCraigHewitt/seomachine)                                                                 | 已有替代       | 已有选材、来源、门禁、定向 repair 和发布流程，不迁移整套系统                                         |
| [Content Research Writer](https://github.com/ComposioHQ/awesome-claude-skills/blob/master/content-research-writer/SKILL.md) | 借鉴           | 从读者问题组织材料、引用随事实；不照搬多轮逐节写作                                                   |
| [marketingskills](https://github.com/coreyhaines31/marketingskills)                                                         | 已有替代       | 个人博客不作为销售长文，不增加转化文案流程                                                           |
| [humanizer](https://github.com/blader/humanizer)                                                                            | 已有替代       | 使用已加载的本地 human-writing 中文规则，不叠加英文润色阶段                                          |
| [Humanizer-zh](https://github.com/op7418/Humanizer-zh)                                                                      | 借鉴           | 阅读其保留事实、确定程度和作者声音的原则；不安装第二个润色流程，也不作 AI 作者检测                   |
| [humanizer-zh-next](https://github.com/Hyacehila/humanizer-zh-next)                                                         | 已有替代       | 本轮未选中安装或完整审计，已有中文规则足够                                                           |
| [stop-slop](https://github.com/hardikpandya/stop-slop)                                                                      | 已有替代       | 不再多跑一轮词语清洗；先修内容与结构                                                                 |
| [baoyu-format-markdown](https://github.com/JimLiu/baoyu-skills/tree/main/skills/baoyu-format-markdown)                      | 借鉴           | 选读 Skill，借鉴先分清结构、再整理格式。其元信息改写和 Bun/npx 运行方式不接入 Worker；不复制上游代码 |
| [baoyu-markdown-to-html](https://github.com/JimLiu/baoyu-skills/tree/main/skills/baoyu-markdown-to-html)                    | 不适用         | Astro 已处理 Markdown，避免二次转换和额外模板                                                        |
| [Tailwind Typography](https://github.com/tailwindlabs/tailwindcss-typography)                                               | 已有替代       | 包已安装，但博客正文继续原生 article-prose，不重新叠加完整 prose 皮肤                                |
| [Heti](https://github.com/sivan/heti)                                                                                       | 不适用         | 本轮不引入另一整套中文排版覆盖层                                                                     |
| [github-markdown-css](https://github.com/sindresorhus/github-markdown-css)                                                  | 不适用         | 原生样式已有对应块，避免主题和选择器竞争                                                             |
| [Doocs MD](https://github.com/doocs/md)                                                                                     | 不适用         | 无新增人工编辑平台需求，不增加服务和部署                                                             |
| [markdownlint](https://github.com/DavidAnson/markdownlint)                                                                  | 已有替代       | Astro 解析、定向 HAST 测试和生成门禁承担本轮实际缺口；不为历史文风跑全库自动重写                     |

已选中或已有运行资源版本：claude-blog 2.3.1，固定 commit `354442348815a7f0327077ad89af2c43cf4b4ab4`，MIT，路径 `D:\CodexTools\claude-blog`；baoyu-format-markdown Skill 1.57.0，仓库固定 commit `1567581c26ec29f4216c6e6835415bf30343b0e3`，仓库 MIT，仅方法参考。Typography 0.5.19/Tailwind 4.1.18、unified 11.0.5、unist-util-visit 5.0.0 沿原锁文件，未升级依赖。已读取本地 Typography 许可证，不移除上游许可。human-writing 为本机已有 1.1.0，按相关中文规则适配，不照搬与代码示例冲突的形式禁令。

Content Research Writer 已读取仓库 README 与完整 SKILL.md，文件最近提交为 `044d48b594f060c164f3b20fac9ea01374721bca`。仅参考读者问题、作者声音、原始引用核对等通用方法；其逐节反馈、多轮润色与示例统计不进入自动任务，示例也不作为真实事实。README 声明仓库 Apache-2.0，但提醒各 Skill 可能不同，GitHub license 接口返回 404；本轮不据此推定子目录已获独立许可，不复制其文本/代码或安装运行依赖。

claude-blog 已实际分析 AI 25 日原文件，但按英文配置输出 32 个“词”、一个句子、36 分。它没有准确统计中文，也没有看到模板里的作者和 JSON-LD，因此这些分数和“缺作者/缺 schema”不作为改站依据。保留其 `estimated=true`、`language=en` 的限制，不靠扩字、补 FAQ 或虚构亲历追分。

## 实施顺序及成本

1. 先补失败测试，再修代码区域保护；普通正文继续经过原来的图片和来源规则。未闭合代码块进入既有严重问题门禁，不发布半篇代码。
2. 将内核版本改为 `2026-10-26.1`。以读者问题组织随笔或两三节实用说明；解释术语、可复制输入、核对动作和适用条件按实际材料选择，不凑清单或篇幅。直接接在原 `getBlogPrompt` 返回值，因此生成和 repair 都能获得规则，不靠 Agent 安装状态。
3. 用既有 HAST 插件为真正的首段添加导语样式；表格在构建时生成可聚焦滚动容器，即使 JS 未运行也不横向撑开。节点文字、链接、ID、代码和元信息不重写，重复处理幂等。原前端脚本识别已有表格容器后跳过，不重复包裹。
4. 局部 CSS 只作用文章。正文仍桌面 18px、手机 17px、行高 1.85、外宽 44rem；导语桌面 20px、手机 18px。沿用根主题、系列标题色、蓝色链接/夜间橙色强调、原字体栈。列表后的段落留呼吸，代码保持空白，表格有键盘焦点，打印可换行。不改首页和主题控制器。
5. 两类博客各跑真实 handler 的 mock 预览，确认 API 请求含版本号、轻度警告一次调用、严重失败最多一次 repair、零 GitHub/KV 写入。不触发三个 BioAI 主任务，不额外调用真实模型。新规则略增加提示词文本，阶段数、重试数、模型路由和输出上限不增加；实际 token/费用未测量。
6. 同步博客后端镜像、跑构建/回归与桌面手机日夜截图。原生切换用实际按钮和页面 timeOrigin 检查，不以 DOM 颜色赋值冒充交互通过。BrowserOS 的裁切手机截图和初次失败不计验收，使用现有 Playwright 独立上下文完成。

发布：本轮先完成分支实现与验证，不将上轮仅修复缺稿的发布许可扩成全部项目上线许可。A/D 同后端，双方不得独立覆盖 Worker；待结果整合后按明确发布流程处理。样稿和报告只在 docs，不作为公开博客。
