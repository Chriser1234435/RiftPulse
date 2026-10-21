# RiftPulse Test Strategy

**Status:** Foundational test approach; expand during each approved feature step.

## Test layers
1. **Unit tests:** Config validation, serialization, module IDs, normalization, filtering, queue bounds, cooldowns, and state transitions.
2. **Contract tests:** Versioned schemas for pairing, config sync, normalized events, connector payloads, and error responses.
3. **Integration tests:** AppDeploy identity middleware, Neon migrations/ownership, Railway API/webhook behavior, token encryption, revocation, and connector reconnection.
4. **Security tests:** Unauthenticated access, forged user IDs, cross-user access, expired/replayed pairing codes, token leakage, webhook signature failures, rate limits, and unsafe workflow execution.
5. **Client build tests:** PCVR compilation against the selected Beat Saber profile and an independent native Quest build.
6. **Runtime acceptance:** Actual Beat Saber PCVR launch/menu/config behavior and physical Quest installation/runtime/performance when available.
7. **Regression:** Re-run relevant suites after changes; maintain `TEST_REPORT.md` and `REGRESSION_LOG.md`.

## Current executable baseline
```powershell
dotnet run --project .\tests\pcvr-config-smoke\pcvr-config-smoke.csproj
```
Latest Step 2 run: passed, exit code 0, with one CS8618 nullable warning from the test compilation context.

## Evidence rules
Record exact command, exit code, output, environment/target, and date. Separate automated tests from manual runtime checks. A build is not a runtime pass; mocks are not live integration evidence. Mark missing credentials, platform approval, devices, and services explicitly.
