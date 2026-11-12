// RFC 9727 (https://www.rfc-editor.org/rfc/rfc9727) API catalog: lets
// agents discover Attestly's published APIs. Route handler rather than a
// static /public file, because the Content-Type the spec requires
// (application/linkset+json with a profile parameter) isn't something
// static-file serving reliably sets — this gives exact control over it.
//
// Lists only the one API actually published for external/agent use (POST
// /api/traces/ingest, bearer API-key auth). The session-gated dashboard
// endpoints (/api/systems/create, /api/api-keys/create,
// /api/organizations/create) are internal to the dashboard's own frontend,
// not published external APIs — they require a browser login an agent
// doesn't have, so listing them here would be misleading rather than
// useful. See /auth.md for how to authenticate against the listed API.

export async function GET() {
  const catalog = {
    linkset: [
      {
        anchor: "https://attestly.online/api/traces/ingest",
        "service-desc": [{ href: "https://attestly.online/openapi/traces-ingest.json", type: "application/json" }],
        "service-doc": [{ href: "https://attestly.online/auth.md", type: "text/markdown" }],
      },
    ],
  };

  return new Response(JSON.stringify(catalog, null, 2), {
    status: 200,
    headers: {
      "Content-Type": 'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"',
    },
  });
}
