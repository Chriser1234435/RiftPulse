# Troubleshooting

Status: Initial baseline.

- If the PCVR configuration smoke test fails, capture the full command output and exit code before changing source.
- If a PCVR build cannot resolve IPA/BSML assemblies, verify the selected `BeatSaberDir` and target profile's dependencies.
- Quest build/install issues cannot be diagnosed reliably until the native toolchain and connected device are verified.
- Never post tokens, authorization headers, pairing codes, or secret environment values in logs/issues.
