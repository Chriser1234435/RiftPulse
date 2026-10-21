# Test Report

## 2026-10-21 — Step 2 foundational baseline
- Command: `dotnet run --project .\tests\pcvr-config-smoke\pcvr-config-smoke.csproj`
- Result: **PASS**, exit code 0.
- Coverage: 12 safe-off defaults, JSON persistence/reload, unsupported schema fallback, malformed-config fallback, and corrupt-file preservation.
- Warning: CS8618 nullable property warning for `StoredModuleConfig.Modules` in the .NET 10 test build context.
- Not covered: game launch, PCVR plugin runtime, cloud services, OAuth, streaming APIs, or physical Quest behavior.
