"use client";
import { useState } from "react";
import { MessagesSquare } from "lucide-react";
import { toast } from "sonner";
import { FilterTabs, PageTitle, useApi, ErrorBox } from "@/components/dashboard/ui";
import { ConfirmModal, Modal } from "@/components/ui/modal";
import { PaymentBadge, StatusBadge } from "@/components/ui/status-badge";
import { TableSkeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/ui/empty-state";
import { api } from "@/lib/api";
import type { BookingStatus } from "@/lib/constants";
import type { Booking } from "@/lib/types";
import { fmtDate, money } from "@/lib/utils";

type Filter = "all" | "requested" | "accepted" | "in-progress" | "completed";

export default function ManageRequests() {
  const { data, setData, loading, error, reload } = useApi<Booking[]>("/api/bookings/technician");
  const [filter, setFilter] = useState<Filter>("all");
  const [completing, setCompleting] = useState<Booking | null>(null);
  const [amount, setAmount] = useState("");
  const [rejecting, setRejecting] = useState<Booking | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const list = (data ?? []).filter((b) => filter === "all" || b.status === filter);
  const count = (f: Filter) => (data ?? []).filter((b) => f === "all" || b.status === f).length;

  const update = async (b: Booking, status: BookingStatus, finalAmount?: number) => {
    setBusy(b._id);
    try {
      const updated = await api<Booking>(`/api/bookings/${b._id}/status`, { method: "PATCH", body: { status, finalAmount } });
      setData((d) => d?.map((x) => (x._id === updated._id ? updated : x)) ?? null);
      const msg: Record<string, string> = {
        accepted: "Job accepted",
        rejected: "Request rejected",
        "in-progress": "Work started",
        completed: "Job completed - the customer can pay now",
      };
      toast.success(msg[status] ?? "Status updated");
      return true;
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not update status");
      return false;
    } finally {
      setBusy(null);
    }
  };

  const openComplete = (b: Booking) => {
    setAmount(String(b.basePrice));
    setCompleting(b);
  };
  const confirmComplete = async () => {
    const n = Number(amount);
    if (!Number.isFinite(n) || n <= 0) return toast.error("Final amount must be greater than 0");
    if (completing && (await update(completing, "completed", n))) setCompleting(null);
  };

  return (
    <>
      <PageTitle title="Manage requests" sub="Only the next valid step is shown for each job." />
      <FilterTabs<Filter>
        value={filter}
        onChange={setFilter}
        tabs={[
          { value: "all", label: "All", count: count("all") },
          { value: "requested", label: "Requested", count: count("requested") },
          { value: "accepted", label: "Accepted", count: count("accepted") },
          { value: "in-progress", label: "In progress", count: count("in-progress") },
          { value: "completed", label: "Completed", count: count("completed") },
        ]}
      />
      {loading ? (
        <TableSkeleton />
      ) : error ? (
        <ErrorBox message={error} onRetry={reload} />
      ) : !list.length ? (
        <EmptyState title={data?.length ? "Nothing in this status" : "No requests yet"} text={data?.length ? "Try another filter." : "When customers request your services, the jobs appear here."} icon={MessagesSquare} />
      ) : (
        <div className="card overflow-x-auto rounded-[21px]">
          <table className="w-full min-w-[1080px] text-sm">
            <thead>
              <tr className="bg-surface-2 text-left text-xs text-muted">
                {["Service", "Customer", "Address", "Preferred", "Problem", "Status", "Action"].map((h) => (
                  <th key={h} className={`px-4 py-3.5 font-bold ${h === "Action" ? "text-right" : ""}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {list.map((b) => (
                <tr key={b._id} className="border-t border-line align-top hover:bg-surface-2/60">
                  <td className="px-4 py-4">
                    <span className="flex flex-col gap-0.5">
                      <span className="text-[11px] text-muted">#{b._id.slice(-6).toUpperCase()}</span>
                      <span className="font-bold">{b.serviceTitle}</span>
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="flex flex-col gap-0.5">
                      <span className="font-bold">{b.customerName}</span>
                      <a href={`tel:${b.customerPhone}`} className="text-xs text-muted hover:text-brand">{b.customerPhone}</a>
                    </span>
                  </td>
                  <td className="max-w-[180px] px-4 py-4 text-[13px] text-muted">{b.address}</td>
                  <td className="whitespace-nowrap px-4 py-4">{fmtDate(b.preferredDate)}</td>
                  <td className="max-w-[240px] px-4 py-4 text-[13px] leading-relaxed text-muted">{b.problemDescription}</td>
                  <td className="px-4 py-4">
                    <span className="flex flex-col items-start gap-1.5">
                      <StatusBadge status={b.status} />
                      {b.status === "completed" && (
                        <span className="flex items-center gap-1.5 text-xs text-muted">
                          <PaymentBadge paid={b.paymentStatus === "paid"} /> {money(b.finalAmount)}
                        </span>
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="flex flex-wrap justify-end gap-2">
                      {b.status === "requested" && (
                        <>
                          <button disabled={busy === b._id} onClick={() => update(b, "accepted")} className="btn !px-3.5 !py-2 !text-[13px]">Accept</button>
                          <button disabled={busy === b._id} onClick={() => setRejecting(b)} className="btn-danger !px-3.5 !py-2 !text-[13px]">Reject</button>
                        </>
                      )}
                      {b.status === "accepted" && (
                        <button disabled={busy === b._id} onClick={() => update(b, "in-progress")} className="btn !bg-ink !px-3.5 !py-2 !text-[13px] !text-bg !shadow-none">Start work</button>
                      )}
                      {b.status === "in-progress" && (
                        <button disabled={busy === b._id} onClick={() => openComplete(b)} className="btn !bg-mint !px-3.5 !py-2 !text-[13px] !shadow-none hover:!bg-emerald-600">Mark completed</button>
                      )}
                      {["completed", "rejected", "cancelled"].includes(b.status) && <span className="text-xs text-muted">No action</span>}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={!!completing} onClose={() => setCompleting(null)} title="Mark job completed">
        <p className="mb-4 text-sm text-muted">{completing?.serviceTitle} · {completing?.customerName}. The customer can pay this amount right after you confirm.</p>
        <label className="label">
          Final amount (USD)
          <span className="flex h-[55px] items-center rounded-[13px] border-[1.5px] border-brand px-4 ring-4 ring-brand/10">
            <span className="text-xl font-bold text-muted">$</span>
            <input type="number" min={1} step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-transparent pl-2 text-xl font-bold outline-none" autoFocus />
          </span>
          <span className="text-xs font-normal text-muted">Pre-filled with the base price. Must be greater than 0.</span>
        </label>
        <div className="mt-6 flex justify-end gap-2.5">
          <button onClick={() => setCompleting(null)} className="btn-outline">Cancel</button>
          <button onClick={confirmComplete} disabled={!!busy} className="btn !bg-mint !shadow-none hover:!bg-emerald-600">Confirm completed</button>
        </div>
      </Modal>
      <ConfirmModal
        open={!!rejecting}
        onClose={() => setRejecting(null)}
        onConfirm={async () => {
          if (rejecting && (await update(rejecting, "rejected"))) setRejecting(null);
        }}
        loading={!!busy}
        danger
        title="Reject this request?"
        text="The customer will see it as Rejected. This is a final state."
        confirmLabel="Reject"
      />
    </>
  );
}
