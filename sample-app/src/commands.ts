import { createOrderDraft, createVaultInvestDraft, signOrder } from "./signing";
import type { CliOptions } from "./utils/args";
import type { LoginResult } from "./utils/auth";
import { loginWithApiKey, maskSecret } from "./utils/auth";
import { getEndpointConfig, parseRuntimeEnv, wsUrl } from "./utils/config";
import { postJson } from "./utils/http";
import { assertWriteAllowed } from "./utils/safety";

type CommandContext = {
  options: CliOptions;
  runtimeEnv: ReturnType<typeof parseRuntimeEnv>;
};

type CommandHandler = (ctx: CommandContext) => Promise<void> | void;

// マーケット系のAPIを呼び出すコマンド
const marketCommands: Record<
  string,
  { method: string; body: (ctx: CommandContext) => unknown }
> = {
  "market:instruments": {
    method: "v1/all_instruments",
    body: () => ({ is_active: true, kinds: ["PERPETUAL"] }),
  },
  "market:ticker": {
    method: "v1/ticker",
    body: (ctx) => ({ instrument: symbol(ctx) }),
  },
  "market:book": {
    method: "v1/book",
    body: (ctx) => ({
      instrument: symbol(ctx),
      depth: ctx.options.limit ?? 10,
    }),
  },
  "market:trades": {
    method: "v1/trade",
    body: (ctx) => ({
      instrument: symbol(ctx),
      limit: ctx.options.limit ?? 20,
    }),
  },
  "market:candles": {
    method: "v1/kline",
    body: (ctx) => ({
      instrument: symbol(ctx),
      interval: ctx.options.interval ?? "CI_1_M",
      type: "TRADE",
      limit: ctx.options.limit ?? 20,
      cursor: "",
    }),
  },
  "market:funding": {
    method: "v1/funding",
    body: (ctx) => ({
      instrument: symbol(ctx),
      limit: ctx.options.limit ?? 24,
      cursor: "",
      agg_type: "FUNDING_INTERVAL",
    }),
  },
};

// 認証が必要な読み込み系のコマンド
const authenticatedReadCommands: Record<
  string,
  {
    method: string;
    body: (ctx: CommandContext, session: LoginResult) => unknown;
  }
> = {
  "account:summary": {
    method: "v1/account_summary",
    body: (_ctx, session) => ({
      sub_account_id: session.subAccountId ?? session.accountId,
    }),
  },
  "account:positions": {
    method: "v1/positions",
    body: (_ctx, session) => ({
      sub_account_id: session.subAccountId ?? session.accountId,
      kind: ["PERPETUAL"],
    }),
  },
  "account:fills": {
    method: "v1/fill_history",
    body: (ctx, session) => ({
      sub_account_id: session.subAccountId ?? session.accountId,
      instrument: symbol(ctx),
      limit: ctx.options.limit ?? 50,
    }),
  },
  "account:funding-payments": {
    method: "v1/funding_payment_history",
    body: (ctx, session) => ({
      sub_account_id: session.subAccountId ?? session.accountId,
      instrument: symbol(ctx),
      limit: ctx.options.limit ?? 24,
    }),
  },
  "order:open": {
    method: "v1/open_orders",
    body: (ctx, session) => ({
      sub_account_id: session.subAccountId ?? session.accountId,
      instrument: symbol(ctx),
    }),
  },
  "order:history": {
    method: "v1/order_history",
    body: (ctx, session) => ({
      sub_account_id: session.subAccountId ?? session.accountId,
      limit: ctx.options.limit ?? 50,
    }),
  },
  "transfer:history": {
    method: "v1/transfer_history",
    body: (_ctx, session) => ({ main_account_id: session.accountId }),
  },
  "deposit:history": {
    method: "v1/deposit_history",
    body: (_ctx, session) => ({ main_account_id: session.accountId }),
  },
  "withdrawal:history": {
    method: "v1/withdrawal_history",
    body: (_ctx, session) => ({ main_account_id: session.accountId }),
  },
  "vault:summary": {
    method: "v1/vault_investor_summary",
    body: (ctx, session) => ({
      main_account_id: session.accountId,
      vault_id: required(ctx.options.vaultId, "--vault-id"),
    }),
  },
  "vault:redeem-queue": {
    method: "v1/vault_view_redemption_queue",
    body: (ctx) => ({ vault_id: required(ctx.options.vaultId, "--vault-id") }),
  },
  "builder:authorized": {
    method: "v1/get_authorized_builders",
    body: (_ctx, session) => ({ main_account_id: session.accountId }),
  },
};

