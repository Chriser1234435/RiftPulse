# Step 4 — Development Database Foundation

**Date:** 2026-10-21  
**Status:** Complete for the database foundation and basic profile/settings persistence. Not deployed.  
**Project:** `riftpulse-development`  
**Database:** `riftpulse`  
**Branch:** development `main`

## Applied schema
Versioned migration: `services/api/migrations/001_initial_schema.sql`. Applied to development main after temporary-branch validation.

Seven tables are present: `user_profiles`, `user_settings`, `platform_connections`, `installations`, `subscriptions`, `billing_webhook_events`, and `event_deduplication`.

- Account preferences are stored in versioned JSONB; gameplay module toggles remain in the in-game Settings tab.
- Provider connections store metadata and secret references, not raw OAuth tokens.
- Subscription entitlements are server-authoritative; Free is $0/month and Premium remains $7.99/month.
- Billing webhook records store idempotency/processing metadata without raw webhook payloads.

## API persistence implemented
- Added PostgreSQL connection pooling and a transaction helper in `services/api/src/database.ts`.
- `GET /api/me` creates/updates the verified user's profile and initializes settings plus a Free subscription record.
- Added authenticated `GET /api/settings` and `PUT /api/settings`; settings are versioned and payloads are validated.
- Each account-scoped transaction sets transaction-local `riftpulse.user_id` from the server-verified Clerk identity. Client-supplied account IDs are never trusted.
- Missing Clerk or database configuration fails closed.

## Runtime role and access boundaries
- `riftpulse_runtime` is a login role with `NOBYPASSRLS`, no superuser/database/role creation privileges, and CRUD privileges only on the five user-owned tables.
- Verified against development: `rolbypassrls=false`; the runtime role has no SELECT access to `billing_webhook_events`.
- RLS is enabled and forced on profiles, settings, platform connections, installations, and subscriptions. Backend-only billing/deduplication tables are not granted to the runtime role.
- The database URL is stored only in the ignored local API `.env`; it was not printed or added to frontend code/source files.

## Verification results
- API TypeScript build: passed.
- API tests: 4/4 passed.
- Frontend lint: passed with 0 warnings and 0 errors.
- Frontend production build: passed.
- Live Neon smoke test through `riftpulse_runtime`: passed. Own profile/settings read-write succeeded; cross-user reads were blocked; cross-owner inserts were rejected; temporary test rows were cleaned up.
- Local API smoke check: health returned `ok`, both auth/database configuration flags were true, and anonymous `GET /api/me` returned HTTP 401.
- Development main table inventory and RLS flags verified after migration.
- `git diff --check`: passed; `services/api/.env` is ignored by Git.

## Scope boundaries
No production database, Railway service, Cloudflare deployment, DNS change, paid-plan upgrade, Git commit, reset, or push was performed. Platform OAuth, installation pairing, billing checkout/webhooks, and production deployment remain later work. Step 5 has not started.
