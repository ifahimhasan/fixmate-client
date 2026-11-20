import "server-only";
import { redirect } from "next/navigation";
import { getServerSession, roleOf } from "./session";
import { DASHBOARD_HOME, type Role } from "./constants";

/** Server guard for role dashboards: wrong role → their own dashboard. */
export async function requireRole(role: Role) {
  const session = await getServerSession();
  if (!session) redirect("/sign-in");
  const current = roleOf(session);
  if (current !== role) redirect(DASHBOARD_HOME[current]);
  return session;
}