export async function runCommand(
  options: CliOptions,
  envSource: Record<string, string | undefined> = process.env,
): Promise<void> {
  const runtimeEnv = parseRuntimeEnv(envSource);
  const ctx = { options, runtimeEnv };
  const command = commands[options.command] ?? dynamicCommand(options.command);
  if (!command) {
    showHelp();
    throw new Error(`Unknown command: ${options.command}`);
  }
  await command(ctx);
}

const commands: Record<string, CommandHandler> = {
  help: () => showHelp(),
  "learn:overview": (ctx) => {
    const env = ctx.options.env ?? ctx.runtimeEnv.GRVT_ENV;
    const config = getEndpointConfig(env);
    printJson({
      purpose:
        "Learn GRVT chain IDs, full/lite encoding, account model, and auth flow.",
      selected_env: env,
      chain_ids: {
        ethereum_l1_chain_id: config.ethereumChainId,
        grvt_l2_chain_id: config.chainId,
      },
      endpoints: config,
      encoding: {
        full: "Readable field names, for learning and debugging.",
        lite: "Short field names, for bandwidth-sensitive clients.",
      },
      account_model: [
        "Funding Account manages funds",
        "Trading Account places derivative orders",
        "API key login returns gravity cookie and X-Grvt-Account-Id",
      ],
      safety: "Writes require --execute and are always blocked for prod.",
    });
  },
  "ws:market": (ctx) => {
    const env = ctx.options.env ?? ctx.runtimeEnv.GRVT_ENV;
    const flavor = ctx.options.flavor;
    const config = getEndpointConfig(env);
    const feed = `${symbol(ctx)}@500-100-10`;
    printJson({
      url: wsUrl(config.marketDataWsUrl, flavor),
      subscribe: {
        stream: "v1.book.s",
        feed: [feed],
        method: "subscribe",
        is_full: flavor === "full",
      },
      unsubscribe: {
        stream: "v1.book.s",
        feed: [feed],
        method: "unsubscribe",
        is_full: flavor === "full",
      },
      sequence_number_note:
        "Reconnect if a delta sequence number jumps or decreases. Snapshot payloads use sequence_number 0.",
    });
  },
  "auth:login": async (ctx) => {
    const env = ctx.options.env ?? ctx.runtimeEnv.GRVT_ENV;
    const config = getEndpointConfig(env);
    const apiKey = required(
      ctx.runtimeEnv.GRVT_TRADING_API_KEY,
      "GRVT_TRADING_API_KEY",
    );
    const login = await loginWithApiKey(config, apiKey);
    printJson({
      cookie: maskSecret(login.cookie),
      "X-Grvt-Account-Id": maskSecret(login.accountId),
      body: {
        ...(typeof login.body === "object" && login.body ? login.body : {}),
        funding_account_address: maskSecret(login.fundingAccountAddress),
        sub_account_id: maskSecret(login.subAccountId),
      },
    });
  },
  "order:create": async (ctx) => {
    const env = ctx.options.env ?? ctx.runtimeEnv.GRVT_ENV;
    const config = getEndpointConfig(env);
    const apiKey = required(
      ctx.runtimeEnv.GRVT_TRADING_API_KEY,
      "GRVT_TRADING_API_KEY",
    );
    const privateKey = required(
      ctx.runtimeEnv.GRVT_TRADING_PRIVATE_KEY,
      "GRVT_TRADING_PRIVATE_KEY",
    );
    const login = await loginWithApiKey(config, apiKey);
    const draft = createOrderDraft({
      subAccountId: login.subAccountId ?? login.accountId,
      symbol: symbol(ctx),
      side: ctx.options.side ?? "buy",
      orderType: ctx.options.orderType ?? "limit",
      size: required(ctx.options.size, "--size"),
      price: ctx.options.price,
      clientOrderId: ctx.options.clientOrderId,
    });
    const signedOrder = await signOrder(config, draft, privateKey);
    const body = { order: signedOrder };
    const safety = assertWriteAllowed({
      env,
      execute: ctx.options.execute,
      operation: "order:create",
    });
    if (!safety.allowed) {
      printJson({
        dry_run: true,
        reason: safety.reason,
        unsigned_order: draft,
        signed_payload: body,
      });
      return;
    }
    printJson(
      await postJson(config, {
        service: "trades",
        flavor: ctx.options.flavor,
        method: "v1/create_order",
        body,
        auth: login,
      }),
    );
  },
  "order:cancel": async (ctx) => {
    const body = {
      order_id: ctx.options.orderId,
      client_order_id: ctx.options.clientOrderId,
    };
    await guardedWrite(ctx, "order:cancel", "v1/cancel_order", body);
  },
  "order:cancel-all": async (ctx) => {
    await guardedWrite(ctx, "order:cancel-all", "v1/cancel_all_orders", {
      kind: ["PERPETUAL"],
    });
  },
  "vault:list": async (ctx) => {
    const env = ctx.options.env ?? ctx.runtimeEnv.GRVT_ENV;
    const config = getEndpointConfig(env);
    const url = `${config.edgeBaseUrl}/api/v1/investment/strategies`;
    const response = await fetch(url);
    const body = await response.json();
    if (!response.ok) {
      throw new Error(
        `Vault list failed: ${response.status} ${JSON.stringify(body)}`,
      );
    }
    printJson(body);
  },
  "vault:invest": async (ctx) => {
    const env = ctx.options.env ?? ctx.runtimeEnv.GRVT_ENV;
    const config = getEndpointConfig(env);
    const apiKey = required(
      ctx.runtimeEnv.GRVT_FUNDING_API_KEY,
      "GRVT_FUNDING_API_KEY",
    );
    const login = await loginWithApiKey(config, apiKey);
    const body = createVaultInvestDraft({
      fundingAccountAddress: login.fundingAccountAddress ?? login.accountId,
      vaultId: required(ctx.options.vaultId, "--vault-id"),
      currency: ctx.options.currency ?? "USDT",
      amount: required(ctx.options.amount, "--amount"),
    });
    const safety = assertWriteAllowed({
      env,
      execute: ctx.options.execute,
      operation: "vault:invest",
    });
    if (!safety.allowed) {
      printJson({ dry_run: true, reason: safety.reason, payload_shape: body });
      return;
    }
    printJson(
      await postJson(config, {
        service: "trades",
        flavor: ctx.options.flavor,
        method: "v1/vault_invest",
        body,
        auth: login,
      }),
    );
  },
  "vault:redeem": async (ctx) => {
    const env = ctx.options.env ?? ctx.runtimeEnv.GRVT_ENV;
    const payload = {
      vault_id: required(ctx.options.vaultId, "--vault-id"),
      currency: ctx.options.currency ?? "USDT",
      num_lp_tokens: required(ctx.options.amount, "--amount"),
      signature: "<build EIP-712 VaultRedeem signature before executing>",
    };
    const safety = assertWriteAllowed({
      env,
      execute: ctx.options.execute,
      operation: "vault:redeem",
    });
    printJson({
      dry_run: !safety.allowed,
      reason: safety.reason,
      payload_shape: payload,
    });
  },
  "referral:epochs": async (ctx) => referral(ctx, "v1/epochs", {}),
  "referral:points": async (ctx) => referral(ctx, "v1/point_summary", {}),
  "referral:data": async (ctx) =>
    referral(ctx, "v1/referral_data", { limit: ctx.options.limit ?? 50 }),
  "builder:guide": (ctx) => {
    const env = ctx.options.env ?? ctx.runtimeEnv.GRVT_ENV;
    const config = getEndpointConfig(env);
    printJson({
      purpose:
        "Builder integration requires a client-authorized builder account before builder-tagged orders are accepted.",
      authorized_builders_endpoint: `${config.tradesBaseUrl}/${ctx.options.flavor}/v1/get_authorized_builders`,
      order_fields: ["order.builder", "order.builder_fee"],
      safety:
        "Use builder:authorized first, then inspect signed order payloads with order:create dry-run.",
    });
  },
  "smoke:public": async (ctx) => {
    for (const command of [
      "market:instruments",
      "market:ticker",
      "market:book",
      "market:candles",
    ]) {
      const market = marketCommands[command];
      if (!market) {
        continue;
      }
      const env = ctx.options.env ?? ctx.runtimeEnv.GRVT_ENV;
      const config = getEndpointConfig(env);
      const result = await postJson(config, {
        service: "market-data",
        flavor: ctx.options.flavor,
        method: market.method,
        body: market.body({ ...ctx, options: { ...ctx.options, command } }),
      });
      printJson({ command, ok: true, summary: summarizePayload(result) });
    }
  },
};

