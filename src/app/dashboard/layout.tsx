import { redirect } from "next/navigation";
import { headers } from "next/headers";
import DashboardShell from "@/components/dashboard/shell";
import { getServerSession, roleOf } from "@/lib/session";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();
  if (!session) {
    const h = await headers();
    const path = h.get("x-invoke-path") || "/dashboard";
    redirect(`/sign-in?redirect=${encodeURIComponent(path)}`);
  }
  return <DashboardShell role={roleOf(session)}>{children}</DashboardShell>;
}
