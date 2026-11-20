"use client";
import { useState } from "react";
import { CalendarCheck2 } from "lucide-react";
import { PageTitle, useApi, ErrorBox } from "@/components/dashboard/ui";
import { PaymentBadge, StatusBadge } from "@/components/ui/status-badge";
import { TableSkeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/ui/empty-state";
import type { Booking } from "@/lib/types";
import { fmtDate, money } from "@/lib/utils";

const STATUSES = ["all", "requested", "accepted", "in-progress", "completed", "rejected", "cancelled"];

export default function AllBookings() {
  const [status, setStatus] = useState("all");
  const { data, loading, error, reload } = useApi<Booking[]>(`/api/admin/bookings${status !== "all" ? `?status=${status}` : ""}`);
  return (
    <>
      <PageTitle
        title="All bookings"
        sub="Read-only view of every repair job on the platform."
        action={
          <label className="flex items-center gap-2 text-[13px] text-muted">
            Status
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="input !h-11 !w-[180px] !text-sm capitalize">
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s === "all" ? "All" : s.replace("-", " ")}</option>
              ))}
            </select>
          </label>
        }
      />
      {loading ? (
        <TableSkeleton />
      ) : error ? (
        <ErrorBox message={error} onRetry={reload} />
      ) : !data?.length ? (
        <EmptyState title="No bookings" text="No bookings match this status yet." icon={CalendarCheck2} />
      ) : (
        <div className="card overflow-x-auto rounded-[21px]">
          <table className="w-full min-w-[960px] text-sm">
            <thead>
              <tr className="bg-surface-2 text-left text-xs text-muted">
                {["Service", "Customer", "Technician", "Date", "Status", "Payment", "Amount"].map((h) => (
                  <th key={h} className="px-4 py-3.5 font-bold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((b) => (
                <tr key={b._id} className="border-t border-line hover:bg-surface-2/60">
                  <td className="px-4 py-4 font-bold">{b.serviceTitle}</td>
                  <td className="px-4 py-4">{b.customerName}</td>
                  <td className="px-4 py-4">{b.technicianName}</td>
                  <td className="px-4 py-4 text-muted">{fmtDate(b.preferredDate)}</td>
                  <td className="px-4 py-4"><StatusBadge status={b.status} /></td>
                  <td className="px-4 py-4"><PaymentBadge paid={b.paymentStatus === "paid"} /></td>
                  <td className="px-4 py-4 font-bold">{money(b.status === "completed" ? b.finalAmount : b.basePrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
