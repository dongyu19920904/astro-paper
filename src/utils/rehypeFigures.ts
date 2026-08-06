type HastNode = {
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

  const visibleChildren = node.children.filter(child => !isWhitespaceText(child));
  if (visibleChildren.length !== 1 || !isElement(visibleChildren[0], "img")) {
    return;
  }

  const image = visibleChildren[0];
  normalizeImage(image);

  const caption = captionFromImage(image);
  node.tagName = "figure";
  node.properties = {};
  node.children = caption
    ? [
        image,
        {
          type: "element",
          tagName: "figcaption",
          properties: {},
          children: [{ type: "text", value: caption }],
        },
      ]
    : [image];
}

function visit(node: HastNode) {
  wrapParagraphImage(node);
  node.children?.forEach(visit);
}

export function rehypeFigures() {
  return (tree: HastNode) => visit(tree);
}
