"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ListChecks, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageTitle, useApi, ErrorBox } from "@/components/dashboard/ui";
import ServiceForm, { type ServiceInput } from "@/components/dashboard/service-form";
import { ConfirmModal, Modal } from "@/components/ui/modal";
import { ApprovalBadge } from "@/components/ui/status-badge";
import { TableSkeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/ui/empty-state";
import { api } from "@/lib/api";
import type { Service } from "@/lib/types";
import { cn, money } from "@/lib/utils";

export default function MyServices() {
  const { data, setData, loading, error, reload } = useApi<Service[]>("/api/services/mine");
  const [editing, setEditing] = useState<Service | null>(null);
  const [deleting, setDeleting] = useState<Service | null>(null);
  const [busy, setBusy] = useState(false);

  const replace = (s: Service) => setData((d) => d?.map((x) => (x._id === s._id ? s : x)) ?? null);

  const toggle = async (s: Service) => {
    replace({ ...s, isAvailable: !s.isAvailable });
    try {
      await api(`/api/services/${s._id}`, { method: "PATCH", body: { isAvailable: !s.isAvailable } });
      toast.success(!s.isAvailable ? "Service is visible again" : "Service hidden from public pages");
    } catch (e) {
      replace(s);
      toast.error(e instanceof Error ? e.message : "Could not update");
    }
  };

  const save = async (input: ServiceInput) => {
    if (!editing) return;
    try {
      const updated = await api<Service>(`/api/services/${editing._id}`, { method: "PATCH", body: input });
      replace(updated);
      setEditing(null);
      toast.success("Service updated", { description: "It's back to pending until an admin approves it again." });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save");
    }
  };

  const remove = async () => {
    if (!deleting) return;
    setBusy(true);
    try {
      await api(`/api/services/${deleting._id}`, { method: "DELETE" });
      setData((d) => d?.filter((x) => x._id !== deleting._id) ?? null);
      toast.success("Service deleted");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not delete");
    } finally {
      setBusy(false);
      setDeleting(null);
    }
  };

  return (
    <>
      <PageTitle title="My services" sub="Editing a service sends it back to admin review." action={<Link href="/dashboard/technician/add-service" className="btn">+ Add a service</Link>} />
      {loading ? (
        <TableSkeleton />
      ) : error ? (
        <ErrorBox message={error} onRetry={reload} />
      ) : !data?.length ? (
        <EmptyState title="No services yet" text="Add your first repair service - customers can request it once an admin approves it." cta="Add a service" href="/dashboard/technician/add-service" icon={ListChecks} />
      ) : (
        <div className="card overflow-x-auto rounded-[21px]">
          <table className="w-full min-w-[820px] text-sm">
            <thead>
              <tr className="bg-surface-2 text-left text-xs text-muted">
                {["Service", "Category", "Price", "Approval", "Available", "Actions"].map((h) => (
                  <th key={h} className={cn("px-4 py-3.5 font-bold", h === "Actions" && "text-right")}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((s) => (
                <tr key={s._id} className="border-t border-line hover:bg-surface-2/60">
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-3">
                      <span className="relative h-12 w-[72px] shrink-0 overflow-hidden rounded-[12px] bg-brand-soft">
                        {s.image && <Image src={s.image} alt="" fill sizes="72px" className="object-cover" />}
                      </span>
                      <span className="font-bold">{s.title}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted">{s.category}</td>
                  <td className="px-4 py-3 font-bold">{money(s.basePrice)}</td>
                  <td className="px-4 py-3"><ApprovalBadge status={s.approvalStatus} /></td>
                  <td className="px-4 py-3">
                    <button
                      role="switch"
                      aria-checked={s.isAvailable}
                      aria-label={`Toggle availability for ${s.title}`}
                      onClick={() => toggle(s)}
                      className={cn("relative h-[30px] w-[50px] rounded-full transition", s.isAvailable ? "bg-brand" : "bg-line-strong")}
                    >
                      <span className={cn("absolute top-1 h-[22px] w-[22px] rounded-full bg-white shadow transition-all", s.isAvailable ? "left-6" : "left-1")} />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex justify-end gap-2">
                      <button onClick={() => setEditing(s)} aria-label={`Edit ${s.title}`} className="grid h-10 w-10 place-items-center rounded-[12px] border border-line text-brand hover:border-brand">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => setDeleting(s)} aria-label={`Delete ${s.title}`} className="grid h-10 w-10 place-items-center rounded-[12px] border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit service" size="lg">
        {editing && <ServiceForm key={editing._id} initial={editing} submitLabel="Save changes" onSubmit={save} />}
      </Modal>
      <ConfirmModal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={remove}
        loading={busy}
        danger
        title="Delete this service?"
        text={`"${deleting?.title}" will be removed from your services and from public pages.`}
        confirmLabel="Delete"
      />
    </>
  );
}
