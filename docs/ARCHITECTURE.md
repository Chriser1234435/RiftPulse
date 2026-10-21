# RiftPulse Architecture

**Status:** Proposed baseline from Step 2. No cloud services or new application code are created by this document.

## System boundaries
- **Web UI / identity:** AppDeploy-hosted website and AppDeploy-native authentication. Protected API handlers validate the AppDeploy bearer token through documented platform middleware.
- **Application API:** AppDeploy backend routes for user-scoped dashboard actions where supported. Derive identity from verified server context, never a browser-supplied user ID.
- **Relational persistence:** Neon PostgreSQL for product records and relational constraints. AppDeploy's app database is not a substitute for PostgreSQL migrations.
- **Streaming connector services:** Railway for durable webhook endpoints and workers where needed. Connector processing must continue while the player's PC is offline.
- **PCVR client:** Existing BSIPA/C# plugin targeting the selected BSManager Beat Saber 1.40.8 profile.
- **Quest client:** Separate native Android/Quest implementation; never reuse or rename the PCVR DLL.
- **Shared contracts:** Versioned JSON/HTTP event and configuration contracts under `shared/protocol/`; no privileged credentials in these contracts.

## Request and event flows
1. The user signs in through AppDeploy-native authentication.
2. The web client calls AppDeploy API routes using the documented client, which attaches the bearer token.
3. Protected routes use documented auth middleware and obtain the stable user ID from verified server context.
4. API/worker operations access only records owned by that identity, using least-privilege database access.
5. Platform OAuth callbacks/webhooks enter connector services, are validated, normalized, deduplicated, and delivered through bounded queues.
6. PCVR/Quest clients use outbound HTTPS and scoped installation credentials. Revoked installations are rejected server-side.
7. The game client processes events asynchronously and degrades safely if the network/cloud fails.

## Data ownership
Proposed records include users keyed by AppDeploy stable user ID (not a second login system), platform connections, encrypted token references/metadata, installations, one-time pairing challenges, revocation records, versioned settings, deduplication keys, and bounded diagnostics. Exact tables and constraints belong to Step 4.

## Authentication and secret boundaries
- AppDeploy is authoritative for user identity.
- Never trust a client-provided user ID as authorization.
- Validate OAuth state, redirect URI, scopes, token audience/issuer/expiry, webhook signatures, and replay windows as applicable.
- Keep app-wide secrets in backend-only secret stores.
- Encrypt per-user platform tokens at rest with keys held separately from database data.
- Never place user tokens or database-owner credentials in browser code, source control, logs, or game binaries.
- Redact authorization headers, OAuth codes, tokens, pairing codes, and sensitive request bodies from logs.

## Availability and performance
Use bounded queues, request timeouts, deduplication, capped retries with exponential backoff and jitter, and explicit stale/unavailable status. No blocking cloud call on the Beat Saber main thread. Cloud failure must not crash or freeze gameplay.

## Proposed environments
Development and production must use distinct app configuration, secrets, database targets, OAuth callbacks, and service deployments. Do not test destructive migrations against production without a verified recovery plan.

## Decisions deferred
- Exact AppDeploy-to-Railway trust boundary and supported server-to-server authentication.
- Exact API runtime/framework and deployment topology.
- Neon branch strategy, schema, and database role model.
- Connector transport per platform and event type.
- Translation provider/model, licensing, hosting, and budget.
- Quest loader/SDK version and physical-device compatibility.

These decisions require verification against actual product capabilities and are not claims of implemented behavior.
