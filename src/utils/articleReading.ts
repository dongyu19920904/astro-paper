export function getArticleSeries(tags: readonly string[] = []) {
  if (tags.includes("bioai-daily")) return "生命科学观察";
  if (tags.includes("ai-daily")) return "AI 工具与实践";
  return "个人记录";
}

export function getArticleSeriesTone(tags: readonly string[] = []) {
  if (tags.includes("bioai-daily")) return "life";
  if (tags.includes("ai-daily")) return "tech";
  return "neutral";
}

export function isAutomatedArticle(tags: readonly string[] = []) {
  return tags.includes("ai-daily") || tags.includes("bioai-daily");
}

export function estimateReadingMinutes(body: string) {
  const chinese = body.match(/[\u3400-\u9fff]/g)?.length ?? 0;
  const words = body.match(/[a-zA-Z0-9]+/g)?.length ?? 0;
  return Math.max(1, Math.ceil(chinese / 350 + words / 220));
}

export function articleProgress(top: number, height: number, viewport: number) {
  const distance = height - viewport;
  if (distance <= 0) return top <= 0 ? 100 : 0;
  return Math.min(100, Math.max(0, (-top / distance) * 100));
}

export function sortByPublishedDate<T extends { data: { pubDatetime: Date } }>(
  posts: T[]
) {
  return [...posts].sort(
    (a, b) => b.data.pubDatetime.getTime() - a.data.pubDatetime.getTime()
  );
}
