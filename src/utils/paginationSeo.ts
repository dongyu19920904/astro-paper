type PaginationSeoOptions = {
  title: string;
  description: string;
  canonicalBase: string | URL;
  currentPage: number;
  siteTitle: string;
};

export function buildPaginationSeo({
  title,
  description,
  canonicalBase,
  currentPage,
  siteTitle,
}: PaginationSeoOptions) {
  const base = new URL(canonicalBase);
  const pageNumber = Math.max(1, currentPage);
  const canonicalURL =
    pageNumber === 1
      ? base
      : new URL(`${base.pathname.replace(/\/?$/, "/")}${pageNumber}/`, base);

  return {
    title:
      pageNumber === 1
        ? `${title} | ${siteTitle}`
        : `${title} - 第 ${pageNumber} 页 | ${siteTitle}`,
    description:
      pageNumber === 1
        ? description
        : `${description}当前为第 ${pageNumber} 页。`,
    canonicalURL: canonicalURL.href,
  };
}
