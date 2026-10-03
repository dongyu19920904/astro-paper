import type { Page } from "astro";

export const TOPIC_PAGE_SIZE = 12;

export function getTopicPage<T>(
  posts: T[],
  slug: string,
  currentPage = 1
): Page<T> {
  const lastPage = Math.max(1, Math.ceil(posts.length / TOPIC_PAGE_SIZE));
  const start = (currentPage - 1) * TOPIC_PAGE_SIZE;
  const path = (page: number) =>
    `/topics/${slug}/${page === 1 ? "" : `${page}/`}`;
  return {
    data: posts.slice(start, start + TOPIC_PAGE_SIZE),
    start,
    end: Math.min(start + TOPIC_PAGE_SIZE, posts.length) - 1,
    size: TOPIC_PAGE_SIZE,
    total: posts.length,
    currentPage,
    lastPage,
    url: {
      current: path(currentPage),
      prev: currentPage > 1 ? path(currentPage - 1) : undefined,
      next: currentPage < lastPage ? path(currentPage + 1) : undefined,
      first: currentPage > 1 ? path(1) : undefined,
      last: currentPage < lastPage ? path(lastPage) : undefined,
    },
  };
}
