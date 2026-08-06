export function cleanPostDescription(description: string | undefined, fallback: string) {
  const value = String(description || "").trim();
  if (!value || /^Table of contents$/i.test(value) || /^目录$/.test(value)) {
    return fallback;
  }
  return value;
}
