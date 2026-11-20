"use client";
import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CalendarCheck2, Download, Star } from "lucide-react";
import { toast } from "sonner";
import { FilterTabs, PageTitle, useApi, ErrorBox } from "@/components/dashboard/ui";
import JobTimeline from "@/components/dashboard/timeline";
import { ConfirmModal, Modal } from "@/components/ui/modal";
import { PaymentBadge, StatusBadge } from "@/components/ui/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/ui/empty-state";
import { downloadInvoice } from "@/components/payment/invoice";
import { api } from "@/lib/api";
import { IMAGES } from "@/lib/images";
import type { Booking, Payment } from "@/lib/types";
import { cn, fmtDate, money } from "@/lib/utils";

type Tab = "all" | "active" | "pay" | "paid" | "closed";

export default function MyBookings() {
  const { data, setData, loading, error, reload } = useApi<Booking[]>("/api/bookings/my");
  const payments = useApi<Payment[]>("/api/payments/my");
  const [tab, setTab] = useState<Tab>("all");
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [rateFor, setRateFor] = useState<Booking | null>(null);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  const match = (b: Booking, t: Tab) =>
    t === "all" ||
    (t === "active" && ["requested", "accepted", "in-progress"].includes(b.status)) ||
    (t === "pay" && b.status === "completed" && b.paymentStatus === "unpaid") ||
    (t === "paid" && b.paymentStatus === "paid") ||
    (t === "closed" && ["rejected", "cancelled"].includes(b.status));
  const list = useMemo(() => (data ?? []).filter((b) => match(b, tab)), [data, tab]);
  const count = (t: Tab) => (data ?? []).filter((b) => match(b, t)).length;
  const paymentFor = (id: string) => payments.data?.find((p) => p.bookingId === id);

  const cancel = async () => {
    if (!cancelId) return;
    setBusy(cancelId);
    try {
      const updated = await api<Booking>(`/api/bookings/${cancelId}/cancel`, { method: "PATCH" });
      setData((d) => d?.map((b) => (b._id === updated._id ? updated : b)) ?? null);
      toast.success("Request cancelled");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not cancel");
    } finally {
      setBusy(null);
      setCancelId(null);
    }
  };

  const pay = async (b: Booking) => {
    setBusy(b._id);
    try {
      const { url } = await api<{ url: string }>("/api/payments/create-checkout-session", { method: "POST", body: { bookingId: b._id } });
      toast.loading("Redirecting to secure Stripe checkout…");
      window.location.href = url;
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not start payment");
      setBusy(null);
    }
  };

  const submitReview = async () => {
    if (!rateFor) return;
    setBusy(rateFor._id);
    try {
      const updated = await api<Booking>(`/api/bookings/${rateFor._id}/review`, { method: "PATCH", body: { rating, review } });
      setData((d) => d?.map((b) => (b._id === updated._id ? updated : b)) ?? null);
      toast.success("Thanks for your review!");
      setRateFor(null);
      setReview("");
      setRating(5);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save review");
    } finally {
      setBusy(null);
    }
  };

  return (
    <>
      <PageTitle title="My bookings" sub="Follow every repair from request to payment." action={<Link href="/services" className="btn">+ New request</Link>} />
      <FilterTabs<Tab>
        value={tab}
        onChange={setTab}
        tabs={[
          { value: "all", label: "All", count: count("all") },
          { value: "active", label: "Active", count: count("active") },
          { value: "pay", label: "To pay", count: count("pay") },
          { value: "paid", label: "Paid", count: count("paid") },
          { value: "closed", label: "Closed", count: count("closed") },
        ]}
      />
      {loading ? (
        <div className="flex flex-col gap-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-[150px] rounded-[26px]" />)}</div>
      ) : error ? (
        <ErrorBox message={error} onRetry={reload} />
      ) : !list.length ? (
        <EmptyState
          title={data?.length ? "Nothing in this tab" : "No bookings yet"}
          text={data?.length ? "Try another filter." : "Find a service and send your first repair request."}
          cta="Browse services"
          href="/services"
          icon={CalendarCheck2}
        />
      ) : (
        <div className="flex flex-col gap-4">
          {list.map((b) => {
            const canPay = b.status === "completed" && b.paymentStatus === "unpaid";
            const p = paymentFor(b._id);
            return (
              <article key={b._id} className="card overflow-hidden rounded-[26px]">
                <div className="grid xl:grid-cols-[1.1fr_1.618fr_.85fr]">
                  <div className="flex min-w-0 gap-4 p-[21px]">
                    <span className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-[18px] bg-brand-soft">
                      <Image src={b.serviceImage || IMAGES.category[b.category] || IMAGES.serviceFallback} alt="" fill sizes="72px" className="object-cover" />
                    </span>
                    <div className="flex min-w-0 flex-col gap-1.5">
                      <span className="text-[11px] tracking-[0.06em] text-muted">#{b._id.slice(-6).toUpperCase()}</span>
                      <span className="text-[17px] font-bold leading-snug">{b.serviceTitle}</span>
                      <span className="text-[13px] text-muted">{b.technicianName} · preferred {fmtDate(b.preferredDate)}</span>
                      <span className="flex flex-wrap gap-1.5 pt-1">
                        <StatusBadge status={b.status} />
                        <PaymentBadge paid={b.paymentStatus === "paid"} />
                      </span>
                    </div>
                  </div>
                  <div className="flex min-w-0 items-center border-t border-dashed border-line p-[21px] xl:border-l xl:border-t-0">
                    <JobTimeline booking={b} />
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-surface-2 p-[21px] xl:flex-col xl:items-end xl:justify-center xl:border-t-0">
                    <span className="flex flex-col xl:items-end">
                      <span className="text-xs text-muted">{b.status === "completed" ? "Final amount" : "Starting price"}</span>
                      <span className="text-[26px] font-bold">{money(b.status === "completed" ? b.finalAmount : b.basePrice)}</span>
                    </span>
                    {b.status === "requested" && (
                      <button onClick={() => setCancelId(b._id)} className="btn-danger">
                        Cancel request
                      </button>
                    )}
                    {canPay && (
                      <button onClick={() => pay(b)} disabled={busy === b._id} className="btn">
                        {busy === b._id ? "Opening Stripe…" : "Pay now →"}
                      </button>
                    )}
                    {b.paymentStatus === "paid" && (
                      <span className="flex flex-wrap gap-2 xl:justify-end">
                        {p && (
                          <button onClick={() => downloadInvoice(p)} className="btn-outline !px-3 !py-2 !text-[13px]">
                            <Download className="h-3.5 w-3.5" /> Invoice
                          </button>
                        )}
                        {b.rating ? (
                          <span className="flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1.5 text-[13px] font-bold text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                            <Star className="h-3.5 w-3.5 fill-current" /> {b.rating}/5
                          </span>
                        ) : (
                          <button onClick={() => setRateFor(b)} className="btn !px-3 !py-2 !text-[13px]">
                            <Star className="h-3.5 w-3.5" /> Rate
                          </button>
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <ConfirmModal
        open={!!cancelId}
        onClose={() => setCancelId(null)}
        onConfirm={cancel}
        loading={!!busy}
        danger
        title="Cancel this request?"
        text="The booking will be marked as cancelled. This can't be undone."
        confirmLabel="Yes, cancel"
      />

      <Modal open={!!rateFor} onClose={() => setRateFor(null)} title="How was the repair?">
        <p className="mb-4 text-sm text-muted">
          {rateFor?.serviceTitle} · {rateFor?.technicianName}
        </p>
        <div role="radiogroup" aria-label="Rating" className="mb-4 flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              role="radio"
              aria-checked={rating === n}
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
              onClick={() => setRating(n)}
              className={cn("grid h-12 w-12 place-items-center rounded-[14px] border", n <= rating ? "border-amber-300 bg-amber-50 text-amber-400 dark:bg-amber-950" : "border-line text-line-strong")}
            >
              <Star className="h-6 w-6 fill-current" />
            </button>
          ))}
        </div>
        <label className="label">
          Short review (optional)
          <textarea className="input" rows={3} maxLength={500} value={review} onChange={(e) => setReview(e.target.value)} placeholder="What went well?" />
        </label>
        <div className="mt-5 flex justify-end gap-2.5">
          <button onClick={() => setRateFor(null)} className="btn-outline">Later</button>
          <button onClick={submitReview} disabled={!!busy} className="btn">Submit review</button>
        </div>
      </Modal>
    </>
  );
}
