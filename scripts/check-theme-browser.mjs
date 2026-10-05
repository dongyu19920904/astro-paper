import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const palette = {
  light: {
    background: "rgb(251, 252, 254)",
    foreground: "rgb(17, 24, 39)",
    accent: "rgb(11, 92, 173)",
    emphasis: "rgb(180, 83, 9)",
    quote: "rgb(240, 246, 252)",
    secondary: "rgb(75, 85, 99)",
    life: "rgb(4, 120, 87)",
    tech: "rgb(14, 116, 144)",
  },
  dark: {
    background: "rgb(33, 39, 55)",
    foreground: "rgb(234, 237, 243)",
    accent: "rgb(255, 107, 1)",
    emphasis: "rgb(255, 107, 1)",
    quote: "rgb(42, 50, 68)",
    secondary: "rgb(192, 198, 210)",
    life: "rgb(110, 231, 183)",
    tech: "rgb(103, 232, 249)",
  },
};

// Executed inside the real page; no article text, cookies or stored data is read.
export function collectThemeRecord() {
  const root = document.documentElement;
  const selectors = {
    body: "body",
    article: "#article",
    paragraph: "#article p",
    h2: "#article h2",
    h3: "#article h3",
    strong: "#article strong",
    link: "#article a",
    quote: "#article blockquote",
    title: ".article-title",
  };
  const colors = Object.fromEntries(
    Object.entries(selectors).map(([name, selector]) => [
      name,
      [
        ...new Map(
          [...document.querySelectorAll(selector)].map(element => {
            const style = getComputedStyle(element);
            const row = {
              color: style.color,
              background: style.backgroundColor,
              inLink: !!element.closest("a"),
              headingLink: !!element.closest("a.heading-link"),
              referenceHeading: element.matches(
                'h2[id="参考资料"], h2[id="references"]'
              ),
            };
            return [JSON.stringify(row), row];
          })
        ).values(),
      ],
    ])
  );
  const button = document.querySelector("#theme-btn");
  const bounds = button?.getBoundingClientRect();
  const hit = bounds
    ? document.elementFromPoint(
        bounds.x + bounds.width / 2,
        bounds.y + bounds.height / 2
      )
    : null;
  return {
    url: location.href,
    canonical: document.querySelector('link[rel="canonical"]')?.href,
    timeOrigin: performance.timeOrigin,
    theme: root.getAttribute("data-theme"),
    series:
      document.querySelector(".article-layout")?.getAttribute("data-series") ??
      "neutral",
    buttonCount: document.querySelectorAll("#theme-btn").length,
    label: button?.getAttribute("aria-label"),
    hitButton: !!hit?.closest("#theme-btn"),
    lastClick: window.__themeCheckClick ?? null,
    colors,
    counts: Object.fromEntries(
      Object.entries(selectors).map(([name, selector]) => [
        name,
        document.querySelectorAll(selector).length,
      ])
    ),
    css: [...document.querySelectorAll('link[rel="stylesheet"]')].map(
      element => element.href
    ),
    viewport: { width: innerWidth, height: innerHeight },
    overflow: root.scrollWidth > innerWidth,
    environment: {
      userAgent: navigator.userAgent,
      forcedColors: matchMedia("(forced-colors: active)").matches,
      darkReaderMarker: !!document.querySelector(
        'meta[name="darkreader"], style.darkreader'
      ),
    },
  };
}

