export type HastNode = {
  type?: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
  value?: string;
};

function isElement(node: HastNode | undefined, tagName: string) {
  return node?.type === "element" && node.tagName === tagName;
}

function isWhitespaceText(node: HastNode | undefined) {
  return node?.type === "text" && !String(node.value || "").trim();
}

function captionFromImage(img: HastNode) {
  const title = String(img.properties?.title || "").trim();
  const alt = String(img.properties?.alt || "").trim();
  const text = title || alt;

  if (!text || /^(image|img|photo|screenshot|图片|配图|截图)$/i.test(text)) {
    return "";
  }

  return text.length > 80 ? "" : text;
}

function normalizeImage(img: HastNode) {
  img.properties = {
    ...img.properties,
    loading: img.properties?.loading || "lazy",
    decoding: img.properties?.decoding || "async",
  };
}

function wrapParagraphImage(node: HastNode) {
  if (!isElement(node, "p") || !node.children) return;

  const visibleChildren = node.children.filter(
    child => !isWhitespaceText(child)
  );
  if (visibleChildren.length !== 1) {
    return;
  }
  const media = visibleChildren[0];
  const linkedImage =
    isElement(media, "a") && media.children?.length === 1
      ? media.children[0]
      : undefined;
  const image = isElement(media, "img") ? media : linkedImage;
  if (!isElement(image, "img") || !image) return;
  normalizeImage(image);
  const caption = captionFromImage(image);
  const source = isElement(media, "a")
    ? String(media.properties?.href || "")
    : "";
  const captionChildren: HastNode[] = caption
    ? [{ type: "text", value: caption }]
    : [];
  if (/^https?:\/\//i.test(source)) {
    captionChildren.push(
      { type: "text", value: caption ? " · " : "" },
      {
        type: "element",
        tagName: "a",
        properties: { href: source },
        children: [{ type: "text", value: "图源" }],
      }
    );
  }
  const original = String(image.properties?.["data-original-src"] || "");
  if (/^https?:\/\//i.test(original)) {
    captionChildren.push(
      { type: "text", value: captionChildren.length ? " · " : "" },
      {
        type: "element",
        tagName: "a",
        properties: { href: original },
        children: [{ type: "text", value: "原图" }],
      }
    );
  }
  node.tagName = "figure";
  node.properties = { className: ["article-media"] };
  node.children = captionChildren.length
    ? [
        media,
        {
          type: "element",
          tagName: "figcaption",
          properties: {},
          children: captionChildren,
        },
      ]
    : [media];
}

function visit(node: HastNode) {
  wrapParagraphImage(node);
  node.children?.forEach(visit);
}

export function rehypeFigures() {
  return (tree: HastNode) => visit(tree);
}
