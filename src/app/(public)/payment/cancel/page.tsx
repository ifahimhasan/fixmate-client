import Link from "next/link";
import type { Metadata } from "next";
import { XCircle } from "lucide-react";

export const metadata: Metadata = { title: "Payment cancelled" };

export default function PaymentCancelPage() {
  return (
    <section className="container-x flex justify-center pb-[89px] pt-[55px]">
      <div className="flex w-full max-w-[520px] flex-col items-center gap-[21px] text-center">
        <span className="grid h-[89px] w-[89px] place-items-center rounded-full bg-surface-2 text-muted"><XCircle className="h-11 w-11" /></span>
        <h1 className="text-[clamp(32px,4.5vw,46px)] font-bold leading-tight tracking-tight">Payment cancelled</h1>
        <p className="text-[17px] leading-[1.618] text-muted">Nothing was charged and your booking is unchanged. You can pay any time from My bookings.</p>
        <Link href="/dashboard/customer/bookings" className="btn">Try again</Link>
      </div>
    </section>
  );
}
