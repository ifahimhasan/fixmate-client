"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Download, XCircle } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import type { Payment } from "@/lib/types";
import { fmtDate, money } from "@/lib/utils";
import { downloadInvoice } from "./invoice";
import { Skeleton } from "@/components/ui/skeleton";

export default function PaymentSuccess() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");
  const { data: session, isPending } = useSession();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [error, setError] = useState("");
  const ran = useRef(false);

  useEffect(() => {
    if (isPending || ran.current) return;
    if (!session) {
      setError("Please sign in to confirm your payment.");
      return;
    }
    if (!sessionId) {
      setError("Missing payment session.");
      return;
    }
    ran.current = true;
    api<Payment>(`/api/payments/verify?session_id=${encodeURIComponent(sessionId)}`)
      .then((p) => {
        setPayment(p);
        toast.success("Payment successful!");
      })
      .catch((e) => setError(e.message || "We couldn't confirm this payment."));
  }, [isPending, session, sessionId]);

  if (error)
    return (
      <div className="glass flex w-full max-w-[520px] flex-col items-center gap-4 rounded-[29px] p-10 text-center">
        <XCircle className="h-14 w-14 text-red-500" />
        <h1 className="text-[28px] font-bold">Payment not confirmed</h1>
        <p className="text-muted">{error}</p>
        <Link href="/dashboard/customer/bookings" className="btn">Back to My bookings</Link>
      </div>
    );

  if (!payment) return <Skeleton className="h-[480px] w-full max-w-[560px] rounded-[29px]" />;

  const rows = [
    ["Service", payment.serviceTitle],
    ["Technician", payment.technicianName],
    ["Transaction ID", payment.transactionId],
    ["Paid on", fmtDate(payment.paidAt, { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })],
  ];
  return (
    <div className="flex w-full max-w-[560px] flex-col items-center gap-[21px] text-center">
      <span className="grid h-[89px] w-[89px] place-items-center rounded-full bg-mint text-white shadow-[0_0_0_13px_rgba(18,184,134,.14),0_21px_34px_-13px_rgba(18,184,134,.7)]">
        <CheckCircle2 className="h-11 w-11" />
      </span>
      <h1 className="text-[clamp(32px,4.5vw,46px)] font-bold leading-tight tracking-tight">Payment received</h1>
      <p className="text-[17px] leading-[1.618] text-muted">Your booking is now marked <strong className="text-ink">Paid</strong>. You can rate the repair from My bookings.</p>
      <div className="glass w-full rounded-[29px] p-2.5 text-left">
        <div className="overflow-hidden rounded-[21px] bg-surface">
          <div className="flex items-center justify-between border-b border-dashed border-line-strong px-[21px] py-[18px]">
            <span className="text-xs tracking-[0.1em] text-muted">RECEIPT</span>
            <span className="rounded-full bg-ink px-3 py-1 text-xs font-bold text-bg">PAID</span>
          </div>
          <div className="flex flex-col gap-[13px] p-[21px] text-[15px]">
            {rows.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3">
                <span className="text-muted">{k}</span>
                <span className="break-all text-right font-bold">{v}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between bg-surface-2 px-[21px] py-[18px]">
            <span className="text-muted">Amount paid</span>
            <span className="text-[34px] font-bold">{money(payment.amount)}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-2.5">
        <Link href="/dashboard/customer/bookings" className="btn">Back to My bookings</Link>
        <button onClick={() => downloadInvoice(payment)} className="btn-outline"><Download className="h-4 w-4" /> Download PDF invoice</button>
      </div>
    </div>
  );
}
