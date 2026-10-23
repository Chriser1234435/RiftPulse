# RiftPulse Branding Update

Date: 2026-10-21
Status: **Source changes deployed; icon asset upload pending.**

## Requested change
Use the user's RiftPulse logo for the browser favicon and top navigation brand mark, plus the Apple touch icon and web-app manifest.

## Implemented in AppDeploy source
- App: `riftpulse-czoph4` — https://riftpulse-czoph4.v2.appdeploy.ai/
- `src/App.tsx`: header logo references `/resources/riftpulse-icon.png`.
- `src/index.css`: header image fits the existing 38px brand-mark container without distortion.
- `index.html`: favicon, Apple touch icon, manifest link, and theme color metadata.
- `public/manifest.json`: RiftPulse app metadata and PNG icon entry.
- Resource slot: `public/resources/riftpulse-icon.png`, accepts `image/png`.

## Verification
- AppDeploy deployment status: **ready**.
- Latest QA snapshot: no frontend errors, network errors, or backend errors.
- The user attempted upload with PNG data, but the original slot accepted JPEG only. Source paths and resource slot were corrected together to PNG.
- AppDeploy still warns that the PNG asset is pending upload and not verified. The favicon/header appearance cannot be confirmed until the user completes the resource upload.

## Remaining action
In the AppDeploy Resources panel, select the `Favicon and home-page icon` slot and upload the PNG file. After upload, verify deployment status and warnings.

## Scope guard
Branding-only update. Step 3 acceptance results remain unchanged. Step 4 and later steps remain unstarted pending explicit user approval.