function dynamicCommand(command: string): CommandHandler | undefined {
  const market = marketCommands[command];
  if (market) {
    return async (ctx) => {
      const env = ctx.options.env ?? ctx.runtimeEnv.GRVT_ENV;
      const config = getEndpointConfig(env);
      printJson(
        await postJson(config, {
          service: "market-data",
          flavor: ctx.options.flavor,
          method: market.method,
          body: market.body(ctx),
        }),
      );
    };
  }
  const authenticated = authenticatedReadCommands[command];
  if (authenticated) {
    return async (ctx) => {
      const env = ctx.options.env ?? ctx.runtimeEnv.GRVT_ENV;
      const config = getEndpointConfig(env);
      const apiKey = required(
        ctx.runtimeEnv.GRVT_TRADING_API_KEY,
        "GRVT_TRADING_API_KEY",
      );
      const login = await loginWithApiKey(config, apiKey);
      printJson(
        await postJson(config, {
          service: "trades",
          flavor: ctx.options.flavor,
          method: authenticated.method,
          body: authenticated.body(ctx, login),
          auth: login,
        }),
      );
    };
  }
  return undefined;
}

async function guardedWrite(
  ctx: CommandContext,
  operation: string,
  method: string,
  body: unknown,
): Promise<void> {
  const env = ctx.options.env ?? ctx.runtimeEnv.GRVT_ENV;
  const config = getEndpointConfig(env);
  const safety = assertWriteAllowed({
    env,
    execute: ctx.options.execute,
    operation,
  });
  if (!safety.allowed) {
    printJson({ dry_run: true, reason: safety.reason, payload_shape: body });
    return;
  }
  const apiKey = required(
    ctx.runtimeEnv.GRVT_TRADING_API_KEY,
    "GRVT_TRADING_API_KEY",
  );
  const login = await loginWithApiKey(config, apiKey);
  printJson(
    await postJson(config, {
      service: "trades",
      flavor: ctx.options.flavor,
      method,
      body,
      auth: login,
    }),
  );
}

