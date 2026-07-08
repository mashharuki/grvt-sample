# GRVT Raw API Sample App

This is a Bun + TypeScript learning app for understanding GRVT from the raw REST and WebSocket layer. It intentionally keeps SDK and CCXT usage out of the main path so you can see endpoints, request bodies, auth headers, cookies, EIP-712 payloads, and write-safety checks directly.

## Setup

```bash
cd sample-app
bun install
cp .env.example .env
```

Public market data does not require credentials. Authenticated reads and write dry-runs require API keys:

```bash
export GRVT_ENV="testnet"
export GRVT_TRADING_API_KEY="..."
export GRVT_TRADING_PRIVATE_KEY="..."
export GRVT_FUNDING_API_KEY="..."
export GRVT_FUNDING_PRIVATE_KEY="..."
export GRVT_DEFAULT_SYMBOL=BTC_USDT_Perp
```

`GRVT_ENV` defaults to `testnet`. Production writes are blocked in code, even with `--execute`.

## Shortest Learning Route

1. `bun run dev -- learn:overview`
2. `bun run dev -- market:instruments`
3. `bun run dev -- market:ticker --symbol BTC_USDT_Perp`
4. `bun run dev -- market:book --symbol BTC_USDT_Perp --limit 10`
5. `bun run dev -- ws:market --symbol BTC_USDT_Perp`
6. `bun run dev -- auth:login`
7. `bun run dev -- account:summary`
8. `bun run dev -- order:create --side buy --size 0.01 --price 50000`
9. `bun run dev -- order:create --side buy --size 0.01 --price 50000 --execute --env testnet`

Step 8 is a dry-run. It prints unsigned and signed payload shapes without submitting the order. Step 9 is the first command that can submit a write to testnet.

## Commands

| Command | API area learned | Env needed | Example | Risk |
| --- | --- | --- | --- | --- |
| `learn:overview` | Chain IDs, full/lite encoding, account model, auth flow | none | `bun run dev -- learn:overview` | safe |
| `market:instruments` | `POST /full/v1/all_instruments` | none | `bun run dev -- market:instruments` | safe |
| `market:ticker` | `POST /full/v1/ticker` | none | `bun run dev -- market:ticker --symbol BTC_USDT_Perp` | safe |
| `market:book` | `POST /full/v1/book` | none | `bun run dev -- market:book --limit 10` | safe |
| `market:trades` | `POST /full/v1/trade` | none | `bun run dev -- market:trades --limit 20` | safe |
| `market:candles` | `POST /full/v1/kline` | none | `bun run dev -- market:candles --interval CI_1_M` | safe |
| `market:funding` | `POST /full/v1/funding` | none | `bun run dev -- market:funding --limit 24` | safe |
| `ws:market` | Market WebSocket subscribe/unsubscribe shape and sequence numbers | none | `bun run dev -- ws:market` | safe |
| `auth:login` | API key login, `gravity` cookie, `X-Grvt-Account-Id` | `GRVT_TRADING_API_KEY` | `bun run dev -- auth:login` | safe, secret-masked |
| `account:summary` | Authenticated sub-account summary | trading API key | `bun run dev -- account:summary` | read-only |
| `account:positions` | Authenticated position query | trading API key | `bun run dev -- account:positions` | read-only |
| `account:fills` | Authenticated fill history | trading API key | `bun run dev -- account:fills --limit 50` | read-only |
| `account:funding-payments` | Funding payment history | trading API key | `bun run dev -- account:funding-payments` | read-only |
| `order:create` | Order payload, EIP-712 signature, create endpoint | trading API key + private key | `bun run dev -- order:create --side buy --size 0.01 --price 50000` | dry-run by default, testnet write with `--execute` |
| `order:cancel` | Cancel payload | trading API key | `bun run dev -- order:cancel --client-order-id 123` | dry-run by default, testnet write with `--execute` |
| `order:cancel-all` | Bulk cancel payload | trading API key | `bun run dev -- order:cancel-all` | dry-run by default, testnet write with `--execute` |
| `order:open` | Open orders | trading API key | `bun run dev -- order:open` | read-only |
| `order:history` | Order history | trading API key | `bun run dev -- order:history` | read-only |
| `transfer:history` | Internal/external transfer history | trading API key | `bun run dev -- transfer:history` | read-only |
| `deposit:history` | Deposit history | trading API key | `bun run dev -- deposit:history` | read-only |
| `withdrawal:history` | Withdrawal history | trading API key | `bun run dev -- withdrawal:history` | read-only |
| `vault:list` | Public strategy listing | none | `bun run dev -- vault:list` | safe |
| `vault:summary` | Vault investor summary | trading API key | `bun run dev -- vault:summary --vault-id 1315997999` | read-only |
| `vault:redeem-queue` | Vault redemption queue | trading API key | `bun run dev -- vault:redeem-queue --vault-id 1315997999` | read-only |
| `vault:invest` | Vault invest payload shape | funding API key | `bun run dev -- vault:invest --vault-id 1315997999 --amount 100` | dry-run by default, testnet write with `--execute` |
| `vault:redeem` | Vault redeem payload shape | funding API key | `bun run dev -- vault:redeem --vault-id 1315997999 --amount 10` | payload/dry-run only |
| `referral:epochs` | Referral epochs | trading API key | `bun run dev -- referral:epochs` | read-only |
| `referral:points` | Referral point summary | trading API key | `bun run dev -- referral:points` | read-only |
| `referral:data` | Referral account data | trading API key | `bun run dev -- referral:data --limit 50` | read-only |
| `builder:authorized` | Authorized builder query | trading API key | `bun run dev -- builder:authorized` | read-only |
| `builder:guide` | Builder order fields and endpoint map | none | `bun run dev -- builder:guide` | safe |

Use `--flavor lite` with most REST commands to point at `/lite/v1/*`. The sample keeps full-field request bodies in most commands because the purpose is readability; use lite mode when comparing endpoint routing and compact schemas.

## Safety Model

Write commands call the same guard before sending any request:

- No `--execute`: print dry-run payloads only.
- `--env prod`: always blocked.
- `--execute --env testnet`: allowed for implemented write commands.

This means you can inspect order and vault payloads locally without risking a real transaction.

## Checks

```bash
bun run check
bun run test
bun run smoke:public
```

`smoke:public` calls public testnet market endpoints and needs network access. Authenticated smoke checks depend on your local credentials:

```bash
bun run dev -- auth:login
bun run dev -- account:summary
bun run dev -- order:create --side buy --size 0.01 --price 50000
bun run dev -- order:create --side buy --size 0.01 --price 50000 --execute --env testnet
```

## Notes

- Official GRVT docs currently specify `POST` for REST APIs.
- Public market endpoints use `https://market-data.testnet.grvt.io/full/v1/*` on testnet.
- Trading endpoints use `https://trades.testnet.grvt.io/full/v1/*` on testnet.
- API key login uses `https://edge.testnet.grvt.io/auth/api_key/login` on testnet and returns the session cookie used by authenticated requests.
