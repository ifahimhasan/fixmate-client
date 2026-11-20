"use client";
import { API_URL } from "./constants";

let cached: { token: string; expiresAt: number } | null = null;

/** Get (and cache) the JWT for the Express API from our /api/token route. */
export async function getToken(force = false): Promise<string | null> {
  if (!force && cached && cached.expiresAt - 60_000 > Date.now()) return cached.token;
  const res = await fetch("/api/token", { cache: "no-store" });
  if (!res.ok) {
    cached = null;
    return null;
  }
  cached = await res.json();
  return cached!.token;
}

export function clearToken() {
  cached = null;
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

type Options = { method?: string; body?: unknown; auth?: boolean; signal?: AbortSignal };

/** fetch wrapper for the Express API - attaches the Bearer token when auth=true. */
export async function api<T = unknown>(path: string, { method = "GET", body, auth = true, signal }: Options = {}): Promise<T> {
  const send = async (token: string | null) =>
    fetch(`${API_URL}${path}`, {
      method,
      signal,
      headers: {
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

  let token = auth ? await getToken() : null;
  if (auth && !token) throw new ApiError(401, "Please sign in again");
  let res = await send(token);
  if (res.status === 401 && auth) {
    token = await getToken(true); // token may have expired - retry once
    res = await send(token);
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, (data as { message?: string }).message || "Request failed");
  return data as T;
}

/** Upload an image (data URL) through the server's ImgBB proxy. */
export async function uploadImage(dataUrl: string): Promise<string> {
  const { url } = await api<{ url: string }>("/api/upload", { method: "POST", body: { image: dataUrl } });
  return url;
}
