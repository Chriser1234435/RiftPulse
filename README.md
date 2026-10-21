# RiftPulse

RiftPulse is planned as a modular streaming suite for Beat Saber with separate PCVR and native Quest implementations.

## Current status
The existing PCVR project contains an in-game settings/configuration foundation. The twelve streaming modules, authenticated website, cloud backend, platform connectors, and native Quest client are not yet complete.

## Project layout
- `clients/pcvr/` — Windows PCVR plugin (BSIPA/C#, .NET Framework 4.7.2, C# 7.3).
- `clients/quest/` — reserved for a separate native Quest implementation; not yet created.
- `services/` — reserved for cloud APIs and connector workers; not yet implemented.
- `web/` — reserved for the AppDeploy website; not yet implemented.
- `shared/protocol/` — reserved for versioned cross-client contracts.
- `tests/pcvr-config-smoke/` — runnable configuration smoke tests.
- `docs/` — architecture, verification records, release guides, and status tracking.

## Local verification
```powershell
dotnet run --project .\tests\pcvr-config-smoke\pcvr-config-smoke.csproj
```
This checks config defaults, JSON persistence/reload, schema fallback, and preservation of malformed/unsupported files. It does not validate game runtime compatibility, cloud services, or streaming integrations.

## Development rules
- Work only in the currently approved project step.
- Never claim an integration or runtime behavior works without evidence.
- Keep secrets out of Git, browser bundles, logs, and mod binaries.
- Keep module enablement controls in the actual in-game RiftPulse Settings tab, not the website.
- See `docs/IMPLEMENTATION_PLAN.md` and `docs/ARCHITECTURE.md`.
