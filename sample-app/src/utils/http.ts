import type { ApiFlavor, EndpointConfig } from "./config";
import { apiUrl } from "./config";

export type Service = "market-data" | "trades";

export type AuthSession = {
  cookie: string;
  accountId: string;
};

export type RequestSpec = {
  service: Service;
  flavor: ApiFlavor;
  method: string;
  body: unknown;
  auth?: AuthSession;
};

/**
 * REST APIのリクエストデータを作成する
 * @param config 
 * @param spec 
 * @returns 
 */
export function buildRestRequest(
  config: EndpointConfig,
  spec: RequestSpec,
): { url: string; init: RequestInit } {
  const baseUrl =
    spec.service === "market-data"
      ? config.marketDataBaseUrl
      : config.tradesBaseUrl;
  const headers = new Headers({ "content-type": "application/json" });
  if (spec.auth) {
    headers.set("cookie", spec.auth.cookie);
    headers.set("x-grvt-account-id", spec.auth.accountId);
  }

  return {
    url: apiUrl(baseUrl, spec.flavor, spec.method),
    init: {
      method: "POST",
      headers,
      body: JSON.stringify(spec.body ?? {}),
    },
  };
}

/**
 * POSTするメソッド
 * @param config 
 * @param spec 
 * @returns 
 */
export async function postJson(
  config: EndpointConfig,
  spec: RequestSpec,
): Promise<unknown> {
  // リクエストデータを作成
  const { url, init } = buildRestRequest(config, spec);
  // APIリクエスト
  const response = await fetch(url, init);
  const text = await response.text();
  const payload = text.length > 0 ? JSON.parse(text) : null;
  if (!response.ok) {
    throw new Error(
      `GRVT ${response.status} ${response.statusText}: ${JSON.stringify(payload)}`,
    );
  }
  return payload;
}

/**
 * 認証付きGETリクエストを送信する
 * @param url
 * @param auth
 * @returns
 */
export async function getJson(
  url: string,
  auth: AuthSession,
): Promise<unknown> {
  const headers = new Headers({
    cookie: auth.cookie,
    "x-grvt-account-id": auth.accountId,
  });
  const response = await fetch(url, { method: "GET", headers });
  const text = await response.text();
  const payload = text.length > 0 ? JSON.parse(text) : null;
  if (!response.ok) {
    throw new Error(
      `GRVT ${response.status} ${response.statusText}: ${JSON.stringify(payload)}`,
    );
  }
  return payload;
}
