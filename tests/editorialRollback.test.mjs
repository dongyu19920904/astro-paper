import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";

test("October 2–4 posts are withdrawn without destroying sources", () => {
  for (const date of ["2026-10-02", "2026-10-03", "2026-10-04"]) {
    for (const type of ["ai-daily", "bioai-daily"]) {
      const text = readFileSync(
        new URL(`../src/data/blog/${type}-${date}.md`, import.meta.url),
        "utf8"
      );
      assert.match(text, /\ndraft: true\r?\n/);
      assert.ok(text.length > 500);
    }
  }
});

test("pre-October prose is restored except explicit factual corrections", () => {
  const fixture = JSON.parse(
    readFileSync(
      new URL("./fixtures/editorialRollback.json", import.meta.url),
      "utf8"
    )
  );
  assert.equal(fixture.baseline, "867fd88");
  assert.equal(fixture.records.length, 30);
  for (const { file, bodySha256 } of fixture.records) {
    const body = value =>
      value
        .replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "")
        .replace(/\r\n/g, "\n")
        .trim();
    const current = body(
      readFileSync(new URL(`../${file}`, import.meta.url), "utf8")
    );
    assert.equal(
      createHash("sha256").update(current).digest("hex"),
      bodySha256,
      file
    );
  }
});

test("public author materials no longer contain finance or private source identifiers", () => {
  const raw = readFileSync(
    new URL("../src/data/authorKnowledge.json", import.meta.url),
    "utf8"
  );
  const knowledge = JSON.parse(raw);
  assert.deepEqual(knowledge.publicFinancialStatements, []);
  assert.equal(knowledge.editorialPolicy.maxRelatedRecords, 3);
  assert.doesNotMatch(
    raw,
    /约3千元|约5万元|SN-\d+|threadId|noteId|sk-[\w-]{12,}/
  );
  const now = readFileSync(
    new URL("../src/pages/now/index.astro", import.meta.url),
    "utf8"
  );
  assert.doesNotMatch(now, /business-records|publicFinancialStatements\.map/);
  const layout = readFileSync(
    new URL("../src/layouts/Layout.astro", import.meta.url),
    "utf8"
  );
  assert.match(layout, /darkreader-lock/);
});
