# RiftPulse — Current-State and Environment Re-Audit

**Audit date:** 2026-10-21  
**Scope:** Phase 1 / Step 1 only — current-state inspection  
**Project root:** E:/RiftPulse/  
**Result:** Inspection and documentation completed. No infrastructure or application-source changes made.

## Executive summary

The local RiftPulse repository exists and contains an early PCVR settings/configuration foundation plus planning documents and a passing configuration smoke test. It is not a complete website, cloud backend, streaming suite, subscription system, or Quest mod.

A critical discrepancy was confirmed: an earlier report records a deployed AppDeploy RiftPulse app and user-confirmed authentication tests, but the current AppDeploy status tool now returns **App deleted**, and the current app inventory is empty. Those earlier authentication results are historical only; no live RiftPulse website/auth flow is currently verified.

## 1. Verified working components

- The authorized Windows device chrispc is online. Windows, Git, .NET SDK, Node.js, and npm are available. The installed .NET SDK is 10.0.401.
- The local repository at E:/RiftPulse/ exists, with branch main, HEAD b1aaeba (docs: finalize Step 2 foundation report), 42 tracked files, and no Git remote configured.
- The existing configuration smoke test was executed during this audit:
  - Command: dotnet run --project ./tests/pcvr-config-smoke/pcvr-config-smoke.csproj
  - Result: **PASS**, exit code 0.
  - Covered: 12 safe-off defaults, JSON persistence/reload, schema mismatch fallback, malformed-config fallback, and preservation of invalid configuration files.
  - Existing warning: CS8618 for StoredModuleConfig.Modules in the .NET 10 test compilation context.
- The selected BSManager SteamVR profile exists at E:/bsmanager/BSManager/BSInstances/SteamVR, reports Beat Saber 1.40.8_7379, and has the IPA loader and BSML references used by the PCVR project.
- A separate Steam-library game copy reports 1.45.3_30054. These copies must not be treated as interchangeable.
- The local artifact dist/pcvr/RiftPulse.PCVR.dll exists. Its existence does not establish that it builds from the current source or loads in-game.

## 2. Existing but unverified components

- PCVR source includes a BSIPA plugin foundation, an in-game BSML Settings page, twelve module preference toggles, and local JSON configuration storage.
- The implementation explicitly states that the streaming handlers are not released. The toggles store preferences; they do not demonstrate that the twelve runtime modules work.
- The PCVR artifact was **not** found in the plugin locations checked under either Beat Saber installation. No in-game launch, loader, VR interaction, or runtime acceptance test was performed during this audit.
- Old documentation records user-confirmed sign-in, protected-access denial, and sign-out tests for the former AppDeploy app. The current app is deleted, so those tests do not prove that a currently accessible live system exists.

## 3. Current provider and repository inventory

| Area | Current verified state |
|---|---|
| AppDeploy | Connected account; current app listing returned zero apps. Historical RiftPulse app status returns **deleted**. No live RiftPulse deployment currently verified. |
| Neon | An organization is visible, but project inventory returned zero projects. No RiftPulse database, schema, migration, or runtime read/write path exists. |
| Railway | No RiftPulse project was found. The account lists two projects named StreamVoice Level; these are unrelated to the RiftPulse audit and were not inspected or changed. |
| Cloudflare | No dedicated Cloudflare integration/tool was found in the currently available tool catalog. This does **not** prove that no Cloudflare account exists. |
| GitHub | The connected GitHub inventory returned zero accessible repositories. The local repository has no remote. |
| Desktop Commander | The Windows device is online; read-only file and process inspection worked. |
| Quest environment | No native Quest source project or CMakeLists.txt is present under clients/quest/. adb, Java, CMake, Ninja, clang++, and ndk-build were not found on PATH. Quest headset/ADB availability remains unverified, not proven absent. |

### Existing local worktree changes

The worktree was already not clean before this audit's documentation updates: eight tracked documentation files were modified and two documentation files were untracked. The prior contents were not discarded. There is no configured Git remote, and no commit or push was performed during this audit.