export function assertThemeRecord(record, expectedTheme, previous) {
  const expected = palette[expectedTheme];
  assert.ok(expected, "valid expected theme required");
  if (previous) {
    assert.equal(
      record.lastClick?.button,
      true,
      "browser input must reach the theme button"
    );
  }
  assert.equal(record.theme, expectedTheme, "root theme must switch once");
  assert.equal(record.buttonCount, 1, "exactly one theme button required");
  assert.equal(
    record.label,
    expectedTheme === "dark" ? "切换到日间" : "切换到夜间",
    "button must expose the next action"
  );
  if (previous) {
    assert.equal(record.url, previous.url, "theme click must not navigate");
    assert.equal(
      record.timeOrigin,
      previous.timeOrigin,
      "theme click must not reload the document"
    );
  }
  assert.ok(record.colors.body.length, "body must be present");
  assert.equal(record.colors.body[0].background, expected.background);
  assert.equal(record.colors.body[0].color, expected.foreground);
  assert.equal(record.overflow, false, "page must not overflow horizontally");
  if (/^\/posts\/[^/]+\/?$/.test(new URL(record.url).pathname)) {
    assert.equal(record.colors.article.length, 1, "article must be present");
    assert.ok(record.colors.paragraph.length, "article paragraphs required");
  }
  for (const [kind, rows] of Object.entries(record.colors)) {
    for (const [index, row] of rows.entries()) {
      const color =
        row.headingLink || row.referenceHeading
          ? expected.secondary
          : kind === "h2" && ["life", "tech"].includes(record.series)
            ? expected[record.series]
            : kind === "strong"
              ? row.inLink
                ? expected.accent
                : expected.emphasis
              : ["link", "h3"].includes(kind)
                ? expected.accent
                : expected.foreground;
      assert.equal(row.color, color, `${kind}[${index}] actual color`);
      if (kind === "quote") {
        assert.equal(row.background, expected.quote, "quote actual background");
      }
    }
  }
}

