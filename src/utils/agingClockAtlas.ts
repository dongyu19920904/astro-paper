import {
  AGING_CLOCK_CATEGORIES,
  AGING_CLOCK_DIFFICULTIES,
  AGING_CLOCK_LICENSE_STATUSES,
  type AgingClockProject,
} from "../data/agingClockProjects.ts";

export const FILTER_ALL = "all" as const;
export const MIN_COMPARISON_PROJECTS = 2;
export const MAX_COMPARISON_PROJECTS = 4;
export const PROJECT_PLAN_GOAL_MAX_LENGTH = 240;

export const ATLAS_SORTS = [
  "featured",
  "name-asc",
  "difficulty-asc",
  "verified-desc",
] as const;
export type AtlasSort = (typeof ATLAS_SORTS)[number];

export interface AtlasFilterState {
  category: string;
  input: string;
  difficulty: string;
  offline: "all" | "yes" | "no";
  license: string;
  remix: string;
  sort: AtlasSort;
}

export const DEFAULT_ATLAS_FILTERS: AtlasFilterState = {
  category: FILTER_ALL,
  input: FILTER_ALL,
  difficulty: FILTER_ALL,
  offline: FILTER_ALL,
  license: FILTER_ALL,
  remix: FILTER_ALL,
  sort: "featured",
};

function uniqueValues(
  projects: AgingClockProject[],
  field: "inputTypes" | "remixIdeas"
) {
  return new Set(projects.flatMap(project => project[field]));
}

function supportedOrAll(value: string | null, supported: Set<string>) {
  return value && supported.has(value) ? value : FILTER_ALL;
}

export function parseAtlasFilters(
  input: string | URLSearchParams,
  projects: AgingClockProject[]
): AtlasFilterState {
  const params =
    typeof input === "string"
      ? new URLSearchParams(input.startsWith("?") ? input.slice(1) : input)
      : input;

  return {
    category: supportedOrAll(
      params.get("category"),
      new Set(AGING_CLOCK_CATEGORIES)
    ),
    input: supportedOrAll(
      params.get("input"),
      uniqueValues(projects, "inputTypes")
    ),
    difficulty: supportedOrAll(
      params.get("difficulty"),
      new Set(AGING_CLOCK_DIFFICULTIES)
    ),
    offline: (["yes", "no"] as const).includes(
      params.get("offline") as "yes" | "no"
    )
      ? (params.get("offline") as "yes" | "no")
      : FILTER_ALL,
    license: supportedOrAll(
      params.get("license"),
      new Set(AGING_CLOCK_LICENSE_STATUSES)
    ),
    remix: supportedOrAll(
      params.get("remix"),
      uniqueValues(projects, "remixIdeas")
    ),
    sort: ATLAS_SORTS.includes(params.get("sort") as AtlasSort)
      ? (params.get("sort") as AtlasSort)
      : "featured",
  };
}

export function atlasFiltersToSearchParams(filters: AtlasFilterState) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    const defaultValue = DEFAULT_ATLAS_FILTERS[key as keyof AtlasFilterState];
    if (value !== defaultValue) params.set(key, value);
  }
  return params;
}

export function filterAndSortProjects(
  projects: AgingClockProject[],
  filters: AtlasFilterState
) {
  const filtered = projects.filter(project => {
    if (
      filters.category !== FILTER_ALL &&
      project.category !== filters.category
    ) {
      return false;
    }
    if (
      filters.input !== FILTER_ALL &&
      !project.inputTypes.includes(filters.input)
    ) {
      return false;
    }
    if (
      filters.difficulty !== FILTER_ALL &&
      project.difficulty !== filters.difficulty
    ) {
      return false;
    }
    if (filters.offline === "yes" && !project.offline) return false;
    if (filters.offline === "no" && project.offline) return false;
    if (
      filters.license !== FILTER_ALL &&
      project.licenseStatus !== filters.license
    ) {
      return false;
    }
    if (
      filters.remix !== FILTER_ALL &&
      !project.remixIdeas.includes(filters.remix)
    ) {
      return false;
    }
    return true;
  });

  const difficultyOrder = new Map(
    AGING_CLOCK_DIFFICULTIES.map((difficulty, index) => [difficulty, index])
  );

  return [...filtered].sort((left, right) => {
    if (filters.sort === "name-asc") {
      return left.name.localeCompare(right.name, "zh-CN");
    }
    if (filters.sort === "difficulty-asc") {
      return (
        (difficultyOrder.get(left.difficulty) ?? 99) -
          (difficultyOrder.get(right.difficulty) ?? 99) ||
        left.name.localeCompare(right.name, "zh-CN")
      );
    }
    if (filters.sort === "verified-desc") {
      return (
        right.lastVerifiedAt.localeCompare(left.lastVerifiedAt) ||
        left.name.localeCompare(right.name, "zh-CN")
      );
    }
    return projects.indexOf(left) - projects.indexOf(right);
  });
}

