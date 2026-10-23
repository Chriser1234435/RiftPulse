# Blockers and Deferred Work

Updated: 2026-10-22

## Current step status
- **Steps 1-4:** Recorded complete in the master checklist and respective reports. The user confirmed live development authentication and settings persistence after save/refresh.
- **Step 5:** Complete with documented limitation. Dedicated Railway development API is online and health checks pass. See `STEP5_BACKEND_REPORT.md`.
- **Step 6:** In progress. The local responsive website foundation is implemented and tested. Creating a Git-backed Cloudflare Pages preview failed with HTTP 401 and an internal Cloudflare Pages Git installation authorization error. Reauthorize the Cloudflare integration, then retry the preview setup with production deployments disabled. See `STEP6_WEBSITE_REPORT.md`.
- **Production deployment:** Later gated work; no production deployment or DNS cutover was performed.

## Outstanding items (not Step 5 blockers)
- **Cloudflare Pages website:** The RiftPulse website has not yet been deployed. A Git-backed preview project request was rejected with HTTP 401 due to a Cloudflare Pages Git installation/API authorization issue. No Pages project was created, no custom domain was attached, and no DNS changed. Reauthorize the Cloudflare integration before retrying.
- **DNS migration:** Do not alter existing DNS records until the replacement website/API domains are verified, old records are captured, rollback is documented, and the user explicitly approves. Preserve MX/SPF/DMARC and other mail-related records.
- **Authentication lifecycle:** Password recovery and session-expiry/revocation checks are not confirmed in the current evidence; track against the Step 3 report without exposing secrets.
- **Production readiness:** Development infrastructure is not production acceptance. Production credentials, service/domain setup, monitoring, backups/restore, cost review, and rollback require later explicit approval and verification.
- **Payment provider:** No payment processor is selected. Billing/webhook requirements, fees, and account onboarding remain unverified.
- **Quest toolchain/device:** Native Android toolchain and physical device status remain unverified.
- **PCVR runtime:** Existing source/artifact and smoke tests do not establish full game runtime compatibility.
- **External platform authorization:** OAuth app credentials/scopes and TikTok LIVE event eligibility remain unverified.
- **Full PC-offline website test:** Deferred until the frontend is hosted or an independent client is available. The Railway API is hosted separately from the user's PC; the deferred end-to-end browser test does not block Step 5's development backend acceptance.

## Safety boundaries
- Do not start Step 7 or later work without explicit user approval.
- Do not deploy to production, change DNS, enable paid services, run destructive migrations, or perform destructive Git operations without explicit permission.
