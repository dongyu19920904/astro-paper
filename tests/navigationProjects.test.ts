import assert from "node:assert/strict";
import test from "node:test";
import { existsSync, readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import ts from "typescript";

import {
  HOME_PROJECTS,
  NAV_LINKS,
  PROJECTS,
  PRIMARY_PROJECTS,
  SECONDARY_PROJECTS,
} from "../src/data/navProjects.ts";

test("homepage keeps SEO, analytics and reveal behavior outside the redesign", () => {
  const page = readFileSync(
    new URL("../src/pages/index.astro", import.meta.url),
    "utf8"
  );
  const css = readFileSync(
    new URL("../src/styles/home-studio.css", import.meta.url),
    "utf8"
  );
  assert.equal((page.match(/<h1\b/g) || []).length, 1);
  assert.ok(page.includes("canonicalURL={SITE.website}"));
  assert.ok(page.includes('<Footer class="studio-footer" />'));
  assert.ok(page.includes("TOPIC_HUBS.map"));
  assert.ok(css.includes("prefers-reduced-motion: reduce"));
  assert.ok(css.includes(".home-studio {"));
  assert.doesNotMatch(
    page + css,
    /IntersectionObserver|opacity:\s*0(?:\s|;)|setInterval|hex2077\.dev\/_next/
  );
});

test("field notes keep real content while reducing homepage duplication", () => {
  const page = readFileSync(
    new URL("../src/pages/index.astro", import.meta.url),
    "utf8"
  );
  const css = readFileSync(
    new URL("../src/styles/home-studio.css", import.meta.url),
    "utf8"
  );
  assert.match(page, /class="studio-workspace"/);
  assert.match(page, /<aside[^>]+aria-label="主题、项目与近况"/);
  assert.match(
    page,
    /<time datetime=\{post\.data\.pubDatetime\.toISOString\(\)\}/
  );
  assert.match(page, /timeZone: SITE\.timezone/);
  assert.match(page, /formatToParts\(date\)/);
  assert.match(page, /href="\/now\/"/);
  assert.match(page, /authorKnowledge\.updatedAt/);
  assert.doesNotMatch(
    page,
    /briefDescription|post\.data\.description|studio-mastline|studio-section-index/
  );
  assert.doesNotMatch(css, /text-shadow|scale\(1\.015\)/);
  assert.match(css, /minmax\(0, 1\.85fr\) minmax\(0, 1fr\)/);
});

test("homepage refinements preserve copy and improve reading targets", () => {
  const page = readFileSync(
    new URL("../src/pages/index.astro", import.meta.url),
    "utf8"
  );
  const css = readFileSync(
    new URL("../src/styles/home-studio.css", import.meta.url),
    "utf8"
  );
  assert.ok(page.includes("将时间留给长期探索。"));
  assert.match(css, /\.studio-posts h3 a\s*\{[^}]*min-height: 44px/);
  assert.match(css, /\.studio-project h3 a\s*\{[^}]*min-height: 44px/);
  assert.doesNotMatch(css, /overflow-x:\s*(?:clip|hidden)|line-clamp/);
});

test("navigation controls use Chinese accessible names", () => {
  const header = readFileSync(
    new URL("../src/components/Header.astro", import.meta.url),
    "utf8"
  );
  assert.ok(header.includes('aria-label="搜索文章"'));
  assert.ok(header.includes('aria-label="展开导航"'));
  assert.ok(header.includes('openMenu ? "展开导航" : "收起导航"'));
  assert.ok(header.includes('menuBtn.setAttribute("title", menuAction)'));
});

test("theme action labels stay in sync through clicks and page swaps", () => {
  const source = readFileSync(
    new URL("../src/scripts/theme.ts", import.meta.url),
    "utf8"
  );
  const code = ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2022 },
  }).outputText;

  for (const initial of ["light", "dark"]) {
    const attrs: Record<string, string> = {};
    const rootAttrs: Record<string, string> = {};
    const events: Record<string, () => void> = {};
    const storage = new Map<string, string>();
    const listeners = new Map<string, () => void>();
    const makeButton = () => ({
      setAttribute: (name: string, value: string) => {
        attrs[name] = value;
      },
      addEventListener: (name: string, callback: () => void) => {
        listeners.set(name, callback);
      },
    });
    let button = makeButton();
    const theme = {
      themeValue: initial,
      getTheme: () => theme.themeValue,
      setTheme: (value: string) => {
        theme.themeValue = value;
      },
    };
    runInNewContext(code, {
      window: {
        theme,
        matchMedia: () => ({ matches: false, addEventListener: () => {} }),
        getComputedStyle: () => ({ backgroundColor: "rgb(255, 255, 255)" }),
      },
      document: {
        body: {},
        firstElementChild: {
          setAttribute: (name: string, value: string) => {
            rootAttrs[name] = value;
          },
        },
        querySelector: (selector: string) =>
          selector === "#theme-btn" ? button : null,
        addEventListener: (name: string, callback: () => void) => {
          events[name] = callback;
        },
      },
      localStorage: {
        getItem: (name: string) => storage.get(name) ?? null,
        setItem: (name: string, value: string) => storage.set(name, value),
      },
    });
    const firstAction = initial === "dark" ? "切换到日间" : "切换到夜间";
    const nextAction = initial === "dark" ? "切换到夜间" : "切换到日间";
    assert.equal(attrs["aria-label"], firstAction);
    assert.equal(attrs.title, firstAction);
    listeners.get("click")!();
    assert.equal(attrs["aria-label"], nextAction);
    assert.equal(attrs.title, nextAction);
    assert.equal(storage.get("theme"), initial === "dark" ? "light" : "dark");

    button = makeButton();
    events["astro:after-swap"]();
    assert.equal(attrs["aria-label"], nextAction);
    listeners.get("click")!();
    assert.equal(attrs["aria-label"], firstAction);
    assert.equal(rootAttrs["data-theme"], initial);
  }
});

