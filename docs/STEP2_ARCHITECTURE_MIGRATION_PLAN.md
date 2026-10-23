
# RiftPulse — Step 2 Architecture and Migration Plan

**Date:** 2026-10-21  
**Status:** Complete with documented limitations - planning and documentation only
**Approval:** User approved starting Step 2. Step 3 or any implementation/provisioning step is not approved by this authorization.  
**Domain:** `riftpulse.me`  
**Hosting decision:** Cloudflare Pages replaces AppDeploy for the website. Neon PostgreSQL is the intended relational database. Railway is the intended API/worker host.

## 1. Step 2 objective

Define a supportable architecture and safe migration path from the current repository and DNS state to a production-independent RiftPulse system. Do not create provider resources, deploy code, change DNS, purchase plans, implement the website/backend, or begin a later roadmap step in this phase.

## 2. Verified current state

- Local repository: `E:\RiftPulse\`, branch `main`, HEAD `b1aaeba` at inspection time.
- The local web, services, and Quest areas are placeholders; no production website/API/Quest implementation is established by the Step 1 audit.
- The former AppDeploy RiftPulse app is reported deleted. Previous AppDeploy auth tests are historical and must not be treated as a currently available identity service.
- Cloudflare integration is authenticated. Account inventory returns the zone `riftpulse.me` with status `active`, not paused.
- The Cloudflare zone currently has apex A and AAAA records pointing at an existing hosting address and a proxied `app.riftpulse.me` CNAME pointing to `proxy-v2.appdeploy.ai`. Other records include IONOS MX records and SPF/DMARC/domain-connect-related records. No Cloudflare Pages project was returned in the earlier read-only inventory.
- DNS records are evidence of configured targets, not proof that those web targets currently serve a healthy page.
- Neon inventory previously returned no RiftPulse project. Railway inventory previously returned no RiftPulse project. The local repository has no configured Git remote and no accessible GitHub repository was returned.
- Existing local worktree changes and untracked documentation are present. They must be preserved; do not reset or discard them.
- No resources, DNS records, deployments, or paid plans were created or changed during Step 2 planning.

## 3. Target architecture

### 3.1 Website and DNS

- **Cloudflare Pages** hosts the static website and frontend assets.
- Use the apex `riftpulse.me` as the intended public website hostname after a Pages project exists and a cutover is explicitly approved.
- Treat `app.riftpulse.me` as an existing legacy AppDeploy target. Decide whether it will redirect to the apex or be retired only after the new site is deployed and tested; do not change it during planning.
- Reserve `api.riftpulse.me` as the intended API hostname, subject to a Railway service being created and its custom-domain target being verified.
- Keep email-related DNS records (MX and TXT/SPF and any required mail-provider records) intact. Do not blindly proxy MX records or rewrite mail configuration.
- Do not change apex A/AAAA or the `app` CNAME until Cloudflare Pages deployment and custom-domain validation are ready. Capture existing values before any approved cutover and verify rollback steps.

### 3.2 API and workers

- **Railway** hosts the server-side API and long-running connector/background workers that require a persistent process.
- API and workers share versioned application contracts but remain separated by responsibility and credentials.
- The API is responsible for authorization, ownership checks, subscription entitlements, integration configuration, installation pairing/revocation, and web-appropriate user settings.
- Connector workers validate OAuth callbacks/webhook signatures, validate timestamps/replay windows, normalize provider events, deduplicate events, and enqueue bounded work.
- Background work must continue when the user's game PC is offline.
- No secrets, database owner credentials, payment-provider secrets, or per-user platform tokens may be embedded in the browser bundle or game-client binaries.

### 3.3 Database

- **Neon PostgreSQL** is the intended persistent relational store.
- Use version-controlled SQL migrations and explicit development/production separation. Define least-privilege runtime roles; the app runtime must not use an owner/admin credential.
- Enforce per-user ownership in server-side queries and database constraints where appropriate.
- Candidate data domains: user/profile mapping, platform connections and encrypted token references, installation/pairing/revocation records, versioned settings, subscription state and verified billing-event IDs, event deduplication keys, and bounded diagnostics.
- Exact tables, indexes, retention, migration commands, backup/recovery, and cross-user isolation tests belong to the later database step. No schema is created in Step 2.

### 3.4 Game clients and modules

- Keep PCVR (BSIPA/C#) and Quest (native Android/Quest) as separate clients and build/release paths.
- Share only versioned, non-secret protocol/configuration contracts.
- Gameplay module enable/disable toggles remain inside the in-game RiftPulse Settings tab. The website must not present one toggle per gameplay module.
- The website may manage account, subscription, platform connections, install/pairing lifecycle, downloads, documentation, and web-appropriate account preferences.
- The PCVR/Quest clients must fail safely when offline and must never block gameplay on cloud requests.

## 4. Identity and authentication decision

AppDeploy is no longer the website host, and the former AppDeploy app is deleted. Its historical native-auth implementation is not a viable live dependency for the new architecture.

**Proposed direction for validation:** use an application authentication solution compatible with a Cloudflare Pages frontend, Railway backend, and PostgreSQL/Neon persistence. The browser must obtain a short-lived/session credential through a supported flow; the Railway API must validate it server-side and derive identity only from verified claims. Never trust a caller-supplied user ID.

Before implementation, compare:
1. A supported managed customer-identity provider (including pricing, account lifecycle, OAuth/social login, session verification, custom-domain support, and export/portability); and
2. A well-maintained self-hosted authentication library integrated with PostgreSQL (including email verification/delivery, password reset, session rotation, CSRF protection, OAuth, abuse controls, maintenance burden, and recovery).

Cloudflare Access is not assumed to be the end-user customer identity system; it is primarily a Zero Trust access-control product and must not be substituted without confirming it fits a public consumer product.

**Gate:** no identity provider has been selected, no credentials registered, and no auth implementation started. Select only after supported capabilities and total cost are documented. Keep the frontend/backend contract provider-neutral until then.

## 5. Request and event flow

1. User opens the site served by Cloudflare Pages over HTTPS.
2. User completes the selected supported sign-in flow; the browser receives only the intended session credential and never a database or provider secret.
3. Browser calls `https://api.riftpulse.me` (or the verified API origin during development) with the supported credential.
4. Railway validates the credential and authorization on every protected request, applies rate limits, and scopes data access to the verified user.
5. Railway API reads/writes Neon using a least-privilege database role and versioned migrations.
6. Provider OAuth callbacks and webhooks arrive at designated backend endpoints, validate state/signature/timestamp/replay protection, normalize and deduplicate events, then dispatch bounded jobs.
7. Worker sends only the minimum required configuration/events to a paired client using a versioned contract and revocable scoped installation credential.
8. PCVR/Quest client processes messages asynchronously; cloud errors produce a visible stale/offline state without freezing or crashing gameplay.

