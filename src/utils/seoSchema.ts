import { SITE } from "../config.ts";

export type PageSchemaType =
  | "website"
  | "profile"
  | "collection"
  | "article"
  | "webpage";

export type BreadcrumbItem = {
  name: string;
  url: string | URL;
};

type SchemaInput = {
  pageType: PageSchemaType;
  title: string;
  description: string;
  canonicalURL: URL;
  imageURL?: URL;
  author?: string;
  profile?: string;
  pubDatetime?: Date;
  modDatetime?: Date | null;
  breadcrumbs?: BreadcrumbItem[];
};

function compactObject<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(
    Object.entries(value).filter(([, item]) => {
      if (item === null || typeof item === "undefined") return false;
      if (Array.isArray(item) && item.length === 0) return false;
      return true;
    })
  ) as Partial<T>;
}

function buildPerson(author: string = SITE.author, profile: string = SITE.profile) {
  return compactObject({
    "@type": "Person",
    "@id": `${SITE.website}#person`,
    name: author,
    url: profile,
    sameAs: SITE.sameAs,
  });
}

function buildBreadcrumbs(items: BreadcrumbItem[], canonicalURL: URL) {
  const normalizedItems =
    items.length > 0
      ? items
      : [
          { name: "首页", url: SITE.website },
          { name: "当前页面", url: canonicalURL },
        ];

  return {
    "@type": "BreadcrumbList",
    "@id": `${canonicalURL.href}#breadcrumb`,
    itemListElement: normalizedItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: new URL(String(item.url), SITE.website).href,
    })),
  };
}

export function buildStructuredData(input: SchemaInput) {
  const {
    pageType,
    title,
    description,
    canonicalURL,
    imageURL,
    author,
    profile,
    pubDatetime,
    modDatetime,
    breadcrumbs = [],
  } = input;

  const person = buildPerson(author, profile);
  const image = imageURL?.href;
  const graph: Record<string, unknown>[] = [person];

  if (pageType === "website") {
    graph.push({
      "@type": "WebSite",
      "@id": `${SITE.website}#website`,
      name: SITE.title,
      url: SITE.website,
      description,
      publisher: person,
    });
  } else if (pageType === "profile") {
    graph.push(
      compactObject({
        "@type": "ProfilePage",
        "@id": `${canonicalURL.href}#profile`,
        url: canonicalURL.href,
        name: title,
        description,
        mainEntity: person,
        image,
      })
    );
  } else if (pageType === "collection") {
    graph.push(
      compactObject({
        "@type": "CollectionPage",
        "@id": `${canonicalURL.href}#collection`,
        url: canonicalURL.href,
        name: title,
        description,
        isPartOf: { "@id": `${SITE.website}#website` },
        about: person,
        image,
      })
    );
  } else if (pageType === "article") {
    graph.push(
      compactObject({
        "@type": "BlogPosting",
        "@id": `${canonicalURL.href}#article`,
        mainEntityOfPage: canonicalURL.href,
        headline: title,
        description,
        image,
        datePublished: pubDatetime?.toISOString(),
        dateModified: (modDatetime || pubDatetime)?.toISOString(),
        author: person,
        publisher: person,
      })
    );
  } else {
    graph.push(
      compactObject({
        "@type": "WebPage",
        "@id": `${canonicalURL.href}#webpage`,
        url: canonicalURL.href,
        name: title,
        description,
        isPartOf: { "@id": `${SITE.website}#website` },
        about: person,
        image,
      })
    );
  }

  if (canonicalURL.pathname !== "/") {
    graph.push(buildBreadcrumbs(breadcrumbs, canonicalURL));
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}
