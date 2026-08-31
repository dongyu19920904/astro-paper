import assert from "node:assert/strict";
import test from "node:test";

import { NAV_LINKS, PROJECTS } from "../src/data/navProjects.ts";

test("personal homepage exposes a distinct seller-facing supply entry", () => {
  const navigationEntry = NAV_LINKS.find(item => item.url === "https://supply.aivora.cn/");
  const projectEntry = PROJECTS.find(item => item.url === "https://supply.aivora.cn/");

  assert.equal(navigationEntry?.title, "AI 货源与商家经营");
  assert.equal(navigationEntry?.tag, "卖家工具");
  assert.match(projectEntry?.desc || "", /找货|货源/);
  assert.match(projectEntry?.desc || "", /经营日报/);
  assert.equal(NAV_LINKS.filter(item => item.url === "https://supply.aivora.cn/").length, 1);
  assert.equal(PROJECTS.filter(item => item.url === "https://supply.aivora.cn/").length, 1);
});
