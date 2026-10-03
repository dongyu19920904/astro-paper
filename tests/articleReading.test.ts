import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync, readdirSync } from "node:fs";
import type { Root } from "mdast";
import {
  articleProgress,
  estimateReadingMinutes,
  getArticleSeries,
  isAutomatedArticle,
  sortByPublishedDate,
} from "../src/utils/articleReading.ts";
import { collectArticleSources } from "../src/utils/remarkArticleSources.ts";
import { getTopicPage } from "../src/utils/topicPagination.ts";

const source = (path: string) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
test("series and automated disclosure are deterministic, not invented reviews", () => {
  assert.equal(getArticleSeries(["bioai-daily", "ai"]), "生命科学观察");
  assert.equal(isAutomatedArticle(["ai-daily"]), true);
  assert.equal(isAutomatedArticle(["notes"]), false);
  assert.equal(estimateReadingMinutes(""), 1);
  assert.equal(estimateReadingMinutes("字".repeat(700)), 2);
  assert.match(source("src/layouts/PostDetails.astro"), /未记录逐篇人工核验/);
});
test("reading progress uses the article, clamps bounds and handles short text", () => {
  assert.equal(articleProgress(100, 2000, 800), 0);
  assert.equal(articleProgress(-600, 2000, 800), 50);
  assert.equal(articleProgress(-1500, 2000, 800), 100);
  assert.equal(articleProgress(0, 500, 800), 100);
  assert.equal(articleProgress(10, 500, 800), 0);
});
test("latest publishing order ignores historical revision dates without mutation", () => {
  const old = {
    data: {
      pubDatetime: new Date("2026-01-01"),
      modDatetime: new Date("2026-10-03"),
    },
  };
  const fresh = { data: { pubDatetime: new Date("2026-10-02") } };
  const input = [old, fresh];
  assert.deepEqual(sortByPublishedDate(input), [fresh, old]);
  assert.deepEqual(input, [old, fresh]);
});
test("actual AST links create citations; images, code and private URLs do not", () => {
  const tree = {
    type: "root",
    children: [
      {
        type: "paragraph",
        children: [
          { type: "link", url: "https://example.org/paper", children: [] },
          { type: "link", url: "https://example.org/paper", children: [] },
          {
            type: "linkReference",
            identifier: "ref",
            referenceType: "full",
            children: [],
          },
          { type: "image", url: "https://image.org/photo.jpg", alt: "photo" },
          { type: "link", url: "https://yuyu.aivora.cn/about/", children: [] },
          {
            type: "link",
            url: "https://user:password@example.org/",
            children: [],
          },
          { type: "link", url: "javascript:alert(1)", children: [] },
          { type: "link", url: "/posts/", children: [] },
        ],
      },
      {
        type: "definition",
        identifier: "ref",
        url: "https://research.org/study",
      },
      { type: "code", value: "https://code.org/not-a-source" },
    ],
  } as Root;
  assert.deepEqual(collectArticleSources(tree, "https://yuyu.aivora.cn/"), [
    "https://example.org/paper",
    "https://research.org/study",
  ]);
});
test("topic pagination preserves the entry URL, bounds and reachability", () => {
  const posts = Array.from({ length: 25 }, (_, index) => index);
  const first = getTopicPage(posts, "ai-longevity");
  const second = getTopicPage(posts, "ai-longevity", 2);
  const last = getTopicPage(posts, "ai-longevity", 3);
  assert.equal(first.url.current, "/topics/ai-longevity/");
  assert.equal(first.url.prev, undefined);
  assert.equal(second.url.prev, first.url.current);
  assert.equal(last.url.next, undefined);
  assert.deepEqual([...first.data, ...second.data, ...last.data], posts);
  assert.equal(getTopicPage([], "ai-longevity").lastPage, 1);
});
test("homepage places six articles before secondary projects", () => {
  const home = source("src/pages/index.astro");
  assert.match(home, /slice\(0, 6\)/);
  assert.ok(
    home.indexOf('id="home-posts-title"') <
      home.indexOf('id="home-projects-title"')
  );
  assert.match(home, /href="\/posts\/" class="studio-primary"/);
});
test("search indexes article content and excludes related titles and navigation", () => {
  const post = source("src/layouts/PostDetails.astro");
  assert.match(post, /<article[^>]*data-pagefind-body/);
  assert.doesNotMatch(post, /<main[^>]*data-pagefind-body/);
  assert.match(post, /<section[^>]*data-pagefind-ignore/);
  const script = source("src/scripts/articleReader.ts");
  assert.match(script, /article\.querySelectorAll/);
  assert.match(script, /controller\.abort\(\)/);
  assert.match(script, /astro:before-swap/);
});
test("known private trading amounts do not remain in published Markdown", () => {
  const root = new URL("../src/data/blog/", import.meta.url);
  const privateAmounts =
    /(?:日销售额|每天销售额|日销|日流水|每天出单).{0,15}(?:3000|三千)|(?:利润|毛利).{0,8}(?:1000|一千)|(?:3000|三千).{0,12}(?:销售额|流水|营业额)/;
  const leaks = readdirSync(root)
    .filter(file => file.endsWith(".md"))
    .filter(file =>
      privateAmounts.test(readFileSync(new URL(file, root), "utf8"))
    );
  assert.deepEqual(leaks, []);
});
