type PublishedPost = {
  id: string;
  data: { pubDatetime: Date; draft?: boolean; tags: string[] };
};

export function buildPublicationStatus(
  posts: PublishedPost[],
  now = new Date()
) {
  const latest: Record<string, string | null> = {
    "ai-daily": null,
    "bioai-daily": null,
  };
  for (const post of posts) {
    if (post.data.draft || post.data.pubDatetime > now) continue;
    for (const type of Object.keys(latest)) {
      if (!post.data.tags.includes(type)) continue;
      const date = post.id.match(
        /(?:ai|bioai)-daily-(\d{4}-\d{2}-\d{2})(?:\.md)?$/
      )?.[1];
      if (date && (!latest[type] || date > latest[type])) latest[type] = date;
    }
  }
  return { generatedAt: now.toISOString(), latest };
}
