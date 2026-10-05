import type { Root } from "mdast";
import { visit } from "unist-util-visit";
import type { Plugin } from "unified";

export function simplifyLegacyReferences(tree: Root) {
  for (let index = 0; index < tree.children.length; index++) {
    const heading = tree.children[index];
    if (heading.type !== "heading" || heading.depth !== 2) continue;
    if (
      heading.children.length !== 1 ||
      heading.children[0].type !== "text" ||
      heading.children[0].value.trim() !== "来源与边界"
    )
      continue;
    let end = index + 1;
    while (end < tree.children.length) {
      const node = tree.children[end];
      if (
        node.type === "thematicBreak" ||
        (node.type === "heading" && node.depth <= 2)
      )
        break;
      end++;
    }
    const section: Root = {
      type: "root",
      children: tree.children.slice(index + 1, end),
    };
    const links = new Map<string, import("mdast").Link>();
    const definitions = new Map<string, import("mdast").Definition>();
    visit(tree, "definition", node => {
      definitions.set(node.identifier, node);
    });
    const add = (node: import("mdast").Link) => {
      try {
        const url = new URL(node.url);
        if (!/^https?:$/.test(url.protocol) || url.username || url.password)
          return;
        if (!links.has(url.href)) links.set(url.href, node);
      } catch {
        /* Do not invent missing or relative references. */
      }
    };
    visit(section, "link", add);
    visit(section, "linkReference", node => {
      const definition = definitions.get(node.identifier);
      if (definition)
        add({
          type: "link",
          url: definition.url,
          title: definition.title,
          children: node.children,
        });
    });
    if (links.size === 0) {
      visit(tree, "link", node => {
        try {
          const url = new URL(node.url);
          if (
            ["aivora.cn", "www.aivora.cn", "yuyu.aivora.cn"].includes(
              url.hostname
            )
          )
            return;
          add(node);
        } catch {
          /* Keep only actual absolute links already in the article. */
        }
      });
    }
    if (links.size === 0) continue;
    heading.children = [{ type: "text", value: "参考资料" }];
    tree.children.splice(index + 1, end - index - 1, {
      type: "list",
      ordered: false,
      spread: false,
      children: [...links.values()].map(link => ({
        type: "listItem",
        spread: false,
        children: [{ type: "paragraph", children: [link] }],
      })),
    });
  }
}

export function collectArticleSources(tree: Root, site: string) {
  const sources = new Set<string>();
  const definitions = new Map<string, string>();
  visit(tree, "definition", node => {
    definitions.set(node.identifier, node.url);
  });
  const add = (value: string | undefined) => {
    if (!value) return;
    try {
      const url = new URL(value);
      if (
        !/^https?:$/.test(url.protocol) ||
        url.hostname === new URL(site).hostname
      )
        return;
      if (url.username || url.password) return;
      sources.add(url.href);
    } catch {
      /* Relative links are navigation, not external citations. */
    }
  };
  visit(tree, "link", node => add(node.url));
  visit(tree, "linkReference", node => add(definitions.get(node.identifier)));
  return [...sources];
}

export const remarkArticleSources: Plugin<[{ site: string }], Root> =
  function ({ site }) {
    return (tree, file) => {
      simplifyLegacyReferences(tree);
      const astro = file.data.astro as
        | { frontmatter: Record<string, unknown> }
        | undefined;
      if (astro)
        astro.frontmatter.articleSources = collectArticleSources(tree, site);
    };
  };
