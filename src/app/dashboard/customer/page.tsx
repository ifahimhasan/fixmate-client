"use client";
import Link from "next/link";
import { CalendarCheck2, CheckCircle2, Clock3, Wallet } from "lucide-react";
import { PageTitle, Panel, StatCard, useApi, ErrorBox } from "@/components/dashboard/ui";
import { MoneyArea, StatusDonut } from "@/components/dashboard/charts";
import { StatusBadge } from "@/components/ui/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/ui/empty-state";
import { useSession } from "@/lib/auth-client";
import type { Booking } from "@/lib/types";
import { fmtDate, money } from "@/lib/utils";

type Stats = {
  totalRequests: number;
  activeJobs: number;
  completedJobs: number;
  totalSpent: number;
  statusCounts: Record<string, number>;
  monthlySpending: { month: string; amount: number }[];
};

export default function CustomerOverview() {
  const { data: session } = useSession();
  const stats = useApi<Stats>("/api/stats/customer");
  const bookings = useApi<Booking[]>("/api/bookings/my");
  const first = session?.user.name?.split(" ")[0] ?? "";

  return (
    <>
      <PageTitle title={first ? `Hi ${first}` : "Overview"} sub="Here's how your repairs are going." action={<Link href="/services" className="btn">+ New request</Link>} />
      {stats.error ? (
        <ErrorBox message={stats.error} onRetry={stats.reload} />
      ) : (
        <div className="grid gap-[21px] sm:grid-cols-2 xl:grid-cols-4">
          {stats.loading || !stats.data ? (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-[132px] rounded-[21px]" />)
          ) : (
            <>
              <StatCard label="Total requests" value={stats.data.totalRequests} note="Since you joined" icon={CalendarCheck2} />
              <StatCard label="Active jobs" value={stats.data.activeJobs} note="Requested · accepted · in progress" icon={Clock3} tone="amber" />
              <StatCard label="Completed jobs" value={stats.data.completedJobs} note="Finished by technicians" icon={CheckCircle2} tone="green" />
              <StatCard label="Total spent" value={money(stats.data.totalSpent)} note="Paid through Stripe" icon={Wallet} tone="sky" />
            </>
          )}
        </div>
      )}
      <div className="grid gap-[21px] lg:grid-cols-[1.618fr_1fr]">
        <Panel title="Spending · last 6 months">{stats.data ? <MoneyArea data={stats.data.monthlySpending} label="Spent" /> : <Skeleton className="h-[260px]" />}</Panel>
        <Panel title="Jobs by status">{stats.data ? <StatusDonut counts={stats.data.statusCounts} /> : <Skeleton className="h-[180px]" />}</Panel>
      </div>
      <Panel title="Recent bookings" action={<Link href="/dashboard/customer/bookings" className="text-sm font-bold text-brand">View all →</Link>}>
        {bookings.loading ? (
          <Skeleton className="h-40" />
        ) : !bookings.data?.length ? (
          <EmptyState title="No bookings yet" text="Find a service and send your first repair request." cta="Browse services" href="/services" />
        ) : (
          <ul className="flex flex-col">
            {bookings.data.slice(0, 4).map((b) => (
              <li key={b._id} className="flex flex-wrap items-center justify-between gap-3 border-t border-line py-3.5 first:border-t-0">
                <span className="flex flex-col">
                  <span className="font-bold">{b.serviceTitle}</span>
                  <span className="text-[13px] text-muted">{b.technicianName} · preferred {fmtDate(b.preferredDate)}</span>
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
