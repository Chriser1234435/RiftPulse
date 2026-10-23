# RiftPulse Web Client

React + TypeScript + Vite client for the RiftPulse website.

## Local setup

1. Install Node.js 20.9+ (the current supported Clerk tooling requires it).
2. Copy `.env.example` to `.env.local`.
3. Create/claim a Clerk application and set `VITE_CLERK_PUBLISHABLE_KEY` in `.env.local`.
4. Set `VITE_API_BASE_URL` only when the API is running on a different origin; locally the Vite proxy forwards `/api` to port 4000.
5. Run `npm install`, then `npm run dev`.

The application deliberately renders a setup screen when the publishable key is missing. It does not simulate successful authentication. The Clerk publishable key is public by design; never expose `CLERK_SECRET_KEY` in a `VITE_*` variable or frontend bundle.

## Routes

- `/`: public landing page
- `/sign-in`: managed Clerk sign-in UI
- `/sign-up`: managed Clerk sign-up UI
- `/dashboard`: signed-in account view and protected `GET /api/me` request

Email verification, password reset, enabled sign-in identifiers, and social providers must be configured in the Clerk dashboard and verified before production.
