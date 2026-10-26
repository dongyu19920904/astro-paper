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

function visit(node: HastNode, state: { tables: number }) {
  const classNames = node.properties?.className;
  if (
    node.children &&
    !(Array.isArray(classNames) && classNames.includes("table-scroll"))
  ) {
    node.children = node.children.map(child => {
      if (child.tagName !== "table") return child;
      state.tables++;
      return {
        type: "element",
        tagName: "div",
        properties: {
          className: ["table-scroll"],
          role: "region",
          tabIndex: 0,
          "aria-label": `表格 ${state.tables}，可横向滚动`,
        },
        children: [child],
      };
    });
  }
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
  node.children?.forEach(child => visit(child, state));
}

export function rehypeReadingBlocks() {
  return (tree: HastNode) => {
    const opening = tree.children?.find(
      child => child.type !== "text" || child.value?.trim()
    );
    if (
      opening?.tagName === "p" &&
      !opening.children?.some(child => child.tagName === "img")
    ) {
      const classes = opening.properties?.className;
      opening.properties = {
        ...opening.properties,
        className: [
          ...new Set([
            ...(Array.isArray(classes) ? classes : []),
            "article-lead",
          ]),
        ],
      };
    }
    visit(tree, { tables: 0 });
  };
}