The local web/, services/, and clients/quest/ areas contain README placeholders only; no web package.json, service package.json, or Quest native build project was found.

## 4. Missing or not yet implemented

- A currently deployed RiftPulse website and account-access flow.
- A verified production authentication architecture compatible with the target hosting approach.
- Neon schema/migrations and tested runtime persistence.
- RiftPulse API, worker, webhook, and streaming connector services.
- Secure installation pairing, scoped credentials, configuration synchronization, and revocation.
- Subscription checkout, billing lifecycle/webhooks, and server-enforced Free/Premium entitlements.
- Twitch, YouTube, TikTok LIVE, and KICK connectors with live authorization/event tests.
- Runtime implementations for the twelve modules; current toggles alone are not modules.
- A native Quest client, native build configuration, and physical-device validation.
- Verified production independence from the development PC, operational health checks, deployment rollback, and cost measurements.
- A repository remote and a reviewed, clean baseline for future implementation.

## 5. Cost and provider limits to carry into Phase 2

No project, subscription, deployment, database, GPU worker, or other paid RiftPulse resource was created during this audit. Actual monthly operating cost is not estimable yet because production architecture and workload are not running.

- **Cloudflare Pages:** The current official documentation says static asset requests are free and unlimited, while Pages Functions consume Workers request quota. The Free Pages limit page lists 500 builds/month, 20,000 files per site, and a 25 MiB per-file asset limit. Confirm the full plan and custom-domain details before choosing the final architecture. Sources: https://developers.cloudflare.com/pages/platform/limits/ and https://developers.cloudflare.com/pages/functions/pricing/.
- **Neon:** Neon’s October 2, 2026 announcement states the Free plan includes up to 100 projects, 1 GB database storage per project, and 100 compute-unit hours per project per month, subject to its current plan limits. The connected account currently has no projects. Source: https://neon.com/blog/neon-free-plan-1-gb-per-project.
- **Railway:** Current official documentation lists Free at $0 with $1 monthly resource credit, Hobby at $5/month with $5 of included usage, and Pro at $20/month with $20 of included usage; usage can exceed the included amount. No RiftPulse project is present, and the unrelated existing projects were not inspected. Source: https://docs.railway.com/pricing/plans.
- Translation GPU/hosting, audio/assets, payment processing, and streaming platform quotas remain separate cost drivers and have not been purchased or provisioned.

## 6. Decisions and blockers

1. The old AppDeploy app has been deleted. Before rebuilding or migrating the frontend, Phase 2 must determine which supported hosting/auth combination fits the requirements and what user approval is required. Do not assume the old live URL or authentication flow still works.
2. The target Cloudflare Pages + Neon + Railway architecture has not been provisioned. No provider integration is complete merely because a connector is available.
3. The local Git worktree contains outstanding documentation modifications. Review and preserve them; do not reset or overwrite them blindly.
4. Quest development is blocked pending verification of the actual native toolchain, supported loader/game version, and device access.
5. PCVR compatibility remains unverified until the current artifact is built against the selected profile and installed/launched in-game.
6. Paid service choices, payment-provider onboarding, GPU compute, new production resources, and material recurring costs require explicit approval.

## Acceptance evidence

- Local source/docs and game-profile paths were inspected through the connected Windows device.
- AppDeploy, Neon, Railway, GitHub, and Desktop Commander inventories were queried read-only.
- The existing configuration smoke test passed with exit code 0 and the warning recorded above.
- Provider cost/limit references were checked against official documentation available on this audit date.
- No existing application source, provider project, database, deployment, or unrelated resource was deleted or modified. This audit report and status reconciliations are documentation-only.

## Proposed next step — approval required

**Phase 2: Architecture and migration plan.** Resolve the live-app/auth gap first; document the supported hosting/auth options, API and database boundaries, secrets flow, deployment/rollback strategy, verified cost ranges, and prerequisites before provisioning resources or beginning implementation.

**Stop condition:** Phase 2 has not started. Wait for explicit user approval before proceeding.
