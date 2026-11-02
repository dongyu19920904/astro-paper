import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createHash } from "node:crypto";
import {
  collectThemeRecord,
  assertThemeRecord,
} from "./check-theme-browser.mjs";

const [mode, baseArg, outputArg, expectation] = process.argv.slice(2);
assert.ok(["site", "serp"].includes(mode));
const base = new URL(baseArg);
assert.ok(["yuyu.aivora.cn", "localhost", "127.0.0.1"].includes(base.hostname));
assert.ok(!base.username && !base.password);
const output = path.resolve(outputArg);
const expectGuide = expectation === "--expect-guide";
await mkdir(output, { recursive: true });
const runtime =
  process.env.THEME_PLAYWRIGHT_MODULE ||
  path.join(
    process.env.USERPROFILE,
    ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs"
  );
const playwright = await import(pathToFileURL(runtime));
const browserKind = process.env.SEO_BROWSER_KIND || "chromium";
assert.ok(["chromium", "firefox"].includes(browserKind));
const browser = await playwright[browserKind].launch({
  headless: true,
  executablePath: process.env.SEO_BROWSER_EXECUTABLE || undefined,
});
const report = {
  mode,
  base: base.href,
  measuredAt: new Date().toISOString(),
  browser: browser.version(),
  engine: browserKind,
  locale: "zh-CN",
  timezone: "Asia/Shanghai",
  freshUnauthenticatedContext: true,
  actualExitCountry: "unknown",
  cases: [],
  errors: [],
};
const digest = text => createHash("sha256").update(text).digest("hex");

