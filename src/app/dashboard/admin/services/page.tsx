"use client";
import { useState } from "react";
import Image from "next/image";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { FilterTabs, PageTitle, useApi, ErrorBox } from "@/components/dashboard/ui";
import { ConfirmModal } from "@/components/ui/modal";
import { ApprovalBadge } from "@/components/ui/status-badge";
import { CardGridSkeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/ui/empty-state";
import { api } from "@/lib/api";
import type { Service } from "@/lib/types";
import { fmtDate, money } from "@/lib/utils";

type F = "pending" | "approved" | "rejected" | "all";

export default function ServiceApproval() {
  const { data, setData, loading, error, reload } = useApi<Service[]>("/api/admin/services");
  const [filter, setFilter] = useState<F>("pending");
  const [rejecting, setRejecting] = useState<Service | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const list = (data ?? []).filter((s) => filter === "all" || s.approvalStatus === filter);
  const count = (f: F) => (data ?? []).filter((s) => f === "all" || s.approvalStatus === f).length;

  const decide = async (s: Service, approvalStatus: "approved" | "rejected") => {
    setBusy(s._id);
    try {
      const updated = await api<Service>(`/api/admin/services/${s._id}/approval`, { method: "PATCH", body: { approvalStatus } });
      setData((d) => d?.map((x) => (x._id === updated._id ? updated : x)) ?? null);
      toast.success(approvalStatus === "approved" ? "Service approved - it's live now" : "Service rejected");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not update");
    } finally {
      setBusy(null);
      setRejecting(null);
    }
  };

  return (
    <>
      <PageTitle title="Service approval" sub="Only approved and available services appear on public pages." />
      <FilterTabs<F>
        value={filter}
        onChange={setFilter}
        tabs={[
          { value: "pending", label: "Pending", count: count("pending") },
          { value: "approved", label: "Approved", count: count("approved") },
          { value: "rejected", label: "Rejected", count: count("rejected") },
          { value: "all", label: "All", count: count("all") },
        ]}
      />
      {loading ? (
        <CardGridSkeleton count={6} />
      ) : error ? (
        <ErrorBox message={error} onRetry={reload} />
      ) : !list.length ? (
        <EmptyState title={filter === "pending" ? "All caught up!" : "Nothing here"} text={filter === "pending" ? "There are no services waiting for review." : "No services with this status."} icon={ShieldCheck} />
      ) : (
        <div className="grid gap-[21px] md:grid-cols-2 xl:grid-cols-3">
          {list.map((s) => (
            <article key={s._id} className="card lift flex flex-col overflow-hidden rounded-[26px]">
              <div className="relative aspect-[2.2/1] bg-brand-soft">
                {s.image && <Image src={s.image} alt={s.title} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover" />}
                <span className="absolute right-3 top-3"><ApprovalBadge status={s.approvalStatus} /></span>
              </div>
              <div className="flex flex-1 flex-col gap-3 p-[21px]">
                <span className="text-[17px] font-bold leading-snug">{s.title}</span>
                <span className="text-[13px] text-muted">{s.category} · {s.serviceMode} · {money(s.basePrice)}</span>
                <span className="line-clamp-2 text-[13px] text-muted">{s.description}</span>
                <span className="text-[13px]">by <strong>{s.technicianName}</strong> · {fmtDate(s.createdAt)}</span>
                <div className="mt-auto flex gap-2 border-t border-dashed border-line pt-4">
                  <button
                    disabled={busy === s._id || s.approvalStatus === "approved"}
                    onClick={() => decide(s, "approved")}
                    className="btn flex-1 !bg-mint !py-2.5 !text-sm !shadow-none hover:!bg-emerald-600 disabled:!bg-mint-soft disabled:!text-emerald-700 disabled:!opacity-100"
                  >
                    {s.approvalStatus === "approved" ? "Approved" : "Approve"}
                  </button>
                  <button disabled={busy === s._id || s.approvalStatus === "rejected"} onClick={() => setRejecting(s)} className="btn-danger flex-1 !py-2.5">
                    {s.approvalStatus === "rejected" ? "Rejected" : "Reject"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
      <ConfirmModal
        open={!!rejecting}
        onClose={() => setRejecting(null)}
        onConfirm={() => rejecting && decide(rejecting, "rejected")}
        loading={!!busy}
        danger
        title="Reject this service?"
        text={`"${rejecting?.title}" will not be shown on public pages. The technician can edit it and resubmit.`}
        confirmLabel="Reject"
      />
    </>
  );
}
