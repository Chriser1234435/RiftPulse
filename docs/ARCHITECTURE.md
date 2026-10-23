# RiftPulse Architecture

**Status:** Target architecture updated during Step 3. The local authentication foundation is implemented, but external Clerk configuration and live acceptance remain pending.

## Hosting and system boundaries
- **Website:** Cloudflare Pages, intended public hostname `riftpulse.me`. No Pages project/deployment is verified yet.
- **API and background workers:** Railway. Intended API hostname: `api.riftpulse.me`, not configured or verified.
- **Relational persistence:** Neon PostgreSQL with versioned migrations, environment separation, and least-privilege runtime roles. No RiftPulse Neon project/schema is verified yet.
- **Customer identity:** Clerk is selected for managed sign-up/sign-in and server-verifiable sessions. The local React client uses `@clerk/react`; the Express API uses `@clerk/express`. No Clerk app keys have been configured, so live authentication is not yet verified. Clerk is an identity provider, not the application database.
- **PCVR client:** Existing BSIPA/C# plugin targeting the selected BSManager Beat Saber 1.40.8 profile.
- **Quest client:** Separate native Android/Quest implementation; never reuse or rename the PCVR DLL.
- **Shared contracts:** Versioned JSON/HTTP event and configuration contracts under `shared/protocol/`; no privileged credentials in these contracts.

## Request and event flows
1. User opens the Cloudflare Pages website over HTTPS.
2. Clerk handles sign-up, sign-in, email verification/password recovery according to the selected dashboard settings, and browser session lifecycle.
3. The client requests a short-lived session token using the Clerk SDK and sends it to the Railway API in an Authorization Bearer header.
4. The API validates the Clerk session using `@clerk/express` and derives identity only from verified claims. It never trusts a caller-provided user ID.
5. The API later accesses Neon with a least-privilege role and owner-scoped queries; persistence is not implemented in this step.
6. Provider OAuth callbacks/webhooks enter designated backend endpoints, are validated for state/signature/timestamp/replay, normalized, deduplicated, and dispatched through bounded work queues.
7. PCVR/Quest clients use outbound HTTPS and scoped installation credentials. Revoked installations are rejected server-side.
8. Game clients process events asynchronously and degrade safely if network/cloud services fail.

## DNS and domain migration
- Cloudflare zone `riftpulse.me` is active according to the connected Cloudflare API inventory.
- Observed existing records include apex A/AAAA records, `app.riftpulse.me` CNAME to `proxy-v2.appdeploy.ai`, and IONOS mail/domain records.
- Keep current web records until the replacement deployment and rollback are ready. Do not delete or rewrite MX/SPF/DMARC/mail-related records as part of a web migration.
- `app.riftpulse.me` is a legacy target. Decide later whether to redirect or retire it after the replacement is tested.
- `api.riftpulse.me` is reserved as a target, not configured or verified.
- Do not claim a website is healthy based solely on an active Cloudflare zone.

## Data ownership
Candidate records include Clerk user-ID mapping, platform connections and encrypted token references/metadata, installations, one-time pairing challenges, revocation records, versioned settings, subscription state and verified billing-event IDs, event deduplication keys, and bounded diagnostics. Exact tables, indexes, retention, roles, migrations, and isolation tests belong to the database step. Application data persistence is not implemented in Step 3.

## Authentication and secret boundaries
- Clerk is the selected customer identity provider; AppDeploy is not a live dependency.
- The frontend may contain only the Clerk publishable key. The Clerk secret key belongs only in server-side environment configuration.
- Never trust a client-provided user ID as authorization.
- The API accepts bearer session tokens and verifies them through Clerk middleware. It does not return tokens in responses.
- Configure CORS for exact allowed website origins; do not enable credentialed cookies unnecessarily.
- Keep app-wide secrets in backend-only secret stores.
- Encrypt per-user platform tokens at rest with keys held separately from database data.
- Never place user tokens or database-owner credentials in browser code, source control, logs, or game binaries.
- Redact authorization headers, OAuth codes, tokens, pairing codes, and sensitive request bodies from logs.
- Use HTTPS, request limits, timeouts, bounded retries, and structured redacted diagnostics.

## Subscriptions and integrations
- Free: $0/month. Premium: $7.99/month.
- Server-side entitlements are authoritative. Do not trust client plan flags or browser redirects.
- Checkout and signed billing webhooks remain server-side; webhook events must be verified, deduplicated, and idempotent.
- No payment provider is selected or provisioned.
- Planned connector order: Twitch, YouTube, TikTok LIVE, KICK. Verify each provider's scopes, review/eligibility, event support, quotas, and credentials before making capability claims.

## Availability and performance
Use bounded queues, request timeouts, deduplication, capped retries with exponential backoff and jitter, and explicit stale/unavailable status. No blocking cloud call on the Beat Saber main thread. Cloud failure must not crash or freeze gameplay. Workers must continue when the player's PC is offline.

## Proposed environments and release strategy
Development/test and production use distinct configuration, secrets, database targets, OAuth callbacks, and service deployments. Test preview/staging before DNS cutover. Record current DNS values and define rollback to previous web targets. Preserve mail records. Do not run destructive migrations against production without a verified recovery plan. No production deployment, DNS change, or paid upgrade was made during Step 3.

## Decisions deferred
- Clerk application ownership/claiming, keys, dashboard sign-up settings, and live acceptance.
- Neon branch strategy, schema, database roles, backup/retention.
- Exact Railway project/service provisioning and production environment variables.
- Payment provider, billing fees, and webhook setup.
- Connector transport per platform and event type.
- Translation provider/model, licensing, hosting, and budget.
- Quest loader/SDK version and physical-device compatibility.
