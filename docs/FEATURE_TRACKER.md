# Feature Tracker

## Latest verified status - 2026-10-21

Step 1 current-state/environment audit is recorded in `STEP1_CURRENT_STATE_REAUDIT.md`. Step 2 architecture/migration plan is complete with documented limitations. Step 3 authentication implementation is in progress: a React/Vite client and Express API foundation now use Clerk SDKs. Local builds and tests pass, but no Clerk application keys are configured and live sign-up/sign-in/session verification are not yet verified. Cloudflare Pages, Railway, and Neon production resources are not provisioned.

| Feature | Status | Evidence / notes |
|---|---|---|
| PCVR settings/config foundation | Implemented | Existing code; configuration smoke test passed. Not a runtime compatibility claim. |
| Website hosting architecture | Planned | Cloudflare Pages selected as target; no Pages project or deployment verified. |
| Website auth client | In Progress - External Setup Needed | React/Vite client uses Clerk components for sign-in/sign-up and protected dashboard; missing publishable key displays setup guidance instead of simulating auth. |
| API auth foundation | Implemented Locally - External Setup Needed | Express API uses Clerk middleware and a protected `GET /api/me`; auth-disabled mode fails closed with 503. Live token verification is pending keys. |
| Domain/DNS migration | Planned / not applied | Cloudflare zone `riftpulse.me` is active; preserve mail records and current web targets until approved cutover. |
| Customer authentication | In Progress | Clerk selected after comparison; no app keys or live acceptance yet. See `CLERK_SETUP_GUIDE.md` and `STEP3_AUTH_REPORT.md`. |
| API and background workers | Foundation Only | Auth/health endpoints exist locally; broader API, connectors, and workers are not implemented. |
| Neon persistence | Not Started | No RiftPulse project/schema created. |
| Subscription/billing | Not Started | Free $0/month; Premium $7.99/month. No payment provider selected; entitlements must be server-enforced. |
| Secure pairing/sync | Not Started | Not implemented. |
| Native Quest client | Awaiting Dependency | Toolchain/device verification remains pending. |
| Twitch / YouTube / TikTok LIVE / KICK | Not Started | No live connector tests. |
| Twelve streaming modules | Not Started | Existing identifiers/preferences are not runtime handlers. |

Current gate: Step 3 is in progress. Complete Clerk app configuration and live acceptance before marking the step complete. Do not start Step 4 or deploy cloud resources without the required approval.
