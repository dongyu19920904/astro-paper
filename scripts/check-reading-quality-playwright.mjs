import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import {
  assertThemeRecord,
  collectThemeRecord,
} from "./check-theme-browser.mjs";

const base = new URL(process.argv[2] || "https://yuyu.aivora.cn/");
assert.ok(["https:", "http:"].includes(base.protocol));
assert.ok(["yuyu.aivora.cn", "127.0.0.1", "localhost"].includes(base.hostname));
assert.ok(!base.username && !base.password);
const output = path.resolve(
  process.argv[3] || "docs/content-quality-20261026/browser"
);
await mkdir(output, { recursive: true });
const runtime =
  process.env.THEME_PLAYWRIGHT_MODULE ||
  path.join(
    process.env.USERPROFILE,
    ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs"
  );
const { chromium } = await import(pathToFileURL(runtime));
const browser = await chromium.launch({ headless: true });
const report = {
  base: base.href,
  browser: browser.version(),
  cases: [],
  pageErrors: [],
  fixture:
    "Local DOM-only display fixture; not a published article or Markdown parser test.",
  analyticsExcluded: true,
};
try {
  for (const width of [1365, 390]) {
    const context = await browser.newContext({
      viewport: { width, height: 960 },
      reducedMotion: "reduce",
      colorScheme: "light",
    });
    await context.route(/https:\/\/(sdk\.51\.la|v6-widget\.51\.la)\//, route =>
      route.fulfill({
        contentType: "application/javascript",
        body: "window.LA={init(){}};",
      })
    );
    const page = await context.newPage();
    page.setDefaultTimeout(20000);
    page.on("pageerror", error => report.pageErrors.push(error.message));
    await page.addInitScript(() =>
      document.addEventListener(
        "click",
        event => {
          window.__themeCheckClick = {
            button: !!event.target.closest("#theme-btn"),
            trusted: event.isTrusted,
          };
        },
        true
      )
    );
    try {
      for (const slug of ["ai-daily-2026-10-25", "bioai-daily-2026-10-25"]) {
        await page.goto(new URL(`/posts/${slug}/`, base).href, {
          waitUntil: "load",
        });
        await page
          .locator('#theme-btn[aria-label^="切换到"]')
          .waitFor({ state: "attached" });
        const timeOrigin = await page.evaluate(() => performance.timeOrigin);
        for (const theme of ["light", "dark"]) {
          if (
            (await page.locator("html").getAttribute("data-theme")) !== theme
          ) {
            if (!(await page.locator("#theme-btn").isVisible()))
              await page.locator("#menu-btn").click();
            await page.locator("#theme-btn").click();
            await page.waitForFunction(
              expected => document.documentElement.dataset.theme === expected,
              theme
            );
          }
          if (
            (await page.locator("#menu-btn").getAttribute("aria-expanded")) ===
            "true"
          )
            await page.locator("#menu-btn").click();
          await page.evaluate(
            () =>
              new Promise(resolve =>
                requestAnimationFrame(() => requestAnimationFrame(resolve))
              )
          );
          const colors = await page.evaluate(collectThemeRecord);
          assertThemeRecord(colors, theme);
          assert.equal(
            await page.evaluate(() => performance.timeOrigin),
            timeOrigin,
            "theme must not reload the page"
          );
          const metric = await page.locator("#article").evaluate(article => {
            const p = article.querySelector("p");
            const css = getComputedStyle(p);
            return {
              viewport: innerWidth,
              articleWidth: article.getBoundingClientRect().width,
              fontSize: css.fontSize,
              lineHeight: css.lineHeight,
              lead: !!article.querySelector(".article-lead"),
              overflow: document.documentElement.scrollWidth > innerWidth + 1,
            };
          });
          assert.equal(metric.viewport, width);
          assert.equal(metric.overflow, false);
          if (["127.0.0.1", "localhost"].includes(base.hostname))
            assert.equal(
              metric.lead,
              true,
              "the new opening paragraph must actually be rendered"
            );
          const screenshot = `${slug}-${width}-${theme}.png`;
          await page.screenshot({ path: path.join(output, screenshot) });
          report.cases.push({
            slug,
            width,
            theme,
            ...metric,
            screenshot,
            nativeThemeNoReload: true,
          });
        }
      }
      if (["127.0.0.1", "localhost"].includes(base.hostname)) {
        await page.locator("#article").evaluate(article => {
          const fixture = document.createElement("section");
          fixture.id = "reading-display-fixture";
          fixture.innerHTML =
            '<h2>排版测试夹具，不是公开文章</h2><p>下面只检查列表、引用、代码和表格的显示。</p><ol><li>先明确要完成的小任务。</li><li>核对原文、输入与输出。</li></ol><blockquote><p>示例中的限制和来源仍应就近保留。</p></blockquote><div class="table-scroll" tabindex="0" role="region" aria-label="示例表格，可横向滚动"><table><thead><tr><th>观察</th><th>检查动作</th><th>适用条件</th><th>待核对的来源</th></tr></thead><tbody><tr><td>找到原句</td><td>回到原文查看上下文</td><td>原文完整可用</td><td><code>https://example.com/a-long-reference-path?source=fixture</code></td></tr></tbody></table></div><pre class="astro-code" style="--shiki-light:#111827;--shiki-light-bg:#f6f8fa;--shiki-dark:#eaedf3;--shiki-dark-bg:#011627"><code>请指出原句和位置。\n没有找到时写“没有找到”。\n\n不要补出原文中没有的内容。</code></pre>';
          article.append(fixture);
        });
        await page.locator("#reading-display-fixture").scrollIntoViewIfNeeded();
        assert.equal(
          await page.evaluate(
            () => document.documentElement.scrollWidth > innerWidth + 1
          ),
          false
        );
        await page.screenshot({
          path: path.join(output, `fixture-${width}-dark.png`),
        });
        const table = await page
          .locator("#reading-display-fixture .table-scroll")
          .evaluate(el => ({
            focusable: el.tabIndex === 0,
            width: el.clientWidth,
            scrollWidth: el.scrollWidth,
          }));
        report.cases.push({ fixture: true, width, theme: "dark", table });
      }
    } finally {
      await context.close();
    }
  }
  assert.equal(report.pageErrors.length, 0);
} catch (error) {
  report.error = error.message;
  process.exitCode = 1;
} finally {
  await browser.close();
  await writeFile(
    path.join(output, "report.json"),
    JSON.stringify(report, null, 2)
  );
  process.stdout.write(
    `${JSON.stringify({ output, cases: report.cases.length, error: report.error || null, pageErrors: report.pageErrors })}\n`
  );
}
