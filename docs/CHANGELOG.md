# Changelog

## 2026-10-21 - Step 3 customer authentication foundation
- Selected Clerk as the managed customer identity provider after comparing integration fit and current free-tier information with self-hosted Better Auth.
- Added React/TypeScript/Vite website client with branded public landing page, sign-in/sign-up routes, protected dashboard, user profile control, and a setup-required screen when the publishable key is missing.
- Added Express API with Clerk middleware, public health endpoint, protected `GET /api/me`, narrow CORS allowlist, Helmet headers, JSON size limit, request rate limit, generic errors, and graceful shutdown.
- Added local environment examples and Clerk setup guide. Secret key is server-only and no secret values are committed.
- Added API tests and updated docs/status trackers.
- Frontend build and lint pass; API tests (4/4) and build pass.
- Live sign-up/sign-in/API token verification remain untested because Clerk app keys are not configured. Step 3 remains in progress.
- No cloud resources, deployment, DNS changes, or paid plans were created.

## 2026-10-21 - Step 2 architecture/migration planning
- Updated target hosting from AppDeploy to Cloudflare Pages for the website, with Railway for API/workers and Neon PostgreSQL for persistence.
- Recorded active Cloudflare zone `riftpulse.me`, existing legacy AppDeploy `app` CNAME, and requirement to preserve mail DNS during any future approved cutover.
- Documented customer-identity decision criteria because the former AppDeploy app is reported deleted.
- Documented server-enforced Free ($0/month) and Premium ($7.99/month) entitlement requirements, cost guardrails, and deployment rollback.
- Planning/documentation only. No source implementation, cloud resource creation, DNS mutation, or paid action.
