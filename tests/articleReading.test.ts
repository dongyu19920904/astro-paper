import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import type { Root } from "mdast";
import {
  articleProgress,
  estimateReadingMinutes,
  getArticleSeries,
  getArticleSeriesTone,
  isAutomatedArticle,
  sortByPublishedDate,
} from "../src/utils/articleReading.ts";
import {
  collectArticleSources,
  simplifyLegacyReferences,
} from "../src/utils/remarkArticleSources.ts";
import { getTopicPage } from "../src/utils/topicPagination.ts";

const source = (path: string) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("article typography inherits the active theme instead of fixed gray defaults", () => {
  const css = source("src/styles/typography.css");
  const articleRule = css.slice(
    css.indexOf(".app-prose {"),
    css.indexOf("    h1,")
  );
  for (const property of ["body", "headings", "quotes", "code"]) {
    assert.match(
      articleRule,
      new RegExp(`--tw-prose-${property}: var\\(--foreground\\)`)
    );
  }
  for (const property of ["lead", "captions", "counters"]) {
    assert.match(
      articleRule,
      new RegExp(`--tw-prose-${property}: var\\(--secondary\\)`)
    );
  }
  assert.match(articleRule, /--tw-prose-links: var\(--accent\)/);
  assert.match(articleRule, /--tw-prose-bullets: var\(--accent\)/);
  assert.match(articleRule, /--tw-prose-bold: var\(--emphasis\)/);
  assert.match(css, /strong\s*\{\s*color: var\(--emphasis\)/);
  assert.match(css, /a strong\s*\{\s*color: inherit/);
});

test("every shared-layout page uses ordinary document navigation", () => {
  const layout = source("src/layouts/Layout.astro");
  assert.doesNotMatch(layout, /ClientRouter|clientRouter|astro:transitions/);
  assert.doesNotMatch(source("src/layouts/PostDetails.astro"), /clientRouter/);
  assert.match(layout, /scripts\/theme\.ts/);
  for (const file of ["src/pages/index.astro", "src/layouts/Main.astro"]) {
    assert.match(source(file), /rememberBackUrl\(\);/);
  }
});
test("series and automated disclosure are deterministic, not invented reviews", () => {
  assert.equal(getArticleSeries(["bioai-daily", "ai"]), "生命科学观察");
  assert.equal(isAutomatedArticle(["ai-daily"]), true);
  assert.equal(isAutomatedArticle(["notes"]), false);
  assert.equal(estimateReadingMinutes(""), 1);
  assert.equal(estimateReadingMinutes("字".repeat(700)), 2);
  assert.doesNotMatch(
    source("src/layouts/PostDetails.astro"),
    /未记录逐篇人工核验|article-method|规范引用/
  );
  assert.match(source("src/utils/geoText.ts"), /AI 辅助整理和撰稿/);
});

test("legacy source prose becomes compact references without changing article facts", () => {
  const body = {
    type: "paragraph" as const,
    children: [{ type: "text" as const, value: "我的项目记录。" }],
  };
  const link = {
    type: "link" as const,
    url: "https://example.com/paper",
    children: [{ type: "text" as const, value: "原始论文" }],
  };
  const tree: Root = {
    type: "root",
    children: [
      body,
      {
        type: "heading",
        depth: 2,
        children: [{ type: "text", value: "来源与边界" }],
      },
      {
        type: "paragraph",
        children: [{ type: "text", value: "正式说明" }, link, link],
      },
      { type: "thematicBreak" },
      body,
    ],
  };
  simplifyLegacyReferences(tree);
  assert.equal(tree.children[0], body);
  assert.deepEqual(tree.children[1], {
    type: "heading",
    depth: 2,
    children: [{ type: "text", value: "参考资料" }],
  });
  assert.equal(tree.children[2].type, "list");
  assert.equal((tree.children[2] as import("mdast").List).children.length, 1);
  assert.deepEqual(collectArticleSources(tree, "https://yuyu.aivora.cn/"), [
    link.url,
  ]);
  assert.equal(tree.children[3].type, "thematicBreak");
  assert.equal(tree.children[4], body);
  simplifyLegacyReferences(tree);
  assert.equal(tree.children.length, 5);
});

test("production builds invalidate rendered Markdown after shared editorial changes", () => {
  assert.match(
    JSON.parse(source("package.json")).scripts.build,
    /^astro sync --force &&/
  );
  assert.match(
    source(".github/workflows/deploy.yml"),
    /pnpm astro sync --force\s+pnpm astro check/
  );
});

test("a section without actual source links is not silently erased", () => {
  const tree: Root = {
    type: "root",
    children: [
      {
        type: "heading",
        depth: 2,
        children: [{ type: "text", value: "来源与边界" }],
      },
      {
        type: "paragraph",
        children: [{ type: "text", value: "此处没有原始链接。" }],
      },
    ],
  };
  const before = structuredClone(tree);
  simplifyLegacyReferences(tree);
  assert.deepEqual(tree, before);
});

test("legacy source notes may reuse actual article links, never invented references", () => {
  const link = {
    type: "link" as const,
    url: "https://example.com/research",
    children: [{ type: "text" as const, value: "原始研究" }],
  };
  const tree: Root = {
    type: "root",
    children: [
      { type: "paragraph", children: [link] },
      {
        type: "heading",
        depth: 2,
        children: [{ type: "text", value: "来源与边界" }],
      },
      {
        type: "paragraph",
        children: [{ type: "text", value: "具体链接见正文。" }],
      },
    ],
  };
  simplifyLegacyReferences(tree);
  assert.equal(tree.children[0].type, "paragraph");
  assert.deepEqual(collectArticleSources(tree, "https://yuyu.aivora.cn"), [
    link.url,
  ]);
  const heading = tree.children[1];
  assert.ok(heading.type === "heading");
  assert.deepEqual(heading.children, [{ type: "text", value: "参考资料" }]);
  assert.equal(tree.children[2].type, "list");
});

test("series color uses explicit daily tags and leaves unknown content neutral", () => {
  assert.equal(getArticleSeriesTone(["bioai-daily", "ai-daily"]), "life");
  assert.equal(getArticleSeriesTone(["ai-daily", "ai"]), "tech");
  assert.equal(getArticleSeriesTone(["ai", "claude", "long life"]), "neutral");
  assert.equal(getArticleSeriesTone([]), "neutral");
  assert.equal(getArticleSeriesTone(), "neutral");
  for (const path of [
    "src/pages/index.astro",
    "src/components/Card.astro",
    "src/layouts/PostDetails.astro",
  ]) {
    assert.match(source(path), /<ArticleSeries/);
  }
});

test("both theme palettes retain readable emphasis and series labels", () => {
  const css = source("src/styles/global.css");
  const luminance = (hex: string) => {
    const rgb = hex
      .slice(1)
      .match(/../g)!
      .map(channel => {
        const value = parseInt(channel, 16) / 255;
        return value <= 0.04045
          ? value / 12.92
          : ((value + 0.055) / 1.055) ** 2.4;
      });
    return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
  };
  for (const theme of ["light", "dark"]) {
    const rule = css.match(
      new RegExp(`html\\[data-theme="${theme}"\\] \\{([^}]+)`)
    )![1];
    const value = (name: string) =>
      rule.match(new RegExp(`--${name}: (#[a-f0-9]{6})`))![1];
    const pairs = [
      ["foreground", "background"],
      ["secondary", "background"],
      ["emphasis", "background"],
      ["foreground", "quote-bg"],
      ["secondary", "muted"],
      ["topic-life", "topic-life-bg"],
      ["topic-tech", "topic-tech-bg"],
    ];
    for (const [foreground, background] of pairs) {
      const l1 = luminance(value(foreground));
      const l2 = luminance(value(background));
      assert.ok(
        (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05) >= 4.5,
        `${theme} ${foreground} on ${background} must meet AA text contrast`
      );
    }
  }
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
test("financial references are restricted to the explicitly restored historical prose", () => {
  const root = new URL("../src/data/blog/", import.meta.url);
  const privateAmounts =
    /(?:日销售额|每天销售额|日销|日流水|每天出单).{0,15}(?:3000|三千)|(?:利润|毛利).{0,8}(?:1000|一千)|(?:3000|三千).{0,12}(?:销售额|流水|营业额)/;
  const leaks = readdirSync(root)
    .filter(file => file.endsWith(".md"))
    .filter(file =>
      privateAmounts.test(readFileSync(new URL(file, root), "utf8"))
    );
  const body = (text: string) =>
    text
      .replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "")
      .replace(/\r\n/g, "\n")
      .trim();
  const fixture = JSON.parse(
    readFileSync(
      new URL("./fixtures/editorialRollback.json", import.meta.url),
      "utf8"
    )
  );
  for (const file of leaks) {
    const current = readFileSync(new URL(file, root), "utf8");
    const restored = fixture.records.find(
      (item: { file: string }) => item.file === `src/data/blog/${file}`
    );
    assert.ok(restored, `Not an authorized historical restore: ${file}`);
    assert.equal(
      createHash("sha256").update(body(current)).digest("hex"),
      restored.bodySha256,
      file
    );
  }
});
