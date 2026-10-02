import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import {
  buildVisitorWidgetUrl,
  formatVisitorMetric,
} from "../src/utils/visitorStats.ts";

test("statistics preserves zero and never fabricates missing counts", () => {
  assert.equal(formatVisitorMetric(0), "0");
  assert.equal(formatVisitorMetric(1234), "1,234");
  for (const value of [undefined, null, -1, NaN, Infinity, "300", 1.5]) {
    assert.equal(formatVisitorMetric(value), "--");
  }
});

test("footer directly renders only the configured 51LA widget", () => {
  const footer = readFileSync(
    new URL("../src/components/VisitorStats.astro", import.meta.url),
    "utf8"
  );
  const layout = readFileSync(
    new URL("../src/layouts/Layout.astro", import.meta.url),
    "utf8"
  );
  assert.match(footer, /id="LA-DATA-WIDGET"/);
  assert.match(footer, /src=\{SITE\.analytics\.la51WidgetUrl\}/);
  assert.match(footer, /crossorigin="anonymous"/);
  assert.match(footer, /charset="UTF-8"/);
  assert.match(footer, /data-astro-rerun/);
  assert.doesNotMatch(footer, /<details|<summary|<iframe|fetch\(|localStorage|\/visitorStats|data-total-pageviews/);
  assert.match(layout, /id="LA_COLLECT"/);
  assert.match(layout, /autoTrack:true/);
});

test("widget URL is restricted to the public 51LA endpoint", () => {
  assert.equal(buildVisitorWidgetUrl(""), "");
  assert.equal(
    buildVisitorWidgetUrl(
      "https://v6-widget.51.la/v6/3RNfNDP1ET9rlhHi/quote.js?f=12"
    ),
    "https://v6-widget.51.la/v6/3RNfNDP1ET9rlhHi/quote.js?theme=0&f=14&col=true"
  );
  for (const url of [
    "https://example.com/quote.js",
    "javascript:alert(1)",
    "http://v6-widget.51.la/v6/site/quote.js",
    "https://user:password@v6-widget.51.la/v6/site/quote.js",
  ]) {
    assert.throws(() => buildVisitorWidgetUrl(url));
  }
});