export function updateComparisonSelection(
  currentIds: string[],
  projectId: string,
  selected: boolean,
  maximum = MAX_COMPARISON_PROJECTS
) {
  const ids = [...new Set(currentIds)];
  if (!selected) {
    return { ids: ids.filter(id => id !== projectId), limitReached: false };
  }
  if (ids.includes(projectId)) return { ids, limitReached: false };
  if (ids.length >= maximum) return { ids, limitReached: true };
  return { ids: [...ids, projectId], limitReached: false };
}

export const PROJECT_PLAN_ROLES = [
  "learner",
  "indie-developer",
  "content-creator",
  "research-team",
] as const;
export const PROJECT_PLAN_DIRECTIONS = [
  "directory",
  "education",
  "interactive-demo",
  "report-tool",
  "content-product",
] as const;
export const PROJECT_PLAN_TIME_BUDGETS = [
  "two-hours",
  "one-day",
  "three-days",
  "seven-days",
] as const;
export const PROJECT_PLAN_EXPERIENCE = [
  "beginner",
  "intermediate",
  "advanced",
] as const;
export const PROJECT_PLAN_DEPLOYMENTS = [
  "static-site",
  "cloudflare",
  "no-deploy",
] as const;

export type ProjectPlanRole = (typeof PROJECT_PLAN_ROLES)[number];
export type ProjectPlanDirection = (typeof PROJECT_PLAN_DIRECTIONS)[number];
export type ProjectPlanTimeBudget = (typeof PROJECT_PLAN_TIME_BUDGETS)[number];
export type ProjectPlanExperience = (typeof PROJECT_PLAN_EXPERIENCE)[number];
export type ProjectPlanDeployment = (typeof PROJECT_PLAN_DEPLOYMENTS)[number];

export const PROJECT_PLAN_ROLE_LABELS: Record<ProjectPlanRole, string> = {
  learner: "学习者",
  "indie-developer": "独立开发者",
  "content-creator": "内容创作者",
  "research-team": "小型研究团队",
};
export const PROJECT_PLAN_DIRECTION_LABELS: Record<
  ProjectPlanDirection,
  string
> = {
  directory: "导航网站",
  education: "教育网站",
  "interactive-demo": "交互演示",
  "report-tool": "数据报告工具",
  "content-product": "内容产品",
};
export const PROJECT_PLAN_TIME_LABELS: Record<ProjectPlanTimeBudget, string> = {
  "two-hours": "1～2 小时",
  "one-day": "1 天",
  "three-days": "3 天",
  "seven-days": "7 天",
};
export const PROJECT_PLAN_EXPERIENCE_LABELS: Record<
  ProjectPlanExperience,
  string
> = {
  beginner: "入门",
  intermediate: "有一定经验",
  advanced: "熟练",
};
export const PROJECT_PLAN_DEPLOYMENT_LABELS: Record<
  ProjectPlanDeployment,
  string
> = {
  "static-site": "Astro 静态站",
  cloudflare: "Cloudflare",
  "no-deploy": "暂不部署",
};

export interface ProjectPlanRequest {
  projectId: string;
  role: ProjectPlanRole;
  direction: ProjectPlanDirection;
  timeBudget: ProjectPlanTimeBudget;
  experience: ProjectPlanExperience;
  deployment: ProjectPlanDeployment;
  goal: string;
}

export interface ProjectPlanDay {
  day: number;
  goal: string;
  deliverables: string[];
}

