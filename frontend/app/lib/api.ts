// Prefer Vite-exposed client env first (VITE_*)
const VITE_BASE = (import.meta as any).env?.VITE_API_BASE_URL;

// Fallback to server env when rendering on the server
// (process.env is only available during SSR)
// eslint-disable-next-line no-undef
const SERVER_BASE = typeof process !== "undefined" ? (process as any).env?.BASE_URL : undefined;

export const API_BASE_URL = VITE_BASE || SERVER_BASE || "http://localhost:5000";

export async function postJson<T>(
  path: string,
  body: unknown,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    body: JSON.stringify(body),
    credentials: "include",
    ...init,
  });

  const text = await res.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {}

  if (!res.ok) {
    const msg =
      (data && (data.error || data.message)) ||
      res.statusText ||
      "Request failed";
    throw new Response(JSON.stringify({ error: msg }), { status: res.status });
  }
  return data as T;
}
