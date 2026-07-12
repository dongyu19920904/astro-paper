import { AGING_CLOCK_PROJECTS } from "@/data/agingClockProjects";
import {
  MAX_COMPARISON_PROJECTS,
  MIN_COMPARISON_PROJECTS,
  PROJECT_PLAN_RESULT_LABELS,
  atlasFiltersToSearchParams,
  createFallbackProjectPlan,
  filterAndSortProjects,
  parseAtlasFilters,
  parseProjectPlanApiResponse,
  updateComparisonSelection,
  validateProjectPlanRequest,
  type ProjectPlan,
  type ProjectPlanResultSource,
} from "@/utils/agingClockAtlas";

function element<T extends Element>(
  selector: string,
  parent: ParentNode = document
) {
  return parent.querySelector<T>(selector);
}

function requiredElement<T extends Element>(
  selector: string,
  parent: ParentNode = document
) {
  const node = element<T>(selector, parent);
  if (!node) throw new Error(`Aging Clock Atlas markup is missing ${selector}`);
  return node;
}

function makeTextElement(tag: string, text: string, className = "") {
  const node = document.createElement(tag);
  node.textContent = text;
  if (className) node.className = className;
  return node;
}

function appendList(parent: HTMLElement, items: string[]) {
  const list = document.createElement("ul");
  list.className = "atlas-list";
  for (const item of items) {
    list.append(makeTextElement("li", item));
  }
  parent.append(list);
}

function appendSection(
  parent: HTMLElement,
  title: string,
  content: string | string[]
) {
  const section = document.createElement("section");
  section.className = "atlas-detail-section";
  section.append(makeTextElement("h3", title));
  if (Array.isArray(content)) appendList(section, content);
  else section.append(makeTextElement("p", content));
  parent.append(section);
}

function renderProjectDetails(projectId: string, dialog: HTMLDialogElement) {
  const project = AGING_CLOCK_PROJECTS.find(item => item.id === projectId);
  const content = element<HTMLElement>("[data-detail-content]", dialog);
  if (!project || !content) return;

  content.replaceChildren();
  content.append(makeTextElement("p", project.category, "atlas-eyebrow"));
  const title = makeTextElement("h2", project.name, "atlas-dialog-title");
  title.id = "project-detail-title";
  content.append(title);
  content.append(makeTextElement("p", project.summary, "atlas-dialog-summary"));
  appendSection(content, "适合人群", project.suitableFor);
  appendSection(content, "工作流程", project.workflow);
  appendSection(content, "输入与输出", [
    `输入：${project.inputFormat.join("、")}`,
    `输出：${project.outputs.join("、")}`,
  ]);
  appendSection(content, "推荐改造方向", project.remixIdeas);
  appendSection(content, "技术限制", project.limitations);
  appendSection(content, "许可证与资源条款", [
    `${project.licenseStatus}：${project.licenseNotes}`,
    project.artifactTerms,
  ]);
  appendSection(content, "医疗与隐私风险", [
    `风险级别：${project.riskLevel}（${project.riskTags.join("、")}）`,
    "本页面不运行该项目，不接收生物或患者数据，也不把输出解释为医学结论。",
  ]);
  appendSection(content, "来源与核验", [
    `官方仓库：${project.repositoryUrl}`,
    ...project.sourceDaily.map(
      source => `${source.date} · ${source.title} · ${source.repositoryPath}`
    ),
    `最近核验：${project.lastVerifiedAt}`,
  ]);

  const links = document.createElement("div");
  links.className = "atlas-dialog-links";
  const repositoryLink = makeTextElement("a", "打开官方仓库 ↗");
  repositoryLink.setAttribute("href", project.repositoryUrl);
  repositoryLink.setAttribute("target", "_blank");
  repositoryLink.setAttribute("rel", "noopener noreferrer");
  links.append(repositoryLink);
  for (const source of project.sourceDaily) {
    const sourceLink = makeTextElement("a", `查看 ${source.date} 日报来源 ↗`);
    sourceLink.setAttribute("href", source.url);
    sourceLink.setAttribute("target", "_blank");
    sourceLink.setAttribute("rel", "noopener noreferrer");
    links.append(sourceLink);
  }
  content.append(links);
  dialog.showModal();
}