export interface ProjectPlan {
  title: string;
  positioning: string;
  targetUsers: string[];
  mvpFeatures: string[];
  nonGoals: string[];
  recommendedStack: string[];
  dataPlan: string[];
  implementationSteps: string[];
  riskAndCompliance: string[];
  sevenDayPlan: ProjectPlanDay[];
  sourceAttribution: string[];
  disclaimer: string;
}

export const PROJECT_PLAN_RESULT_SOURCES = [
  "model",
  "backup-model",
  "server-fallback",
  "client-fallback",
] as const;
export type ProjectPlanResultSource =
  (typeof PROJECT_PLAN_RESULT_SOURCES)[number];

export const PROJECT_PLAN_RESULT_LABELS: Record<
  ProjectPlanResultSource,
  string
> = {
  model: "AI 实时生成",
  "backup-model": "备用 AI 模型生成",
  "server-fallback": "服务端模板结果",
  "client-fallback": "本地模板结果",
};

type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; field: string; message: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function includesValue<T extends readonly string[]>(values: T, value: unknown) {
  return typeof value === "string" && values.includes(value as T[number]);
}

export function validateProjectPlanRequest(
  input: unknown,
  projectIds: string[]
): ValidationResult<ProjectPlanRequest> {
  if (!isRecord(input)) {
    return { ok: false, field: "request", message: "请求必须是 JSON 对象。" };
  }
  if (
    typeof input.projectId !== "string" ||
    !projectIds.includes(input.projectId)
  ) {
    return { ok: false, field: "projectId", message: "请选择有效的开源项目。" };
  }
  for (const [field, values] of [
    ["role", PROJECT_PLAN_ROLES],
    ["direction", PROJECT_PLAN_DIRECTIONS],
    ["timeBudget", PROJECT_PLAN_TIME_BUDGETS],
    ["experience", PROJECT_PLAN_EXPERIENCE],
    ["deployment", PROJECT_PLAN_DEPLOYMENTS],
  ] as const) {
    if (!includesValue(values, input[field])) {
      return { ok: false, field, message: `${field} 不是允许的选项。` };
    }
  }
  if (typeof input.goal !== "string") {
    return { ok: false, field: "goal", message: "项目目标必须是文本。" };
  }
  const goal = input.goal.trim();
  if (goal.length > PROJECT_PLAN_GOAL_MAX_LENGTH) {
    return {
      ok: false,
      field: "goal",
      message: `项目目标不能超过 ${PROJECT_PLAN_GOAL_MAX_LENGTH} 个字符。`,
    };
  }

  return {
    ok: true,
    value: {
      projectId: input.projectId,
      role: input.role as ProjectPlanRole,
      direction: input.direction as ProjectPlanDirection,
      timeBudget: input.timeBudget as ProjectPlanTimeBudget,
      experience: input.experience as ProjectPlanExperience,
      deployment: input.deployment as ProjectPlanDeployment,
      goal,
    },
  };
}

function isBoundedString(value: unknown, maximum = 600) {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    value.length <= maximum
  );
}

function isStringList(value: unknown, maximumItems = 20) {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.length <= maximumItems &&
    value.every(item => isBoundedString(item))
  );
}

export function validateProjectPlan(
  input: unknown
): ValidationResult<ProjectPlan> {
  if (!isRecord(input)) {
    return { ok: false, field: "plan", message: "路线结果不是 JSON 对象。" };
  }
  for (const field of ["title", "positioning", "disclaimer"] as const) {
    if (!isBoundedString(input[field], 1000)) {
      return { ok: false, field, message: `${field} 缺失或过长。` };
    }
  }
  for (const field of [
    "targetUsers",
    "mvpFeatures",
    "nonGoals",
    "recommendedStack",
    "dataPlan",
    "implementationSteps",
    "riskAndCompliance",
    "sourceAttribution",
  ] as const) {
    if (!isStringList(input[field])) {
      return { ok: false, field, message: `${field} 必须是非空短文本数组。` };
    }
  }
  if (
    !Array.isArray(input.sevenDayPlan) ||
    input.sevenDayPlan.length !== 7 ||
    input.sevenDayPlan.some(
      (item, index) =>
        !isRecord(item) ||
        item.day !== index + 1 ||
        !isBoundedString(item.goal) ||
        !isStringList(item.deliverables, 8)
    )
  ) {
    return {
      ok: false,
      field: "sevenDayPlan",
      message: "sevenDayPlan 必须包含第 1～7 天的有效计划。",
    };
  }
  return { ok: true, value: input as unknown as ProjectPlan };
}

