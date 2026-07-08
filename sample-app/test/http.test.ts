import { describe, expect, test } from "bun:test";
import { getEndpointConfig } from "../src/utils/config";
import { buildRestRequest } from "../src/utils/http";

describe("http", () => {
  test("builds full market-data POST requests", async () => {
    const request = buildRestRequest(getEndpointConfig("testnet"), {
      service: "market-data",
      flavor: "full",
      method: "v1/book",
      body: { instrument: "BTC_USDT_Perp" },
    });
    expect(request.url).toBe(
      "https://market-data.testnet.grvt.io/full/v1/book",
    );
    expect(request.init.method).toBe("POST");
    expect(await new Response(request.init.body).json()).toEqual({
      instrument: "BTC_USDT_Perp",
    });
  });

  test("adds auth headers for trades", () => {
    const request = buildRestRequest(getEndpointConfig("testnet"), {
      service: "trades",
      flavor: "lite",
      method: "v1/open_orders",
      body: {},
      auth: { cookie: "gravity=abc", accountId: "123" },
    });
    const headers = request.init.headers as Headers;
    expect(request.url).toBe(
      "https://trades.testnet.grvt.io/lite/v1/open_orders",
    );
    expect(headers.get("cookie")).toBe("gravity=abc");
    expect(headers.get("x-grvt-account-id")).toBe("123");
  });
});
