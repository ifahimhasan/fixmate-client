import { redirect } from "next/navigation";
import { getServerSession, roleOf } from "@/lib/session";
import { DASHBOARD_HOME } from "@/lib/constants";

export default async function DashboardIndex() {
  const session = await getServerSession();
  redirect(session ? DASHBOARD_HOME[roleOf(session)] : "/sign-in");
}