test("day and night retain the original blog palette without home overrides", () => {
  const source = (path: string) =>
    readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
  const css = source("src/styles/global.css");
  const light = css.match(
    /:root,\s*html\[data-theme="light"\]\s*\{([^}]+)\}/
  )![1];
  const dark = css.match(/html\[data-theme="dark"\]\s*\{([^}]+)\}/)![1];
  for (const [block, expected] of [
    [
      light,
      { background: "#fbfcfe", foreground: "#111827", accent: "#0b5cad" },
    ],
    [dark, { background: "#212737", foreground: "#eaedf3", accent: "#ff6b01" }],
  ] as const) {
    for (const [name, value] of Object.entries(expected)) {
      assert.match(block, new RegExp(`--${name}:\\s*${value}\\s*;`));
    }
  }
  const home = source("src/styles/home-studio.css").match(
    /\.home-studio\s*\{([^}]+)\}/
  )![1];
  assert.doesNotMatch(home, /--(?:background|foreground|accent|muted|border):/);
  assert.doesNotMatch(css + source("tokens.css"), /oklch\(/);
  assert.doesNotMatch(source("src/styles/reading.css"), /--color-studio-/);
  assert.match(
    source("src/components/Card.astro"),
    /post-list-title text-lg font-medium text-accent/
  );
  assert.match(
    source("src/styles/reading.css"),
    /\.article-title\s*\{[^}]*color:\s*var\(--accent\)/
  );
  assert.match(
    source("src/styles/home-studio.css"),
    /\.studio-posts h3 a\s*\{[^}]*color:\s*var\(--accent\)/
  );
});

