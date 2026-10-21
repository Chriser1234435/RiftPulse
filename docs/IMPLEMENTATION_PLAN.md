# RiftPulse — Initial Implementation Plan

**Created:** 2026-10-21  
**State:** Initial plan from Step 1 audit; the user-provided 32-step sequence remains authoritative.  
**Change control:** Do not reorder or replace the agreed roadmap without documenting the dependency and obtaining user approval.

## Product architecture baseline

- **Web/auth:** AppDeploy-hosted public site and account dashboard using native AppDeploy sign-in. Server-side identity verification protects account data.
- **Database:** Neon PostgreSQL for relational user/application records with schema migrations and separate environment branches.
- **Cloud connectors:** Railway for webhook receivers, durable streaming-platform connectors, and worker processes where required. Cloud processing must continue independently of the player's PC.
- **Game clients:** Separate PCVR BSIPA/C# project and Quest-native C++/CMake project, sharing protocol and configuration contracts only.
- **Secrets:** Backend-only platform/service credentials. Per-user OAuth tokens stored encrypted at rest; never put secrets in web assets, source control, logs, or client binaries.
- **Event model:** Normalize platform events, validate them, deduplicate by source/event identity, apply bounded queues, and use bounded retries/backoff with explicit stale/unavailable states.
- **Module settings:** All gameplay module controls remain in the actual in-game RiftPulse Settings tab; the website manages accounts, integrations, installs, downloads, docs, and web-appropriate preferences only.

## Execution and verification rules

Each step must define objective, in-scope work, dependencies, acceptance criteria, and evidence before implementation. Finish and test only the current approved step; fix defects within it; update documentation; report actual results; stop for explicit approval. Do not interpret broad administrative permission as approval to advance.

A successful compile is not runtime compatibility. Mocks are not proof of an external integration. Mark unavailable credentials, device access, app review, paid services, or other external dependencies explicitly. Obtain explicit approval before incurring new paid subscriptions or material new costs.
## Roadmap with step gates