try {
  if (mode === "serp") {
    for (const engine of ["google", "bing"]) {
      for (const query of ["AI生命延续学", "AI长生不老"]) {
        const context = await browser.newContext({
          locale: report.locale,
          timezoneId: report.timezone,
        });
        const page = await context.newPage();
        const url =
          engine === "google"
            ? new URL("https://www.google.com/search")
            : new URL("https://www.bing.com/search");
        url.searchParams.set("q", query);
        if (engine === "google") {
          url.searchParams.set("hl", "zh-CN");
          url.searchParams.set("gl", "hk");
          url.searchParams.set("pws", "0");
        } else {
          url.searchParams.set("mkt", "zh-CN");
          url.searchParams.set("setlang", "zh-hans");
        }
        const result = {
          engine,
          query,
          requestedUrl: url.href,
          rank: null,
          aiCitations: "not measured",
        };
        try {
          const response = await page.goto(url.href, {
            waitUntil: "domcontentloaded",
            timeout: 25000,
          });
          await page.waitForTimeout(1500);
          const data = await page.evaluate(engine => {
            const body = document.body.innerText;
            const blocked =
              /unusual traffic|not a robot|verify you are human|验证码|人机验证|异常流量/i.test(
                body
              );
            const selector = engine === "google" ? "#rso h3" : "li.b_algo h2 a";
            const rows = [...document.querySelectorAll(selector)]
              .filter(el => !el.closest(".b_ad, .uEierd, [data-text-ad]"))
              .map(el => ({
                title: el.textContent.trim(),
                href: (el.closest("a") || el.querySelector("a"))?.href,
              }))
              .filter(row => row.href)
              .slice(0, 10);
            return {
              title: document.title,
              language: document.documentElement.lang,
              blocked,
              rows,
            };
          }, engine);
          result.status = response.status();
          result.finalUrl = page.url();
          result.observation = data;
          result.availability =
            data.blocked || !data.rows.length
              ? "unavailable"
              : "organic link sample";
          result.note =
            "Observed link order is not a verified universal rank; ads excluded by selector. No challenge bypass or login.";
          await page.screenshot({
            path: path.join(output, `${engine}-${query}.png`),
          });
        } catch (error) {
          result.availability = "unavailable";
          result.error = error.message;
        }
        report.cases.push(result);
        await context.close();
      }
    }
  } else {
    const paths = [
      "/",
      "/topics/ai-longevity/",
      "/topics/ai-longevity/2/",
      "/posts/bioai-daily-2026-11-01/",
      "/topics/ai-one-person-company/",
      "/topics/ai-account-business/",
    ];
    for (const width of [1365, 390]) {
      const context = await browser.newContext({
        viewport: { width, height: 960 },
        locale: report.locale,
        timezoneId: report.timezone,
        reducedMotion: "reduce",
        colorScheme: "light",
      });
      await context.route(
        /https:\/\/(sdk\.51\.la|v6-widget\.51\.la)\//,
        route =>
          route.fulfill({
            contentType: "application/javascript",
            body: "window.LA={init(){}};",
          })
      );
      const page = await context.newPage();
      page.setDefaultTimeout(25000);
      page.on("pageerror", error => report.errors.push(error.message));
      for (let i = 0; i < paths.length; i++) {
        const pathname = paths[i];
        const response = await page.goto(new URL(pathname, base).href, {
          waitUntil: "load",
          timeout: 45000,
        });
        assert.equal(response.status(), 200, pathname);
        if (width === 1365)
          await writeFile(
            path.join(output, `page-${i}.html`),
            await response.text()
          );
        const metrics = await page.evaluate(() => ({
          title: document.title,
          description: document.querySelector('meta[name="description"]')
            ?.content,
          canonical: document.querySelector('link[rel="canonical"]')?.href,
          robots: document.querySelector('meta[name="robots"]')?.content || "",
          h1: document.querySelectorAll("h1").length,
          guide: !!document.querySelector("#longevity-guide"),
          guideText:
            document.querySelector("#longevity-guide")?.textContent || "",
          articleText: document.querySelector("#article")?.textContent || "",
          mainText: document.querySelector("main")?.textContent || "",
          topicLink: !!document.querySelector(
            'main a[href="/topics/ai-longevity/"]'
          ),
          guideLayout: document.querySelector("#longevity-guide")
            ? {
                headingSize: parseFloat(
                  getComputedStyle(
                    document.querySelector("#longevity-guide h2")
                  ).fontSize
                ),
                paragraphSize: parseFloat(
                  getComputedStyle(document.querySelector("#longevity-guide p"))
                    .fontSize
                ),
                tableTabIndex: document.querySelector(
                  "#longevity-guide .table-scroll"
                )?.tabIndex,
                references: document.querySelectorAll(
                  "#longevity-references + ul a"
                ).length,
              }
            : null,
          schemas: [
            ...document.querySelectorAll('script[type="application/ld+json"]'),
          ].flatMap(el => JSON.parse(el.textContent)["@graph"] || []),
        }));
        assert.equal(metrics.h1, 1, pathname);
        assert.equal(
          metrics.canonical,
          new URL(pathname, "https://yuyu.aivora.cn").href
        );
        assert.doesNotMatch(metrics.robots, /noindex|nosnippet/i);
        if (expectGuide) {
          assert.equal(
            metrics.guide,
            pathname === "/topics/ai-longevity/",
            "guide is first-page-only"
          );
          if (["/", paths[3]].includes(pathname))
            assert.ok(metrics.topicLink, "visible hub backlink");
          if (metrics.guide) {
            assert.ok(metrics.guideText.includes("AI 能让人长生不老吗？"));
            assert.ok(metrics.guideText.includes("不是一个正式学科名称"));
            assert.ok(
              metrics.guideLayout.headingSize >
                metrics.guideLayout.paragraphSize
            );
            assert.equal(metrics.guideLayout.tableTabIndex, 0);
            assert.equal(metrics.guideLayout.references, 3);
          }
        }
        const articleHash = digest(metrics.articleText);
        const mainHash = digest(metrics.mainText);
        delete metrics.articleText;
        delete metrics.mainText;
        delete metrics.guideText;
        const timeOrigin = await page.evaluate(() => performance.timeOrigin);
        for (const theme of ["light", "dark"]) {
          if (
            (await page.locator("html").getAttribute("data-theme")) !== theme
          ) {
            if (!(await page.locator("#theme-btn").isVisible()))
              await page.locator("#menu-btn").click();
            await page.locator("#theme-btn").click();
            await page.waitForFunction(
              theme => document.documentElement.dataset.theme === theme,
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
          assert.equal(
            await page.evaluate(() => performance.timeOrigin),
            timeOrigin
          );
          const colors = await page.evaluate(collectThemeRecord);
          assertThemeRecord(colors, theme);
          report.cases.push({
            pathname,
            width,
            theme,
            ...metrics,
            articleHash,
            mainHash,
            noReload: true,
            overflow: colors.overflow,
          });
          if (i === 1)
            await page.screenshot({
              path: path.join(output, `hub-${width}-${theme}.png`),
            });
        }
      }
      if (width === 1365) {
        for (const file of [
          "robots.txt",
          "sitemap-index.xml",
          "sitemap-0.xml",
          "llms.txt",
        ]) {
          const response = await context.request.get(new URL(file, base).href);
          assert.equal(response.status(), 200, file);
          const text = await response.text();
          await writeFile(path.join(output, file), text);
          if (file === "sitemap-0.xml")
            assert.ok(text.includes("/topics/ai-longevity/"));
        }
      }
      await context.close();
    }
    if (expectGuide) {
      const context = await browser.newContext({ javaScriptEnabled: false });
      const page = await context.newPage();
      await page.goto(new URL("/topics/ai-longevity/", base).href);
      assert.ok(await page.locator("#longevity-guide").isVisible());
      assert.ok(
        await page
          .getByRole("heading", { name: "AI 能让人长生不老吗？" })
          .isVisible()
      );
      assert.equal(
        await page.locator("#longevity-references + ul a").count(),
        3
      );
      report.noJavascriptGuide = true;
      await context.close();
    }
    assert.deepEqual(report.errors, []);
  }
} catch (error) {
  report.failure = error.message;
  process.exitCode = 1;
} finally {
  await browser.close();
  await writeFile(
    path.join(output, "report.json"),
    JSON.stringify(report, null, 2)
  );
  process.stdout.write(
    `${JSON.stringify({ output, cases: report.cases.length, failure: report.failure, errors: report.errors })}\n`
  );
}
