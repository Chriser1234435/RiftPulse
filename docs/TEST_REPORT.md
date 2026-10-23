# Test Report

## 2026-10-21 - Step 3 authentication foundation
Scope: local web client and API authentication foundation; no cloud deployment or real Clerk credentials.

- Frontend command: `npm run build` from `web/client/` - **PASS** (TypeScript check and Vite production build).
- Frontend command: `npm run lint` from `web/client/` - **PASS**, zero warnings/errors.
- Frontend HTTP smoke: `/`, `/sign-in`, and `/sign-up` returned HTTP 200 from local Vite server - **PASS**.
- API command: `npm test` from `services/api/` - **PASS**, 4/4 tests:
  1. Public health check returns expected status and reports auth configuration state.
  2. Protected identity endpoint fails closed with HTTP 503 when auth keys are absent.
  3. Unknown API routes return a generic 404 without internal details.
  4. Unapproved browser origins are rejected.
- API command: `npm run build` from `services/api/` - **PASS** (TypeScript compile).
- API runtime HTTP smoke: public health returned HTTP 200; protected `/api/me` returned HTTP 503 with keys intentionally absent - **PASS**.
- API dependency install reported 0 vulnerabilities at install time. npm emitted a transitive `@clerk/types` deprecation warning and install-script approval warnings for `@clerk/shared` and `esbuild`; no install scripts were manually approved in this step.
- **Not tested:** real Clerk sign-up, email verification, sign-in/out, password reset, anonymous 401, authenticated 200, session expiry/revocation, deployment, production keys, or custom domains. These require Clerk app configuration.

## 2026-10-21 - Step 2 architecture and migration planning
- Cloudflare integration: authenticated API access succeeded. Zone inventory returned `riftpulse.me` as active; DNS read succeeded. The zone has existing apex A/AAAA records and `app.riftpulse.me` CNAME to `proxy-v2.appdeploy.ai`; mail-related records were also present.
- Cloudflare Pages: earlier read-only inventory returned no Pages projects. No project was created.
- Neon/Railway/GitHub: current-state audit found no RiftPulse Neon project, Railway project, or Git remote. No resource was created.
- `git diff --check` passed. Existing worktree changes were preserved.

## Historical - Step 3 AppDeploy authentication (2026-10-21)
- Historical AppDeploy app ID: `riftpulse-czoph4`; URL: https://riftpulse-czoph4.v2.appdeploy.ai/
- The AppDeploy app is now reported deleted and is not the target authentication system.
- The earlier report recorded user-confirmed sign-in, anonymous denial, and sign-out. These historical results do not establish current Clerk or current website authentication.

## 2026-10-21 - Step 1 current-state re-audit
- Command: `dotnet run --project .\tests\pcvr-config-smoke\pcvr-config-smoke.csproj` - **PASS**, exit code 0.
- Coverage: safe-off defaults, JSON persistence/reload, unsupported schema fallback, malformed-config fallback, and preservation of malformed/unsupported files.
- Warning: CS8618 nullable property warning for `StoredModuleConfig.Modules`.
- This is a configuration smoke test only; it does not prove PCVR game runtime, cloud integration, live authentication, streaming APIs, billing, or Quest runtime.
