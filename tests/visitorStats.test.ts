import assert from "node:assert/strict";
import test from "node:test";
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
