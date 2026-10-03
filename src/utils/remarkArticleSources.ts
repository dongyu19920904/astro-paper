import type { Root } from "mdast";
import { visit } from "unist-util-visit";
import type { Plugin } from "unified";

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
      const astro = file.data.astro as
        | { frontmatter: Record<string, unknown> }
        | undefined;
      if (astro)
        astro.frontmatter.articleSources = collectArticleSources(tree, site);
    };
  };
