import test from "node:test";
import assert from "node:assert/strict";
import { buildPublicationStatus } from "../src/utils/publicationStatus.ts";

test("publication snapshot ignores withdrawn and future posts and separates both series", () => {
  const posts = [
    { id: "ai-daily-2026-10-20", data: { pubDatetime: new Date("2026-10-20"), tags: ["ai-daily"] } },
    { id: "ai-daily-2026-10-21", data: { pubDatetime: new Date("2026-10-21"), tags: ["ai-daily"] } },
    { id: "bioai-daily-2026-10-19", data: { pubDatetime: new Date("2026-10-19"), tags: ["bioai-daily"] } },
    { id: "bioai-daily-2026-10-20", data: { pubDatetime: new Date("2026-10-20"), draft: true, tags: ["bioai-daily"] } },
    { id: "ai-daily-2026-10-25", data: { pubDatetime: new Date("2026-10-25"), tags: ["ai-daily"] } },
  ];
  assert.deepEqual(buildPublicationStatus(posts, new Date("2026-10-22")).latest, {
    "ai-daily": "2026-10-21", "bioai-daily": "2026-10-19",
  });
});