| Step | Name | Core completion evidence |
|---:|---|---|
| 1 | Environment, integrations, requirements audit | **Completed:** verified inventory, provisional architecture, costs, risks, and blockers documented in `STEP1_ENVIRONMENT_AUDIT.md`. |
| 2 | Architecture and project foundations | Architecture/schema/protocol decisions documented; folder structure, source-control conventions, documentation skeleton, and build/test approach established and verified. |
| 3 | AppDeploy-native authentication | Real sign-in/sign-out, server-side identity verification, and protected access demonstrated. A minimal AppDeploy app shell may be needed here; full site design stays in Step 6. |
| 4 | Database and persistent application data | Neon schema and migrations apply; persistence and cross-user isolation verified; schema documented. |
| 5 | Backend foundation and production infrastructure | Required API/services start, health checks pass, secrets/config are secure, and cloud operation does not depend on the PC. |
| 6 | Website foundation and design system | Responsive branded landing page/navigation render correctly; no module toggles on the website. |
| 7 | Authenticated website features | Dashboard, identity, platform connection entry points, downloads, installation management, diagnostics, and docs work behind authorization. |
| 8 | PCVR mod foundation | Correct PCVR artifact builds against the explicitly chosen game profile; loader/dependencies verified; in-game Settings integration demonstrated. |
| 9 | Native Quest mod foundation | Separate Quest-native artifact and toolchain verified; physical installation/runtime test performed when the headset is available. |
| 10 | Secure pairing and configuration sync | Valid pairing works; expired/reused/unauthorized/revoked challenges fail; versioned settings synchronize. |
| 11 | Shared event infrastructure and Twitch | Normalized event system, bounded queues, dedupe, reconnect, diagnostics, and actual Twitch tests where credentials permit. |
| 12 | YouTube connector | Supported OAuth/event flow works; quotas and limitations documented; connector tests pass. |
| 13 | TikTok LIVE connector | Officially supportable events/permissions verified; any app-review or capability blocker documented. |
| 14 | KICK connector | Supported OAuth/webhook event flow verified; unsupported event types documented. |
| 15 | Chat module | Unified chat runs on supported targets with tested queues, rendering, emotes/moderation hooks, and reconnection. |
| 16 | WordFilter module | Unicode/multilingual filter options pass punctuation, whitespace, bypass, and false-positive tests. |
| 17 | FontFilter module | Font/fallback/glyph behavior passes representative multilingual tests. |
| 18 | AntiSpam module | Duplicate/flood/cooldown behavior tested without harmful delays to normal chat. |
| 19 | Chatbot Commands module | Built-in/custom commands work with permissions, cooldowns, arguments, and real state; no arbitrary code execution. |
| 20 | ChatEmoteRain module | Verified assets, caching, validation, resource limits, and Quest fallback tested. |
| Step | Name | Core completion evidence |
|---:|---|---|
| 21 | SoundAlerts module | Supported alert events, audio queue, volume/cooldown options, and duplicate handling verified. |
| 22 | Text-to-Speech module | Voice options, message limits, filtering, queueing, and failure fallback verified; basic operation not dependent on paid AI. |
| 23 | Automatic Translation module | Selected service/model, license, hosting cost, languages, caching, limits, latency, and fallbacks evaluated and tested. |
| 24 | ChatIntegrations module | Validated trigger-condition-action workflows, permissions, execution history, throttles, and loop prevention tested; no arbitrary shell execution. |
| 25 | ChatRequest/BSR module | Real lookup/history/queue/permission behavior tested; only claim playback actions actually confirmed by the game. |
| 26 | Viewer Count module | Platform data availability and freshness tested; unknown/stale counts remain distinct from zero. |
| 27 | Cross-module integration | Event flow, shared settings, interactions, performance, cleanup, and failure isolation regression-tested. |
| 28 | Security and privacy audit | Auth, authorization, tokens, pairing, DB access, API exposure, logs, deletion/export paths, and release artifacts reviewed. |
| 29 | Production deployment | Approved production services deployed; health, config, secrets, and real endpoints verified. |
| 30 | PCVR acceptance testing | Actual artifact installed/launched/tested in the selected Beat Saber profile; logs and outcome recorded. |
| 31 | Physical Quest acceptance testing | Native artifact tested on the headset when available; otherwise blocker and partial status precisely documented. |
| 32 | Final regression, release, and handoff | Applicable full regression passes; release artifacts, installation guides, changelog, limits, and final status report are accurate. |

## Dependencies and gates

1. Step 2 must resolve the control-plane boundary between AppDeploy-authenticated actions, Railway connector services, and Neon records without inventing SDK behavior.
2. Step 3 tests AppDeploy's documented native auth in a minimal app context. The completed public-site design remains Step 6.
3. Step 4 must establish user ownership and test cross-user isolation before any private account records are exposed.
4. Step 5 creates only approved RiftPulse-scoped resources, after reviewing pricing, free-tier limits, and expected spend.
5. Step 8 should use `E:\bsmanager\BSManager\BSInstances\SteamVR` (Beat Saber 1.40.8) unless the user approves a different supported target. The separate Steam copy reports 1.45.3 and is not interchangeable.
6. Step 9 requires C++/CMake/Android toolchain discovery or installation and ADB device authorization; this prerequisite is not currently verified.
7. Connector credentials/app registrations and TikTok LIVE event entitlement are external dependencies, not assumed complete when code compiles.
8. Before production, separate development/test/production secrets and database targets; never run destructive migrations without a verified recovery path.
 

## Step 2 foundation decisions

- Local source control is initialized at the project root. The default branch will be normalized to `main`; a remote is not configured because no accessible GitHub repository was returned.
- Build artifacts, IDE state, logs, and local secret files are excluded by `.gitignore`. Existing `dist/` artifacts remain visible for explicit review rather than being blanket-ignored.
- The current .NET 10 configuration smoke-test project is the initial runnable automated test baseline.
- The initial architecture and test strategy are in `ARCHITECTURE.md` and `TEST_STRATEGY.md`.
- All roadmap documentation files are tracked as planning/status documents. Placeholder privacy and terms documents are explicitly marked not ready for publication.
- Step 2 does not create a web application, auth flow, database, cloud service, Quest project, or production deployment.
