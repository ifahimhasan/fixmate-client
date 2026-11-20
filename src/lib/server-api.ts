import "server-only";
import { API_URL } from "./constants";

/** Server-side fetch for public API data. Never throws - returns fallback on failure. */
export async function serverGet<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${API_URL}${path}`, { cache: "no-store" });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}
