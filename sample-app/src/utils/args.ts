import { z } from "zod";
import { type ApiFlavor, envNames, type GrvtEnv } from "./config";

export type CliOptions = {
  command: string;
  env?: GrvtEnv;
  flavor: ApiFlavor;
  symbol?: string;
  limit?: number;
  interval?: string;
  execute: boolean;
  dryRun: boolean;
  side?: "buy" | "sell";
  orderType?: "limit" | "market";
  size?: string;
  price?: string;
  clientOrderId?: string;
  orderId?: string;
  vaultId?: string;
  currency?: string;
  amount?: string;
  raw: Record<string, string | boolean>;
};

// コマンドのオプション
const optionSchema = z.object({
  command: z.string().min(1),
  env: z.enum(envNames).optional(),
  flavor: z.enum(["full", "lite"]).default("full"),
  symbol: z.string().optional(),
  limit: z.coerce.number().int().positive().optional(),
  interval: z.string().optional(),
  execute: z.boolean().default(false),
  dryRun: z.boolean().default(false),
  side: z.enum(["buy", "sell"]).optional(),
  orderType: z.enum(["limit", "market"]).optional(),
  size: z.string().optional(),
  price: z.string().optional(),
  clientOrderId: z.string().optional(),
  orderId: z.string().optional(),
  vaultId: z.string().optional(),
  currency: z.string().optional(),
  amount: z.string().optional(),
  raw: z.record(z.union([z.string(), z.boolean()])),
});

// オプション
const aliases: Record<string, keyof Omit<CliOptions, "command" | "raw">> = {
  env: "env",
  flavor: "flavor",
  symbol: "symbol",
  limit: "limit",
  interval: "interval",
  side: "side",
  "order-type": "orderType",
  size: "size",
  price: "price",
  "client-order-id": "clientOrderId",
  "order-id": "orderId",
  "vault-id": "vaultId",
  currency: "currency",
  amount: "amount",
};

/**
 * 引数をパース
 * @param argv 
 * @returns 
 */
export function parseArgs(argv: string[]): CliOptions {
  const [command = "help", ...rest] = argv;
  const parsed: Record<string, unknown> = {
    command,
    flavor: "full",
    execute: false,
    dryRun: false,
    raw: {},
  };
  const raw: Record<string, string | boolean> = {};

  for (let i = 0; i < rest.length; i += 1) {
    const token = rest[i];
    if (!token.startsWith("--")) {
      throw new Error(`Unexpected positional argument: ${token}`);
    }
    const [flagName, inlineValue] = token.slice(2).split("=", 2);
    const key = aliases[flagName];
    if (
      flagName === "execute" ||
      flagName === "dry-run" ||
      flagName === "dryRun"
    ) {
      const normalized = flagName === "dry-run" ? "dryRun" : flagName;
      parsed[normalized] = true;
      raw[flagName] = true;
      continue;
    }
    const value = inlineValue ?? rest[i + 1];
    if (value === undefined || value.startsWith("--")) {
      throw new Error(`Missing value for --${flagName}`);
    }
    if (inlineValue === undefined) {
      i += 1;
    }
    if (!key) {
      raw[flagName] = value;
      continue;
    }
    parsed[key] = value;
    raw[flagName] = value;
  }

  parsed.raw = raw;
  return optionSchema.parse(parsed);
}
