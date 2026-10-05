import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import {
  assertThemeRecord,
  collectThemeRecord,
} from "./check-theme-browser.mjs";

const args = new Map();
for (let i = 2; i < process.argv.length; i += 2) {
  assert.ok(["--base", "--output"].includes(process.argv[i]));
  assert.ok(process.argv[i + 1]);
  args.set(process.argv[i], process.argv[i + 1]);
}
const base = new URL(args.get("--base") ?? "http://127.0.0.1:4401/");
const local = ["localhost", "127.0.0.1"].includes(base.hostname);
assert.ok(local || base.origin === "https://yuyu.aivora.cn");
const output = path.resolve(
  args.get("--output") ?? "theme-playwright-report.json"
);
await mkdir(path.dirname(output), { recursive: true });
const runtime =
  process.env.THEME_PLAYWRIGHT_MODULE ??
  path.join(
    process.env.USERPROFILE ?? process.env.HOME ?? "",
    ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs"
  );
const { chromium } = await import(pathToFileURL(runtime));
const browser = await chromium.launch({ headless: true });
const report = {
  base: base.href,
  browser: browser.version(),
  cases: [],
  journeys: [],
  pageErrors: [],
  errors: [],
  analyticsExcluded: true,
};
const paths = [
  "/",
  "/posts/",
  "/posts/bioai-daily-2026-10-03/",
  "/posts/bioai-daily-2026-10-02/",
  "/posts/bioai-daily-2026-09-30/",
  "/posts/ai-daily-2026-10-03/",
  "/posts/ai-daily-2026-09-28/",
  "/posts/bioai-daily-2026-09-12/",
  "/posts/ai-daily-2026-01-10/",
  "/topics/",
  "/search/",
  "/about/",
];

async function ready(page) {
  await page
    .locator('#theme-btn[aria-label^="切换到"]')
    .waitFor({ state: "attached" });
}
async function record(page) {
  // Check the rendered frame, not the interval between input and browser paint.
  await page.evaluate(
    () =>
      new Promise(resolve => {
        requestAnimationFrame(() => requestAnimationFrame(resolve));
      })
  );
  const value = await page.evaluate(collectThemeRecord);
  report.lastRecord = value;
  if (value.colors.article.length) {
    assert.equal(
      await page.locator("#article").getAttribute("class"),
      "article-prose mt-8 w-full",
      "deployed native article required"
    );
  }
  assertThemeRecord(value, value.theme);
  return value;
}
async function toggle(page, before) {
  const button = page.locator("#theme-btn");
  if (!(await button.isVisible()))
    await page.getByRole("button", { name: "展开导航" }).click();
  await button.click();
  const after = await record(page);
  assertThemeRecord(after, before.theme === "dark" ? "light" : "dark", before);
  return after;
}

