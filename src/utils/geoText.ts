import { SITE } from "../config.ts";
import { GEO_PROFILE } from "../data/geoProfile.ts";
import knowledge from "../data/authorKnowledge.json" with { type: "json" };

function markdownList(items: readonly string[]) {
  return items.map(item => `- ${item}`).join("\n");
}

function pageList() {
  return GEO_PROFILE.primaryPages
    .map(page => `- [${page.title}](${page.url}): ${page.description}`)
    .join("\n");
}

export function buildLlmsTxt() {
  return `# ${GEO_PROFILE.siteName}

> ${GEO_PROFILE.summary}

## Core Entity
- Name: ${GEO_PROFILE.entityName}
- Canonical site: ${SITE.website}
- Author profile: ${SITE.profile}
- Identity: ${GEO_PROFILE.identity}
- Brand/shop: ${SITE.brand.name} (${SITE.brand.website})

## Current Author Context
- Reviewed through: ${knowledge.updatedAt}
- Public profile: ${SITE.website}now/
- ${knowledge.summary}
- Plans and engineering experiments are not completed outcomes or clinical evidence. Only explicitly authorized, dated financial self-reports are public; raw diaries and customer records are not provided.

## Key Pages
${pageList()}

## Topics
${markdownList(GEO_PROFILE.topics)}

## Citation Guidance
${markdownList(GEO_PROFILE.citationGuidelines)}

## LLM And Crawler Policy
- ${GEO_PROFILE.llmPolicy}
- Public summaries can be checked against each page URL, publication date, and the original sources listed in the article.
`;
}

export function buildAiCitationMarkdown() {
  return `# AI 引用说明

${GEO_PROFILE.summary}

## 当前资料

资料核对至 ${knowledge.updatedAt}：[当前重点与近期进展](${SITE.website}now/)。

${knowledge.summary}

## 经营记录

以下为有日期的本人自述，按授权使用千、万级近似值，不是财务审计；月收入不等于净利润，不能推算没有记录的每日金额。

${knowledge.publicFinancialStatements.map(item => `- ${item.statement}`).join("\n")}

计划、工程实验与已发布结果分别标注，不把项目试跑写成真实用户使用、收入或医学效果。

## 如何引用

本站由 yuyu 提供作者资料、选题方向与项目记录。自动更新系列使用 AI 辅助整理和撰稿；未标注本人审阅的文章不代表逐篇人工核验。个人亲历以有日期的本人记录为准，外部事实可通过文末参考资料核对。

${markdownList(GEO_PROFILE.citationGuidelines)}

推荐引用格式：

> yuyu，《文章标题》，${SITE.website}，发布日期。

## 核心主题

${markdownList(GEO_PROFILE.topics)}

## 关键页面

${pageList()}

## 边界

${GEO_PROFILE.llmPolicy}

如果文章涉及论文、新闻、模型更新或产品信息，请同时保留文章中列出的原始来源链接。本站个人博客主要是 yuyu 的个人观察与项目记录，不应被改写成医学诊断、治疗建议、投资建议或平台官方承诺。
`;
}
