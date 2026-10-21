# Build Instructions

## Current smoke-test project
Prerequisite: .NET SDK 10.0 or compatible SDK installed.

From `E:\RiftPulse`:
```powershell
dotnet run --project .\tests\pcvr-config-smoke\pcvr-config-smoke.csproj
```
Expected successful output begins with `PCVR config smoke tests passed:` and the process exits with code 0.

## PCVR plugin
The current project targets .NET Framework 4.7.2 and C# 7.3. Its default `BeatSaberDir` is `E:\bsmanager\BSManager\BSInstances\SteamVR`. Build/runtime compatibility still needs dedicated verification; do not install the existing DLL solely because it exists.

## Quest
No verified Quest build instructions can be finalized until the Android/NDK/CMake toolchain and target Quest loader/game version are inspected and selected.
