import { STATUS_STYLE, type BookingStatus } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: BookingStatus }) {
  const s = STATUS_STYLE[status] ?? STATUS_STYLE.requested;
  return (
    <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold", s.className)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {s.label}
    </span>
  );
}

export function PaymentBadge({ paid }: { paid: boolean }) {
  return paid ? (
    <span className="inline-flex rounded-full bg-ink px-3 py-1 text-xs font-bold text-bg">Paid</span>
  ) : (
    <span className="inline-flex rounded-full border border-line-strong px-3 py-1 text-xs font-bold text-muted">Unpaid</span>
  );
}

const APPROVAL: Record<string, string> = {
  pending: "bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  approved: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  rejected: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
};
export function ApprovalBadge({ status }: { status: string }) {
  return (
    <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-bold capitalize", APPROVAL[status] ?? APPROVAL.pending)}>{status}</span>
  );
}
