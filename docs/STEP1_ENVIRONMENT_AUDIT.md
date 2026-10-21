# RiftPulse — Step 1 Environment, Integrations, and Requirements Audit

**Audit date:** 2026-10-21  
**Step status:** Complete — audit and planning only  
**Project root:** `E:\RiftPulse\`

## Executive result

The authorized Windows device and local RiftPulse files were inspected, relevant connected integrations were queried read-only, and current official platform/modding documentation was reviewed. The current project is an early PCVR settings/configuration foundation; it is not yet the complete website, backend, streaming suite, or Quest implementation.

No application, database, Railway service, cloud deployment, platform OAuth app, or paid resource was created. No existing RiftPulse source was changed. This audit and the initial plan are the only project files added in Step 1.

## Verified development environment

- OS: Windows 11 Pro, build 26200.
- CPU: Intel Core i7-7700 @ 3.60 GHz.
- Visible RAM: approximately 15.9 GiB.
- GPUs reported: NVIDIA GeForce RTX 4060 and Intel HD Graphics 630 (plus virtual display adapters).
- Git: 2.56.0.windows.2.
- .NET SDK: 10.0.401; .NET Framework 4.7.2 reference assemblies are present.
- Node.js: v24.22.0; npm: 11.19.1.
- Visual Studio Installer locator exists, but MSBuild is not on PATH. Build capability must be verified during the approved foundations/build step.
- Python did not verify as a usable runtime: the command resolves to the WindowsApps shim and the Desktop Commander runtime reports Python unavailable.
- ADB, Java, CMake, Ninja, clang++, and ndk-build were not found on PATH. Common Android SDK locations checked did not exist, and ANDROID_HOME, ANDROID_SDK_ROOT, and JAVA_HOME were unset.
- Desktop Commander device `chrispc` was online during inspection.

Tool availability findings describe the inspected PATH and checked standard locations; they do not prove a tool could not exist elsewhere on disk.

## Existing RiftPulse project inventory

The root currently contains `clients\pcvr\`, `dist\pcvr\`, and `tests\pcvr-config-smoke\`. No `.git` directory or `docs\` folder was present at the time of inspection. There is no visible website, backend, or native Quest source project in the current root listing.

Files inspected include:
- `clients\pcvr\RiftPulse.PCVR.csproj`
- `clients\pcvr\manifest.json`
- `clients\pcvr\Plugin.cs`
- `clients\pcvr\SettingsHost.cs`
- `clients\pcvr\RiftPulse.Settings.bsml`
- `clients\pcvr\Configuration\StoredModuleConfig.cs`
- `tests\pcvr-config-smoke\Program.cs`
- `dist\pcvr\manifest.json`

The PCVR smoke-test source describes intended checks for 12 stable module IDs, safe-off defaults, JSON persistence/reload, unsupported schema fallback, and malformed-file preservation. **The test was not run during this audit**, so these assertions are not reported as passing.
## PCVR game and loader inventory

The configured build target is `E:\bsmanager\BSManager\BSInstances\SteamVR`. Its version file reports `1.40.8_7379`; the instance contains `Beat Saber.exe`, IPA loader files, and `Plugins\BSML.dll`. The PCVR project references `IPA.Loader.dll` and `BSML.dll`, targets .NET Framework 4.7.2, and sets C# language version 7.3.

The existing manifest targets Beat Saber 1.40.8 and declares BSIPA `^4.3.6` and BeatSaberMarkupLanguage `^1.12.5`. That aligns with the currently configured BSManager `SteamVR` profile. A separate Steam-library install reports `1.45.3_30054`, and other BSManager version folders exist. Future builds/installations must explicitly target the intended profile and must not silently install into the other game copy.

A compiled-looking file, `dist\pcvr\RiftPulse.PCVR.dll`, exists, but its presence alone does not prove that it builds from current source, loads correctly, or runs in-game. The existing PCVR code explicitly identifies itself as a development foundation: the menu stores local preferences; the streaming handlers are unreleased. The settings page places module controls in-game, consistent with the requirement not to add module toggles to the website.

## Connected integration inventory (read-only)

| Integration | Verified state | Capabilities and implications |
|---|---|---|
| AppDeploy | Connected; no apps returned | SDK reference documents native sign-in/sign-out, a stable AppDeploy user ID, API calls with bearer-token attachment, server route middleware, and encrypted app-scoped backend secrets. No RiftPulse auth flow has been implemented or tested. |
| Neon | Connected; no projects returned | Connector offers PostgreSQL project/branch/schema/migration operations. Use as the proposed relational application store; no database or migration was created. |
| Railway | Connected; no RiftPulse project verified | Connector supports projects/services, deploys, variables, logs, health/diagnostic information, and domains. No RiftPulse infrastructure was created. Unrelated existing projects were excluded from inspection and left untouched. |
| GitHub | Connected; zero accessible repositories returned | No remote repository is currently available through the connector, and the local RiftPulse root has no `.git` directory. Source control must be established in a future approved step. |
| Desktop Commander | Windows device online | Read-only filesystem/process inspection is available. Actual write/build/test capability remains to be verified only within the approved step that needs it. |

AppDeploy SDK references were consulted for `auth`, `secrets`, and `database`. The AppDeploy database feature is a key-value application database, not a substitute for the requested relational PostgreSQL schema. The proposed split is native AppDeploy identity plus Neon PostgreSQL for product data.
## Provisional architecture proposal

This proposal is grounded in currently documented tool capabilities but is not yet an implementation.

1. **Website and identity:** AppDeploy-hosted responsive website/dashboard using AppDeploy-native authentication. All protected operations must verify the authenticated identity server-side; browser-supplied user IDs are never authoritative.
2. **Relational storage:** Neon PostgreSQL for platform-connection metadata, installation records, pairing challenges, revocation state, versioned configuration, and bounded diagnostics. Use migrations and separate development/production branches/resources.
3. **Independent cloud event services:** Railway for public webhook/API endpoints and long-running connector/event-processing workloads where persistent connections or workers are required. Cloud event handling must not depend on the player's PC being powered on.
4. **Credential boundaries:** Keep static service secrets in the host's backend-only secret store. Store per-user platform tokens encrypted at rest, with encryption keys only in backend secret configuration. Never put privileged keys or refresh tokens in browser code, logs, source control, or mod binaries.
5. **Mod clients:** Separate PCVR C#/.NET Framework 4.7.2 plugin and native Quest C++/CMake project. Share versioned protocol and configuration schemas, not game-specific binaries. Clients connect outbound over authenticated HTTPS; pairing issues short-lived, single-use challenges and scoped installation credentials, with revocation and replay protection.
6. **Streaming event pipeline:** Platform adapters normalize official supported events into one schema; a bounded queue, deduplication, timeouts, retries/backoff, health state, and explicit unsupported-event states sit behind the connectors.
7. **Module framework:** One shared set of stable IDs/configuration contracts with independently implemented platform-specific runtime integrations. Website module enablement controls remain out of scope; gameplay toggles belong in the in-game RiftPulse Settings tab.

A key open design detail is how the AppDeploy-authenticated control plane securely invokes Railway connector operations and accesses Neon without duplicating identity or exposing tokens. Resolve this in Step 2's technical design before implementing protected APIs. Do not invent undocumented AppDeploy APIs.
## Platform and modding constraints checked

- **PCVR modding:** The current community PC mod guide describes the PC workflow as BSIPA-based and identifies C#/.NET Framework 4.7.2 and BeatSaberMarkupLanguage among the relevant development tools. Source: https://bsmg.wiki/modding/pc/setup.html and https://bsmg.wiki/modding/pc/
- **Quest modding:** The separate Quest development guide assumes C++, CMake, ADB, and PowerShell. Those core tools were not found in the checked local environment, and ADB could not enumerate any device. This means Quest physical-device availability is **unverified**, not proven absent. No Quest client code currently appears in the RiftPulse root listing. Source: https://bsmg.wiki/modding/quest/intro.html
- **Twitch:** Official EventSub supports event notifications over webhooks, WebSockets, and conduits. Select the transport based on event type and hosting behavior; actual app credentials, scopes, subscriptions, and live tests remain outstanding. Source: https://dev.twitch.tv/docs/eventsub/
- **YouTube:** The official Live Streaming API documents `liveChatMessages.streamList` for server-streamed, low-latency live chat. OAuth consent, broadcast ownership/access, quota, and supported fan-funding event details still need verification in the connector step. Source: https://developers.google.com/youtube/data/live/reference/rest/v3/liveChatMessages/streamList
- **TikTok LIVE:** TikTok documents webhook events and states that integrations using APIs/SDKs in Live are subject to app review. The general webhook event list inspected did not establish availability of the specific live-chat/gift events required by RiftPulse. Treat this as a high-risk external dependency until official endpoints, permissions, and account/app eligibility are demonstrated. Do not assume unofficial scraping is supported. Sources: https://developers.tiktok.com/docs/en/webhooks-events and https://developers.tiktok.com/docs/en/our-guidelines-developer-guidelines
- **KICK:** KICK publishes a developer API and documents real-time Event API webhooks for supported events including chat, follows, and subscription activity. Exact event coverage, signatures, app registration, and alert mapping must be confirmed in its dedicated implementation step. Sources: https://docs.kick.com/ and https://github.com/KickEngineering/KickDevDocs/blob/main/events/introduction.md

## Risks, blockers, and cost guardrails

1. **Multiple Beat Saber copies:** The build config targets the 1.40.8 BSManager profile while the standalone Steam-library copy is 1.45.3. Installation and runtime tests must state the exact game path/version.
2. **Quest toolchain missing/unverified:** ADB, Java, CMake, Ninja, clang++, and NDK tools were not found on PATH; no physical Quest runtime result is available. Quest work is blocked until the native toolchain and device access are verified.
3. **No source-control baseline:** There is no local Git repository and no GitHub repository returned by the connector. Step 2 must establish versioned, reviewable changes before substantial implementation.
4. **No cloud application resources yet:** No AppDeploy app or Neon project exists; no RiftPulse Railway service was found. Auth, database persistence, deployment, and connector behavior remain unimplemented/unverified.
5. **Current PCVR artifact not runtime-proven:** The existing DLL and menu source do not demonstrate an in-game runtime pass; smoke-test source was inspected but not executed here.
6. **Platform access depends on authorization:** Twitch/YouTube app configuration, TikTok LIVE-specific eligibility, and KICK app/webhook setup are external dependencies. No platform credentials were provided or tested during Step 1.
7. **Security design:** Per-user OAuth tokens require encrypted storage and careful revocation. The AppDeploy app-secret facility is for app-scoped secrets; do not use it as a fake per-user vault or expose values to clients.
8. **Privacy and diagnostics:** Persist only necessary user/platform/install data, bound diagnostic retention, and provide accurate data export/deletion behavior.
9. **Translation/TTS costs and licensing:** Provider/model, license, hosting, language coverage, and latency are unresolved. Basic TTS and commands must not become dependent on paid AI.
10. **Spending:** No paid resources were created. Railway's current docs describe a $5/month Hobby base plan or $20/month Pro base plan plus metered usage; Neon billing depends on usage and plan. Actual workload cost is not yet estimable. Use cost limits and obtain explicit approval before a new paid subscription, paid add-on, or material new spend. Sources: https://docs.railway.com/pricing and https://neon.com/blog/new-usage-based-pricing
## Evidence and acceptance check

**Observed locally**
- Windows/system and toolchain facts came from read-only PowerShell queries through the connected Windows device.
- Beat Saber version strings were read from `E:\bsmanager\BSManager\BSInstances\SteamVR\BeatSaberVersion.txt` and `E:\SteamLibrary\steamapps\common\Beat Saber\BeatSaberVersion.txt`.
- PCVR project/manifest/settings/config/test files were read directly from `E:\RiftPulse\`.
- Integration inventories used read-only AppDeploy, Neon, Railway, GitHub, and Desktop Commander calls.
- Current public developer/modding/pricing pages above were checked on 2026-10-21.

**Not performed in Step 1**
- No source build, test suite, game launch, or mod installation was run.
- No OAuth flow, platform live-event session, Quest ADB device test, API deployment, database migration, or production health test was performed.
- No platform credentials were created or requested.
- No source code or production state was changed.

**Step 1 acceptance criteria**
- Environment and available integrations inspected to the extent permitted: **Met**.
- Existing RiftPulse resources inventoried: **Met**.
- Provisional architecture grounded in verified capabilities: **Met**, with the AppDeploy-to-Railway control-plane detail explicitly open.
- Unknowns, risks, costs, and external blockers documented: **Met**.

The next step is **Step 2 — Architecture and project foundations**. It has not started. Approval is required before any Step 2 work.
