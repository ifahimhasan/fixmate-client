"use client";
import { Wallet } from "lucide-react";
import { PageTitle, useApi, ErrorBox } from "@/components/dashboard/ui";
import { TableSkeleton, Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/ui/empty-state";
import type { Payment } from "@/lib/types";
import { fmtDate, money } from "@/lib/utils";

export default function Transactions() {
  const { data, loading, error, reload } = useApi<{ payments: Payment[]; totalRevenue: number; count: number }>("/api/admin/payments");
  const avg = data && data.count ? data.totalRevenue / data.count : 0;
  return (
    <>
      <PageTitle title="Transactions" sub="Every document in the payments collection." />
      {loading ? (
        <Skeleton className="h-[150px] rounded-[29px]" />
      ) : data ? (
        <div className="grid gap-[21px] lg:grid-cols-[1.618fr_1fr]">
          <div className="glass rounded-[29px] p-2.5">
            <div className="relative flex flex-col gap-2.5 overflow-hidden rounded-[21px] bg-gradient-to-br from-surface via-violet-50 to-sky-50 p-[29px] dark:from-surface dark:via-[#1d2136] dark:to-[#1a2236]">
              <span className="eyebrow !text-xs">Total revenue · all time</span>
              <span className="text-[clamp(40px,5vw,55px)] font-bold leading-none tracking-tight">{money(data.totalRevenue)}</span>
              <span className="text-sm text-muted">Sum of all payments · Stripe test mode</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="card flex flex-col gap-2 p-[21px]"><span className="text-[13px] text-muted">Payments</span><span className="text-[34px] font-bold">{data.count}</span></div>
            <div className="card flex flex-col gap-2 p-[21px]"><span className="text-[13px] text-muted">Average</span><span className="text-[34px] font-bold">{money(avg)}</span></div>
          </div>
        </div>
      ) : null}
      {loading ? (
        <TableSkeleton />
      ) : error ? (
        <ErrorBox message={error} onRetry={reload} />
      ) : !data?.payments.length ? (
        <EmptyState title="No transactions yet" text="Payments appear here when customers pay for completed jobs." icon={Wallet} />
      ) : (
        <div className="card overflow-x-auto rounded-[21px]">
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="bg-surface-2 text-left text-xs text-muted">
                {["Customer", "Technician", "Service", "Amount", "Transaction ID", "Payment date"].map((h) => (
                  <th key={h} className="px-4 py-3.5 font-bold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.payments.map((p) => (
                <tr key={p._id} className="border-t border-line hover:bg-surface-2/60">
                  <td className="px-4 py-4 font-bold">{p.customerName}</td>
                  <td className="px-4 py-4">{p.technicianName}</td>
                  <td className="px-4 py-4 text-muted">{p.serviceTitle}</td>
                  <td className="px-4 py-4 font-bold">{money(p.amount)}</td>
                  <td className="px-4 py-4 font-mono text-xs text-muted">{p.transactionId}</td>
                  <td className="px-4 py-4 text-muted">{fmtDate(p.paidAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
