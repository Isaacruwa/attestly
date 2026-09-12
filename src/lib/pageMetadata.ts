import type { Metadata } from "next";

const SITE_URL = "https://attestly.online";
const SITE_NAME = "Attestly";

// Central helper so every route gets a consistent, unique <title>, meta
// description, canonical, and — critically — its own openGraph/twitter
// title+description instead of silently inheriting the root layout's
// defaults. Next.js does not deep-merge nested metadata fields like
// `openGraph` across segments, so each page has to set its own.
export function buildMetadata({
  title,
  description,
  path,
  noindex = false,
}: {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
}): Metadata {
  const url = `${SITE_URL}${path}`;

  const meta: Metadata = {
    title,
    description,
    alternates: { canonical: url },
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
