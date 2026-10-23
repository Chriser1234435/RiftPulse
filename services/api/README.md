# RiftPulse API — Authentication foundation

Node.js + Express API hosted on Railway in the target architecture.

## Local setup

1. Copy `.env.example` to `.env` and add keys from the RiftPulse Clerk development application.
2. Install dependencies with `npm install`.
3. Run `npm run dev`; default port is 4000.
4. `GET /api/_healthcheck` is public and reports whether auth configuration exists.
5. `GET /api/me` requires a verified Clerk session token in `Authorization: Bearer <token>`.

The API intentionally fails closed with HTTP 503 when auth keys are absent. It does not accept a caller-provided user ID. When configured, `@clerk/express` validates the session and the route returns only the verified user ID and session ID; it never returns tokens.

## Production environment variables

- `CLERK_PUBLISHABLE_KEY`: Clerk publishable key (server config).
- `CLERK_SECRET_KEY`: Clerk secret key, stored only in Railway server-side variables.
- `WEB_ORIGINS`: comma-separated exact allowed origins (e.g. `https://riftpulse.me` and the approved preview origin).
- `PORT`: injected by Railway; defaults to 4000 locally.

The frontend sends bearer tokens, so CORS does not enable credentialed cookies. Keep CORS origins narrow. Do not log tokens or authorization headers. The health route must not expose secrets.

## Scope limits

This service currently provides only the auth health and identity foundation. It does not yet implement account data persistence, billing, platform integrations, or client pairing. Those belong to later approved steps.