try {
  for (const viewport of [
    { width: 1280, height: 900 },
    { width: 390, height: 844 },
  ]) {
    const context = await browser.newContext({
      viewport,
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    // Theme QA must not count automated visits in production analytics.
    await page.route("https://sdk.51.la/**", route =>
      route.fulfill({
        contentType: "application/javascript",
        body: "window.LA={init(){}};",
      })
    );
    await page.route("https://v6-widget.51.la/**", route =>
      route.fulfill({ contentType: "application/javascript", body: "" })
    );
    page.setDefaultTimeout(15000);
    page.on("pageerror", error =>
      report.pageErrors.push({ url: page.url(), message: error.message })
    );
    await page.addInitScript(() => {
      document.addEventListener(
        "click",
        event => {
          window.__themeCheckClick = {
            button: !!event.target.closest("#theme-btn"),
            trusted: event.isTrusted,
          };
        },
        true
      );
    });
    try {
      for (const pathname of paths) {
        const entry = { pathname, viewport, records: [], status: "pending" };
        report.cases.push(entry);
        await page.goto(new URL(pathname, base).href, {
          waitUntil: "load",
        });
        await ready(page);
        let before = await record(page);
        entry.records.push(before);
        for (let index = 0; index < 6; index += 1) {
          before = await toggle(page, before);
          entry.records.push(before);
          if (pathname === "/posts/bioai-daily-2026-10-03/" && index < 2) {
            await page.screenshot({
              path: `${output}.${viewport.width}.${before.theme}.png`,
            });
          }
        }
        await page.reload({ waitUntil: "load" });
        await ready(page);
        const restored = await record(page);
        assert.equal(
          restored.theme,
          before.theme,
          "refresh retains the last preference"
        );
        assert.notEqual(
          restored.timeOrigin,
          before.timeOrigin,
          "refresh check must actually reload"
        );
        entry.restored = restored;
        entry.status = "passed";
        process.stdout.write(
          `${JSON.stringify({ pathname, viewport, clicks: 6, status: "passed" })}\n`
        );
      }
      for (const from of ["/", "/posts/"]) {
        await page.goto(new URL(from, base).href, {
          waitUntil: "load",
        });
        await ready(page);
        const selected = await toggle(page, await record(page));
        const link = page.locator('a[href^="/posts/bioai-daily-"]').first();
        const target = await link.getAttribute("href");
        assert.ok(target, "real article entry link required");
        const entry = {
          from,
          target,
          viewport,
          records: [],
          status: "pending",
        };
        report.journeys.push(entry);
        await link.click();
        const expected = new URL(target, base);
        await page.waitForURL(
          url =>
            url.origin === expected.origin &&
            url.pathname.replace(/\/$/, "") ===
              expected.pathname.replace(/\/$/, ""),
          { waitUntil: "load" }
        );
        await ready(page);
        let before = await record(page);
        assert.equal(
          before.theme,
          selected.theme,
          "article entry retains homepage/list preference"
        );
        entry.records.push(before);
        for (let i = 0; i < 4; i += 1) {
          before = await toggle(page, before);
          entry.records.push(before);
        }
        await page.goBack({ waitUntil: "load" });
        await ready(page);
        const back = await record(page);
        assert.equal(
          back.theme,
          before.theme,
          "back navigation retains the current preference"
        );
        entry.status = "passed";
      }
      if (local && viewport.width === 1280) {
        await page.goto(new URL("/posts/bioai-daily-2026-10-03/", base).href, {
          waitUntil: "load",
        });
        await ready(page);
        const beforePinned = await record(page);
        await page.evaluate(color => {
          const style = document.createElement("style");
          style.id = "theme-pinned-negative";
          style.textContent = `#article p { color: ${color} !important; }`;
          document.head.append(style);
        }, beforePinned.colors.paragraph[0].color);
        try {
          await assert.rejects(
            toggle(page, beforePinned),
            /paragraph\[\d+\] actual color/
          );
          report.localNegativeControl =
            "stuck paragraph color rejected after browser paint";
        } finally {
          await page
            .locator("#theme-pinned-negative")
            .evaluate(element => element.remove());
        }
        await record(page);
        await page.locator("#article").evaluate(article => {
          const fixture = document.createElement("section");
          fixture.id = "theme-css-fixture";
          fixture.innerHTML =
            '<p><a href="#"><strong>Link emphasis</strong> <code>inline</code></a></p><blockquote><p>Quote</p></blockquote><ul><li>List</li></ul><table><thead><tr><th>Header</th></tr></thead><tbody><tr><td>Cell</td></tr></tbody></table><pre class="astro-code" style="--shiki-light:#123456;--shiki-light-bg:#f6f8fa;--shiki-dark:#abcdef;--shiki-dark-bg:#011627"><code><span style="--shiki-light:#654321;--shiki-dark:#fedcba">Token</span></code></pre>';
          article.append(fixture);
        });
        const fixtureChecks = [];
        for (let i = 0; i < 2; i += 1) {
          const after = await toggle(page, await record(page));
          const colors = await page
            .locator("#theme-css-fixture")
            .evaluate(element => {
              const get = selector => {
                const node = element.querySelector(selector);
                const css = getComputedStyle(node);
                return { color: css.color, background: css.backgroundColor };
              };
              return {
                inline: get("a code"),
                pre: get("pre"),
                token: get("pre span"),
                cell: get("td"),
              };
            });
          assert.equal(
            colors.inline.color,
            after.theme === "light" ? "rgb(11, 92, 173)" : "rgb(255, 107, 1)"
          );
          assert.equal(
            colors.pre.background,
            after.theme === "light" ? "rgb(246, 248, 250)" : "rgb(1, 22, 39)"
          );
          assert.equal(
            colors.token.color,
            after.theme === "light" ? "rgb(101, 67, 33)" : "rgb(254, 220, 186)"
          );
          fixtureChecks.push({ theme: after.theme, colors });
        }
        report.localCssFixture = fixtureChecks;
      }
    } finally {
      await context.close();
    }
  }
} catch (error) {
  report.errors.push(error.message);
  const pending = [...report.cases, ...report.journeys].find(
    entry => entry.status === "pending"
  );
  if (pending) pending.status = "failed";
  process.exitCode = 1;
} finally {
  await browser.close();
  await writeFile(output, JSON.stringify(report, null, 2));
  process.stdout.write(
    `${JSON.stringify({
      cases: report.cases.length,
      journeys: report.journeys.length,
      errors: report.errors,
      pageErrors: report.pageErrors.length,
      output,
    })}\n`
  );
}
