import { cpSync, existsSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { isAbsolute, relative, resolve, sep } from "node:path";

const projectRoot = fileURLToPath(new URL("..", import.meta.url));
const source = resolve(projectRoot, "dist/pagefind");
const destination = resolve(projectRoot, "public/pagefind");
const destinationRelative = relative(projectRoot, destination);

if (
  destinationRelative === "" ||
  destinationRelative === ".." ||
  destinationRelative.startsWith(`..${sep}`) ||
  isAbsolute(destinationRelative)
) {
  throw new Error(`Refusing unsafe Pagefind destination: ${destination}`);
}

if (!existsSync(source)) {
  throw new Error(`Pagefind output not found: ${source}`);
}

rmSync(destination, { recursive: true, force: true });
cpSync(source, destination, { recursive: true });

process.stdout.write(`Copied Pagefind assets to ${destination}\n`);
