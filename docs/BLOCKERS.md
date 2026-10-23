# Blockers

- **Step 3 authentication setup:** Clerk was selected and the local React/Express integration is implemented, but a Clerk application has not been configured with keys. Live sign-up, sign-in, sign-out, email verification/recovery, and API session verification remain untested. Follow `CLERK_SETUP_GUIDE.md`; never share the secret key in chat or commit it.
- **Cloudflare Pages project:** The `riftpulse.me` zone is active, but no Pages project was returned by inventory. Website deployment and custom-domain attachment are not verified.
- **DNS migration:** Existing apex A/AAAA records point at an existing host; `app.riftpulse.me` points to `proxy-v2.appdeploy.ai`. Do not alter them until the replacement site is deployed, tested, and rollback values are recorded. Preserve MX/SPF/DMARC and other mail-related records.
- **Neon database:** No RiftPulse Neon project/schema exists yet.
- **Railway services:** No RiftPulse service/project verified.
- **GitHub / worktree:** No accessible repository returned and no Git remote is configured. Preserve existing uncommitted changes; do not reset or discard them.
- **Payment provider:** No payment processor is selected. Billing/webhook requirements, fees, and account onboarding remain unverified.
- **Quest toolchain/device:** ADB and native Android build tools were not found in the checked PATH/common locations; physical device status remains unverified.
- **PCVR runtime:** Existing source/artifact and smoke test do not establish game runtime compatibility.
- **External platform authorization:** OAuth app credentials/scopes and TikTok LIVE-specific event eligibility remain unverified.
- **Current phase gate:** Step 3 is in progress pending Clerk configuration and live acceptance. Do not begin Step 4 or production deployment before Step 3 is verified and the user explicitly approves continuation.
