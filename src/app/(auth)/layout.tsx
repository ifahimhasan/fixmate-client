import { redirect } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import Logo from "@/components/ui/logo";
import { getServerSession, roleOf } from "@/lib/session";
import { DASHBOARD_HOME } from "@/lib/constants";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  // Logged-in users never see sign in / sign up
  const session = await getServerSession();
  if (session) redirect(DASHBOARD_HOME[roleOf(session)]);

  return (
    <div className="relative min-h-screen overflow-x-clip">
      <div aria-hidden="true" className="pointer-events-none absolute -left-36 -top-36 h-[610px] w-[610px] rounded-full bg-[radial-gradient(circle,rgba(124,92,255,.28),transparent_68%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-36 bottom-0 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,.2),transparent_68%)]" />
      <div className="container-x relative grid min-h-screen items-center gap-[55px] py-[34px] lg:grid-cols-2">
        <div className="flex flex-col gap-[34px] lg:py-[55px]">
          <Logo />
          <div className="hidden flex-col gap-[21px] lg:flex">
            <h1 className="text-[clamp(38px,4vw,52px)] font-bold leading-[1.08] tracking-[-0.025em]">
              Every repair, one ticket you can <span className="bg-gradient-to-r from-brand to-sky bg-clip-text text-transparent">follow</span>.
            </h1>
            <p className="max-w-[460px] text-[17px] leading-[1.618] text-muted">
              Customers request and track repairs. Technicians list services and manage jobs. Pick your side to get started.
            </p>
            <ul className="flex flex-col gap-[13px]">
              {["Pay only after the job is completed", "Live status on every repair", "Admin-verified technicians"].map((t) => (
                <li key={t} className="flex items-center gap-3 text-[15px]">
                  <CheckCircle2 className="h-5 w-5 text-mint" /> {t}
                </li>
              ))}
            </ul>
            <div className="glass max-w-[420px] rounded-[26px] p-[21px]">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs tracking-[0.08em] text-muted">TICKET #FM-2048</span>
                <span className="rounded-full bg-mint-soft px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">Completed</span>
              </div>
              <div className="mb-3 flex justify-between text-[17px] font-bold">
                <span>Split AC servicing</span>
                <span>$30</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-brand-soft">
                <div className="h-2 w-4/5 rounded-full bg-gradient-to-r from-mint to-brand" />
              </div>
              <p className="mt-3 text-[13px] text-muted">4 of 5 steps done · waiting for payment</p>
            </div>
          </div>
        </div>
        <div className="flex justify-center lg:justify-end">{children}</div>
      </div>
    </div>
  );
}
