# Step 7 — Authenticated Website Features

**Updated:** 2026-10-22
**Status:** Implementation and local checks complete; hosted preview acceptance pending.

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
- Connection responses omit secret_reference and other credential material.
- Installation creation validates platform and display-name length; revocation validates UUID shape and only updates records owned by the authenticated account.
- No secret keys or database credentials were added to frontend code.
- No production services, DNS, payment provider, or paid features were changed.

## Local verification

- Frontend lint: **PASS**, 0 warnings and 0 errors.
- Frontend production build: **PASS** (TypeScript + Vite).
- API TypeScript build: **PASS**.
- API tests: **PASS**, 5/5 including fail-closed checks for new endpoints when auth is not configured.
- Runtime acceptance for authenticated database operations requires the hosted preview and user session; local no-credential tests do not simulate successful Clerk sessions or live Neon data.

## Remaining acceptance checks

1. Commit and push only Step 7 files to step-6-preview; leave the unrelated web/client/New Text Document.txt untouched.
2. Confirm Cloudflare Pages and Railway development deployments complete successfully for the preview branch.
3. Verify signed-in navigation, preferences save/reload, installation create/revoke, and account-scoped API responses in the hosted preview.
4. If any hosted check fails, fix it within Step 7 and retest.
5. Update the master checklist and this report with actual hosted evidence before declaring Step 7 complete.

## Approval gate

Do not start Step 8 until the user explicitly approves. No production deployment or DNS change is included in Step 7.