async function main() {
  const options = new Map();
  for (let index = 2; index < process.argv.length; index += 1) {
    const key = process.argv[index];
    if (["--negative-control", "--journeys-only"].includes(key))
      options.set(key, true);
    else if (["--base", "--output", "--paths", "--input"].includes(key)) {
      assert.ok(process.argv[index + 1], `missing value for ${key}`);
      options.set(key, process.argv[++index]);
    } else throw new Error(`Unknown option: ${key}`);
  }
  const base = new URL(options.get("--base") ?? "https://yuyu.aivora.cn/");
  assert.ok(["http:", "https:"].includes(base.protocol));
  assert.ok(!base.username && !base.password, "no credentials in target URL");
  const negative = options.has("--negative-control");
  const input = options.get("--input") ?? "mouse";
  assert.ok(
    ["mouse", "keyboard"].includes(input),
    "valid browser input required"
  );
  assert.ok(
    !negative || ["127.0.0.1", "localhost"].includes(base.hostname),
    "negative control is allowed only on an isolated local preview"
  );
  const paths = options.has("--journeys-only")
    ? ["/"]
    : (
        options.get("--paths") ??
        "/,/posts/ai-daily-2026-10-03/,/posts/bioai-daily-2026-10-03/,/posts/bioai-daily-2026-10-02/,/posts/bioai-daily-2026-09-30/,/posts/ai-daily-2026-09-28/,/posts/bioai-daily-2026-09-12/,/posts/,/topics/,/search/,/about/"
      ).split(",");
  const urls = paths.map(value => {
    const url = new URL(value, base);
    assert.equal(url.origin, base.origin, "checks stay on the target site");
    return url.href;
  });
  const sdkRoot =
    process.env.NEO_MCP_SDK_PATH ??
    "D:/CodexTools/Browsers/camofox-browser/node_modules/@modelcontextprotocol/sdk/dist/esm";
  const launcher =
    process.env.NEO_MCP_LAUNCHER ??
    "D:/CodexTools/Browsers/codex-browseros-neo.mjs";
  const { Client } = await import(
    pathToFileURL(path.join(sdkRoot, "client/index.js"))
  );
  const { StdioClientTransport } = await import(
    pathToFileURL(path.join(sdkRoot, "client/stdio.js"))
  );
  const client = new Client({
    name: "Blog theme regression",
    version: "1.0.0",
  });
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [launcher, "--mcp"],
    stderr: "pipe",
  });
  const report = {
    base: base.href,
    input,
    cases: [],
    journeys: [],
    errors: [],
  };
  let session;
  let page;
  let negativeDetected = false;
  async function call(name, args) {
    const result = await client.callTool(
      { name, arguments: { ...args, ...(session ? { session } : {}) } },
      undefined,
      { timeout: 35000 }
    );
    session = result._meta?.["com.browseros.neo/session"] ?? session;
    assert.ok(
      !result.isError,
      `${name} tool failed: ${result.content
        ?.filter(block => block.type === "text")
        .map(block => block.text)
        .join("\n")}`
    );
    return result;
  }
  async function run(code) {
    const result = await call("run", { code, timeout: 30000 });
    assert.ok(result.structuredContent?.ok, "browser operation failed");
    return result.structuredContent.value;
  }
  async function evaluate(code) {
    const result = await run(
      `return await browser.evaluate(${page},{code:${JSON.stringify(code)}});`
    );
    assert.ok(
      result && "value" in result,
      `Page evaluation failed: ${JSON.stringify(result)}`
    );
    return result.value;
  }
  async function capture() {
    const source = collectThemeRecord.toString();
    return evaluate(
      source.slice(source.indexOf("{") + 1, source.lastIndexOf("}"))
    );
  }
  async function navigate(url) {
    await run(
      `await browser.cdpJsonForPage(${page},'Page.navigate',${JSON.stringify(JSON.stringify({ url }))});await browser.wait(${page},{for:'selector',value:"#theme-btn[aria-label^='切换到']"});return true;`
    );
  }
  async function clickTheme() {
    return run(`const s=await browser.observe(${page}).snapshot();
      const ref=s.refs.find(r=>r.role==='button'&&r.name.startsWith('切换到'));
      if(!ref)throw new Error('Theme button unavailable');
      await browser.evaluate(${page},{code:"window.__themeCheckClick=null;document.addEventListener('click',e=>{window.__themeCheckClick={button:!!e.target.closest('#theme-btn'),target:e.target.tagName,x:e.clientX,y:e.clientY,trusted:e.isTrusted};},{capture:true,once:true});return true;"});
      ${input === "mouse" ? `await browser.input(${page}).click(ref.ref);` : `await browser.evaluate(${page},{code:"document.querySelector('#theme-btn').focus();return true;"});await browser.input(${page}).press('Enter');`}
      return true;`);
  }
  try {
    await client.connect(transport);
    await call("name_session", {
      name: "blog theme regression",
      category: "testing-and-qa",
      summary: "Check theme clicks and real text colors without page reloads.",
    });
    page = await run(
      `return await browser.pages.newPage(${JSON.stringify(urls[0])});`
    );
    assert.ok(Number.isInteger(page), "task page identity required");
    for (const url of urls) {
      const entry = { url, records: [], status: "pending" };
      report.cases.push(entry);
      if (url !== urls[0]) {
        await run(`await browser.pages.close(${page});return true;`);
        page = undefined;
        page = await run(
          `return await browser.pages.newPage(${JSON.stringify(url)});`
        );
        assert.ok(Number.isInteger(page), "task page identity required");
      }
      await run(
        `await browser.wait(${page},{for:'selector',value:'#theme-btn'});return true;`
      );
      const screenshot = await call("screenshot", { page, format: "png" });
      const image = screenshot.content?.find(block => block.type === "image");
      if (image && options.has("--output")) {
        const file = `${options.get("--output")}.${report.cases.length}.png`;
        await writeFile(file, Buffer.from(image.data, "base64"));
        entry.screenshot = file;
      }
      const viewport = await evaluate("return {width:innerWidth};");
      if (viewport.width < 640) {
        await run(
          `const s=await browser.observe(${page}).snapshot();const m=s.refs.find(r=>r.role==='button'&&r.name==='展开导航');if(m)await browser.input(${page}).click(m.ref);return true;`
        );
      }
      let before = await capture();
      assert.equal(
        new URL(before.url).pathname.replace(/\/$/, ""),
        new URL(url).pathname.replace(/\/$/, ""),
        "requested document must finish navigation"
      );
      assertThemeRecord(before, before.theme);
      assert.equal(before.hitButton, true, "theme button must be reachable");
      entry.records.push(before);
      if (negative && !negativeDetected && before.colors.article.length) {
        await evaluate(
          `const s=document.createElement('style');s.id='theme-check-negative';s.textContent=${JSON.stringify(`#article p { color: ${palette[before.theme].foreground} !important; }`)};document.head.append(s);return true;`
        );
        try {
          await clickTheme();
          const bad = await capture();
          assertThemeRecord(
            bad,
            before.theme === "light" ? "dark" : "light",
            before
          );
          throw new Error("Negative control was not detected");
        } catch (error) {
          assert.match(error.message, /paragraph\[\d+\] actual color/);
          negativeDetected = true;
          entry.negativeControl = "fixed paragraph color correctly rejected";
        } finally {
          await evaluate(
            "document.querySelector('#theme-check-negative')?.remove();return true;"
          );
        }
        before = await capture();
        assertThemeRecord(before, before.theme);
      }
      const repeats = /ai-daily-2026-10-03/.test(url) ? 5 : 2;
      for (let index = 0; index < repeats; index += 1) {
        await clickTheme();
        const after = await capture();
        entry.records.push(after);
        assertThemeRecord(
          after,
          before.theme === "light" ? "dark" : "light",
          before
        );
        before = after;
      }
      entry.status = "passed";
      process.stdout.write(
        `${JSON.stringify({ url, viewport: before.viewport, clicks: repeats, status: "passed" })}\n`
      );
    }
    if (options.has("--journeys-only")) {
      for (const journey of [
        { from: "/", target: "/posts/bioai-daily-2026-10-03/" },
        { from: "/posts/", target: "/posts/bioai-daily-2026-10-02/" },
      ]) {
        const entry = { ...journey, status: "pending", records: [] };
        report.journeys.push(entry);
        await navigate(new URL(journey.from, base).href);
        const label = await evaluate(
          `const a=[...document.querySelectorAll('a[href]')].find(a=>new URL(a.href).pathname.split('/').filter(Boolean).join('/')===${JSON.stringify(journey.target.split("/").filter(Boolean).join("/"))});return a?.innerText.trim();`
        );
        assert.ok(label, "article entry link required");
        await run(
          `const s=await browser.observe(${page}).snapshot();const ref=s.refs.find(r=>r.role==='link'&&r.name===${JSON.stringify(label)});if(!ref)throw new Error('Article link reference missing');await browser.input(${page}).click(ref.ref);await browser.wait(${page},{for:'selector',value:'#article'});return true;`
        );
        let before = await capture();
        assert.equal(
          new URL(before.url).pathname.replace(/\/$/, ""),
          journey.target.replace(/\/$/, "")
        );
        assertThemeRecord(before, before.theme);
        entry.records.push(before);
        for (let index = 0; index < 2; index += 1) {
          await clickTheme();
          const after = await capture();
          entry.records.push(after);
          assertThemeRecord(
            after,
            before.theme === "light" ? "dark" : "light",
            before
          );
          before = after;
        }
        entry.status = "passed";
        process.stdout.write(
          `${JSON.stringify({ journey, input, status: "passed" })}\n`
        );
      }
    }
    if (negative)
      assert.ok(negativeDetected, "negative control needs an article");
  } catch (error) {
    const pending = [...report.cases, ...report.journeys].find(
      entry => entry.status === "pending"
    );
    if (pending) pending.status = "failed";
    report.errors.push(error.message);
    process.exitCode = 1;
  } finally {
    if (Number.isInteger(page)) {
      try {
        await run(`await browser.pages.close(${page});return true;`);
      } catch (error) {
        report.errors.push(`Task page cleanup failed: ${error.message}`);
        process.exitCode = 1;
      }
    }
    await client.close();
    if (options.has("--output")) {
      await writeFile(options.get("--output"), JSON.stringify(report, null, 2));
    }
    process.stdout.write(
      `${JSON.stringify({
        cases: report.cases.length,
        negativeDetected,
        errors: report.errors,
      })}\n`
    );
  }
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  main().catch(error => {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  });
}
