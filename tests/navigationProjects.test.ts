import assert from "node:assert/strict";
import test from "node:test";
import { existsSync, readFileSync } from "node:fs";

import { HOME_PROJECTS, NAV_LINKS, PROJECTS, PRIMARY_PROJECTS, SECONDARY_PROJECTS } from "../src/data/navProjects.ts";

test("workbench keeps SEO, analytics and reveal behavior outside the redesign", () => {
  const page = readFileSync(new URL("../src/pages/index.astro", import.meta.url), "utf8");
  const css = readFileSync(new URL("../src/styles/home-studio.css", import.meta.url), "utf8");
  assert.equal((page.match(/<h1\b/g) || []).length, 1);
  assert.ok(page.includes("canonicalURL={SITE.website}"));
  assert.ok(page.includes('<Footer class="studio-footer" />'));
  assert.ok(page.includes("TOPIC_HUBS.map"));
  assert.ok(css.includes("prefers-reduced-motion: reduce"));
  assert.ok(css.includes(".home-studio {"));
  assert.doesNotMatch(page + css, /IntersectionObserver|opacity:\s*0(?:\s|;)|setInterval|hex2077\.dev\/_next/);
});

test("homepage previews are local real-project assets with stable dimensions", () => {
  for (const project of HOME_PROJECTS) {
    assert.match(project.preview.src, /^\/images\/projects\/[a-z0-9-]+\.webp$/);
    assert.ok(existsSync(new URL("../public" + project.preview.src, import.meta.url)));
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
  assert.deepEqual(HOME_PROJECTS.map(project => project.title), ["多维衰老时钟地图", "脑健康成分地图"]);
});

test("supply remains accessible only as a secondary directory entry", () => {
  const navigationEntry = NAV_LINKS.find(
    item => item.url === "https://supply.aivora.cn/"
  );
  const projectEntry = PROJECTS.find(
    item => item.url === "https://supply.aivora.cn/"
  );

  assert.equal(navigationEntry, undefined);
  assert.equal(PRIMARY_PROJECTS.some(item => item.url === "https://supply.aivora.cn/"), false);
  assert.equal(HOME_PROJECTS.some(item => item.url === "https://supply.aivora.cn/"), false);
  assert.equal(SECONDARY_PROJECTS.length, 1);
  assert.equal(SECONDARY_PROJECTS[0], projectEntry);
  assert.match(projectEntry?.desc || "", /找货|货源/);
  assert.match(projectEntry?.desc || "", /经营日报/);
  assert.equal(
    NAV_LINKS.filter(item => item.url === "https://supply.aivora.cn/").length,
    0
  );
  const directory = readFileSync(new URL("../src/pages/projects/index.astro", import.meta.url), "utf8");
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
