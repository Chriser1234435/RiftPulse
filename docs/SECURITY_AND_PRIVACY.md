# Security and Privacy

Initial architecture principles:
- AppDeploy is the authoritative user identity system.
- All protected APIs must verify identity server-side.
- Scope each private record to its authenticated owner.
- Keep service credentials and token-encryption keys backend-only.
- Encrypt platform tokens at rest; redact secrets from logs.
- Rate-limit pairing and webhook/API endpoints; reject expired and replayed challenges.
- Collect minimal data and define retention/deletion behavior before production.
- Do not make compliance claims before a scoped review.
