# GRVT API 学習用 sample-app 実装プラン

## Summary

sample-app/ に Bun + TypeScript + Biome のスクリプトベース教材アプリを作る。中心は Raw REST / WebSocket 実装で、GRVT の API 仕様を低レイヤから理解できる構成にする。書き込み系 API は testnet 実行可能にするが、デフォルトは dry-run とし、実行には明示フラグを必須にする。

## Key Changes

- sample-app/ を新規作成し、Bun プロジェクトとして初期化する。
- 主要依存:
    - typescript: 型付き実装
    - @biomejs/biome: format/lint
    - zod: env・入力・レスポンスの最低限バリデーション
    - viem: EIP-712 署名、秘密鍵 account、typed data helpers

- 主要スクリプト:
    - bun run dev -- <command>
    - bun run check
    - bun run format
    - bun run test
    - bun run smoke:public

- .env.example を用意:
    - GRVT_ENV=testnet
    - GRVT_TRADING_API_KEY
    - GRVT_TRADING_PRIVATE_KEY
    - GRVT_FUNDING_API_KEY
    - GRVT_FUNDING_PRIVATE_KEY
    - GRVT_DEFAULT_SYMBOL=BTC_USDT_Perp

## Implementation Changes

- 共通基盤:
    - config: testnet / prod の edge, trades, ws endpoint を一元管理。
    - http: POST full/v1/* と POST lite/v1/* を切り替え可能な Raw REST client。
    - auth: API key login で gravity cookie と X-Grvt-Account-Id を取得。
    - signing: EIP-712 payload を生成・署名し、署名前 JSON と署名後 payload を表示できる。
    - safety: 書き込み系は --execute がない限り送信しない。prod での書き込みは常に拒否する。

- CLI コマンド構成:
    - learn:overview: chain IDs、full/lite、account model、auth flow を表示。
    - market:instruments, market:ticker, market:book, market:trades, market:candles, market:funding: Public Market Data API を
      網羅。

    - ws:market: mini ticker、ticker、orderbook、trade、candlestick の subscribe/unsubscribe と sequence number 表示。
    - auth:login: API key login の cookie/header/body を安全にマスク表示。
    - account:summary, account:positions, account:fills, account:funding-payments: 認証済み read API。
    - order:create, order:cancel, order:cancel-all, order:open, order:history: testnet trading API。create/cancel は default
      dry-run。

    - transfer:history, deposit:history, withdrawal:history: 資金移動系の read API。
    - vault:list, vault:summary, vault:redeem-queue: Vault 理解用。invest/redeem は payload/dry-run 中心、--execute で testnet
      のみ許可。

    - referral:epochs, referral:points, referral:data: Referral Data API。
    - builder:authorized, builder:guide: Builder Integration の認可 payload と関連 API の理解用。

- 教材ドキュメント:
    - sample-app/README.md に「最短学習ルート」を書く。
    - 推奨順序は learn:overview → public market → websocket → auth → account read → order dry-run → testnet execute。
    - 各コマンドに「学べる API 仕様」「必要な env」「実行例」「危険度」を明記する。

## Test Plan

- bun run check: Biome lint/format check と TypeScript 型チェック。
- bun run test: env parser、endpoint resolver、full/lite request builder、auth cookie parser、EIP-712 payload builder、write
  safety guard を単体テスト。

- bun run smoke:public: API key なしで market instruments/ticker/book/candles を testnet public endpoint に対して実行。
- 認証系 smoke は credentials がある場合のみ手動:
    - bun run dev -- auth:login
    - bun run dev -- account:summary
    - bun run dev -- order:create --dry-run
    - bun run dev -- order:create --execute --env testnet

## Assumptions
- sample-app は Web UI ではなく CLI/script ベースにする。
- Raw REST/WS を主軸にし、SDK/CCXT は比較メモに留める。
- 書き込み系 API は testnet のみ実行可能、production 書き込みは実装上ブロックする。
- 既存の README.md, AGENTS.md, docs/api_docs.md, .agents/skills/* は参照元として扱い、必要最小限の追記以外は変更しない。