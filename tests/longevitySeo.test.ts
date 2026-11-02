import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { getTopicHub } from "../src/data/topicHubs.ts";

test("longevity topic answers the intended queries without changing its canonical slug", () => {
  const topic = getTopicHub("ai-longevity");
  assert.equal(topic?.slug, "ai-longevity");
  assert.match(topic?.description || "", /长生不老/);
  assert.match(topic?.description || "", /证据/);
});

test("the guide appears only on the first longevity page and keeps reference URLs traceable", async () => {
  const { LONGEVITY_GUIDE, getLongevityGuide } =
    await import("../src/data/longevityGuide.ts");
  assert.equal(getLongevityGuide("ai-longevity", 1), LONGEVITY_GUIDE);
  for (const page of [0, 2, 3, 50])
    assert.equal(getLongevityGuide("ai-longevity", page), null);
  for (const slug of [
    "ai-one-person-company",
    "ai-account-business",
    "unknown",
  ])
    assert.equal(getLongevityGuide(slug, 1), null);
  assert.match(LONGEVITY_GUIDE.seoTitle, /AI 生命延续学/);
  assert.match(LONGEVITY_GUIDE.seoTitle, /AI 长生不老/);
  assert.equal(LONGEVITY_GUIDE.updatedAt, "2026-11-02");
  assert.equal(
    new Set(LONGEVITY_GUIDE.sources.map(source => source.url)).size,
    LONGEVITY_GUIDE.sources.length
  );
  for (const source of LONGEVITY_GUIDE.sources) {
    assert.equal(new URL(source.url).protocol, "https:");
    assert.ok(source.kind && source.purpose);
  }
  assert.ok(LONGEVITY_GUIDE.sources.some(source => source.kind === "原始研究"));
  assert.ok(LONGEVITY_GUIDE.sources.some(source => source.kind === "综述"));
});

test("guide content explains evidence and author scope without manufactured authority", async () => {
  const { LONGEVITY_GUIDE } = await import("../src/data/longevityGuide.ts");
  const text = JSON.stringify(LONGEVITY_GUIDE);
  assert.match(text, /不是一个正式学科名称/);
  assert.match(text, /动物/);
  assert.match(text, /人体/);
  assert.match(text, /预测/);
  assert.match(text, /不是医生或研究机构/);
  assert.doesNotMatch(
    text,
    /保证永生|保证长生不老|治愈衰老|临床证实永生|权重提升至最高|逐字引用/
  );
});

test("home and article templates provide crawlable topic paths without rewriting articles", () => {
  const read = (file: string) =>
    readFileSync(new URL(file, import.meta.url), "utf8");
  assert.match(
    read("../src/pages/index.astro"),
    /href="\/topics\/ai-longevity\/"/
  );
  assert.match(
    read("../src/layouts/PostDetails.astro"),
    /getPostTopicSlugs\(post\)\.includes\("ai-longevity"\)/
  );
  assert.match(
    read("../src/layouts/PostDetails.astro"),
    /href="\/topics\/ai-longevity\/"/
  );
  assert.match(
    read("../src/layouts/TopicDetails.astro"),
    /getLongevityGuide\(topic\.slug, page\.currentPage\)/
  );
});
