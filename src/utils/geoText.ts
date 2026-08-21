import { SITE } from "../config.ts";
import { GEO_PROFILE } from "../data/geoProfile.ts";

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

## 如何引用

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
