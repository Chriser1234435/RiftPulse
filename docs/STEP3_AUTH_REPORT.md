# Step 3 - Customer Authentication Report

**Date:** 2026-10-21  
**Status:** Core local authentication acceptance passed; remaining lifecycle checks and final audit are pending.  
**Provider:** Clerk managed identity. Development instance configured locally.

## Why Clerk was selected
- Provides managed sign-up/sign-in UI, user profile controls, and session lifecycle without implementing a custom password store.
- Official React and Express SDKs support a static React/Vite client and an independent Railway API. The API validates Clerk sessions server-side.
- Keeps authentication implementation independent of the not-yet-created Neon application schema, so this step does not prematurely create Step 4 data tables.
- Clerk's free-plan quotas and terms must be rechecked before production. Source: https://clerk.com/pricing
- Official implementation references: https://clerk.com/docs/react/getting-started/quickstart and https://clerk.com/docs/expressjs/getting-started/quickstart
- Alternatives considered: self-hosted Better Auth with PostgreSQL (requires schema and email-delivery setup) and Neon Auth (couples authentication to the Neon project and requires validating token handoff to the separate Railway API).

## Implemented locally
- React + TypeScript + Vite website client under `web/client/`.
- Branded public landing page, sign-in route, sign-up route, protected dashboard, Clerk user profile control, and explicit setup-required screen when the publishable key is missing.
- Dashboard obtains a Clerk session token and sends it as a bearer token to the protected API.
- Express API under `services/api/` with Clerk middleware, public health endpoint, protected `GET /api/me`, narrow CORS allowlist, Helmet headers, JSON body limit, request rate limit, generic error responses, and graceful shutdown.
- Environment examples and setup guide. Secret values must stay out of source control and chat.
- Website has no gameplay-module toggles; those controls belong in the in-game Settings tab.

## Verification evidence

### Automated and runtime checks
- Frontend `npm run build`: **PASS** (TypeScript check and Vite production build).
- Frontend `npm run lint`: **PASS**, zero warnings/errors.
- Frontend HTTP smoke test: **PASS**; `/`, `/sign-in`, and `/sign-up` returned HTTP 200 from the local Vite SPA server.
- API `npm test`: **PASS**, 4/4 tests:
  1. Public health response and auth configuration state.
  2. Protected identity endpoint fails closed when auth keys are absent.
  3. Unknown routes return a generic 404.
  4. Unapproved browser origins are rejected.
- API `npm run build`: **PASS** (TypeScript compile).
- API runtime HTTP smoke test: health endpoint returned HTTP 200; the API was also verified to reject anonymous access when authentication keys were absent.
- `git diff --check`: **PASS** at the last recorded check.
- Dependency installation previously reported 0 vulnerabilities at install time; npm emitted a transitive `@clerk/types` deprecation warning and install-script approval warnings. No install scripts were manually approved.

### User-confirmed live development acceptance
- Clerk CLI authenticated and linked to the existing RiftPulse development application; no new Clerk application was created.
- User confirmed the sign-up and sign-in buttons navigate to the authentication pages.
- User confirmed a test account signed up and was logged directly into the dashboard.
- User confirmed the dashboard displays signed-in account/profile information without an authentication error.
- User confirmed the dashboard's Protected API status is **Verified**, indicating the signed-in session was accepted by the API.
- These are user-reported browser checks; no passwords, verification codes, or key values were requested or recorded.

## Remaining checks before Step 3 can be marked complete
1. Confirm sign-out works and a signed-out visitor cannot remain on the protected dashboard.
2. Confirm password recovery is available and can be completed, if enabled for the Clerk development instance.
3. Verify session expiry/revocation behavior, or explicitly document it as not tested if a safe test is not practical.
4. Run a final non-secret configuration/status review and confirm the working tree contains no accidental secret files or unrelated changes.

## Change safety
- No Cloudflare Pages project or deployment created.
- No Railway project/service created.
- No Neon project/schema created.
- No DNS records changed and no paid plan enabled.
- No Git commit, reset, push, or cleanup performed.
- Existing unrelated worktree changes were preserved.

**Stop condition:** Keep Step 3 active until remaining acceptance checks and the final audit are complete. Then report results and wait for explicit approval before Step 4.
