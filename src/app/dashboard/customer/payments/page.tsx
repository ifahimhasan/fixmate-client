"use client";
import { CreditCard, Download } from "lucide-react";
import { PageTitle, useApi, ErrorBox } from "@/components/dashboard/ui";
import { TableSkeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/ui/empty-state";
import { downloadInvoice } from "@/components/payment/invoice";
import type { Payment } from "@/lib/types";
import { fmtDate, money } from "@/lib/utils";

export default function PaymentHistory() {
  const { data, loading, error, reload } = useApi<Payment[]>("/api/payments/my");
  const total = (data ?? []).reduce((s, p) => s + p.amount, 0);
  return (
    <>
      <PageTitle title="Payment history" sub="Every repair you've paid for through Stripe." action={data?.length ? <span className="rounded-full bg-brand-soft px-4 py-2 text-sm font-bold text-brand">Total paid {money(total)}</span> : null} />
      {loading ? (
        <TableSkeleton />
      ) : error ? (
        <ErrorBox message={error} onRetry={reload} />
      ) : !data?.length ? (
        <EmptyState title="No payments yet" text="When a technician completes your job, you'll pay from My bookings and it will show up here." cta="Go to My bookings" href="/dashboard/customer/bookings" icon={CreditCard} />
      ) : (
        <div className="card overflow-x-auto rounded-[21px]">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="bg-surface-2 text-left text-xs text-muted">
                {["Service", "Technician", "Amount", "Transaction ID", "Payment date", ""].map((h) => (
                  <th key={h} className="px-4 py-3.5 font-bold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((p) => (
                <tr key={p._id} className="border-t border-line hover:bg-surface-2/60">
                  <td className="px-4 py-4 font-bold">{p.serviceTitle}</td>
                  <td className="px-4 py-4">{p.technicianName}</td>
                  <td className="px-4 py-4 font-bold">{money(p.amount)}</td>
                  <td className="px-4 py-4 font-mono text-xs text-muted">{p.transactionId}</td>
                  <td className="px-4 py-4 text-muted">{fmtDate(p.paidAt)}</td>
                  <td className="px-4 py-4 text-right">
                    <button onClick={() => downloadInvoice(p)} className="btn-outline !px-3 !py-2 !text-[13px]" aria-label={`Download invoice for ${p.serviceTitle}`}>
                      <Download className="h-3.5 w-3.5" /> PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
