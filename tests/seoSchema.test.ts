import assert from "node:assert/strict";
import test from "node:test";

import { buildStructuredData } from "../src/utils/seoSchema.ts";

test("non-article pages do not emit BlogPosting or undefined dates", () => {
  const schema = buildStructuredData({
    pageType: "profile",
    title: "关于我 | yuyu",
    description: "yuyu 的个人介绍",
    canonicalURL: new URL("https://yuyu.aivora.cn/about/"),
  });

  const json = JSON.stringify(schema);
  assert.equal(json.includes("BlogPosting"), false);
  assert.equal(json.includes("undefined"), false);
  assert.ok(json.includes("ProfilePage"));
  assert.ok(json.includes("AI 生命延续学"));
  assert.ok(json.includes("knowsAbout"));
});

test("article pages emit BlogPosting with valid dates and breadcrumbs", () => {
  const published = new Date("2026-08-06T01:00:00.000Z");
  const schema = buildStructuredData({
    pageType: "article",
    title: "Cursor 又更新了",
    description: "一篇关于 Cursor 和账号店的文章",
    canonicalURL: new URL("https://yuyu.aivora.cn/posts/cursor/"),
    imageURL: new URL("https://yuyu.aivora.cn/og.png"),
    pubDatetime: published,
    keywords: ["Cursor", "AI 账号店"],
    citations: ["https://news.aivora.cn/2026-08/2026-08-06/"],
    breadcrumbs: [
      { name: "首页", url: "https://yuyu.aivora.cn/" },
      { name: "博客", url: "https://yuyu.aivora.cn/posts/" },
      { name: "Cursor 又更新了", url: "https://yuyu.aivora.cn/posts/cursor/" },
    ],
  });

  const graph = schema["@graph"];
  assert.ok(graph.some(item => item["@type"] === "BlogPosting"));
  assert.ok(graph.some(item => item["@type"] === "BreadcrumbList"));
  assert.equal(JSON.stringify(schema).includes(published.toISOString()), true);
  assert.equal(JSON.stringify(schema).includes("Cursor, AI 账号店"), true);
  assert.equal(
    JSON.stringify(schema).includes(
      "https://news.aivora.cn/2026-08/2026-08-06/"
    ),
    true
  );
});
