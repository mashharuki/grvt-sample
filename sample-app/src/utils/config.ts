import { z } from "zod";

export const envNames = ["staging", "testnet", "prod"] as const;
export type GrvtEnv = (typeof envNames)[number];
export type ApiFlavor = "full" | "lite";

export type EndpointConfig = {
  env: GrvtEnv;
  chainId: string;
  ethereumChainId: string;
  edgeBaseUrl: string;
  tradesBaseUrl: string;
  marketDataBaseUrl: string;
  marketDataWsUrl: string;
  tradesWsUrl: string;
};

// エンドポイント
const endpoints: Record<GrvtEnv, EndpointConfig> = {
  staging: {
    env: "staging",
    chainId: "327",
    ethereumChainId: "11155111",
    edgeBaseUrl: "https://edge.staging.gravitymarkets.io",
    tradesBaseUrl: "https://trades.staging.gravitymarkets.io",
    marketDataBaseUrl: "https://market-data.staging.gravitymarkets.io",
    marketDataWsUrl: "wss://market-data.staging.gravitymarkets.io/ws",
    tradesWsUrl: "wss://trades.staging.gravitymarkets.io/ws",
  },
  testnet: {
    env: "testnet",
    chainId: "326",
    ethereumChainId: "11155111",
    edgeBaseUrl: "https://edge.testnet.grvt.io",
    tradesBaseUrl: "https://trades.testnet.grvt.io",
    marketDataBaseUrl: "https://market-data.testnet.grvt.io",
    marketDataWsUrl: "wss://market-data.testnet.grvt.io/ws",
    tradesWsUrl: "wss://trades.testnet.grvt.io/ws",
  },
  prod: {
    env: "prod",
    chainId: "325",
    ethereumChainId: "1",
    edgeBaseUrl: "https://edge.grvt.io",
    tradesBaseUrl: "https://trades.grvt.io",
    marketDataBaseUrl: "https://market-data.grvt.io",
    marketDataWsUrl: "wss://market-data.grvt.io/ws",
    tradesWsUrl: "wss://trades.grvt.io/ws",
  },
};

// 環境変数
const runtimeEnvSchema = z.object({
  GRVT_ENV: z.enum(envNames).default("testnet"),
  GRVT_TRADING_API_KEY: z.string().optional(),
  GRVT_TRADING_PRIVATE_KEY: z.string().optional(),
  GRVT_FUNDING_API_KEY: z.string().optional(),
  GRVT_FUNDING_PRIVATE_KEY: z.string().optional(),
  GRVT_DEFAULT_SYMBOL: z.string().default("BTC_USDT_Perp"),
});

export type RuntimeEnv = z.infer<typeof runtimeEnvSchema>;

export function parseRuntimeEnv(
  source: Record<string, string | undefined>,
): RuntimeEnv {
  return runtimeEnvSchema.parse(source);
}

export function getEndpointConfig(env: GrvtEnv): EndpointConfig {
  return endpoints[env];
}

export function apiUrl(
  baseUrl: string,
  flavor: ApiFlavor,
  method: string,
): string {
  const normalizedMethod = method.replace(/^\/+/, "");
  return `${baseUrl}/${flavor}/${normalizedMethod}`;
}

export function wsUrl(baseUrl: string, flavor: ApiFlavor): string {
  return `${baseUrl}/${flavor}`;
}