## 6. Subscription and platform integration boundaries

- Public pricing is Free **$0/month** and Premium **$7.99/month**.
- Pricing display is not entitlement enforcement. The API must derive Premium access from verified server-side subscription state.
- Checkout/session creation and billing webhook handling remain server-side. Verify webhook signatures, deduplicate event IDs, handle retries/out-of-order updates, and make entitlement changes idempotent.
- Do not activate Premium from browser query parameters or client-submitted plan flags.
- No live billing provider or payment account is selected or provisioned in Step 2. Payment processing fees and provider requirements remain a cost/dependency to resolve before billing implementation.
- Planned connector order: Twitch, YouTube, TikTok LIVE, KICK. Provider-specific OAuth scopes, review/eligibility, quotas, webhook/event support, and test credentials must be confirmed individually; do not promise unavailable capabilities.

## 7. Environments, configuration, and secrets

- Separate development/test and production domains, OAuth redirect URLs, provider secrets, database targets/roles, and Railway deployments.
- Store secrets in the relevant provider's server-side secret/configuration system. Never commit local environment files, API keys, OAuth secrets, encryption keys, signing secrets, payment secrets, or user tokens.
- Encrypt per-user platform refresh/access tokens at rest; keep encryption keys separate from the database and rotate them with a documented procedure.
- Redact tokens, authorization headers, OAuth codes, pairing codes, payment payloads, and sensitive bodies from logs.
- Establish request limits, timeouts, bounded queues, capped retries with exponential backoff/jitter, health/readiness endpoints, structured redacted logs, and an operational alerting strategy before production.
- Use HTTPS only for public production endpoints; configure CORS narrowly for the real website origins.

## 8. Cost and capacity guardrails

