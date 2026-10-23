# Step 7 — Authenticated Website Features

**Updated:** 2026-10-22
**Status:** COMPLETE — local checks pass and the user confirmed all hosted acceptance checks.

## Scope

Deliver account-protected website features without enabling production deployment, DNS changes, payments, or unimplemented OAuth integrations. Keep gameplay module toggles in the in-game RiftPulse Settings tab.

## Implemented

- Expanded the authenticated dashboard into account sections: Overview, Platforms, Installations, Downloads, Diagnostics, Preferences, and Documentation.
- Kept the account portal behind Clerk authentication; anonymous access redirects to sign-in.
- Added account-scoped API routes for reading platform connection metadata and installation records.
- Added creation of pending PCVR/Quest installation records and account-scoped revocation. These operations do not create pairing credentials or pair a client.
- Added a website-preferences screen backed by the existing versioned settings endpoint. Preferences cover website language selection and product-update interest only, not gameplay module toggles.
- Added a diagnostics view for authenticated API verification and the public development health endpoint. Only non-secret configuration flags are displayed.
- Added an authenticated documentation hub and clear unavailable states for downloads and platform OAuth until their implementation steps are complete.
- Platform connection buttons remain disabled; no fake OAuth success or connected status is presented.
- Free remains $0/month; Premium remains planned at $7.99/month with checkout unavailable.

## Security boundaries

- All new user-data routes require configured Clerk authentication and a verified session.
- Queries filter records by the server-verified Clerk user ID inside the existing transaction/RLS boundary.
- Connection responses omit secret references and credential material.
- Installation creation validates platform and display-name length; revocation validates UUID shape and only updates records owned by the authenticated account.
- No secret keys or database credentials were added to frontend code.
- No production services, DNS, payment provider, or paid features were changed.

## Hosted acceptance and final verification

- The user confirmed successful hosted checks for Preferences, Installations, and the remaining portal pages.
- Cloudflare Pages preview deployment for commit `aa4b8f7a33f8f6ea04f47bf2dc0340718094e0b0` completed all stages successfully: https://20188d2f.riftpulse-site-preview.pages.dev. The stable branch alias remains https://step-6-preview.riftpulse-site-preview.pages.dev.
- Railway development API deployment `d99d1d1b-c5f7-4bca-9369-6b394ec674fc` is SUCCESS; service is online with one running replica, no active deployment work, and no reported issues.
- Preview root and SPA paths `/dashboard`, `/dashboard/connections`, `/dashboard/installations`, `/dashboard/downloads`, `/dashboard/diagnostics`, `/dashboard/preferences`, and `/dashboard/docs` returned HTTP 200.
- New account API endpoints returned HTTP 401 when requested without credentials, confirming fail-closed unauthenticated behavior.
- User confirmed signed-in preferences save/reload, installation record create/reload/revoke, and all other portal pages.
- Frontend lint: PASS (0 warnings/errors); frontend TypeScript/Vite build: PASS; API TypeScript build: PASS; API tests: PASS (5/5); `git diff --check`: PASS.
- Git branch `step-6-preview` is synchronized with origin. Commits: `47d8ac6` (portal implementation), `aa4b8f7` (preserve existing settings during preference save). The unrelated untracked `web/client/New Text Document.txt` was preserved.
- Production deployment remains disabled (`production_deployments_enabled: false`, production branch `main`). No production deploy, custom-domain/DNS change, payment activation, or paid-service activation occurred.

## Approval gate

**Step 7 is complete. Do not start Step 8 until the user explicitly approves.** No production deployment or DNS change is included in Step 7.
