# AGENTS.md

このリポジトリは GRVT の調査・検証用リポジトリです。アプリケーション本体ではなく、GRVT API、SDK、Agent Skill の参照と検証を目的にしています。

## 作業方針

- 既存の README、docs、`.agents/skills` の内容を優先して確認してください。
- GRVT の API や SDK は変わる可能性があるため、仕様に関わる変更では公式ドキュメントやローカルの `docs/api_docs.md` との整合性を確認してください。
- API キー、秘密鍵、`.env` の内容などの認証情報はコミットしないでください。
- README は日本語、API ドキュメントや Skill 本文は英語が中心です。編集時は周囲の言語に合わせてください。

## 主要ファイル

- `README.md`: プロジェクト概要、GRVT 参考リンク、API キー取得メモ。
- `docs/api_docs.md`: GRVT API のローカル参照メモ。
- `skills-lock.json`: 導入済み GRVT Skill のソースとハッシュ。
- `.agents/skills/*/SKILL.md`: GRVT 操作用のローカル Skill。

## Skill 利用

GRVT 関連の作業では、該当する Skill を先に確認してください。

- `market-data`: 価格、板、約定、ローソク足、Funding Rate、銘柄一覧。
- `account-management`: 残高、ポジション、証拠金、取引履歴、Funding 支払い履歴。
- `perpetual-trading`: 無期限先物の注文、キャンセル、注文確認、TP/SL。
- `investment`: Vault の一覧、投資、償還、投資家サマリー。

## 環境変数

検証スクリプトや Skill 例では、必要に応じて以下を使います。

```bash
export GRVT_ENV="testnet"
export GRVT_TRADING_API_KEY="..."
export GRVT_TRADING_PRIVATE_KEY="..."
export GRVT_FUNDING_API_KEY="..."
export GRVT_FUNDING_PRIVATE_KEY="..."
```

`GRVT_ENV` は通常 `testnet` を既定として扱い、本番環境を使う場合は明示的に確認してください。

## 推奨コマンド

```bash
npx skills add gravity-technologies/grvt-skills
pip install grvt-pysdk
rg --files
git status --short
```

このリポジトリには、現時点で専用のビルド、テスト、Lint、Format コマンドは定義されていません。

## 完了確認

- ドキュメント変更では `git diff --check` を実行してください。
- 変更後は `git status --short` で差分対象を確認してください。
- GRVT の実 API を使う検証は、ユーザーの認証情報と `GRVT_ENV` に依存するため、実行可否を明示してください。
