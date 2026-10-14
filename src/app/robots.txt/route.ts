// Served as a literal route segment (not the typed `robots.ts` metadata
// convention) because Next.js's MetadataRoute.Robots type only knows how to
// emit User-agent/Allow/Disallow/Sitemap — it has no field for the
// Content-Signal directive (https://contentsignals.org/, IETF
// draft-romm-aipref-contentsignals), so that directive can't be expressed
// through the typed file. This writes the exact same bot list and policy
// the previous robots.ts produced, in plain text, plus one added line.

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
  // Google (AI-specific tokens; plain Googlebot falls under the wildcard group)
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

const disallowPaths = ["/dashboard", "/api", "/invite", "/admin"];

// Content Signals (https://contentsignals.org/): a site-wide preference,
// since every User-agent group below shares the same Allow/Disallow policy
// — there's no per-bot differentiation to express yet. search=yes and
// ai-input=yes keep Attestly discoverable and citable in AI answers
// (matching the intent already expressed by publishing llms.txt/
// llms-full.txt); ai-train=no opts out of being used as model training
// data. Declared once, on the wildcard group, per the spec (a single
// Content-Signal line in the `User-agent: *` group is a valid, sufficient
// declaration — it isn't required on every named bot's group too).
const contentSignal = "Content-Signal: search=yes, ai-input=yes, ai-train=no";

function buildGroup(userAgent: string, includeContentSignal: boolean): string {
  const lines = [
    `User-agent: ${userAgent}`,
    "Allow: /",
    ...disallowPaths.map((p) => `Disallow: ${p}`),
  ];
  if (includeContentSignal) lines.push(contentSignal);
  return lines.join("\n");
}

export async function GET() {
  const groups = [
    buildGroup("*", true),
    ...aiAndSearchBots.map((agent) => buildGroup(agent, false)),
  ];

  const body = `${groups.join("\n\n")}\n\nSitemap: https://attestly.online/sitemap.xml\n`;

  return new Response(body, {
    status: 200,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
