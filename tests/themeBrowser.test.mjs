import assert from "node:assert/strict";
import test from "node:test";
import { assertThemeRecord } from "../scripts/check-theme-browser.mjs";

// These test the validator, not browser behavior; the CLI reads actual CSS.
function record(theme = "dark") {
  const light = theme === "light";
  const foreground = light ? "rgb(17, 24, 39)" : "rgb(234, 237, 243)";
  const accent = light ? "rgb(11, 92, 173)" : "rgb(255, 107, 1)";
  const row = color => ({
    color,
    background: "rgba(0, 0, 0, 0)",
    inLink: false,
  });
  return {
    url: "https://yuyu.aivora.cn/posts/ai-daily-2026-10-03/",
    timeOrigin: 1000,
    theme,
    buttonCount: 1,
    label: light ? "切换到夜间" : "切换到日间",
    overflow: false,
    lastClick: { button: true },
    colors: {
      body: [
        {
          ...row(foreground),
          background: light ? "rgb(251, 252, 254)" : "rgb(33, 39, 55)",
        },
      ],
      article: [row(foreground)],
      paragraph: [row(foreground)],
      h2: [row(foreground)],
      h3: [row(accent)],
      strong: [
        row(light ? "rgb(180, 83, 9)" : accent),
        { ...row(accent), inLink: true },
      ],
      link: [row(accent)],
      title: [row(foreground)],
      quote: [
        {
          ...row(foreground),
          background: light ? "rgb(240, 246, 252)" : "rgb(42, 50, 68)",
        },
      ],
    },
  };
}

test("validator accepts actual-color records for both existing palettes", () => {
  assert.doesNotThrow(() =>
    assertThemeRecord(record(), "dark", record("light"))
  );
  assert.doesNotThrow(() =>
    assertThemeRecord(record("light"), "light", record())
  );
});

test("validator checks semantic headings, quieter references and heading links", () => {
  const value = record();
  value.series = "life";
  value.colors.h2 = [
    { ...value.colors.h2[0], color: "rgb(110, 231, 183)" },
    {
      ...value.colors.h2[0],
      color: "rgb(192, 198, 210)",
      referenceHeading: true,
    },
  ];
  value.colors.link.push({
    ...value.colors.link[0],
    color: "rgb(192, 198, 210)",
    headingLink: true,
  });
  assert.doesNotThrow(() => assertThemeRecord(value, "dark"));
  value.colors.h2[0].color = "rgb(4, 120, 87)";
  assert.throws(() => assertThemeRecord(value, "dark"), /h2\[0\] actual color/);
});

test("validator rejects changed root with unchanged paragraph colors", () => {
  const after = record();
  after.colors.paragraph[0].color = "rgb(17, 24, 39)";
  assert.throws(
    () => assertThemeRecord(after, "dark"),
    /paragraph\[0\] actual color/
  );
});

test("validator rejects a reload disguised as a successful switch", () => {
  const after = record();
  after.timeOrigin = 2000;
  assert.throws(
    () => assertThemeRecord(after, "dark", record("light")),
    /must not reload/
  );
});

test("validator rejects double toggles, duplicate controls and empty articles", () => {
  assert.throws(
    () => assertThemeRecord(record("light"), "dark"),
    /must switch once/
  );
  const duplicate = record();
  duplicate.buttonCount = 2;
  assert.throws(() => assertThemeRecord(duplicate, "dark"), /one theme button/);
  const empty = record();
  empty.colors.paragraph = [];
  assert.throws(() => assertThemeRecord(empty, "dark"), /paragraphs required/);
});

test("validator distinguishes missed browser input from a website failure", () => {
  const after = record();
  after.lastClick = { button: false, target: "HTML" };
  assert.throws(
    () => assertThemeRecord(after, "dark", record("light")),
    /must reach the theme button/
  );
});
