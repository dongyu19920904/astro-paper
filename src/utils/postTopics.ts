import type { CollectionEntry } from "astro:content";
import type { TopicSlug } from "@/data/topicHubs";

type BlogPost = CollectionEntry<"blog">;

const GENERIC_TAGS = new Set([
  "ai",
  "ai daily",
  "ai-daily",
  "bioai daily",
  "bioai-daily",
  "biotech",
  "daily",
  "日报",
]);

const TOPIC_PATTERNS: Record<TopicSlug, RegExp[]> = {
  "ai-one-person-company": [
    /一人公司/i,
    /自动化|工作流|agent|智能体|效率|增效|运营系统|内容生产/i,
  ],
  "ai-longevity": [
    /生命延续|长寿|衰老|抗衰|寿命|脑健康|脑龄|生物年龄/i,
    /bioai|生命科学|生物标志物|生物医药|临床试验|药物研发/i,
  ],
  "ai-account-business": [
    /账号店|账号生意|客服|售后|发货|货源|商家经营|利润/i,
    /chatgpt|claude|cursor|codex|gemini|grok|perplexity/i,
  ],
};

function normalizeTag(tag: string) {
  return tag.trim().toLowerCase().replace(/_/g, "-");
}

function getSearchText(post: BlogPost) {
  const meaningfulTags = (post.data.tags ?? [])
    .filter(tag => !GENERIC_TAGS.has(normalizeTag(tag)))
    .join(" ");

  return [post.data.title, post.data.description, meaningfulTags, post.body]
    .filter(Boolean)
    .join("\n");
}

export function getPostTopicSlugs(post: BlogPost): TopicSlug[] {
  const text = getSearchText(post);
  return (Object.entries(TOPIC_PATTERNS) as [TopicSlug, RegExp[]][])
    .filter(([, patterns]) => patterns.some(pattern => pattern.test(text)))
    .map(([slug]) => slug);
}

export function scoreRelatedPost(current: BlogPost, candidate: BlogPost) {
  if (current.id === candidate.id) return Number.NEGATIVE_INFINITY;

  const currentTopics = new Set(getPostTopicSlugs(current));
  const topicOverlap = getPostTopicSlugs(candidate).filter(topic =>
    currentTopics.has(topic)
  ).length;
  const currentTags = new Set(
    (current.data.tags ?? [])
      .map(normalizeTag)
      .filter(tag => !GENERIC_TAGS.has(tag))
  );
  const tagOverlap = (candidate.data.tags ?? [])
    .map(normalizeTag)
    .filter(tag => currentTags.has(tag)).length;

  return topicOverlap * 10 + tagOverlap * 3;
}
