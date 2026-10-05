import type { HastNode } from "./rehypeFigures";

const labels: Record<string, string> = {
  NOTE: "提示",
  TIP: "可以这样做",
  IMPORTANT: "要点",
  WARNING: "注意",
  CAUTION: "注意",
};

function text(node: HastNode): string {
  return node.type === "text"
    ? node.value || ""
    : (node.children || []).map(text).join("");
}

function visit(node: HastNode) {
  if (node.tagName === "blockquote") {
    const paragraph = node.children?.find(child => child.tagName === "p");
    const first = paragraph?.children?.[0];
    const marker =
      first?.type === "text" &&
      first.value?.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/);
    if (marker && first && paragraph && node.children) {
      first.value = first.value!.slice(marker[0].length);
      node.tagName = "aside";
      node.properties = {
        className: ["article-note"],
        "data-kind": /WARNING|CAUTION/.test(marker[1]) ? "warning" : "note",
        "aria-label": labels[marker[1]],
      };
      if (paragraph.children?.length === 1 && !first.value) {
        node.children = node.children.filter(child => child !== paragraph);
      }
      node.children.unshift({
        type: "element",
        tagName: "p",
        properties: { className: ["article-note-title"] },
        children: [{ type: "text", value: labels[marker[1]] }],
      });
    }
  }
  if (node.tagName === "article" || node.type === "root") {
    const children = node.children;
    if (children) {
      for (let i = 0; i < children.length; i++) {
        const heading = children[i];
        if (
          heading.tagName !== "h2" ||
          !/^(参考资料|references)$/i.test(
            text(heading).trim() || String(heading.properties?.id || "")
          )
        )
          continue;
        let end = i + 1;
        while (
          end < children.length &&
          !["h1", "h2", "hr"].includes(children[end].tagName || "")
        )
          end++;
        const section: HastNode = {
          type: "element",
          tagName: "section",
          properties: {
            className: ["article-references"],
            "aria-label": "参考资料",
          },
          children: children.slice(i, end),
        };
        children.splice(i, end - i, section);
      }
    }
  }
  node.children?.forEach(visit);
}

export function rehypeReadingBlocks() {
  return (tree: HastNode) => visit(tree);
}
