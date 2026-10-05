import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = file => readFileSync(new URL(file, import.meta.url), "utf8");
const layout = read("../src/layouts/PostDetails.astro");
const css = read("../src/styles/article-prose.css");
const global = read("../src/styles/global.css");
const reading = read("../src/styles/reading.css");

test("every blog uses the shared native article class, not prose theme utilities", () => {
  const article = layout.match(/<article\b[\s\S]*?>/)?.[0];
  assert.ok(article);
  assert.match(article, /class="article-prose mt-8 w-full"/);
  assert.doesNotMatch(article, /app-prose|dark:|prose-pre/);
  assert.match(layout, /<Content\s*\/>/);
  assert.match(layout, /<Layout \{\.\.\.layoutProps\}>/);
});

test("article colors use root selectors and existing tokens without plugin aliases", () => {
  assert.match(global, /@import "\.\/article-prose\.css"/);
  assert.doesNotMatch(css, /@apply|@plugin|--tw-prose|!important/);
  for (const token of [
    "foreground",
    "accent",
    "emphasis",
    "quote-bg",
    "border",
    "secondary",
    "muted",
  ]) {
    assert.ok(css.includes(`var(--${token})`), token);
  }
  assert.match(css, /html\[data-theme\] \.article-prose/);
  assert.match(css, /html\[data-theme="light"\] \.article-prose \.astro-code/);
  assert.match(css, /html\[data-theme="dark"\] \.article-prose \.astro-code/);
  assert.match(css, /a :where\(strong, b, code\)\s*\{\s*color: inherit/);
  assert.ok(
    css.indexOf("a :where(strong, b, code)") >
      css.indexOf("html[data-theme] .article-prose code"),
    "linked inline code must override the ordinary inline-code color"
  );
});

test("reading measurements target native article markup and remain unchanged", () => {
  assert.doesNotMatch(reading, /app-prose/);
  assert.match(
    reading,
    /\.article-layout \.article-prose\s*\{\s*font-size: 1\.0625rem;\s*line-height: 1\.85/
  );
  assert.match(reading, /\.article-layout \.article-prose h2/);
  assert.match(reading, /\.article-layout \.article-prose h3/);
  assert.match(reading, /font-size: 1\.125rem/);
  assert.match(reading, /max-width: 44rem/);
});

test("native prose keeps lists, tables, images, quotes and code readable", () => {
  for (const selector of [
    ".article-prose ul",
    ".article-prose ol",
    ".article-prose table",
    ".article-prose img",
    ".article-prose blockquote",
    ".article-prose .astro-code code",
  ]) {
    assert.ok(css.includes(selector), selector);
  }
  assert.match(css, /list-style-type: disc/);
  assert.match(css, /list-style-type: decimal/);
  assert.match(css, /border-collapse: collapse/);
  assert.match(
    css,
    /\.astro-code code\s*\{\s*color: inherit;\s*background: transparent/
  );
});
