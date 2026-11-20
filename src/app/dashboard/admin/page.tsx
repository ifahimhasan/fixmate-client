"use client";
import Link from "next/link";
import { Clock3, DollarSign, Users, Wrench } from "lucide-react";
import { PageTitle, Panel, StatCard, useApi, ErrorBox } from "@/components/dashboard/ui";
import { CategoryBars, MoneyArea, StatusDonut } from "@/components/dashboard/charts";
import { Skeleton } from "@/components/ui/skeleton";
import { money } from "@/lib/utils";

type Stats = {
  totalUsers: number;
  totalTechnicians: number;
  pendingServices: number;
  totalBookings: number;
  totalRevenue: number;
  bookingsByCategory: { category: string; count: number }[];
  statusCounts: Record<string, number>;
  monthlyRevenue: { month: string; amount: number }[];
};

export default function AdminOverview() {
  const { data: s, error, reload } = useApi<Stats>("/api/stats/admin");
  return (
    <>
      <PageTitle
        title="Platform overview"
        sub={s ? `${s.pendingServices} service${s.pendingServices === 1 ? " is" : "s are"} waiting for review.` : "Users, services, jobs and revenue."}
        action={<Link href="/dashboard/admin/services" className="btn">Review services</Link>}
      />
      {error ? (
        <ErrorBox message={error} onRetry={reload} />
      ) : (
        <div className="grid gap-[21px] sm:grid-cols-2 xl:grid-cols-4">
          {!s ? (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-[132px] rounded-[21px]" />)
          ) : (
            <>
              <StatCard label="Total users" value={s.totalUsers} note="Customers, technicians & admins" icon={Users} />
              <StatCard label="Total technicians" value={s.totalTechnicians} note="Offering repair services" icon={Wrench} tone="sky" />
              <StatCard label="Pending services" value={s.pendingServices} note="Waiting for approval" icon={Clock3} tone="amber" />
              <StatCard label="Total revenue" value={money(s.totalRevenue)} note={`${s.totalBookings} bookings so far`} icon={DollarSign} tone="green" />
            </>
          )}
        </div>
      )}
      <div className="grid gap-[21px] lg:grid-cols-[1.618fr_1fr]">
        <Panel title="Revenue · last 6 months">{s ? <MoneyArea data={s.monthlyRevenue} label="Revenue" /> : <Skeleton className="h-[260px]" />}</Panel>
        <Panel title="Bookings by category">{s ? <CategoryBars data={s.bookingsByCategory} /> : <Skeleton className="h-[260px]" />}</Panel>
      </div>
      <Panel title="All jobs by status">{s ? <StatusDonut counts={s.statusCounts} /> : <Skeleton className="h-[180px]" />}</Panel>
    </>
  );
}
