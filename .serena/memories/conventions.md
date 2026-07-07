# Conventions

- Documentation language is mixed: README is Japanese; imported API/skill reference material is English. Preserve the surrounding file language when editing.
- Local GRVT skill docs use Markdown with YAML front matter: `name` and `description` are required for skill discovery.
- Skill docs are task-oriented: `When to Use`, `Prerequisites`, `SDK Setup`, then focused API examples.
- Skill examples assume `.env` may be loaded manually via `Path('.env')` and `os.environ.setdefault`; keep this pattern if extending examples.
- Symbol format for perps is `{BASE}_{QUOTE}_Perp`, e.g. `BTC_USDT_Perp`.
- Auth distinction matters:
  - Market data is public; no API key required.
  - Account/perps use Trading API key/private key.
  - Vault operations require Funding credentials and often also Trading login for `trading_account_id`.
- Avoid committing secrets. Treat GRVT API keys/private keys and `.env` contents as user-local sensitive data.