async function referral(
  ctx: CommandContext,
  method: string,
  body: unknown,
): Promise<void> {
  const env = ctx.options.env ?? ctx.runtimeEnv.GRVT_ENV;
  const config = getEndpointConfig(env);
  const apiKey = required(
    ctx.runtimeEnv.GRVT_TRADING_API_KEY,
    "GRVT_TRADING_API_KEY",
  );
  const login = await loginWithApiKey(config, apiKey);
  printJson(
    await postJson(config, {
      service: "trades",
      flavor: ctx.options.flavor,
      method,
      body,
      auth: login,
    }),
  );
}

function symbol(ctx: CommandContext): string {
  return ctx.options.symbol ?? ctx.runtimeEnv.GRVT_DEFAULT_SYMBOL;
}

function required<T>(value: T | undefined, label: string): T {
  if (value === undefined || value === "") {
    throw new Error(`${label} is required.`);
  }
  return value;
}

function printJson(value: unknown): void {
  console.log(JSON.stringify(value, null, 2));
}

function summarizePayload(value: unknown): unknown {
  if (!value || typeof value !== "object") {
    return value;
  }
  const result =
    "result" in value ? (value as { result?: unknown }).result : value;
  if (Array.isArray(result)) {
    return {
      result_count: result.length,
      first: result[0],
    };
  }
  if (result && typeof result === "object") {
    return Object.fromEntries(Object.entries(result).slice(0, 8));
  }
  return result;
}

function showHelp(): void {
  console.log(`GRVT Raw API sample app

Usage:
  bun run dev -- <command> [--env testnet|prod|staging] [--flavor full|lite]

Core:
  learn:overview
  market:instruments | market:ticker | market:book | market:trades | market:candles | market:funding
  ws:market
  auth:login
  account:summary | account:positions | account:fills | account:funding-payments
  order:create | order:cancel | order:cancel-all | order:open | order:history
  transfer:history | deposit:history | withdrawal:history
  vault:list | vault:summary | vault:redeem-queue | vault:invest | vault:redeem
  referral:epochs | referral:points | referral:data
  builder:authorized | builder:guide

Examples:
  bun run dev -- learn:overview
  bun run dev -- market:ticker --symbol BTC_USDT_Perp
  bun run dev -- order:create --side buy --size 0.01 --price 50000
  bun run dev -- order:create --side buy --size 0.01 --price 50000 --execute --env testnet
`);
}