export function parseProjectPlanApiResponse(input: unknown) {
  if (!isRecord(input)) {
    return { ok: false as const, message: "接口返回格式无效。" };
  }
  const plan = validateProjectPlan(input.plan);
  if (!plan.ok) return { ok: false as const, message: plan.message };
  if (
    !PROJECT_PLAN_RESULT_SOURCES.includes(
      input.resultSource as ProjectPlanResultSource
    ) ||
    input.resultSource === "client-fallback"
  ) {
    return { ok: false as const, message: "接口结果来源标识无效。" };
  }
  return {
    ok: true as const,
    plan: plan.value,
    resultSource: input.resultSource as Exclude<
      ProjectPlanResultSource,
      "client-fallback"
    >,
    message: typeof input.message === "string" ? input.message : "",
  };
}

export function createFallbackProjectPlan(
  request: ProjectPlanRequest,
  project: AgingClockProject
): ProjectPlan {
  const role = PROJECT_PLAN_ROLE_LABELS[request.role];
  const direction = PROJECT_PLAN_DIRECTION_LABELS[request.direction];
  const deployment = PROJECT_PLAN_DEPLOYMENT_LABELS[request.deployment];
  const goal = request.goal || `把 ${project.name} 做成可核验的${direction}`;

  return {
    title: `${project.name}：7 天${direction}改造路线`,
    positioning: `${goal}。面向${role}，只展示公开元数据、算法流程和来源，不处理真实生物或患者数据。`,
    targetUsers: [role, ...project.suitableFor.slice(0, 2)],
    mvpFeatures: [
      "一页式项目事实卡与原仓库来源",
      "输入、算法、输出、许可证和限制对比",
      project.remixIdeas[0],
      "研究用途与非医疗边界提示",
    ],
    nonGoals: [
      "不测算个人生物年龄",
      "不上传或分析 DNA、甲基化、MRI、病例和患者数据",
      "不提供疾病诊断、治疗或临床有效性结论",
    ],
    recommendedStack: ["Astro", "TypeScript", "原生浏览器交互", deployment],
    dataPlan: [
      "只保存官方仓库公开元数据、README 摘要、许可证状态和来源日期",
      "用本地结构化数据和构建时校验替代自动爬虫",
      "演示数据只使用明确标注的合成/占位内容，不使用个人生物数据",
    ],
    implementationSteps: [
      "冻结项目事实、未知项和非目标",
      "建立经过校验的数据模型",
      "完成一张真实卡片的纵向切片",
      "补充筛选、对比、详情和来源追踪",
      `按 ${deployment} 偏好完成构建与本地验收`,
    ],
    riskAndCompliance: [
      `许可证状态：${project.licenseStatus}；${project.licenseNotes}`,
      project.artifactTerms,
      ...project.riskTags.map(tag => `风险：${tag}`),
    ],
    sevenDayPlan: [
      {
        day: 1,
        goal: "核实事实和边界",
        deliverables: ["来源清单", "非目标清单"],
      },
      { day: 2, goal: "建立数据模型", deliverables: ["类型定义", "数据校验"] },
      { day: 3, goal: "完成首张卡片", deliverables: ["独立路由", "来源链接"] },
      { day: 4, goal: "补齐核心交互", deliverables: ["筛选", "比较"] },
      {
        day: 5,
        goal: "补齐详情和合规",
        deliverables: ["详情视图", "风险提示"],
      },
      { day: 6, goal: "验证质量", deliverables: ["测试结果", "可访问性检查"] },
      {
        day: 7,
        goal: "交付可运行 MVP",
        deliverables: ["构建产物", "运行与限制说明"],
      },
    ],
    sourceAttribution: [
      project.repositoryUrl,
      ...project.sourceDaily.map(source => `${source.title}：${source.url}`),
    ],
    disclaimer:
      "本路线仅用于开源项目学习与网站规划，不构成医学建议；请勿输入或上传个人健康、生物或患者数据。",
  };
}
