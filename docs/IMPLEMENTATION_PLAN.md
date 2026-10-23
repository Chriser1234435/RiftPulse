# RiftPulse - Initial Implementation Plan

**Created:** 2026-10-21
**Current state (2026-10-22):** Steps 1-5 are recorded complete, with Step 5 documented as complete with a limitation. Step 6 website foundation is in progress; local design/build checks pass, but Cloudflare Pages preview creation is blocked by a Cloudflare Git installation/API authorization error. The user's step-by-step approval rule remains authoritative.
**Change control:** Do not reorder or replace the agreed roadmap without documenting dependencies and obtaining user approval.

## Product architecture baseline
- **Website:** Cloudflare Pages; intended public hostname `riftpulse.me`. The RiftPulse website has not been transferred/deployed to Cloudflare Pages; this is future website work, not a completed Step 5 deliverable.
- **API/workers:** Railway for server-side API, webhook receivers, and durable connector workers. A dedicated **development** Railway project and `riftpulse-api` service are online at https://riftpulse-api-development.up.railway.app. This is not a production API/domain cutover.
- **Database:** Neon PostgreSQL for relational records, migrations, least-privilege roles, and environment separation. Development schema and basic profile/settings persistence are documented in `docs/STEP4_DATABASE_REPORT.md`.
- **Identity:** Clerk managed customer identity. User has confirmed live development authentication and dashboard access. Do not put secrets in source control or chat.
- **Game clients:** Separate PCVR BSIPA/C# project and Quest-native C++/CMake project, sharing protocol and configuration contracts only.
- **Secrets:** Backend-only platform/service credentials. Per-user OAuth tokens encrypted at rest; never put secrets in web assets, source control, logs, or client binaries.
- **Event model:** Normalize platform events, validate them, deduplicate by source/event identity, apply bounded queues, and use bounded retries/backoff with explicit stale/unavailable states.
- **Module settings:** All gameplay module controls remain in the actual in-game RiftPulse Settings tab; the website manages accounts, subscription, integrations, installs, downloads, docs, and web-appropriate preferences only.
- **Pricing:** Free $0/month; Premium $7.99/month. Server-side entitlement checks are authoritative; no payment provider is selected.

## Execution and verification rules
Each step must define objective, in-scope work, dependencies, acceptance criteria, and evidence before implementation. Finish and test only the current approved step; fix defects within it; update documentation; report actual results; stop for explicit approval. Do not interpret broad administrative permission as approval to advance.

A successful compile is not runtime compatibility. Mocks are not proof of an external integration. Mark unavailable credentials, device access, app review, paid services, or other external dependencies explicitly. Obtain explicit approval before incurring new paid subscriptions or material new costs.

## Roadmap with step gates
| Step | Name | Core completion evidence |
|---:|---|---|
| 1 | Environment, integrations, requirements audit | Complete: verified inventory, architecture, costs, risks, and blockers documented. |
| 2 | Architecture and hosting migration plan | Complete with documented limitations: Cloudflare Pages + Railway + Neon, DNS/rollback, security boundaries, costs, prerequisites documented. No production cutover. |
| 3 | Customer authentication for the new architecture | Core development sign-in/sign-up/dashboard/protected API/sign-out accepted; password recovery and session-expiry behavior remain unverified. |
| 4 | Database and persistent application data | Development Neon schema/migrations, persistence, least-privilege role, and cross-user isolation verified. |
| 5 | Backend foundation and development infrastructure | **Complete with documented limitation:** Railway development API online, health check passes, user confirmed authentication and save-refresh persistence. Full website PC-offline test is deferred until the frontend is hosted; see Step 5 report. |
| 6 | Website foundation and design system | Responsive branded site, sections/navigation, plan clarity, mobile layout, metadata, and local lint/build/route checks are implemented. Cloudflare Pages preview deployment is blocked pending Cloudflare Git installation/API reauthorization; no custom domain/DNS or production deployment. In progress. |
| 7 | Authenticated website features | Dashboard, identity, platform connection entry points, downloads, installation management, diagnostics, docs work behind authorization. |
| 8 | PCVR mod foundation | Correct PCVR artifact builds against explicitly chosen game profile; loader/dependencies verified; in-game Settings demonstrated. |
| 9 | Native Quest mod foundation | Separate Quest-native artifact and toolchain verified; physical installation/runtime test when headset available. |
| 10 | Secure pairing and configuration sync | Valid pairing works; expired/reused/unauthorized/revoked challenges fail; versioned settings synchronize. |
| 11 | Shared event infrastructure and Twitch | Normalized event system, bounded queues, dedupe, reconnect, diagnostics, actual Twitch tests where credentials permit. |
| 12 | YouTube connector | Supported OAuth/event flow works; quotas and limitations documented; tests pass. |
| 13 | TikTok LIVE connector | Officially supportable events/permissions verified; app-review/capability blockers documented. |
| 14 | KICK connector | Supported OAuth/webhook event flow verified; unsupported event types documented. |
| 15-26 | Twelve streaming modules | Each module's runtime behavior and acceptance tests verified individually. |
| 27 | Cross-module integration | Event flow, shared settings, interactions, performance, cleanup, failure isolation regression-tested. |
| 28 | Security and privacy audit | Auth, authorization, tokens, pairing, DB access, API exposure, logs, deletion/export, release artifacts reviewed. |
| 29 | Production deployment | Approved production services deployed; health, config, secrets, real endpoints verified. Separate approval required; no production deployment in Step 5. |
| 30 | PCVR acceptance testing | Actual artifact installed/launched/tested in selected Beat Saber profile; logs and outcome recorded. |
| 31 | Physical Quest acceptance testing | Native artifact tested on headset when available; otherwise blocker precisely documented. |
| 32 | Final regression, release, handoff | Applicable regression passes; artifacts, installation guides, changelog, limits, and final report accurate. |

## Dependencies and gates
1. Steps 3 and 4 provide managed identity and account-scoped data foundations; their reports document tested behavior and remaining limitations.
2. Step 5 creates only approved RiftPulse-scoped development infrastructure. The development API is hosted; this does not establish that the website is deployed or that production is ready.
3. Step 6 owns the website foundation and intended Cloudflare Pages preview. Local lint/build/route checks pass; the Cloudflare project was not created because the connected Cloudflare API returned HTTP 401 for the Git-backed Pages project request. Reauthorize the Cloudflare integration and retry using Git-backed preview deployments with production deployments disabled. A full browser test while the user's PC is off requires a hosted frontend.
4. DNS cutover occurs only after Pages and API domains are verified, old records are captured, rollback is documented, and the user explicitly approves.
5. Step 8 should use `E:\bsmanager\BSManager\BSInstances\SteamVR` (Beat Saber 1.40.8) unless another supported target is approved.
6. Step 9 requires C++/CMake/Android toolchain discovery or installation and ADB device authorization.
7. Connector credentials/app registrations and TikTok LIVE event eligibility are external dependencies, not assumed complete when code compiles.
8. Before production, separate development/test/production secrets and database targets; never run destructive migrations without a verified recovery path.

## Current status
Steps 1-5 are recorded complete (Step 5 with documented limitation). Step 6 is in progress; see `docs/MASTER_CHECKLIST.md` and `docs/STEP6_WEBSITE_REPORT.md`. Do not begin Step 7 until the user explicitly approves.
