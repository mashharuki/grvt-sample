import { describe, expect, test } from "bun:test";
import { assertWriteAllowed } from "../src/utils/safety";

describe("write safety", () => {
  test("blocks dry-run writes", () => {
    expect(
      assertWriteAllowed({
        env: "testnet",
        execute: false,
        operation: "order:create",
      }),
    ).toMatchObject({ allowed: false });
  });

  test("allows explicit testnet writes", () => {
    expect(
      assertWriteAllowed({
        env: "testnet",
        execute: true,
        operation: "order:create",
      }),
    ).toMatchObject({ allowed: true });
  });

  test("blocks prod writes even with execute", () => {
    expect(
      assertWriteAllowed({
        env: "prod",
        execute: true,
        operation: "order:create",
      }),
    ).toMatchObject({ allowed: false });
  });
});
