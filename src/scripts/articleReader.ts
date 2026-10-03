import { articleProgress } from "../utils/articleReading";

let cleanup = () => {};
function initializeArticleReader() {
  cleanup();
  const article = document.querySelector<HTMLElement>("#article");
  if (!article) return;
  const controller = new AbortController();
  article
    .querySelectorAll<HTMLElement>("h2[id],h3[id],h4[id],h5[id],h6[id]")
    .forEach(heading => {
      if (!heading.id || heading.querySelector(".heading-link")) return;
      const link = document.createElement("a");
      link.className = "heading-link ms-2 text-sm no-underline";
      link.href = `#${heading.id}`;
      link.setAttribute("aria-label", `链接到：${heading.textContent}`);
      link.textContent = "#";
      heading.appendChild(link);
    });
  article.querySelectorAll("table").forEach((table, index) => {
    if (table.parentElement?.classList.contains("table-scroll")) return;
    const wrapper = document.createElement("div");
    wrapper.className = "table-scroll";
    wrapper.tabIndex = 0;
    wrapper.setAttribute("role", "region");
    wrapper.setAttribute("aria-label", `表格 ${index + 1}，可横向滚动`);
    table.before(wrapper);
    wrapper.appendChild(table);
  });
  article.querySelectorAll("pre").forEach(block => {
    if (block.parentElement?.classList.contains("article-code")) return;
    const wrapper = document.createElement("div");
    wrapper.className = "article-code";
    const button = document.createElement("button");
    button.className = "copy-code";
    button.type = "button";
    button.setAttribute("aria-label", "复制代码");
    button.title = "复制代码";
    // A small tool icon, not a primary illustration.
    button.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V4H4v12h4"/></svg>';
    const status = document.createElement("span");
    status.className = "copy-status";
    status.setAttribute("role", "status");
    block.tabIndex = 0;
    block.before(wrapper);
    wrapper.append(block, button, status);
    button.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(
          block.querySelector("code")?.textContent ?? ""
        );
        status.textContent = "已复制";
      } catch {
        status.textContent = "复制失败，请选择代码后复制";
      }
    });
  });
  const progress = document.createElement("div");
  progress.className = "article-progress";
  progress.setAttribute("aria-hidden", "true");
  const bar = document.createElement("div");
  progress.appendChild(bar);
  document.body.appendChild(progress);
  let frame = 0;
  const update = () => {
    frame = 0;
    const bounds = article.getBoundingClientRect();
    bar.style.width = `${articleProgress(bounds.top, bounds.height, window.innerHeight)}%`;
  };
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };
  document.addEventListener("scroll", schedule, {
    passive: true,
    signal: controller.signal,
  });
  window.addEventListener("resize", schedule, { signal: controller.signal });
  const observer = new ResizeObserver(schedule);
  observer.observe(article);
  cleanup = () => {
    controller.abort();
    observer.disconnect();
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    progress.remove();
  };
  update();
}
document.addEventListener("astro:before-swap", () => cleanup());
document.addEventListener("astro:page-load", initializeArticleReader);
initializeArticleReader();
