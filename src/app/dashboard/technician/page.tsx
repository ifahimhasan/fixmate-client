"use client";
import Link from "next/link";
import { Clock3, ListChecks, ShieldCheck, Wallet } from "lucide-react";
import { PageTitle, Panel, StatCard, useApi, ErrorBox } from "@/components/dashboard/ui";
import { MonthBars, StatusDonut } from "@/components/dashboard/charts";
import { StatusBadge } from "@/components/ui/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/lib/auth-client";
import type { Booking } from "@/lib/types";
import { fmtDate, money } from "@/lib/utils";

type Stats = {
  totalServices: number;
  approvedServices: number;
  pendingRequests: number;
  totalEarnings: number;
  statusCounts: Record<string, number>;
  monthlyEarnings: { month: string; amount: number }[];
};

export default function TechnicianOverview() {
  const { data: session } = useSession();
  const stats = useApi<Stats>("/api/stats/technician");
  const jobs = useApi<Booking[]>("/api/bookings/technician?status=requested");
  const s = stats.data;
  return (
    <>
      <PageTitle
        title={`Hello, ${session?.user.name?.split(" ")[0] ?? "there"}`}
        sub={s ? `${s.pendingRequests} new request${s.pendingRequests === 1 ? " is" : "s are"} waiting for your answer.` : "Your services, jobs and earnings."}
        action={<Link href="/dashboard/technician/add-service" className="btn">+ Add a service</Link>}
      />
      {stats.error ? (
        <ErrorBox message={stats.error} onRetry={stats.reload} />
      ) : (
        <div className="grid gap-[21px] sm:grid-cols-2 xl:grid-cols-4">
          {!s ? (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-[132px] rounded-[21px]" />)
          ) : (
            <>
              <StatCard label="Total services" value={s.totalServices} note="All your listings" icon={ListChecks} />
              <StatCard label="Approved services" value={s.approvedServices} note="Live after admin review" icon={ShieldCheck} tone="green" />
              <StatCard label="Pending requests" value={s.pendingRequests} note="Accept or reject them" icon={Clock3} tone="amber" />
              <StatCard label="Total earnings" value={money(s.totalEarnings)} note="From paid jobs" icon={Wallet} tone="sky" />
            </>
          )}
        </div>
      )}
      <div className="grid gap-[21px] lg:grid-cols-[1.618fr_1fr]">
        <Panel title="Earnings · last 6 months">{s ? <MonthBars data={s.monthlyEarnings} /> : <Skeleton className="h-[260px]" />}</Panel>
        <Panel title="Jobs by status">{s ? <StatusDonut counts={s.statusCounts} /> : <Skeleton className="h-[180px]" />}</Panel>
      </div>
      <Panel title="New requests" action={<Link href="/dashboard/technician/requests" className="text-sm font-bold text-brand">Manage all →</Link>}>
        {jobs.loading ? (
          <Skeleton className="h-32" />
        ) : !jobs.data?.length ? (
          <p className="py-6 text-center text-sm text-muted">No new requests right now.</p>
        ) : (
          <ul>
            {jobs.data.slice(0, 5).map((b) => (
              <li key={b._id} className="flex flex-wrap items-center justify-between gap-3 border-t border-line py-3.5 first:border-t-0">
                <span className="flex flex-col">
                  <span className="font-bold">{b.serviceTitle}</span>
                  <span className="text-[13px] text-muted">{b.customerName} · preferred {fmtDate(b.preferredDate)}</span>
                </span>
                <StatusBadge status={b.status} />
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </>
  );
}