- Start with provider free tiers only where current limits and the workload fit. Re-check current official pricing before provisioning because prices and quotas can change.
- Cloudflare Pages static delivery is the preferred low-cost website host; Pages Functions are not assumed necessary because the target API is on Railway.
- Neon and Railway usage may exceed free/included allowances. Estimate database storage/compute, API CPU/RAM, worker concurrency, logs, bandwidth, backups, and idle/background usage before production.
- Translation, TTS, audio/assets, payment processing, email delivery, and platform API quotas are separate potential costs.
- Do not create a paid service, upgrade a plan, enable paid usage, or incur material recurring cost without explicit user approval.
- No production monthly-cost claim is made until workload assumptions and actual provider settings are verified.

## 9. Deployment, cutover, and rollback plan

1. Confirm the Git source-of-truth/remote and review outstanding local worktree changes without discarding them.
2. Select and validate customer authentication and email delivery; define the provider-neutral API contract.
3. Create a minimal Cloudflare Pages build/deployment only in its separately approved implementation step; test preview deployment before assigning the production domain.
4. Build and test Railway API/worker services with health checks and environment-specific secrets; validate API custom-domain requirements before DNS edits.
5. Create Neon development database and migrations in its approved step; test migration forward/rollback/recovery and tenant isolation before production data exists.
6. Validate website, auth, API, CORS, rate limits, webhook signature verification, and failure states on preview/staging.
7. Record the current DNS values and TTL, confirm the new Pages project custom-domain state, and verify the API target. Only after explicit cutover approval change the necessary web DNS records; leave mail records intact.
8. Test apex and legacy `app` host behavior, TLS, auth callback URLs, API reachability, and email DNS. Monitor errors and provider usage.
9. Roll back by restoring the recorded prior web DNS targets and prior configuration if the new site fails acceptance. Do not delete old targets or records until the new site is verified and the user approves cleanup.

No deployment, DNS change, or provider resource was performed by this plan.

## 10. Step 2 acceptance checklist

- [x] Current repository, AppDeploy status, and Cloudflare domain/DNS observations recorded.
- [x] Cloudflare Pages + Railway + Neon target architecture documented.
- [x] AppDeploy removal from the hosting plan documented.
- [x] Legacy DNS and mail-record preservation/rollback requirements documented.
- [x] Auth-provider decision framed with criteria and explicit selection gate.
- [x] API/data/security/event/subscription boundaries documented.
- [x] Environment, cost, deployment, and rollback requirements documented.
- [ ] Validate exact Cloudflare Pages custom-domain behavior against the eventual project (requires a project; not done in planning).
- [ ] Select an identity provider and email delivery solution (deliberately deferred pending capability/cost comparison).
- [ ] Implement/provision/deploy anything (out of scope for Step 2).

## 11. Blockers and handoff

- No Pages project exists yet; the website cannot be deployed or attached to the apex until a later approved step.
- Current `app.riftpulse.me` points to AppDeploy and must remain untouched until cutover is ready.
- Customer authentication provider and email delivery are unselected.
- No Neon project/schema, Railway project, or repository remote is currently verified.
- Payment provider, platform credentials, OAuth app review, TikTok LIVE eligibility, and external quotas remain unverified.
- Step 2 does not establish production readiness or a running product.

**Result:** Architecture and migration plan documented. No source implementation, resource provisioning, DNS mutation, paid action, or later step started. Stop and wait for explicit approval before proceeding.

# Step 2 status update — acceptance verification

**Final result:** Complete with documented limitations (2026-10-21).

- The architecture and migration plan is saved in this document.
- The architecture, implementation plan, feature tracker, blockers, master checklist, build/release status, changelog, and test report were reconciled to the Cloudflare Pages + Railway + Neon target.
- `git diff --check` passed. Git printed line-ending normalization notices only.
- No application source/configuration files were changed; the source/config diff summary was empty.
- No Cloudflare Pages project, Neon database, Railway service, DNS change, deployment, billing provider, or paid resource was created.
- Identity provider and email delivery remain explicit follow-up decisions before authentication implementation. The former AppDeploy app is deleted, so its historical authentication is not treated as available.
- The existing worktree changes and untracked docs were preserved. No commit, reset, push, or cleanup was performed.

**Stop condition:** Step 2 is complete with the above limitations documented. Do not begin Step 3 or provision resources until the user explicitly approves the next step.
