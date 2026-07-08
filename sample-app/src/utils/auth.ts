import type { EndpointConfig } from "./config";
import type { AuthSession } from "./http";

export type LoginResult = AuthSession & {
  body: unknown;
  fundingAccountAddress?: string;
  subAccountId?: string;
};

/**
 * クッキー関連のユーティリティメソッド
 * @param setCookieHeaders 
 * @returns 
 */
export function parseGravityCookie(
  setCookieHeaders: string[],
): string | undefined {
  for (const header of setCookieHeaders) {
    const match = header.match(/(?:^|,\s*)(gravity=[^;,\s]+)/i);
    if (match) {
      return match[1];
    }
  }
  return undefined;
}

export function maskSecret(value: string | undefined): string {
  if (!value) {
    return "";
  }
  if (value.length <= 10) {
    return `${value.slice(0, 2)}...`;
  }
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

/**
 * APIキーにて認証を行うメソッド
 * @param config 
 * @param apiKey 
 * @returns 
 */
export async function loginWithApiKey(
  config: EndpointConfig,
  apiKey: string,
): Promise<LoginResult> {
  // 認証APIを実行する
  const response = await fetch(`${config.edgeBaseUrl}/auth/api_key/login`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      cookie: "rm=true;",
    },
    body: JSON.stringify({ api_key: apiKey }),
  });
  const body = await response.json();
  if (!response.ok) {
    throw new Error(`Login failed: ${response.status} ${JSON.stringify(body)}`);
  }

  // GRVT はエラー時も HTTP 200 を返し、ボディの status/error で失敗を示すことがある
  const errorBody = body as { status?: string; error?: string };
  if (errorBody.status === "failure" || errorBody.error) {
    throw new Error(`Login failed: ${JSON.stringify(body)}`);
  }

  // Cookieをセットする
  const cookie = parseGravityCookie(
    response.headers.getSetCookie?.() ?? [
      response.headers.get("set-cookie") ?? "",
    ],
  );
  const accountId = response.headers.get("x-grvt-account-id") ?? "";
  if (!cookie || !accountId) {
    throw new Error(
      "Login response did not include gravity cookie or X-Grvt-Account-Id.",
    );
  }

  const typedBody = body as {
    funding_account_address?: string;
    sub_account_id?: string;
  };
  return {
    cookie,
    accountId,
    body,
    fundingAccountAddress: typedBody.funding_account_address,
    subAccountId: typedBody.sub_account_id,
  };
}
