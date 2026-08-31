import type { MetadataRoute } from "next";

// Explicit allow-list for every AI crawler with a documented user-agent as of
// 2026, across all three categories (training, search/retrieval, and
// user-triggered fetch), plus standard search engines. Nothing under
// /dashboard, /api, or /auth is ever crawlable — those require login and
// crawling them serves no discovery purpose while adding attack surface.
export default function robots(): MetadataRoute.Robots {
  const aiAndSearchBots = [
    // OpenAI
    "GPTBot",
    "ChatGPT-User",
    "OAI-SearchBot",
    // Anthropic
    "ClaudeBot",
    "Claude-Web",
    "Claude-SearchBot",
    "Claude-User",
    "anthropic-ai",
    // Perplexity
    "PerplexityBot",
    "Perplexity-User",
    // Google (AI-specific tokens; Googlebot itself is handled separately below)
    "Google-Extended",
    "Google-CloudVertexBot",
    "GoogleOther",
    // Apple
    "Applebot",
    "Applebot-Extended",
    // Microsoft
    "Bingbot",
    // Meta
    "meta-externalagent",
    "FacebookBot",
    // Common Crawl (feeds most open-weight model training sets)
    "CCBot",
    // ByteDance
    "Bytespider",
    // Amazon
    "Amazonbot",
    // Cohere
    "cohere-ai",
    // Diffbot, You.com
    "Diffbot",
    "YouBot",
    // Omgili (feeds several third-party training sets)
    "Omgilibot",
    "Omgili",
  ];

  const disallowPaths = ["/dashboard", "/api", "/auth", "/invite"];

  return {
    rules: [
      // Everyone else (including plain Googlebot, and any AI crawler not yet
      // added to the explicit list above) gets the same open default.
      {
        userAgent: "*",
        allow: "/",
        disallow: disallowPaths,
      },
      ...aiAndSearchBots.map((agent) => ({
        userAgent: agent,
        allow: "/",
        disallow: disallowPaths,
      })),
    ],
    sitemap: "https://attestly-one.vercel.app/sitemap.xml",
  };
}
