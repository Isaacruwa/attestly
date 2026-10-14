// Best-effort HTML -> Markdown conversion, used for markdown content
// negotiation (see src/middleware.ts). This is a string/regex-based
// converter, not a full HTML parser — it targets this site's own
// server-rendered Next.js output (divs/spans with inline styles, no deeply
// irregular third-party markup) rather than arbitrary HTML. It intentionally
// has zero new dependencies, to keep this addition low-risk. Test it
// against a few real pages (a text-heavy guide, a page with a table, a page
// with nested links) before relying on it broadly — regex-based conversion
// can mishandle unusual nesting that a real parser wouldn't.

function stripTag(html: string, tag: string): string {
  const re = new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?<\\/${tag}>`, "gi");
  return html.replace(re, "");
}

function decodeEntities(s: string): string {
  return s
    .replace(/&nbsp;/g, " ")
    .replace(/&mdash;/g, "\u2014")
    .replace(/&ndash;/g, "\u2013")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&#x27;/gi, "'");
}

export function htmlToMarkdown(html: string): string {
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  let content = bodyMatch ? bodyMatch[1] : html;

  // Drop non-content chrome and anything not meant to be read as text.
  for (const tag of ["script", "style", "noscript", "svg", "nav", "footer", "head"]) {
    content = stripTag(content, tag);
  }

  // Headings
  content = content.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, "\n# $1\n");
  content = content.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, "\n## $1\n");
  content = content.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, "\n### $1\n");
  content = content.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, "\n#### $1\n");
  content = content.replace(/<h5[^>]*>([\s\S]*?)<\/h5>/gi, "\n##### $1\n");
  content = content.replace(/<h6[^>]*>([\s\S]*?)<\/h6>/gi, "\n###### $1\n");

  // Links — before stripping other tags, so href survives.
  content = content.replace(
    /<a\s+[^>]*href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi,
    (_m, href, text) => `[${text.replace(/<[^>]+>/g, "").trim()}](${href})`
  );

  // Images (alt text only — no point linking to the actual asset for an agent)
  content = content.replace(/<img\s+[^>]*alt=["']([^"']*)["'][^>]*\/?>/gi, (_m, alt) => (alt ? `![${alt}]` : ""));

  // Emphasis
  content = content.replace(/<(strong|b)[^>]*>([\s\S]*?)<\/\1>/gi, "**$2**");
  content = content.replace(/<(em|i)[^>]*>([\s\S]*?)<\/\1>/gi, "*$2*");

  // Code
  content = content.replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, (_m, code) => `\n\`\`\`\n${code.replace(/<[^>]+>/g, "")}\n\`\`\`\n`);
  content = content.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, "`$1`");

  // Blockquotes (before generic tag stripping, so we can prefix each line)
  content = content.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_m, inner) => {
    const text = inner.replace(/<[^>]+>/g, "").trim();
    return (
      text
        .split("\n")
        .map((line: string) => `> ${line.trim()}`)
        .join("\n") + "\n"
    );
  });

  // Lists
  content = content.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, "- $1\n");
  content = content.replace(/<\/?(ul|ol)[^>]*>/gi, "\n");

  // Tables (lightweight: pipe-separated cells, not full GFM table syntax)
  content = content.replace(/<\/(td|th)>/gi, " | ");
  content = content.replace(/<tr[^>]*>/gi, "\n");

  // Paragraphs and line breaks
  content = content.replace(/<br\s*\/?>/gi, "\n");
  content = content.replace(/<\/p>/gi, "\n\n");

  // Everything else: strip tags, keep text.
  content = content.replace(/<[^>]+>/g, "");

  content = decodeEntities(content);
  content = content.replace(/[ \t]+/g, " ");
  content = content.replace(/\n[ \t]+/g, "\n");
  content = content.replace(/\n{3,}/g, "\n\n");

  return content.trim();
}

// Rough chars-per-token heuristic (~4 chars/token for English), not a real
// tokenizer — good enough for the advisory x-markdown-tokens header without
// adding a tokenizer dependency.
export function estimateTokenCount(text: string): number {
  return Math.ceil(text.length / 4);
}
