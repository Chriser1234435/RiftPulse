# Build and Release Status

- Current phase: **Step 3 customer authentication - local implementation complete; external setup and live acceptance pending (2026-10-21).**
- Hosting target: Cloudflare Pages for website, Railway for API/workers, Neon PostgreSQL for persistence.
- Domain: `riftpulse.me` zone was read successfully from Cloudflare and reports active. No Pages project was returned by inventory.
- Legacy DNS: `app.riftpulse.me` currently points to `proxy-v2.appdeploy.ai`; apex A/AAAA records still point at an existing hosting address. No DNS changes have been made.
- Auth provider: Clerk selected. React client uses `@clerk/react`; Express API uses `@clerk/express`. No Clerk keys are configured and no live authentication workflow is verified.
- Frontend build: **PASS**; frontend lint: **PASS**, zero warnings/errors.
- Frontend route smoke: **PASS**; local `/`, `/sign-in`, and `/sign-up` all returned HTTP 200.
- API tests: **PASS**, 4/4; API TypeScript build: **PASS**.
- API runtime HTTP smoke: **PASS**; health returned 200 and protected `/api/me` returned 503 when auth keys were intentionally absent.
- Authenticated/anonymous live Clerk acceptance: **NOT TESTED** because Clerk app keys are not configured.
- RiftPulse Neon/Railway resources: no Neon project or RiftPulse Railway project verified.
- Native Quest build/runtime: not tested.
- DNS, deployments, billing, and paid provider plans: unchanged during Step 3.
- Approval gate: configure Clerk keys and run live acceptance; do not start Step 4 without explicit user approval.
