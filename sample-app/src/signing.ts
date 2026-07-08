import type { Hex } from "viem";
import { parseSignature } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import type { EndpointConfig } from "./utils/config";

export type OrderDraft = {
  sub_account_id: string;
  is_market: boolean;
  time_in_force:
    | "GOOD_TILL_TIME"
    | "IMMEDIATE_OR_CANCEL"
    | "FILL_OR_KILL"
    | "ALL_OR_NONE";
  post_only: boolean;
  reduce_only: boolean;
  legs: Array<{
    instrument: string;
    size: string;
    limit_price: string;
    is_buying_asset: boolean;
  }>;
  signature?: SignatureDto;
  metadata: {
    client_order_id: string;
    create_time: string;
  };
  builder: string;
  builder_fee: string;
};

export type SignatureDto = {
  signer: string;
  r: Hex;
  s: Hex;
  v: number;
  expiration: string;
  nonce: number;
  chain_id: string;
};

// 注文タイプ
const orderTypes = {
  Order: [
    { name: "subAccountID", type: "string" },
    { name: "isMarket", type: "bool" },
    { name: "timeInForce", type: "string" },
    { name: "postOnly", type: "bool" },
    { name: "reduceOnly", type: "bool" },
    { name: "instrument", type: "string" },
    { name: "size", type: "string" },
    { name: "limitPrice", type: "string" },
    { name: "isBuyingAsset", type: "bool" },
    { name: "nonce", type: "uint32" },
    { name: "expiration", type: "int64" },
  ],
} as const;

/**
 * 注文データのオーダーのドラフトを作成する
 * @param input 
 * @returns 
 */
export function createOrderDraft(input: {
  subAccountId: string;
  symbol: string;
  side: "buy" | "sell";
  orderType: "limit" | "market";
  size: string;
  price?: string;
  clientOrderId?: string;
  now?: Date;
}): OrderDraft {
  const nowNs = BigInt(input.now?.getTime() ?? Date.now()) * 1_000_000n;
  return {
    sub_account_id: input.subAccountId,
    is_market: input.orderType === "market",
    time_in_force:
      input.orderType === "market" ? "IMMEDIATE_OR_CANCEL" : "GOOD_TILL_TIME",
    post_only: false,
    reduce_only: false,
    legs: [
      {
        instrument: input.symbol,
        size: input.size,
        limit_price: input.orderType === "market" ? "0" : (input.price ?? "0"),
        is_buying_asset: input.side === "buy",
      },
    ],
    metadata: {
      client_order_id:
        input.clientOrderId ?? `${2n ** 63n + (nowNs % 1_000_000_000n)}`,
      create_time: nowNs.toString(),
    },
    builder: "0x0000000000000000000000000000000000000000",
    builder_fee: "0",
  };
}

/**
 * 種別ごとの注文データを構築するメソッド
 * @param config 
 * @param order 
 * @param nonce 
 * @param expirationNs 
 * @returns 
 */
export function buildOrderTypedData(
  config: EndpointConfig,
  order: OrderDraft,
  nonce: number,
  expirationNs: string,
) {
  const leg = order.legs[0];
  return {
    domain: {
      name: "GRVT Exchange",
      version: "0",
      chainId: Number(config.chainId),
    },
    types: orderTypes,
    primaryType: "Order" as const,
    message: {
      subAccountID: order.sub_account_id,
      isMarket: order.is_market,
      timeInForce: order.time_in_force,
      postOnly: order.post_only,
      reduceOnly: order.reduce_only,
      instrument: leg.instrument,
      size: leg.size,
      limitPrice: leg.limit_price,
      isBuyingAsset: leg.is_buying_asset,
      nonce,
      expiration: BigInt(expirationNs),
    },
  };
}

/**
 * 注文データに署名を行うメソッド
 * @param config 
 * @param order 
 * @param privateKey 
 * @returns 
 */
export async function signOrder(
  config: EndpointConfig,
  order: OrderDraft,
  privateKey: string,
): Promise<OrderDraft> {
  const normalizedPrivateKey = privateKey.startsWith("0x")
    ? privateKey
    : `0x${privateKey}`;
  const account = privateKeyToAccount(normalizedPrivateKey as Hex);
  const nonce = Math.floor(Math.random() * 2 ** 32);
  const expirationNs = (
    BigInt(Date.now() + 24 * 60 * 60 * 1000) * 1_000_000n
  ).toString();
  // 署名
  const typedData = buildOrderTypedData(config, order, nonce, expirationNs);
  const signature = await account.signTypedData(typedData);
  const parsed = parseSignature(signature);
  return {
    ...order,
    signature: {
      signer: account.address,
      r: parsed.r,
      s: parsed.s,
      v: Number(parsed.v),
      expiration: expirationNs,
      nonce,
      chain_id: config.chainId,
    },
  };
}

export function createVaultInvestDraft(input: {
  fundingAccountAddress: string;
  vaultId: string;
  currency: string;
  amount: string;
}) {
  return {
    main_account_id: input.fundingAccountAddress,
    vault_id: input.vaultId,
    currency: input.currency,
    num_tokens: input.amount,
    signature: {
      signer: "<signer-address>",
      r: "<r>",
      s: "<s>",
      v: 27,
      expiration: "<unix-ns>",
      nonce: 0,
      chain_id: "<grvt-chain-id>",
    },
  };
}
