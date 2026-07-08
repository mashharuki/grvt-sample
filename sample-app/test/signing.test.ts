import { describe, expect, test } from "bun:test";
import { buildOrderTypedData, createOrderDraft } from "../src/signing";
import { getEndpointConfig } from "../src/utils/config";

describe("signing payloads", () => {
  test("builds order draft and typed data", () => {
    const order = createOrderDraft({
      subAccountId: "123",
      symbol: "BTC_USDT_Perp",
      side: "buy",
      orderType: "limit",
      size: "0.01",
      price: "50000",
      clientOrderId: "client-1",
      now: new Date("2026-01-01T00:00:00.000Z"),
    });
    const typedData = buildOrderTypedData(
      getEndpointConfig("testnet"),
      order,
      1,
      "1772159636314000000",
    );
    expect(order.legs[0]).toMatchObject({
      instrument: "BTC_USDT_Perp",
      is_buying_asset: true,
    });
    expect(typedData.domain.chainId).toBe(326);
    expect(typedData.message.limitPrice).toBe("50000");
  });
});
