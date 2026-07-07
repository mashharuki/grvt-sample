# Core

- Purpose: GRVT investigation/validation repository, not an application codebase.
- Top-level files:
  - `README.md`: Japanese overview, API key acquisition notes, external GRVT references.
  - `docs/api_docs.md`: local GRVT API notes copied/summarized from official docs; includes auth, chain IDs, websocket, CCXT, and endpoint details.
  - `skills-lock.json`: pins GRVT skill sources/hashes from `gravity-technologies/grvt-skills`.
  - `.agents/skills/*/SKILL.md`: operational Codex skills for GRVT workflows.
- Major local skills:
  - `account-management`: balances, positions, margin, fills, account/funding history.
  - `market-data`: public prices, books, trades, OHLCV, funding rates, instruments.
  - `investment`: vault discovery, investor summary, invest/redeem/cancel redemption.
  - `perpetual-trading`: perps order placement/cancel/status/history, TP/SL helpers.
- Read `mem:tech_stack` for runtime/package assumptions and required credentials.
- Read `mem:conventions` before editing local skill docs or adding examples.
- Read `mem:suggested_commands` for setup and operational commands.
- Read `mem:task_completion` before closing any coding/docs change.