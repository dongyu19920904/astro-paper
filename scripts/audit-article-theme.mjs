import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

const dist = path.resolve("dist");
const files = readdirSync(path.join(dist, "posts"), { recursive: true }).filter(
  file => file.endsWith("index.html")
);
let articles = 0;
const stylesheets = new Set();
for (const file of files) {
  const html = readFileSync(path.join(dist, "posts", file), "utf8");
  const article = html.match(/<article\b[^>]*\bid="article"[^>]*>/)?.[0];
  if (!article) continue;
  articles += 1;
  assert.match(
    html,
    /<meta\b[^>]*name="darkreader-lock"/,
    `native theme lock missing: ${file}`
  );
  assert.match(article, /class="article-prose mt-8 w-full"/, file);
  assert.doesNotMatch(article, /app-prose|prose-pre|dark:/, file);
  const css = [
    ...html.matchAll(/<link\b[^>]*href="(\/_astro\/[^"?]+\.css)"[^>]*>/g),
  ].map(match => match[1]);
  assert.ok(css.length, `stylesheet missing: ${file}`);
  for (const href of css) stylesheets.add(href);
}
assert.ok(articles > 0, "built articles required");
const assets = [...stylesheets].map(href => {
  const source = readFileSync(path.join(dist, href.slice(1)), "utf8");
  assert.ok(source.includes(".article-prose"), `native rules missing: ${href}`);
  assert.match(
    source,
    /html\[data-theme=(?:"dark"|dark)\] \.article-prose/,
    href
  );
  return { href, sha256: createHash("sha256").update(source).digest("hex") };
});
process.stdout.write(
  `${JSON.stringify({ articles, nativeThemeLocks: articles, legacyArticleClasses: 0, assets }, null, 2)}\n`
);
