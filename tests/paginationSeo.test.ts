import assert from "node:assert/strict";
import test from "node:test";

import { buildPaginationSeo } from "../src/utils/paginationSeo.ts";

test("first collection page keeps the collection canonical", () => {
  const seo = buildPaginationSeo({
    title: "博客",
    description: "文章归档。",
    canonicalBase: "https://yuyu.aivora.cn/posts/",
    currentPage: 1,
    siteTitle: "yuyu",
  });

  assert.equal(seo.canonicalURL, "https://yuyu.aivora.cn/posts/");
  assert.equal(seo.title, "博客 | yuyu");
  assert.equal(seo.description, "文章归档。");
});

test("later collection pages self-canonicalize and identify their page", () => {
  const seo = buildPaginationSeo({
    title: "标签: BioAI",
    description: "BioAI 相关文章。",
    canonicalBase: "https://yuyu.aivora.cn/tags/bioai/",
    currentPage: 3,
    siteTitle: "yuyu",
  });

  assert.equal(seo.canonicalURL, "https://yuyu.aivora.cn/tags/bioai/3/");
  assert.equal(seo.title, "标签: BioAI - 第 3 页 | yuyu");
  assert.match(seo.description, /第 3 页/);
});