test("base and secondary text and colored actions have readable contrast", () => {
  const css = readFileSync(
    new URL("../src/styles/global.css", import.meta.url),
    "utf8"
  );
  const luminance = (hex: string) => {
    const rgb = hex
      .slice(1)
      .match(/../g)!
      .map(part => {
        const value = parseInt(part, 16) / 255;
        return value <= 0.04045
          ? value / 12.92
          : ((value + 0.055) / 1.055) ** 2.4;
      });
    return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
  };
  const blocks = [
    css.match(/:root,\s*html\[data-theme="light"\]\s*\{([^}]+)\}/)![1],
    css.match(/html\[data-theme="dark"\]\s*\{([^}]+)\}/)![1],
  ];
  for (const block of blocks) {
    const color = (name: string) => {
      const value = block.match(
        new RegExp(`--${name}:\\s*(#[0-9a-f]{6})\\s*;`, "i")
      )?.[1];
      assert.ok(value, `Missing explicit ${name} color`);
      return luminance(value);
    };
    for (const [text, background] of [
      ["foreground", "background"],
      ["secondary", "background"],
      ["accent", "background"],
      ["on-accent", "accent"],
    ]) {
      const a = color(text),
        b = color(background);
      const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
      assert.ok(ratio >= 4.5, `${text}/${background}: ${ratio.toFixed(2)}`);
    }
  }
});

test("homepage previews are local real-project assets with stable dimensions", () => {
  for (const project of HOME_PROJECTS) {
    assert.match(project.preview.src, /^\/images\/projects\/[a-z0-9-]+\.webp$/);
    assert.ok(
      existsSync(new URL("../public" + project.preview.src, import.meta.url))
    );
    assert.ok(project.preview.alt.includes("公开"));
    assert.match(project.preview.capturedAt, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(project.preview.width > 0 && project.preview.height > 0);
  }
});

test("homepage highlights two existing longevity experiments", () => {
  assert.equal(HOME_PROJECTS.length, 2);
  assert.equal(new Set(HOME_PROJECTS.map(project => project.url)).size, 2);
  assert.ok(
    HOME_PROJECTS.every(project =>
      PROJECTS.some(item => item.url === project.url)
    )
  );
  assert.ok(HOME_PROJECTS.every(project => project.desc.length < 60));
  assert.deepEqual(
    HOME_PROJECTS.map(project => project.title),
    ["多维衰老时钟地图", "脑健康成分地图"]
  );
});

test("supply remains accessible only as a secondary directory entry", () => {
  const navigationEntry = NAV_LINKS.find(
    item => item.url === "https://supply.aivora.cn/"
  );
  const projectEntry = PROJECTS.find(
    item => item.url === "https://supply.aivora.cn/"
  );

  assert.equal(navigationEntry, undefined);
  assert.equal(
    PRIMARY_PROJECTS.some(item => item.url === "https://supply.aivora.cn/"),
    false
  );
  assert.equal(
    HOME_PROJECTS.some(item => item.url === "https://supply.aivora.cn/"),
    false
  );
  assert.equal(SECONDARY_PROJECTS.length, 1);
  assert.equal(SECONDARY_PROJECTS[0], projectEntry);
  assert.match(projectEntry?.desc || "", /找货|货源/);
  assert.match(projectEntry?.desc || "", /经营日报/);
  assert.equal(
    NAV_LINKS.filter(item => item.url === "https://supply.aivora.cn/").length,
    0
  );
  const directory = readFileSync(
    new URL("../src/pages/projects/index.astro", import.meta.url),
    "utf8"
  );
  assert.match(directory, /<details[^>]*data-secondary-projects/);
  assert.doesNotMatch(directory, /<details[^>]*\bopen\b/);
  assert.ok(directory.includes("PRIMARY_PROJECTS.map"));
  assert.ok(directory.includes("SECONDARY_PROJECTS.map"));
  assert.equal(
    PROJECTS.filter(item => item.url === "https://supply.aivora.cn/").length,
    1
  );
});

test("navigation uses the local longevity topic hub instead of the broken host", () => {
  assert.equal(
    [...NAV_LINKS, ...PROJECTS].some(item =>
      item.url.includes("life.aivora.cn")
    ),
    false
  );
  assert.equal(
    NAV_LINKS.some(item => item.url === "/topics/ai-longevity/"),
    true
  );
});
