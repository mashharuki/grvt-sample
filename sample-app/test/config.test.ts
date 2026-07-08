import { describe, expect, test } from "bun:test";
import { apiUrl, getEndpointConfig, parseRuntimeEnv } from "../src/utils/config";

describe("config", () => {
  test("parses defaults", () => {
    expect(parseRuntimeEnv({})).toMatchObject({
      GRVT_ENV: "testnet",
      GRVT_DEFAULT_SYMBOL: "BTC_USDT_Perp",
    });
  });

  test("resolves testnet endpoints", () => {
    const config = getEndpointConfig("testnet");
    expect(config.chainId).toBe("326");
    expect(config.marketDataBaseUrl).toBe(
      "https://market-data.testnet.grvt.io",
    );
    expect(apiUrl(config.marketDataBaseUrl, "full", "v1/ticker")).toBe(
      "https://market-data.testnet.grvt.io/full/v1/ticker",
    );
  });
});
