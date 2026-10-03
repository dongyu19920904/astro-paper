import type { CollectionEntry } from "astro:content";
import postFilter from "./postFilter";
import { sortByPublishedDate } from "./articleReading";

const getSortedPosts = (posts: CollectionEntry<"blog">[]) => {
  return sortByPublishedDate(posts.filter(postFilter));
};

export default getSortedPosts;
