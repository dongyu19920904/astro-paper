import test from "node:test";
import assert from "node:assert/strict";
import { supplementArticleMedia } from "../src/utils/remarkArticleMedia.ts";
import { rehypeFigures, type HastNode } from "../src/utils/rehypeFigures.ts";
import { rehypeReadingBlocks } from "../src/utils/rehypeReadingBlocks.ts";
import type { Root } from "mdast";

const media = { imageUrl: "https://example.org/figure.png", alt: "来源配图：研究图", sourceUrl: "https://example.org/paper", sourceTitle: "论文" };
test("offline media needs a real citation, never changes existing images and is idempotent", () => {
  const tree: Root = { type: "root", children: [{ type: "paragraph", children: [{ type: "link", url: media.sourceUrl, children: [{ type: "text", value: "论文" }] }] }] };
  supplementArticleMedia(tree, [media]);
  assert.equal(tree.children.length, 2);
  supplementArticleMedia(tree, [media]);
  assert.equal(tree.children.length, 2);
  const empty: Root = { type: "root", children: [] };
  supplementArticleMedia(empty, [media]);
  assert.equal(empty.children.length, 0);
});
test("linked images gain a figure, safe plain caption, source and original exits", () => {
  const tree: HastNode = { type: "root", children: [{ type: "element", tagName: "p", children: [{ type: "element", tagName: "a", properties: { href: media.sourceUrl }, children: [{ type: "element", tagName: "img", properties: { src: media.imageUrl, alt: media.alt, "data-original-src": media.imageUrl } }] }] }] };
  rehypeFigures()(tree);
  const figure = tree.children![0];
  assert.equal(figure.tagName, "figure");
  assert.equal(figure.children![1].tagName, "figcaption");
  assert.ok(JSON.stringify(figure).includes('"value":"图源"'));
  assert.ok(JSON.stringify(figure).includes('"value":"原图"'));
  rehypeFigures()(tree);
  assert.equal(tree.children!.length, 1);
});
test("only explicit callouts change; ordinary quotations and unknown markers remain intact", () => {
  const quote = (value: string): HastNode => ({ type: "element", tagName: "blockquote", children: [{ type: "element", tagName: "p", children: [{ type: "text", value }] }] });
  const tree: HastNode = { type: "root", children: [quote("[!NOTE]\n限定条件"), quote("真实引文"), quote("[!UNKNOWN]\n保留")] };
  rehypeReadingBlocks()(tree);
  assert.equal(tree.children![0].tagName, "aside");
  assert.equal(tree.children![1].tagName, "blockquote");
  assert.equal(tree.children![2].tagName, "blockquote");
  assert.ok(JSON.stringify(tree).includes("限定条件"));
});
test("references retain heading ID and links, stay visible and do not swallow following sections", () => {
  const tree: HastNode = { type: "root", children: [{ type: "element", tagName: "h2", properties: { id: "参考资料" } }, { type: "element", tagName: "ul" }, { type: "element", tagName: "hr" }, { type: "element", tagName: "p" }] };
  rehypeReadingBlocks()(tree);
  assert.equal(tree.children![0].tagName, "section");
  assert.equal(tree.children![0].children!.length, 2);
  assert.equal(tree.children![1].tagName, "hr");
});

test("references are recognized before Astro adds heading IDs", () => {
  const tree: HastNode = { type: "root", children: [{ type: "element", tagName: "h2", children: [{ type: "text", value: "参考资料" }] }, { type: "element", tagName: "ul" }] };
  rehypeReadingBlocks()(tree);
  assert.equal(tree.children![0].tagName, "section");
  assert.equal(tree.children![0].children![0].properties, undefined);
});
