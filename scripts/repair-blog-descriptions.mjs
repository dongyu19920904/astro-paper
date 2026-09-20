import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PLACEHOLDER_RE = /^description:\s*(['"]?)Table of contents\1\s*$/m;

function cleanParagraph(value) {
  return value
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[`*_~]/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function deriveDescription(body, maxLength = 150) {
  const paragraphs = body.replace(/\r\n/g, "\n").split(/\n\s*\n/);

  for (const paragraph of paragraphs) {
    const raw = paragraph.trim();
    if (
      !raw ||
      /^(?:#{1,6}\s|---+$|```|>|[-*+]\s|\d+[.)]\s|\|)/.test(raw) ||
      /^(?:table of contents|现在来写这篇博客)[：:]?$/i.test(raw)
    ) {
      continue;
    }

    const candidate = cleanParagraph(raw);
    if (candidate.length < 24) continue;
    if (candidate.length <= maxLength) return candidate;

    const clipped = candidate.slice(0, maxLength);
    const sentenceEnd = Math.max(
      clipped.lastIndexOf("。"),
      clipped.lastIndexOf("！"),
      clipped.lastIndexOf("？")
    );
    return sentenceEnd >= 50
      ? clipped.slice(0, sentenceEnd + 1)
      : `${clipped.replace(/[，、；：,.!?\s]+$/u, "")}…`;
  }

  return "";
}

export function repairDescription(content) {
  if (!PLACEHOLDER_RE.test(content)) return null;
  const frontmatter = content.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/);
  if (!frontmatter) return null;

  const description = deriveDescription(content.slice(frontmatter[0].length));
  if (!description) return null;
  const yamlValue = description.replace(/'/g, "''");
  return content.replace(PLACEHOLDER_RE, `description: '${yamlValue}'`);
}

async function listMarkdownFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(entry => {
      const entryPath = path.join(directory, entry.name);
      return entry.isDirectory()
        ? listMarkdownFiles(entryPath)
        : entry.name.endsWith(".md")
          ? [entryPath]
          : [];
    })
  );
  return nested.flat();
}

export async function repairBlogDescriptions(directory) {
  const files = await listMarkdownFiles(directory);
  const changed = [];
  const unresolved = [];

  for (const file of files) {
    const content = await readFile(file, "utf8");
    if (!PLACEHOLDER_RE.test(content)) continue;
    const repaired = repairDescription(content);
    if (!repaired) {
      unresolved.push(file);
      continue;
    }
    await writeFile(file, repaired, "utf8");
    changed.push(file);
  }

  return { changed, unresolved };
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : "";
if (invokedPath === fileURLToPath(import.meta.url)) {
  const directory = path.resolve(process.argv[2] ?? "src/data/blog");
  const result = await repairBlogDescriptions(directory);
  // eslint-disable-next-line no-console
  console.log(
    JSON.stringify(
      {
        directory,
        changed: result.changed.length,
        unresolved: result.unresolved.map(file => path.relative(directory, file)),
      },
      null,
      2
    )
  );
  if (result.unresolved.length > 0) process.exitCode = 1;
}
