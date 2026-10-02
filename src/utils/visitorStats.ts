export function formatVisitorMetric(value: unknown): string {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0
    ? new Intl.NumberFormat("zh-CN").format(value)
    : "--";
}

export function buildVisitorWidgetUrl(value: string): string {
  if (!value) return "";
  const url = new URL(value);
  if (
    url.protocol !== "https:" ||
    url.hostname !== "v6-widget.51.la" ||
    url.username ||
    url.password ||
    url.port ||
    !/^\/v6\/[a-zA-Z0-9]+\/quote\.js$/.test(url.pathname)
  ) {
    throw new Error("Expected a public 51LA widget URL");
  }
  url.search = "";
  url.hash = "";
  url.searchParams.set("theme", "0");
  url.searchParams.set("f", "14");
  url.searchParams.set("col", "true");
  return url.toString();
}
