import type { MetadataRoute } from "next";
import { GLOSSARY_TERMS } from "@/lib/glossary";

const CONTENT_UPDATED = new Date("2026-11-07");
const SITE_UPDATED = new Date("2026-10-30");

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.attestly.online";
  const entries: MetadataRoute.Sitemap = [
    {
      url: base,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/fr`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${base}/de`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${base}/glossary`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...GLOSSARY_TERMS.map((t) => ({
      url: `${base}/glossary/${t.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    {
      url: `${base}/why-traces-over-scans`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/guides`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/guides/eu-ai-act-annex-iv-explained`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/guides/annex-iv-template`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/guides/ai-act-article-72-monitoring`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/guides/eu-ai-act-article-12-logging`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/guides/high-risk-ai-examples`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/about`,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${base}/changelog`,
      changeFrequency: "weekly",
      priority: 0.4,
    },
    {
      url: `${base}/attestly-vs-aiacto`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${base}/attestly-vs-openlayer`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${base}/attestly-vs-credo-ai`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${base}/attestly-vs-holistic-ai`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${base}/attestly-vs-manual-process`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${base}/pricing`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${base}/eu-ai-act-risk-checker`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${base}/fr/eu-ai-act-risk-checker`,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${base}/de/eu-ai-act-risk-checker`,
      changeFrequency: "monthly",
      priority: 0.85,
    },
  ];

  // Real dates (not "now" on every build): update CONTENT_UPDATED when guides,
  // glossary or comparison pages change, and SITE_UPDATED for other pages.
  return entries.map((e) => ({
    ...e,
    lastModified: /\/(guides|glossary|attestly-vs-|why-traces)/.test(e.url) ? CONTENT_UPDATED : SITE_UPDATED,
  }));
}
