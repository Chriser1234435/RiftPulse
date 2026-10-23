# API Documentation

## Health

### GET /api/_healthcheck
- Purpose: API process health probe.
- Authentication: public.
- Response includes `status`, `service`, `authConfigured`, and `databaseConfigured`; never includes credentials.
- A healthy process does not imply that Clerk or the database is configured.

## Authentication and account persistence

### GET /api/me
- Requires a verified Clerk session through `clerkMiddleware()` and `getAuth(req)`.
- Creates the user's profile, default settings, and Free subscription record on first access.
- Uses only the server-verified Clerk user ID; a caller-supplied user ID is never trusted.
- Returns `authenticated`, `user.userId`, `session.sessionId`, and the persisted profile.
- Returns 401 for an anonymous request when Clerk is configured; returns 503 if auth or database configuration is missing.

### GET /api/settings
- Requires a verified Clerk session.
- Returns the authenticated user's persisted settings object and version.
- Initializes an account profile/settings record when needed.
- Never accepts a target account ID from the request.

### PUT /api/settings
- Requires a verified Clerk session.
- Accepts a JSON object in `{ "settings": { ... } }`; rejects arrays, non-objects, and oversized payloads.
- Persists settings as JSONB and increments `settings_version` on update.
- Settings persistence is for account preferences only. Gameplay module toggles are controlled in the in-game RiftPulse Settings tab, not on the website.

## Database security
- The API uses the `riftpulse_runtime` PostgreSQL role, configured with `NOBYPASSRLS` and only CRUD privileges on account-owned tables.
- Every account-scoped database operation runs in a transaction and sets transaction-local `riftpulse.user_id` from the verified Clerk identity.
- Row-level security is enabled and forced on profiles, settings, platform connections, installations, and subscriptions.
- Do not use a Neon owner role or any role with `BYPASSRLS` as the API runtime role.
- `DATABASE_URL` and Clerk server keys belong only in server-side environment variables or ignored local `.env` files; never in frontend variables or committed files.

## API protections
- Helmet security headers.
- Narrow CORS allowlist from `WEB_ORIGINS` (defaults to `http://localhost:5173` locally).
- 120 requests per 15 minutes per client IP for `/api`, with standard rate-limit headers.
- JSON body limit 10 KB.
- Generic 404 and 500 error responses; no request bodies, authorization headers, or tokens logged.
- API listens on `PORT` (defaults to 4000 locally).

Platform OAuth workflows, installation pairing, billing checkout/webhooks, and production deployment are not implemented in this step.
