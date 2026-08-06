import type { Root, RootContent } from "mdast";
import type { Plugin } from "unified";

function textOf(node: RootContent) {
  if (!("children" in node) || !Array.isArray(node.children)) return "";
  return node.children
    .map(child => ("value" in child ? String(child.value) : ""))
    .join("")
    .trim();
}

function isTocHeading(node: RootContent) {
  return (
    node.type === "heading" &&
    node.depth >= 2 &&
    node.depth <= 3 &&
    /^(Table of contents|目录)$/i.test(textOf(node))
  );
}

export const remarkRemoveToc: Plugin<[], Root> = () => {
  return tree => {
    const nextChildren: RootContent[] = [];
    let skippingToc = false;

    for (const node of tree.children) {
      if (isTocHeading(node)) {
        skippingToc = true;
        continue;
      }

      if (skippingToc && (node.type === "list" || node.type === "paragraph")) {
        continue;
      }

      skippingToc = false;
      nextChildren.push(node);
    }

    tree.children = nextChildren;
  };
};
