import assert from "node:assert/strict";
import test from "node:test";
import { rehypeReadingBlocks } from "../src/utils/rehypeReadingBlocks.ts";
import type { HastNode } from "../src/utils/rehypeFigures.ts";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

test("reading transforms decorate only the opening prose and preserve text, links and code", () => {
  const paragraph: HastNode = {
    type: "element",
    tagName: "p",
    properties: { id: "opening" },
    children: [
      { type: "text", value: "先读清楚这个问题，再看看它能帮你完成什么。" },
    ],
  };
  const code: HastNode = {
    type: "element",
    tagName: "pre",
    children: [{ type: "text", value: "## source\n\nvalue = 1250" }],
  };
  const link: HastNode = {
    type: "element",
    tagName: "a",
    properties: { href: "https://example.com/?x=1&y=2" },
    children: [{ type: "text", value: "原文" }],
  };
  const table: HastNode = {
    type: "element",
    tagName: "table",
    properties: { id: "data" },
    children: [link],
  };
  const tree: HastNode = { type: "root", children: [paragraph, code, table] };
  const originalText = JSON.stringify([paragraph.children, code, table]);
  rehypeReadingBlocks()(tree);
  assert.deepEqual(paragraph.properties?.className, ["article-lead"]);
  const wrapper = tree.children?.[2];
  assert.deepEqual(wrapper?.properties?.className, ["table-scroll"]);
  assert.equal(wrapper?.properties?.tabIndex, 0);
  assert.equal(wrapper?.properties?.role, "region");
  assert.equal(wrapper?.children?.[0], table);
  assert.equal(JSON.stringify([paragraph.children, code, table]), originalText);
  const once = JSON.stringify(tree);
  rehypeReadingBlocks()(tree);
  assert.equal(JSON.stringify(tree), once);
});

test("media openings, references and nested paragraphs are not promoted to a lead", () => {
  for (const child of [
    {
      type: "element",
      tagName: "figure",
      children: [{ type: "text", value: "配图" }],
    },
    {
      type: "element",
      tagName: "blockquote",
      children: [{ type: "text", value: "引文" }],
    },
    {
      type: "element",
      tagName: "h2",
      children: [{ type: "text", value: "参考资料" }],
    },
  ]) {
    const tree: HastNode = {
      type: "root",
      children: [
        child,
        {
          type: "element",
          tagName: "p",
          children: [{ type: "text", value: "后续说明" }],
        },
      ],
    };
    rehypeReadingBlocks()(tree);
    assert.ok(!JSON.stringify(tree).includes("article-lead"));
  }
});

test("the installed Astro compiler applies reading blocks to real Markdown without changing evidence", async () => {
  const require = createRequire(
    createRequire(import.meta.url).resolve("astro")
  );
  const { createMarkdownProcessor } = await import(
    pathToFileURL(require.resolve("@astrojs/markdown-remark")).href
  );
  const markdown =
    "先核对输入，再检查输出。\n\n## 核对结果\n\n[原文](https://example.com/research?x=1&y=2)\n\n| 数据 | 条件 |\n| --- | --- |\n| 5% 到 9% | 群体分析 |\n\n```text\n## 目录\n\n保留代码内容 1260\n```";
  const before = await (await createMarkdownProcessor()).render(markdown);
  const after = await (
    await createMarkdownProcessor({ rehypePlugins: [rehypeReadingBlocks] })
  ).render(markdown);
  assert.ok(after.code.includes('class="article-lead"'));
  assert.ok(after.code.includes('class="table-scroll"'));
  assert.ok(after.code.includes('tabindex="0"'));
  assert.ok(
    after.code.includes("https://example.com/research?x=1&#x26;y=2") ||
      after.code.includes("https://example.com/research?x=1&y=2")
  );
  assert.ok(after.code.includes("5% 到 9%"));
  assert.deepEqual(after.metadata.headings, before.metadata.headings);
  assert.equal(
    after.code.match(/<pre\b[\s\S]*?<\/pre>/)?.[0],
    before.code.match(/<pre\b[\s\S]*?<\/pre>/)?.[0]
  );
});
