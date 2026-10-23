# RiftPulse

RiftPulse is planned as a modular streaming suite for Beat Saber with separate PCVR and native Quest implementations.

## Current status
The existing PCVR project contains an in-game settings/configuration foundation. Step 3 has a local React/Vite website authentication client and Express API authentication foundation using Clerk SDKs. Real sign-up/sign-in and API session verification still require a configured Clerk development application. The twelve streaming modules, cloud deployment, platform connectors, and native Quest client are not yet complete.

## Project layout
- `clients/pcvr/` - Windows PCVR plugin (BSIPA/C#, .NET Framework 4.7.2, C# 7.3).
- `clients/quest/` - reserved for a separate native Quest implementation; not yet created.
- `services/api/` - Express API authentication foundation for Railway.
- `services/` - reserved for platform connectors and event workers.
- `web/client/` - React/TypeScript/Vite website client for Cloudflare Pages.
- `shared/protocol/` - reserved for versioned cross-client contracts.
- `tests/pcvr-config-smoke/` - runnable PCVR configuration smoke tests.
- `docs/` - architecture, verification records, release guides, and status tracking.

## Local verification
PCVR config:
```powershell
dotnet run --project .\tests\pcvr-config-smoke\pcvr-config-smoke.csproj
```

Web client:
```powershell
Set-Location .\web\client
npm install
npm run build
npm run lint
```

API:
```powershell
Set-Location .\services\api
npm install
npm test
npm run build
```

The PCVR smoke test checks configuration defaults, JSON persistence/reload, schema fallback, and preservation of malformed/unsupported files. The auth tests currently cover fail-closed configuration and API/CORS behavior; they do not replace live Clerk acceptance.

## Development rules
- Work only in the currently approved project step.
- Never claim an integration or runtime behavior works without evidence.
- Keep secrets out of Git, browser bundles, logs, and mod binaries.
- Keep module enablement controls in the actual in-game RiftPulse Settings tab, not the website.
- See `docs/IMPLEMENTATION_PLAN.md` and `docs/ARCHITECTURE.md`.