const comparisonRows = [
  [
    "数据来源",
    (id: string) =>
      AGING_CLOCK_PROJECTS.find(p => p.id === id)?.inputTypes.join("、"),
  ],
  [
    "输入格式",
    (id: string) =>
      AGING_CLOCK_PROJECTS.find(p => p.id === id)?.inputFormat.join("、"),
  ],
  [
    "算法",
    (id: string) => AGING_CLOCK_PROJECTS.find(p => p.id === id)?.algorithm,
  ],
  [
    "输出",
    (id: string) =>
      AGING_CLOCK_PROJECTS.find(p => p.id === id)?.outputs.join("、"),
  ],
  [
    "使用场景",
    (id: string) =>
      AGING_CLOCK_PROJECTS.find(p => p.id === id)?.useCases.join("、"),
  ],
  [
    "运行成本",
    (id: string) => AGING_CLOCK_PROJECTS.find(p => p.id === id)?.runCost,
  ],
  [
    "本地可行性",
    (id: string) => AGING_CLOCK_PROJECTS.find(p => p.id === id)?.offlineNotes,
  ],
  [
    "许可证",
    (id: string) => {
      const project = AGING_CLOCK_PROJECTS.find(p => p.id === id);
      return project ? `${project.licenseStatus}：${project.licenseNotes}` : "";
    },
  ],
  [
    "限制",
    (id: string) =>
      AGING_CLOCK_PROJECTS.find(p => p.id === id)?.limitations.join("；"),
  ],
  [
    "网站化建议",
    (id: string) =>
      AGING_CLOCK_PROJECTS.find(p => p.id === id)?.remixIdeas.join("、"),
  ],
] as const;

function renderComparison(ids: string[], target: HTMLElement) {
  target.replaceChildren();
  for (const id of ids) {
    const project = AGING_CLOCK_PROJECTS.find(item => item.id === id);
    if (!project) continue;
    const card = document.createElement("article");
    card.className = "atlas-compare-card";
    card.append(makeTextElement("h3", project.name));
    const descriptionList = document.createElement("dl");
    for (const [label, readValue] of comparisonRows) {
      const row = document.createElement("div");
      row.append(makeTextElement("dt", label));
      row.append(makeTextElement("dd", readValue(id) || "待核实"));
      descriptionList.append(row);
    }
    card.append(descriptionList);
    target.append(card);
  }
}

function renderPlan(
  plan: ProjectPlan,
  target: HTMLElement,
  resultSource: ProjectPlanResultSource
) {
  target.replaceChildren();
  target.append(
    makeTextElement(
      "p",
      PROJECT_PLAN_RESULT_LABELS[resultSource],
      "atlas-source-badge"
    )
  );
  target.append(makeTextElement("h3", plan.title, "atlas-plan-title"));
  target.append(
    makeTextElement("p", plan.positioning, "atlas-plan-positioning")
  );
  for (const [title, items] of [
    ["目标用户", plan.targetUsers],
    ["MVP 功能", plan.mvpFeatures],
    ["明确非目标", plan.nonGoals],
    ["推荐技术栈", plan.recommendedStack],
    ["数据计划", plan.dataPlan],
    ["实施步骤", plan.implementationSteps],
    ["风险与合规", plan.riskAndCompliance],
    ["来源归属", plan.sourceAttribution],
  ] as const) {
    const section = document.createElement("section");
    section.className = "atlas-plan-section";
    section.append(makeTextElement("h4", title));
    appendList(section, [...items]);
    target.append(section);
  }

  const days = document.createElement("section");
  days.className = "atlas-plan-section";
  days.append(makeTextElement("h4", "7 天计划"));
  const dayGrid = document.createElement("div");
  dayGrid.className = "atlas-day-grid";
  for (const item of plan.sevenDayPlan) {
    const day = document.createElement("article");
    day.className = "atlas-plan-day";
    day.append(makeTextElement("p", `Day ${item.day}`, "atlas-eyebrow"));
    day.append(makeTextElement("h5", item.goal));
    appendList(day, item.deliverables);
    dayGrid.append(day);
  }
  days.append(dayGrid);
  target.append(days);
  target.append(makeTextElement("p", plan.disclaimer, "atlas-plan-disclaimer"));
}

