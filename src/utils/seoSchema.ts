import { SITE } from "../config.ts";
import { GEO_PROFILE } from "../data/geoProfile.ts";

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
  keywords?: readonly string[];
  citations?: readonly (string | URL)[];
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

function buildPerson(
  author: string = SITE.author,
  profile: string = SITE.profile
) {
  return compactObject({
    "@type": "Person",
    "@id": `${SITE.website}#person`,
    name: author,
    url: profile,
    sameAs: SITE.sameAs,
    knowsAbout: GEO_PROFILE.topics,
    subjectOf: GEO_PROFILE.primaryPages.map(page => ({
      "@type": "WebPage",
      name: page.title,
      url: page.url,
      description: page.description,
    })),
  });
}

function buildTopicThings(topics: readonly string[]) {
  return topics.map(topic => ({
    "@type": "Thing",
    name: topic,
  }));
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
    keywords = [],
    citations = [],
  } = input;

  const person = buildPerson(author, profile);
  const image = imageURL?.href;
  const graph: Record<string, unknown>[] = [person];
  const pageTopics =
    keywords.length > 0 ? keywords : GEO_PROFILE.topics.slice(0, 6);
  const citationUrls = citations.map(
    citation => new URL(String(citation), SITE.website).href
  );

  if (pageType === "website") {
    graph.push({
      "@type": "WebSite",
      "@id": `${SITE.website}#website`,
      name: SITE.title,
      url: SITE.website,
      description,
      inLanguage: SITE.lang,
      publisher: person,
      about: buildTopicThings(GEO_PROFILE.topics.slice(0, 8)),
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
        inLanguage: SITE.lang,
        about: buildTopicThings(GEO_PROFILE.topics.slice(0, 8)),
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
        inLanguage: SITE.lang,
        about: buildTopicThings(pageTopics),
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
        abstract: description,
        image,
        datePublished: pubDatetime?.toISOString(),
        dateModified: (modDatetime || pubDatetime)?.toISOString(),
        inLanguage: SITE.lang,
        isAccessibleForFree: true,
        keywords: pageTopics.join(", "),
        about: buildTopicThings(pageTopics),
        citation: citationUrls,
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
        inLanguage: SITE.lang,
        about: buildTopicThings(pageTopics),
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
