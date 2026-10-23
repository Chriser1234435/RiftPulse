# RiftPulse Clerk Setup Guide

This guide completes the external configuration needed to test the local Step 3 authentication implementation. It does not require a production deployment or DNS change.

## 1. Link the already-selected development application
The Clerk Dashboard has already selected the RiftPulse application with ID `app_3L1BGtyFYig1WkJuY8ozLL7TpuP`. Do not create a replacement application.

1. In a terminal on the RiftPulse development computer, run `npx -y clerk@latest auth login` and finish the browser sign-in.
2. From `E:\RiftPulse\services\api`, run `npx -y clerk@latest link --app app_3L1BGtyFYig1WkJuY8ozLL7TpuP`.
3. From that same API directory, run `npx -y clerk@latest env pull --app app_3L1BGtyFYig1WkJuY8ozLL7TpuP --file .env` to restore the selected application's development keys into the API's `.env` file (the API loads `.env`). Do not display or paste the file contents.
4. In Clerk Dashboard, configure email address sign-up/sign-in, email verification, and password recovery according to the current dashboard options. Keep social sign-in disabled until a provider is intentionally selected and tested.
5. In `web/client/.env.local`, set `VITE_CLERK_PUBLISHABLE_KEY` to the selected app's development publishable key. Keep the secret key only in `services/api/.env`; never place it in a `VITE_*` variable.

Clerk's official React setup: https://clerk.com/docs/react/getting-started/quickstart  
Clerk's official Express setup: https://clerk.com/docs/expressjs/getting-started/quickstart

## 2. Configure the frontend locally
1. Copy `web/client/.env.example` to `web/client/.env.local`.
2. Set `VITE_CLERK_PUBLISHABLE_KEY` to the development publishable key.
3. Leave `VITE_API_BASE_URL` empty for local use; Vite proxies `/api` to `http://localhost:4000`.

The publishable key is designed for browser use. Do not place the secret key in this file or any `VITE_*` variable.

## 3. Configure the API locally
1. Copy `services/api/.env.example` to `services/api/.env`.
2. Set `CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` to the development keys.
3. Keep `WEB_ORIGINS=http://localhost:5173` for local testing.

Never commit `services/api/.env`, post the secret key in chat, or include it in screenshots/logs. The root `.gitignore` excludes environment files.

## 4. Run the applications
Open two terminals:

Terminal A:
```powershell
Set-Location E:\RiftPulse\services\api
npm install
npm run dev
```

Terminal B:
```powershell
Set-Location E:\RiftPulse\web\client
npm install
npm run dev
```

Open the local Vite URL printed in Terminal B.

## 5. Live acceptance checklist
- [ ] Landing page loads and sign-up/sign-in controls are visible.
- [ ] Create a test account and complete email verification.
- [ ] Sign in and open `/dashboard`.
- [ ] Dashboard displays the signed-in profile.
- [ ] Protected API card reports **Verified** and `GET /api/me` returns the same Clerk user ID.
- [ ] Sign out using the user menu.
- [ ] Anonymous visit to `/dashboard` redirects to sign-in.
- [ ] Direct anonymous `GET /api/me` returns HTTP 401 when server keys are configured.
- [ ] Invalid/expired token is denied.
- [ ] Password recovery flow is available and works.

The application is not production-ready until these checks pass and production keys/domains are configured in the correct provider environments.
