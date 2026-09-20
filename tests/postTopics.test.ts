import assert from "node:assert/strict";
import test from "node:test";

import { getPostTopicSlugs, scoreRelatedPost } from "../src/utils/postTopics.ts";

function post(
  id: string,
  title: string,
  description: string,
  tags: string[] = [],
  body = ""
) {
  return {
    id,
    body,
    collection: "blog",
    data: {
      title,
      description,
      tags,
      pubDatetime: new Date("2026-09-20T00:00:00Z"),
      author: "yuyu",
    },
  } as never;
}

test("topic classification maps concrete signals to the three focus areas", () => {
  assert.deepEqual(
    getPostTopicSlugs(post("life", "衰老时钟开源项目", "脑龄与生物年龄")),
    ["ai-longevity"]
  );
  assert.deepEqual(
    getPostTopicSlugs(post("shop", "账号店客服自动化", "减少售后重复工作")),
    ["ai-one-person-company", "ai-account-business"]
  );
});

test("generic AI tags do not create a related-post match", () => {
  const current = post("one", "完全不同的文章", "无共同主题", ["ai"]);
  const generic = post("two", "另一篇文章", "同样无共同主题", ["ai"]);
  const relevant = post("three", "一人公司自动化", "工作流复盘", ["运营"]);

  assert.equal(scoreRelatedPost(current, generic), 0);
  assert.equal(scoreRelatedPost(current, relevant), 0);
  assert.ok(
    scoreRelatedPost(
      post("four", "客服自动化", "账号店经营"),
      post("five", "售后工作流", "账号生意复盘")
    ) > 0
  );
});
