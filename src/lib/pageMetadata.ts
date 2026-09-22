import type { Metadata } from "next";

const SITE_URL = "https://attestly.online";
const SITE_NAME = "Attestly";

export type HreflangMap = {
  en: string;
  fr?: string;
  de?: string;
};

// Central helper so every route gets a consistent, unique <title>, meta
// description, canonical, and — critically — its own openGraph/twitter
// title+description instead of silently inheriting the root layout's
// defaults. Next.js does not deep-merge nested metadata fields like
// `openGraph` across segments, so each page has to set its own.
//
// `hreflang`, when provided, maps locale -> path (not full URL) for every
// language version of this page, and generates the corresponding
// <link rel="alternate" hreflang="..."> tags plus x-default (pointing at
// the English version) via Next's `alternates.languages`.
export function buildMetadata({
  title,
  description,
  path,
  noindex = false,
  hreflang,
}: {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
  hreflang?: HreflangMap;
}): Metadata {
  const url = `${SITE_URL}${path}`;

  const meta: Metadata = {
    title,
    description,
    alternates: hreflang
      ? {
          canonical: url,
          languages: {
            en: `${SITE_URL}${hreflang.en}`,
            ...(hreflang.fr ? { fr: `${SITE_URL}${hreflang.fr}` } : {}),
            ...(hreflang.de ? { de: `${SITE_URL}${hreflang.de}` } : {}),
            "x-default": `${SITE_URL}${hreflang.en}`,
          },
        }
      : { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };

  if (noindex) {
    meta.robots = { index: false, follow: false };
  }

  return meta;
}
