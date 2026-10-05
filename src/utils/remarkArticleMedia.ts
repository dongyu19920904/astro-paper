import path from "node:path";
import type { Root, RootContent, Paragraph } from "mdast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";
import mediaData from "../data/articleMedia.json" with { type: "json" };

type Media = {
  imageUrl: string;
  alt: string;
  sourceUrl: string;
  sourceTitle: string;
};
type Manifest = Record<string, Media[]>;

export function supplementArticleMedia(tree: Root, media: Media[]) {
  let hasImage = false;
  const cited = new Set<string>();
  visit(tree, "image", () => {
    hasImage = true;
  });
  visit(tree, "html", node => {
    if (/<img\b/i.test(node.value)) hasImage = true;
  });
  visit(tree, "link", node => {
    cited.add(node.url);
  });
  if (hasImage) return;
  for (const [position, item] of media.slice(0, 2).entries()) {
    if (
      !cited.has(item.sourceUrl) ||
      !/^https:\/\//.test(item.imageUrl) ||
      !/^https:\/\//.test(item.sourceUrl)
    )
      continue;
    const figure: Paragraph = {
      type: "paragraph",
      children: [
        {
          type: "link",
          url: item.sourceUrl,
          children: [
            {
              type: "image",
              url: item.imageUrl,
              alt: item.alt,
              title: item.alt,
            },
          ],
        },
      ],
    };
    let index = tree.children.findIndex(node => {
      if (node.type !== "paragraph") return false;
      let match = false;
      visit(node, "link", link => {
        if (link.url === item.sourceUrl) match = true;
      });
      return match;
    });
    if (index >= 0) index++;
    else {
      if (position === 0)
        index = tree.children.findIndex(node => node.type === "paragraph") + 1;
      if (index <= 0) {
        index = tree.children.findIndex(
          node =>
            node.type === "heading" &&
            node.children.some(
              child =>
                child.type === "text" &&
                /^(参考资料|references)$/i.test(child.value)
            )
        );
        if (index < 0) index = tree.children.length;
      }
    }
    tree.children.splice(index, 0, figure as RootContent);
  }
}

export const remarkArticleMedia: Plugin<[], Root> = () => (tree, file) => {
  const frontmatter = (
    file.data.astro as { frontmatter?: { draft?: boolean } } | undefined
  )?.frontmatter;
  if (frontmatter?.draft) return;
  const name = path.basename(String(file.path || ""));
  const media = (mediaData as Manifest)[name];
  if (media) supplementArticleMedia(tree, media);
};
