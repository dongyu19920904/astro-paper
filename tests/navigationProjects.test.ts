import assert from "node:assert/strict";
import test from "node:test";

import { HOME_PROJECTS, NAV_LINKS, PROJECTS } from "../src/data/navProjects.ts";

test("homepage highlights two existing projects without changing the directory", () => {
  assert.equal(HOME_PROJECTS.length, 2);
  assert.equal(new Set(HOME_PROJECTS.map(project => project.url)).size, 2);
  assert.ok(
    HOME_PROJECTS.every(project =>
      PROJECTS.some(item => item.url === project.url)
    )
  );
  assert.ok(HOME_PROJECTS.every(project => project.desc.length < 60));
});

test("personal homepage exposes a distinct seller-facing supply entry", () => {
  const navigationEntry = NAV_LINKS.find(
    item => item.url === "https://supply.aivora.cn/"
  );
  const projectEntry = PROJECTS.find(
    item => item.url === "https://supply.aivora.cn/"
  );

  assert.equal(navigationEntry?.title, "AI 货源与商家经营");
  assert.equal(navigationEntry?.tag, "卖家工具");
  assert.match(projectEntry?.desc || "", /找货|货源/);
  assert.match(projectEntry?.desc || "", /经营日报/);
  assert.equal(
    NAV_LINKS.filter(item => item.url === "https://supply.aivora.cn/").length,
    1
  );
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
