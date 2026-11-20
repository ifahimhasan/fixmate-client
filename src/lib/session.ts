import "server-only";
import { headers } from "next/headers";
import { auth } from "./auth";
import type { Role } from "./constants";

/** Read the BetterAuth session on the server (layouts, pages, route handlers). */
export async function getServerSession() {
  try {
    return await auth.api.getSession({ headers: await headers() });
  } catch {
    return null;
  }
}

export function roleOf(session: Awaited<ReturnType<typeof getServerSession>>): Role {
  const r = (session?.user as { role?: string } | undefined)?.role;
  return r === "technician" || r === "admin" ? r : "customer";
}
