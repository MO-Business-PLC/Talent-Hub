// Lightweight auth utility for storing/retrieving tokens

const STORAGE: "cookie" | "localStorage" =
  (typeof window !== "undefined" &&
    (import.meta as any).env?.VITE_TOKEN_STORAGE) ||
  "localStorage";

const ACCESS_COOKIE = "accessToken";
const REFRESH_COOKIE = "refreshToken";

function setCookie(name: string, value: string, days = 7) {
  if (typeof document === "undefined") return;
  const maxAge = days * 24 * 60 * 60;
  document.cookie =
    `${name}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; SameSite=Lax` +
    (location.protocol === "https:" ? "; Secure" : "");
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^|; )" + name + "=([^;]*)"));
  return match ? decodeURIComponent(match[2]) : null;
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie =
    `${name}=; Max-Age=0; Path=/; SameSite=Lax` +
    (location.protocol === "https:" ? "; Secure" : "");
}

export function setTokens(accessToken: string, refreshToken?: string) {
  if (STORAGE === "cookie") {
    setCookie(ACCESS_COOKIE, accessToken);
    if (refreshToken) setCookie(REFRESH_COOKIE, refreshToken);
  } else if (typeof localStorage !== "undefined") {
    localStorage.setItem("accessToken", accessToken);
    if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
  }
}

export function getAccessToken(): string | null {
  if (STORAGE === "cookie") return getCookie(ACCESS_COOKIE);
  if (typeof localStorage !== "undefined")
    return localStorage.getItem("accessToken");
  return null;
}

export function getRefreshToken(): string | null {
  if (STORAGE === "cookie") return getCookie(REFRESH_COOKIE);
  if (typeof localStorage !== "undefined")
    return localStorage.getItem("refreshToken");
  return null;
}

export function clearTokens() {
  if (STORAGE === "cookie") {
    deleteCookie(ACCESS_COOKIE);
    deleteCookie(REFRESH_COOKIE);
  } else if (typeof localStorage !== "undefined") {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }
}

export function decodeJwt(token: string): any | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const payload = parts[1];
    const json =
      typeof atob === "function"
        ? atob(payload)
        : Buffer.from(payload, "base64").toString("utf8");
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function getRoleFromToken(): string | null {
  const token = getAccessToken();
  if (!token) return null;
  const decoded = decodeJwt(token);
  const role = decoded?.role;
  return typeof role === "string" ? role : null;
}
