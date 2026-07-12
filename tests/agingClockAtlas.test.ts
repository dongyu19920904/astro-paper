import assert from "node:assert/strict";
import test from "node:test";

import {
  AGING_CLOCK_PROJECTS,
  validateAgingClockProjects,
} from "../src/data/agingClockProjects.ts";
import {
  MAX_COMPARISON_PROJECTS,
  PROJECT_PLAN_RESULT_LABELS,
  atlasFiltersToSearchParams,
  createFallbackProjectPlan,
  filterAndSortProjects,
  parseAtlasFilters,
  parseProjectPlanApiResponse,
  updateComparisonSelection,
  validateProjectPlan,
  validateProjectPlanRequest,
} from "../src/utils/agingClockAtlas.ts";

test("the curated project data passes the build-time schema", () => {
  assert.equal(validateAgingClockProjects(AGING_CLOCK_PROJECTS), AGING_CLOCK_PROJECTS);
  assert.equal(AGING_CLOCK_PROJECTS.length, 4);
  assert.deepEqual(
    new Set(AGING_CLOCK_PROJECTS.map(project => project.category)),
    new Set(["表观遗传年龄时钟", "脑龄模型", "古 DNA 年龄时钟", "数字生物标志物"])
  );
  assert.ok(
    AGING_CLOCK_PROJECTS.every(
      project =>
        project.lastVerifiedAt === "2026-07-11" &&
        project.sourceDaily.length > 0 &&
        project.repositoryUrl.startsWith("https://github.com/")
    )
  );
});

test("filters apply all required dimensions and round-trip through a URL", () => {
  const filters = parseAtlasFilters(
    new URLSearchParams({
      category: "表观遗传年龄时钟",
      input: "DNA 甲基化 beta 值",
      difficulty: "中",
      offline: "yes",
      license: "部分明确",
      remix: "衰老时钟术语地图",
      sort: "name-asc",
    }),
    AGING_CLOCK_PROJECTS
  );

  const results = filterAndSortProjects(AGING_CLOCK_PROJECTS, filters);
  assert.deepEqual(results.map(project => project.id), ["epiage-skill"]);
  assert.equal(
    parseAtlasFilters(atlasFiltersToSearchParams(filters), AGING_CLOCK_PROJECTS).category,
    "表观遗传年龄时钟"
  );
});

test("unknown URL filters are discarded", () => {
  const filters = parseAtlasFilters("?category=unknown&offline=maybe&sort=nope", AGING_CLOCK_PROJECTS);
  assert.equal(filters.category, "all");
  assert.equal(filters.offline, "all");
  assert.equal(filters.sort, "featured");
});

test("comparison selection never exceeds four projects", () => {
  let ids: string[] = [];
  for (const project of AGING_CLOCK_PROJECTS) {
    ids = updateComparisonSelection(ids, project.id, true).ids;
  }
  assert.equal(ids.length, MAX_COMPARISON_PROJECTS);

  const fifth = updateComparisonSelection(ids, "not-in-atlas", true);
  assert.equal(fifth.limitReached, true);
  assert.deepEqual(fifth.ids, ids);

  const removed = updateComparisonSelection(ids, ids[0], false);
  assert.equal(removed.ids.length, 3);
});

const validRequest = {
  projectId: "epiage-skill",
  role: "indie-developer",
  direction: "education",
  timeBudget: "seven-days",
  experience: "intermediate",
  deployment: "static-site",
  goal: "做一个不处理个人数据的衰老时钟教育页",
};

test("AI request validation accepts enums and rejects oversized free text", () => {
  const accepted = validateProjectPlanRequest(
    validRequest,
    AGING_CLOCK_PROJECTS.map(project => project.id)
  );
  assert.equal(accepted.ok, true);

  const rejected = validateProjectPlanRequest(
    { ...validRequest, goal: "x".repeat(241) },
    AGING_CLOCK_PROJECTS.map(project => project.id)
  );
  assert.equal(rejected.ok, false);
  if (!rejected.ok) assert.equal(rejected.field, "goal");
});

test("the deterministic fallback and API response both satisfy the plan schema", () => {
  const request = validateProjectPlanRequest(
    validRequest,
    AGING_CLOCK_PROJECTS.map(project => project.id)
  );
  assert.equal(request.ok, true);
  if (!request.ok) return;

  const fallback = createFallbackProjectPlan(request.value, AGING_CLOCK_PROJECTS[0]);
  assert.equal(validateProjectPlan(fallback).ok, true);
  const parsed = parseProjectPlanApiResponse({
    resultSource: "server-fallback",
    message: "no provider",
    plan: fallback,
  });
  assert.equal(parsed.ok, true);
  if (parsed.ok) assert.equal(parsed.resultSource, "server-fallback");

  for (const resultSource of ["model", "backup-model"] as const) {
    const modelResult = parseProjectPlanApiResponse({ resultSource, plan: fallback });
    assert.equal(modelResult.ok, true);
    if (modelResult.ok) assert.equal(modelResult.resultSource, resultSource);
  }

  assert.equal(PROJECT_PLAN_RESULT_LABELS.model, "AI 实时生成");
  assert.equal(
    PROJECT_PLAN_RESULT_LABELS["client-fallback"],
    "本地模板结果"
  );

  assert.equal(
    parseProjectPlanApiResponse({ plan: { title: "incomplete" } }).ok,
    false
  );
  assert.equal(
    parseProjectPlanApiResponse({ resultSource: "ai", plan: fallback }).ok,
    false
  );
});
