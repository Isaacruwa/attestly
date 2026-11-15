# auth.md

This file follows the [auth.md](https://auth0.com/auth.md) agent-registration-discovery convention so AI agents and automated clients can find out how to authenticate with Attestly's API.

## Who this is for

Agents and scripts acting on behalf of an existing Attestly account — for example, a scheduled job that imports
agent trace data, or a coding agent managing an organization's AI-system documentation on a user's behalf.
This is not for end users signing up through the dashboard; that's regular email/password authentication at
https://attestly.online/login, out of scope for this file.

## Current state: no OAuth

Attestly does not run an OAuth authorization server or publish OAuth Protected Resource Metadata. There is no
`/.well-known/oauth-protected-resource` or `/.well-known/oauth-authorization-server` endpoint, and no
`agent_auth` block, because neither applies yet. This section exists so a scanner checking for OAuth metadata
fails informatively rather than silently — if that changes, this file will be updated to match.

## How an agent authenticates: API keys

Attestly uses bearer API keys, not OAuth.

- **Registration/provisioning.** There is no public, unauthenticated self-registration endpoint for API keys.
  A key is provisioned by a human who already has an authenticated Attestly account, via the dashboard at
  `https://attestly.online/dashboard/settings/api-keys` (requires logging in first at
  `https://attestly.online/login`). An agent cannot register itself; a person has to create the key for it.
- **Key format.** Keys look like `atly_live_<48 hex characters>`. Only the sha256 hash of a key is ever
  stored server-side; the plaintext is shown once, at creation time, and cannot be recovered afterward.
- **Using a key.** Send it as a standard bearer token:

  ```
  Authorization: Bearer atly_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  ```

- **Scope.** A key authenticates as the organization it was created under. It currently authorizes:
  - `POST /api/traces/ingest` — import agent runtime trace data (OpenTelemetry, LangSmith, AgentOps, MCP
    session logs, or pre-normalized JSON) into that organization's AI systems.
- **Revocation.** Keys are revoked from the same dashboard page, immediately and permanently. A revoked key
  stops authenticating on its next use; there is no grace period.
- **Rate limits.** None are currently enforced beyond the organization's plan-level usage limits.

## What this does *not* cover

Creating or managing AI systems, documentation projects, or organization membership via API key is not yet
supported — those currently require a logged-in dashboard session. This file will be updated if that changes.
