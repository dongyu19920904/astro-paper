import assert from "node:assert/strict";
import test from "node:test";

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
