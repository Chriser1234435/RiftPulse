# RiftPulse - Initial Implementation Plan

**Created:** 2026-10-21
**State:** Step 2 is complete with documented limitations. Step 3 authentication implementation is in progress. The user's step-by-step approval rule remains authoritative.
**Change control:** Do not reorder or replace the agreed roadmap without documenting dependencies and obtaining user approval.

## Product architecture baseline
- **Website:** Cloudflare Pages; intended public hostname `riftpulse.me`. No Pages project is verified.
- **API/workers:** Railway for server-side API, webhook receivers, and durable connector workers. Intended API hostname `api.riftpulse.me`, pending service and domain setup.
- **Database:** Neon PostgreSQL for relational records, migrations, least-privilege roles, and environment separation.
- **Identity:** Clerk selected for managed customer identity. The local React/Express integration is implemented; Clerk application keys and live acceptance remain pending. AppDeploy is not a live dependency.
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
| 1 | Environment, integrations, requirements audit | Completed: verified inventory, provisional architecture, costs, risks, blockers documented. |
| 2 | Architecture and hosting migration plan | Complete with documented limitations: Cloudflare Pages + Railway + Neon, DNS/rollback, security boundaries, costs, prerequisites documented. No provisioning. |
| 3 | Customer authentication for the new architecture | In progress: Clerk client and API code built/tested locally; external app configuration and live sign-in/session tests pending. |
| 4 | Database and persistent application data | Neon schema/migrations apply; persistence and cross-user isolation verified; schema documented. |
| 5 | Backend foundation and production infrastructure | Approved API/services start; health checks pass; secrets/config secure; cloud operation does not depend on the PC. |
| 6 | Website foundation and design system | Responsive branded site/navigation render; no module toggles on website. |
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
| 29 | Production deployment | Approved production services deployed; health, config, secrets, real endpoints verified. |
| 30 | PCVR acceptance testing | Actual artifact installed/launched/tested in selected Beat Saber profile; logs and outcome recorded. |
| 31 | Physical Quest acceptance testing | Native artifact tested on headset when available; otherwise blocker precisely documented. |
| 32 | Final regression, release, handoff | Applicable regression passes; artifacts, installation guides, changelog, limits, and final report accurate. |

## Dependencies and gates
1. Step 3 must finish Clerk app configuration and live sign-up/sign-in/sign-out, password recovery, and API authorization tests.
2. Step 4 establishes application data ownership and tests cross-user isolation before private account records are exposed.
3. Step 5 creates only approved RiftPulse-scoped infrastructure after reviewing pricing, free-tier limits, and expected spend.
4. DNS cutover occurs only after Pages and API domains are verified, old records are captured, rollback is documented, and the user explicitly approves.
5. Step 8 should use `E:\bsmanager\BSManager\BSInstances\SteamVR` (Beat Saber 1.40.8) unless another supported target is approved.
6. Step 9 requires C++/CMake/Android toolchain discovery or installation and ADB device authorization.
7. Connector credentials/app registrations and TikTok LIVE event eligibility are external dependencies, not assumed complete when code compiles.
8. Before production, separate development/test/production secrets and database targets; never run destructive migrations without a verified recovery path.

## Current status
Step 3 is in progress. See `docs/STEP3_AUTH_REPORT.md` and `docs/CLERK_SETUP_GUIDE.md`. No cloud deployment, DNS change, Neon project, or Railway service has been created.
