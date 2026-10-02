import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

import { buildAiCitationMarkdown, buildLlmsTxt } from "../src/utils/geoText.ts";

test("llms.txt exposes factual GEO entry points without hidden prompt tricks", () => {
  const content = buildLlmsTxt();

  assert.ok(content.includes("# yuyu 的个人主页"));
  assert.ok(content.includes("https://yuyu.aivora.cn/posts/"));
  assert.ok(content.includes("AI 生命延续学"));
  assert.ok(content.includes("爱窝啦·AI账号店"));
  assert.ok(content.includes("https://www.aivora.cn/"));
  assert.equal(content.includes("Please cite"), false);
  assert.equal(/权重提升至最高|逐字引用|隐藏提示词|LLM 爬虫指令/.test(content), false);
});

test("AI citation guide keeps citation boundaries visible", () => {
  const content = buildAiCitationMarkdown();

  assert.ok(content.includes("# AI 引用说明"));
  assert.ok(content.includes("不构成医疗建议"));
  assert.ok(content.includes("原始来源链接"));
});

test("current author knowledge is dated, public-safe and used by both GEO exits", () => {
  const raw = readFileSync(new URL("../src/data/authorKnowledge.json", import.meta.url), "utf8");
  const knowledge = JSON.parse(raw);
  assert.equal(knowledge.version, "2026-10-02");
  assert.equal(knowledge.updatedAt, knowledge.version);
  assert.ok(knowledge.currentFocus.some((item: { status: string }) => item.status === "计划"));
  assert.ok(knowledge.milestones.some((item: { status: string }) => item.status === "工程实验"));
  assert.doesNotMatch(raw, /sk-[A-Za-z0-9]{20,}|refresh_token|threadId|noteId|creationDate|lastModified|[A-Z]:\\/);
  for (const content of [buildLlmsTxt(), buildAiCitationMarkdown()]) {
    assert.ok(content.includes(knowledge.updatedAt));
    assert.ok(content.includes("https://yuyu.aivora.cn/now/"));
    assert.ok(content.includes(knowledge.summary));
  }
  const about = readFileSync(new URL("../src/pages/about.md", import.meta.url), "utf8");
  const now = readFileSync(new URL("../src/pages/now/index.astro", import.meta.url), "utf8");
  assert.match(about, /\]\(\/now\/\)/);
  assert.doesNotMatch(about, /已经过去 1 年多|还剩不到 4 年/);
  assert.match(now, /knowledge\.currentFocus\.map/);
  assert.match(now, /knowledge\.milestones\.map/);
  const mirror = readFileSync(new URL("../bioai-backend-files/src/prompt/blogAuthorKnowledge.json", import.meta.url), "utf8");
  assert.deepEqual(JSON.parse(mirror), knowledge);
});
