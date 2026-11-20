"use client";
import { useState } from "react";
import { Users } from "lucide-react";
import { toast } from "sonner";
import { FilterTabs, PageTitle, useApi, ErrorBox } from "@/components/dashboard/ui";
import { ConfirmModal } from "@/components/ui/modal";
import { TableSkeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/ui/empty-state";
import { Avatar, ROLE_BADGE } from "@/components/layout/navbar";
import { api } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import type { Role } from "@/lib/constants";
import type { AppUser } from "@/lib/types";
import { cn, fmtDate } from "@/lib/utils";

type F = "all" | Role;

export default function ManageUsers() {
  const { data: session } = useSession();
  const { data, setData, loading, error, reload } = useApi<AppUser[]>("/api/admin/users");
  const [filter, setFilter] = useState<F>("all");
  const [pending, setPending] = useState<{ user: AppUser; role: Role } | null>(null);
  const [busy, setBusy] = useState(false);

  const list = (data ?? []).filter((u) => filter === "all" || (u.role || "customer") === filter);
  const count = (f: F) => (data ?? []).filter((u) => f === "all" || (u.role || "customer") === f).length;

  const changeRole = async () => {
    if (!pending) return;
    setBusy(true);
    try {
      await api(`/api/admin/users/${pending.user._id}/role`, { method: "PATCH", body: { role: pending.role } });
      setData((d) => d?.map((u) => (u._id === pending.user._id ? { ...u, role: pending.role } : u)) ?? null);
      toast.success(`${pending.user.name} is now ${pending.role === "admin" ? "an" : "a"} ${pending.role}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not change role");
    } finally {
      setBusy(false);
      setPending(null);
    }
  };

  return (
    <>
      <PageTitle title="Manage users" sub="Change a user's role. Your own role is locked." />
      <FilterTabs<F>
        value={filter}
        onChange={setFilter}
        tabs={[
          { value: "all", label: "All", count: count("all") },
          { value: "customer", label: "Customers", count: count("customer") },
          { value: "technician", label: "Technicians", count: count("technician") },
          { value: "admin", label: "Admins", count: count("admin") },
        ]}
      />
      {loading ? (
        <TableSkeleton />
      ) : error ? (
        <ErrorBox message={error} onRetry={reload} />
      ) : !list.length ? (
        <EmptyState title="No users here" text="Try another filter." icon={Users} />
      ) : (
        <div className="card overflow-x-auto rounded-[21px]">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="bg-surface-2 text-left text-xs text-muted">
                {["User", "Email", "Joined", "Role"].map((h) => (
                  <th key={h} className="px-4 py-3.5 font-bold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {list.map((u) => {
                const role = (u.role || "customer") as Role;
                const self = u.email === session?.user.email;
                return (
                  <tr key={u._id} className="border-t border-line hover:bg-surface-2/60">
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-3">
                        <Avatar name={u.name} image={u.image} size={38} />
                        <span className="font-bold">{u.name}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted">{u.email}</td>
                    <td className="px-4 py-3 text-muted">{fmtDate(u.createdAt)}</td>
                    <td className="px-4 py-3">
                      {self ? (
                        <span className={cn("rounded-full px-3 py-1 text-xs font-bold", ROLE_BADGE.admin)}>Admin (you) · locked</span>
                      ) : (
                        <label>
                          <span className="sr-only">Role for {u.name}</span>
                          <select
                            value={role}
                            onChange={(e) => setPending({ user: u, role: e.target.value as Role })}
                            className="input !h-10 !w-[160px] !text-sm capitalize"
                          >
                            <option value="customer">customer</option>
                            <option value="technician">technician</option>
                            <option value="admin">admin</option>
                          </select>
                        </label>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <ConfirmModal
        open={!!pending}
        onClose={() => setPending(null)}
        onConfirm={changeRole}
        loading={busy}
        title="Change role?"
        text={pending ? `Change ${pending.user.name}'s role to "${pending.role}"? They will see the ${pending.role} dashboard next time they open it.` : ""}
        confirmLabel="Change role"
      />
    </>
  );
}
