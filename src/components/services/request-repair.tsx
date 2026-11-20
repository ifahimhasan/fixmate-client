"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CheckCircle2, Info } from "lucide-react";
import { toast } from "sonner";
import { Modal } from "@/components/ui/modal";
import { useSession } from "@/lib/auth-client";
import { api, ApiError } from "@/lib/api";
import { money, todayISO } from "@/lib/utils";

type Errors = Partial<Record<"customerPhone" | "address" | "preferredDate" | "problemDescription", string>>;

export default function RequestRepair({ serviceId, title, basePrice }: { serviceId: string; title: string; basePrice: number }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [form, setForm] = useState({ customerPhone: "", address: "", preferredDate: todayISO(), problemDescription: "" });

  const user = session?.user as { name: string; email: string; role?: string; phone?: string; area?: string } | undefined;
  const role = user?.role || "customer";

  const openForm = () => {
    if (!user) {
      router.push(`/sign-in?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    setForm((f) => ({ ...f, customerPhone: f.customerPhone || user.phone || "", address: f.address || user.area || "" }));
    setOpen(true);
  };

  const validate = () => {
    const e: Errors = {};
    if (!/^[+\d][\d\s-]{6,}$/.test(form.customerPhone.trim())) e.customerPhone = "Enter a valid phone number";
    if (form.address.trim().length < 5) e.address = "Enter the service or pickup address";
    if (!form.preferredDate || form.preferredDate < todayISO()) e.preferredDate = "Pick today or a future date";
    if (form.problemDescription.trim().length < 20) e.problemDescription = `At least 20 characters (${form.problemDescription.trim().length}/20)`;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      await api("/api/bookings", { method: "POST", body: { serviceId, ...form } });
      setOpen(false);
      toast.success("Repair request sent!", {
        description: "The technician will accept or reject it soon.",
        action: { label: "My bookings", onClick: () => router.push("/dashboard/customer/bookings") },
      });
      setForm({ customerPhone: form.customerPhone, address: form.address, preferredDate: todayISO(), problemDescription: "" });
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Could not send the request";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [k]: e.target.value });

  return (
    <>
      {isPending ? (
        <div className="h-[54px] animate-pulse rounded-[13px] bg-line" />
      ) : user && role !== "customer" ? (
        <>
          <button disabled className="rounded-[13px] bg-surface-2 py-4 text-base font-bold text-muted">
            Request repair
          </button>
          <p className="flex items-start gap-2.5 rounded-[13px] bg-amber-50 p-3 text-sm leading-relaxed text-amber-900 dark:bg-amber-950 dark:text-amber-200">
            <Info className="mt-0.5 h-4 w-4 shrink-0" /> Only customers can request a repair.
          </p>
        </>
      ) : (
        <>
          <button onClick={openForm} className="btn !py-4 !text-base">
            {user ? "Request repair" : "Sign in to request repair"}
          </button>
          {!user && <p className="text-center text-[13px] text-muted">You&apos;ll come back to this page after signing in.</p>}
        </>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={`Request: ${title}`} size="lg">
        <form onSubmit={submit} noValidate className="flex flex-col gap-[18px]">
          <div className="grid gap-[18px] sm:grid-cols-2">
            <label className="label">
              Name
              <input className="input" value={user?.name || ""} readOnly />
            </label>
            <label className="label">
              Email
              <input className="input" value={user?.email || ""} readOnly />
            </label>
            <label className="label">
              Phone
              <input className="input" value={form.customerPhone} onChange={set("customerPhone")} placeholder="01XXXXXXXXX" inputMode="tel" />
              {errors.customerPhone && <span className="field-error">{errors.customerPhone}</span>}
            </label>
            <label className="label">
              Preferred date
              <input type="date" className="input" min={todayISO()} value={form.preferredDate} onChange={set("preferredDate")} />
              {errors.preferredDate && <span className="field-error">{errors.preferredDate}</span>}
            </label>
          </div>
          <label className="label">
            Address
            <input className="input" value={form.address} onChange={set("address")} placeholder="House, road, area, city" />
            {errors.address && <span className="field-error">{errors.address}</span>}
          </label>
          <label className="label">
            Problem description
            <textarea className="input" rows={4} value={form.problemDescription} onChange={set("problemDescription")} placeholder="What is wrong with the device? (min. 20 characters)" />
            {errors.problemDescription ? (
              <span className="field-error">{errors.problemDescription}</span>
            ) : (
              <span className="text-xs font-normal text-muted">{form.problemDescription.trim().length}/20 characters minimum</span>
            )}
          </label>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
            <span className="flex items-center gap-1.5 text-[13px] text-muted">
              <CheckCircle2 className="h-4 w-4 text-mint" /> From {money(basePrice)} · pay after completion
            </span>
            <span className="flex gap-2.5">
              <button type="button" onClick={() => setOpen(false)} className="btn-outline">
                Cancel
              </button>
              <button disabled={saving} className="btn">
                {saving ? "Sending…" : "Send request"}
              </button>
            </span>
          </div>
          <Link href="/dashboard/customer/bookings" className="sr-only">
            My bookings
          </Link>
        </form>
      </Modal>
    </>
  );
}