function initAgingClockAtlas() {
  const root = element<HTMLElement>("#aging-clock-atlas");
  if (!root || root.dataset.initialized === "true") return;
  root.dataset.initialized = "true";

  const filterForm = requiredElement<HTMLFormElement>("#atlas-filters", root);
  const projectGrid = requiredElement<HTMLElement>("#atlas-project-grid", root);
  const resultCount = requiredElement<HTMLElement>("#atlas-result-count", root);
  const emptyState = requiredElement<HTMLElement>("#atlas-empty", root);
  const clearFilters = requiredElement<HTMLButtonElement>(
    "#clear-atlas-filters",
    root
  );
  const compareButton = requiredElement<HTMLButtonElement>(
    "#show-comparison",
    root
  );
  const clearComparison = requiredElement<HTMLButtonElement>(
    "#clear-comparison",
    root
  );
  const comparisonCount = requiredElement<HTMLElement>(
    "#comparison-count",
    root
  );
  const comparisonStatus = requiredElement<HTMLElement>(
    "#comparison-status",
    root
  );
  const comparisonPanel = requiredElement<HTMLElement>(
    "#comparison-panel",
    root
  );
  const comparisonResults = requiredElement<HTMLElement>(
    "#comparison-results",
    root
  );
  const detailDialog = requiredElement<HTMLDialogElement>(
    "#project-detail-dialog"
  );
  const planForm = requiredElement<HTMLFormElement>("#project-plan-form", root);
  const planStatus = requiredElement<HTMLElement>("#project-plan-status", root);
  const planResult = requiredElement<HTMLElement>("#project-plan-result", root);

  let selectedIds: string[] = [];
  const initialFilters = parseAtlasFilters(
    window.location.search,
    AGING_CLOCK_PROJECTS
  );
  for (const [name, value] of Object.entries(initialFilters)) {
    const control = filterForm.elements.namedItem(name);
    if (control instanceof HTMLSelectElement) control.value = value;
  }

  function currentFilters() {
    const values = new FormData(filterForm);
    const params = new URLSearchParams();
    values.forEach((value, key) => params.set(key, String(value)));
    return parseAtlasFilters(params, AGING_CLOCK_PROJECTS);
  }

  function updateFilterView(syncUrl = true) {
    const filters = currentFilters();
    const visibleProjects = filterAndSortProjects(
      AGING_CLOCK_PROJECTS,
      filters
    );
    const visibleIds = new Set(visibleProjects.map(project => project.id));
    const cards = new Map(
      [...projectGrid.querySelectorAll<HTMLElement>("[data-project-card]")].map(
        card => [card.dataset.projectId || "", card]
      )
    );

    for (const project of visibleProjects) {
      const card = cards.get(project.id);
      if (!card) continue;
      card.hidden = false;
      projectGrid.append(card);
    }
    for (const project of AGING_CLOCK_PROJECTS) {
      if (visibleIds.has(project.id)) continue;
      const card = cards.get(project.id);
      if (card) card.hidden = true;
    }
    resultCount.textContent = `显示 ${visibleProjects.length} / ${AGING_CLOCK_PROJECTS.length} 个项目`;
    emptyState.hidden = visibleProjects.length > 0;

    if (syncUrl) {
      const params = atlasFiltersToSearchParams(filters);
      const query = params.toString();
      history.replaceState(
        history.state,
        "",
        `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`
      );
    }
  }

  function updateComparisonControls(message = "") {
    comparisonCount.textContent = `${selectedIds.length} / ${MAX_COMPARISON_PROJECTS}`;
    compareButton.disabled = selectedIds.length < MIN_COMPARISON_PROJECTS;
    clearComparison.disabled = selectedIds.length === 0;
    comparisonStatus.textContent =
      message ||
      (selectedIds.length < MIN_COMPARISON_PROJECTS
        ? `再选择 ${MIN_COMPARISON_PROJECTS - selectedIds.length} 个项目即可比较。`
        : "已可生成比较结果。");
  }

  filterForm.addEventListener("change", () => updateFilterView());
  clearFilters.addEventListener("click", () => {
    filterForm.reset();
    updateFilterView();
  });

  projectGrid.addEventListener("change", event => {
    const checkbox = event.target;
    if (
      !(checkbox instanceof HTMLInputElement) ||
      !checkbox.matches("[data-compare-project]")
    ) {
      return;
    }
    const update = updateComparisonSelection(
      selectedIds,
      checkbox.value,
      checkbox.checked
    );
    selectedIds = update.ids;
    if (update.limitReached) checkbox.checked = false;
    updateComparisonControls(
      update.limitReached ? `最多比较 ${MAX_COMPARISON_PROJECTS} 个项目。` : ""
    );
  });

  projectGrid.addEventListener("click", event => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const button = target.closest<HTMLElement>("[data-project-detail]");
    if (button?.dataset.projectDetail) {
      renderProjectDetails(button.dataset.projectDetail, detailDialog);
    }
  });

  element<HTMLButtonElement>(
    "[data-dialog-close]",
    detailDialog
  )?.addEventListener("click", () => detailDialog.close());
  detailDialog.addEventListener("click", event => {
    if (event.target === detailDialog) detailDialog.close();
  });

  clearComparison.addEventListener("click", () => {
    selectedIds = [];
    projectGrid
      .querySelectorAll<HTMLInputElement>("[data-compare-project]")
      .forEach(input => (input.checked = false));
    comparisonPanel.hidden = true;
    comparisonResults.replaceChildren();
    updateComparisonControls();
  });

  compareButton.addEventListener("click", () => {
    if (selectedIds.length < MIN_COMPARISON_PROJECTS) return;
    renderComparison(selectedIds, comparisonResults);
    comparisonPanel.hidden = false;
    comparisonPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  planForm.addEventListener("submit", async event => {
    event.preventDefault();
    const rawRequest = Object.fromEntries(new FormData(planForm));
    const validatedRequest = validateProjectPlanRequest(
      rawRequest,
      AGING_CLOCK_PROJECTS.map(project => project.id)
    );
    if (!validatedRequest.ok) {
      planStatus.textContent = validatedRequest.message;
      element<HTMLElement>(
        `[name="${validatedRequest.field}"]`,
        planForm
      )?.focus();
      return;
    }

    const project = AGING_CLOCK_PROJECTS.find(
      item => item.id === validatedRequest.value.projectId
    );
    if (!project) return;
    const fallback = createFallbackProjectPlan(validatedRequest.value, project);
    const apiBase = (root.dataset.apiBase || "").replace(/\/+$/, "");
    const submitButton = element<HTMLButtonElement>(
      "button[type='submit']",
      planForm
    );
    if (submitButton) submitButton.disabled = true;
    planStatus.textContent = "正在生成一份有边界的 7 天改造路线…";

    if (!apiBase) {
      renderPlan(fallback, planResult, "client-fallback");
      planStatus.textContent =
        "本地模板结果：未配置后端 API，已显示确定性的本地路线。";
      if (submitButton) submitButton.disabled = false;
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 30_000);
    try {
      const response = await fetch(
        `${apiBase}/api/project-lab/aging-clock-plan`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "omit",
          signal: controller.signal,
          body: JSON.stringify(validatedRequest.value),
        }
      );
      const responseText = await response.text();
      if (responseText.length > 100_000) throw new Error("response_too_large");
      const parsed = parseProjectPlanApiResponse(JSON.parse(responseText));
      if (!response.ok || !parsed.ok) throw new Error("invalid_api_response");
      renderPlan(parsed.plan, planResult, parsed.resultSource);
      const sourceLabel = PROJECT_PLAN_RESULT_LABELS[parsed.resultSource];
      planStatus.textContent = parsed.message
        ? `${sourceLabel}：${parsed.message}`
        : `${sourceLabel}：路线已生成并通过结构校验。`;
    } catch {
      renderPlan(fallback, planResult, "client-fallback");
      planStatus.textContent =
        "本地模板结果：接口不可用或结果校验失败，已切换到确定性的本地路线。";
    } finally {
      window.clearTimeout(timeout);
      if (submitButton) submitButton.disabled = false;
    }
  });

  updateFilterView(false);
  updateComparisonControls();
}

initAgingClockAtlas();
document.addEventListener("astro:page-load", initAgingClockAtlas);
