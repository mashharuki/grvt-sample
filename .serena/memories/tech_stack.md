# Tech Stack

- Primary language in local examples: Python.
- GRVT access library: `grvt-pysdk`, imported as `pysdk.grvt_ccxt.GrvtCcxt` and `pysdk.grvt_ccxt_env.GrvtEnv`.
- Optional general exchange integration: CCXT supports GRVT in Python, JavaScript/TypeScript, PHP, and C# per `docs/api_docs.md`.
- No package manifest or app test harness is present in this repo as of onboarding; setup is command/example driven.
- Local skill installation source is pinned in `skills-lock.json`: `gravity-technologies/grvt-skills`.
- Common environment variables used by skills:
  - `GRVT_ENV`: `testnet` by default, `prod` for production.
  - `GRVT_TRADING_API_KEY`, `GRVT_TRADING_PRIVATE_KEY`: trading account operations and perps.
  - `GRVT_FUNDING_API_KEY`, `GRVT_FUNDING_PRIVATE_KEY`: funding/vault operations.
- GRVT endpoints in examples:
  - testnet edge: `edge.testnet.grvt.io`; production edge: `edge.grvt.io`.
  - testnet trades: `trades.testnet.grvt.io`; production trades: `trades.grvt.io`.
- Chain IDs from docs: GRVT L2 Sepolia staging 327, testnet 326, mainnet 325.