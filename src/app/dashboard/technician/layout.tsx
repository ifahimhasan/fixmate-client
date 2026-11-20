import { requireRole } from "@/lib/require-role";

export default async function TechnicianLayout({ children }: { children: React.ReactNode }) {
  await requireRole("technician");
  return <>{children}</>;
}
