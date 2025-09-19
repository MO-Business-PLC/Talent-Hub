const VITE_BASE = (import.meta as any).env?.VITE_API_BASE_URL;

const SERVER_BASE =
  typeof process !== "undefined" ? (process as any).env?.BASE_URL : undefined;

export const API_BASE_URL = VITE_BASE || SERVER_BASE || "http://localhost:5000";

import { getAccessToken, getRefreshToken, setTokens } from "./auth";

async function requestWithRefresh(
  method: string,
  path: string,
  body?: unknown,
  init?: RequestInit
) {
  const doFetch = async () => {
    const token = getAccessToken();
    const headers: Record<string, string> = {
      ...(init?.headers as Record<string, string>),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    if (body !== undefined) {
      headers["Content-Type"] = headers["Content-Type"] || "application/json";
    }

    const res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      credentials: "include",
      ...init,
    });
    return res;
  };

  let res = await doFetch();
  if (res.status === 401) {
    // Attempt refresh once
    const rt = getRefreshToken();
    const refreshInit: RequestInit = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: rt ? JSON.stringify({ refreshToken: rt }) : undefined,
    };
    try {
      const r = await fetch(`${API_BASE_URL}/api/auth/refresh`, refreshInit);
      const txt = await r.text();
      let data: any = null;
      try {
        data = txt ? JSON.parse(txt) : null;
      } catch {}
      if (r.ok && data?.accessToken) {
        setTokens(data.accessToken, data.refreshToken);
        res = await doFetch();
      }
    } catch {}
  }

  const text = await res.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {}
  return { res, data };
}

export async function postJson<T>(
  path: string,
  body: unknown,
  init?: RequestInit
): Promise<T> {
  const { res, data } = await requestWithRefresh("POST", path, body, init);
  if (!res.ok) {
    const msg =
      (data && (data.error || data.message)) ||
      res.statusText ||
      "Request failed";
    throw new Response(JSON.stringify({ error: msg }), { status: res.status });
  }
  return data as T;
}

export async function getJson<T>(path: string, init?: RequestInit): Promise<T> {
  const { res, data } = await requestWithRefresh("GET", path, undefined, init);
  if (!res.ok) {
    const err: any = new Error(data?.error || `GET ${path} failed`);
    err.response = res;
    throw err;
  }
  return data as T;
}
