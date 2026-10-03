import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createContext, runInContext } from "node:vm";
import test from "node:test";
import ts from "typescript";

const layout = readFileSync(
  new URL("../src/layouts/Layout.astro", import.meta.url),
  "utf8"
);
const inline = layout.match(/<script is:inline>\s*([\s\S]*?)<\/script>/)?.[1];
assert.ok(inline, "the actual early theme bootstrap must be tested");
const script = ts.transpileModule(
  readFileSync(new URL("../src/scripts/theme.ts", import.meta.url), "utf8"),
  {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.None,
    },
  }
).outputText;

function harness({
  stored = "dark",
  readBlocked = false,
  writeBlocked = false,
} = {}) {
  const storage = new Map(stored ? [["theme", stored]] : []);
  const root = {
    attrs: new Map(),
    setAttribute(name, value) {
      this.attrs.set(name, value);
    },
  };
  const makeButton = () => ({
    attrs: new Map(),
    handlers: [],
    setAttribute(name, value) {
      this.attrs.set(name, value);
    },
    addEventListener(name, handler) {
      if (name === "click") this.handlers.push(handler);
    },
  });
  let button = makeButton();
  const events = new Map();
  let mediaChange;
  const media = {
    matches: true,
    addEventListener(name, handler) {
      if (name === "change") mediaChange = handler;
    },
  };
  const meta = {
    attrs: new Map(),
    setAttribute(name, value) {
      this.attrs.set(name, value);
    },
    getAttribute(name) {
      return this.attrs.get(name);
    },
  };
  const document = {
    firstElementChild: root,
    documentElement: root,
    body: {},
    querySelector(selector) {
      return selector === "#theme-btn" ? button : meta;
    },
    addEventListener(name, handler) {
      events.set(name, handler);
    },
  };
  const window = {
    matchMedia: () => media,
    getComputedStyle: () => ({
      backgroundColor:
        root.attrs.get("data-theme") === "light"
          ? "rgb(251, 252, 254)"
          : "rgb(33, 39, 55)",
    }),
  };
  const context = createContext({
    window,
    document,
    localStorage: {
      getItem(key) {
        if (readBlocked) throw new Error("storage read blocked");
        return storage.get(key) ?? null;
      },
      setItem(key, value) {
        if (writeBlocked) throw new Error("storage write blocked");
        storage.set(key, value);
      },
    },
    WeakSet,
  });
  return {
    boot() {
      runInContext(inline, context);
      runInContext(script, context);
    },
    click() {
      for (const handler of button.handlers) handler();
    },
    swap() {
      button = makeButton();
      runInContext(inline, context);
      events.get("astro:after-swap")?.();
    },
    bindAgain() {
      events.get("astro:after-swap")?.();
    },
    systemChange(matches) {
      media.matches = matches;
      mediaChange?.({ matches });
    },
    theme: () => root.attrs.get("data-theme"),
    label: () => button.attrs.get("aria-label"),
    stored: () => storage.get("theme"),
    meta: () => meta.attrs.get("content"),
  };
}

test("click updates theme, button and browser color immediately without reload", () => {
  const page = harness();
  page.boot();
  page.click();
  assert.equal(page.theme(), "light");
  assert.equal(page.label(), "切换到夜间");
  page.swap();
  assert.equal(
    page.theme(),
    "light",
    "navigation must retain the in-memory choice"
  );
  assert.equal(page.meta(), "rgb(251, 252, 254)");
  assert.equal(page.stored(), "light");
  page.click();
  assert.equal(page.theme(), "dark");
});

test("storage write failure cannot interrupt the visible theme switch", () => {
  const page = harness({ writeBlocked: true });
  page.boot();
  assert.doesNotThrow(() => page.click());
  assert.equal(page.theme(), "light");
  assert.equal(page.label(), "切换到夜间");
  page.swap();
  assert.equal(page.theme(), "light");
  page.click();
  assert.equal(page.theme(), "dark");
});

test("storage read failure still initializes and switches a usable theme", () => {
  const page = harness({ readBlocked: true, writeBlocked: true });
  assert.doesNotThrow(() => page.boot());
  assert.equal(page.theme(), "dark");
  page.click();
  assert.equal(page.theme(), "light");
});

test("repeated navigation setup binds each button only once", () => {
  const page = harness();
  page.boot();
  page.bindAgain();
  page.click();
  assert.equal(page.theme(), "light");
  page.swap();
  page.bindAgain();
  page.click();
  assert.equal(page.theme(), "dark");
});

test("manual preference survives a system theme change, navigation and refresh", () => {
  const page = harness();
  page.boot();
  page.click();
  page.systemChange(true);
  assert.equal(page.theme(), "light");
  assert.equal(page.stored(), "light");
  page.swap();
  assert.equal(page.theme(), "light");
  const refreshed = harness({ stored: page.stored() });
  refreshed.boot();
  assert.equal(refreshed.theme(), "light");
});

test("without a manual preference the theme follows the system", () => {
  const page = harness({ stored: null });
  page.boot();
  page.systemChange(false);
  assert.equal(page.theme(), "light");
  page.systemChange(true);
  assert.equal(page.theme(), "dark");
});

test("invalid saved preferences fall back to a valid system theme", () => {
  const page = harness({ stored: "undefined" });
  page.boot();
  assert.equal(page.theme(), "dark");
  page.click();
  assert.equal(page.theme(), "light");
});
