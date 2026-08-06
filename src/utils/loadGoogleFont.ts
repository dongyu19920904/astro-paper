import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";

type OgFont = {
  name: string;
  data: ArrayBuffer;
  weight: number;
  style: string;
};

const regularCandidates = [
  process.env.AIVORA_OG_FONT_REGULAR,
  "C:/Windows/Fonts/simhei.ttf",
  "C:/Windows/Fonts/arial.ttf",
  "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.otf",
  "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
  "/System/Library/Fonts/Supplemental/Arial Unicode.ttf",
].filter(Boolean) as string[];

const boldCandidates = [
  process.env.AIVORA_OG_FONT_BOLD,
  "C:/Windows/Fonts/simhei.ttf",
  "C:/Windows/Fonts/arialbd.ttf",
  "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.otf",
  "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
  "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
].filter(Boolean) as string[];

function toArrayBuffer(buffer: Buffer): ArrayBuffer {
  const bytes = new Uint8Array(buffer);
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return copy.buffer;
}

async function loadFirstAvailableFont(paths: string[]): Promise<ArrayBuffer> {
  for (const fontPath of paths) {
    if (!existsSync(fontPath)) continue;
    const buffer = await readFile(fontPath);
    return toArrayBuffer(buffer);
  }

  throw new Error(
    "No local OG font found. Set AIVORA_OG_FONT_REGULAR and AIVORA_OG_FONT_BOLD."
  );
}

async function loadGoogleFonts(_text: string): Promise<OgFont[]> {
  const regular = await loadFirstAvailableFont(regularCandidates);
  let bold = regular;

  try {
    bold = await loadFirstAvailableFont(boldCandidates);
  } catch {
    bold = regular;
  }

  return [
    { name: "Aivora OG Font", data: regular, weight: 400, style: "normal" },
    { name: "Aivora OG Font", data: bold, weight: 700, style: "normal" },
  ];
}

export default loadGoogleFonts;
