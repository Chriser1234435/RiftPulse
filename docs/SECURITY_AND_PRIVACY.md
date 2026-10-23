# Security and Privacy

## Step 3 local authentication foundation
- Clerk is the selected managed identity provider. The website uses `@clerk/react`; the API uses `@clerk/express`.
- The frontend contains only the publishable key. `CLERK_SECRET_KEY` is server-only and must never be exposed in a `VITE_*` variable.
- Protected `GET /api/me` derives identity only from the verified Clerk request context. It never accepts caller-provided user IDs and does not return tokens.
- The API fails closed with HTTP 503 when auth keys are absent; it does not simulate successful sign-in.
- CORS is restricted to the configured exact origin allowlist; the frontend uses a bearer token rather than cross-origin credentialed cookies.
- Helmet headers, a bounded JSON body, a request rate limit, generic errors, and no sensitive request logging are configured.
- The frontend dashboard displays account identity from Clerk and separately checks the protected API. API unavailability is not represented as a successful server-side authentication.

## Not yet verified
- Real Clerk sign-up, email verification, sign-in, sign-out, password recovery, and session expiration.
- Anonymous denial (401) and authenticated identity response (200) against a configured API.
- Production custom domains, CORS origins, secret storage, and TLS deployment.
- Persistent account records, ownership constraints, and cross-user isolation (later database step).

## Required before production
- Configure and claim the Clerk application, verify email/password settings and recovery paths, and test the live workflow.
- Store `CLERK_SECRET_KEY` only in Railway's server-side variables. Put only the publishable key in Cloudflare Pages build variables.
- Add owner-scoped persistent records and cross-user isolation tests when storage is implemented.
- Keep service credentials and token-encryption keys backend-only.
- Encrypt platform tokens at rest; redact secrets from logs.
- Rate-limit pairing and webhook/API endpoints; reject expired and replayed challenges.
- Collect minimal data and define retention/deletion behavior before production.
- Do not make compliance claims before a scoped review.
