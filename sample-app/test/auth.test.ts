import { describe, expect, test } from "bun:test";
import { maskSecret, parseGravityCookie } from "../src/utils/auth";

describe("auth helpers", () => {
  test("extracts gravity cookie", () => {
    expect(
      parseGravityCookie([
        "foo=bar; Path=/",
        "gravity=session-token; Path=/; HttpOnly",
      ]),
    ).toBe("gravity=session-token");
  });

  test("masks secrets", () => {
    expect(maskSecret("gravity=abcdefghijklmn")).toBe("gravit...klmn");
  });
});
