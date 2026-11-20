import { Check } from "lucide-react";
import type { Booking } from "@/lib/types";
import { cn, fmtDate } from "@/lib/utils";

const STEPS = ["requested", "accepted", "in-progress", "completed", "paid"] as const;
const LABEL: Record<string, string> = { requested: "Requested", accepted: "Accepted", "in-progress": "In progress", completed: "Completed", paid: "Paid" };

/** Visual job tracker (optional feature): Requested → Accepted → In Progress → Completed → Paid */
export default function JobTimeline({ booking }: { booking: Booking }) {
  const history = booking.statusHistory ?? [];
  const when = (s: string) => history.find((h) => h.status === s)?.changedAt;

  if (booking.status === "rejected" || booking.status === "cancelled") {
    return (
      <p className="text-sm text-muted">
        {booking.status === "rejected" ? "The technician rejected this request" : "You cancelled this request"}
        {when(booking.status) ? ` on ${fmtDate(when(booking.status))}` : ""}.
      </p>
    );
  }

  const reached = booking.paymentStatus === "paid" ? 5 : STEPS.indexOf(booking.status as (typeof STEPS)[number]) + 1;
  return (
    <ol className="grid w-full grid-cols-5" aria-label="Job timeline">
      {STEPS.map((s, i) => {
        const done = i < reached;
        const current = i === reached;
        const date = when(s);
        return (
          <li key={s} className="flex flex-col gap-2">
            <span className="flex items-center">
              <span
                className={cn(
                  "grid h-6 w-6 shrink-0 place-items-center rounded-full border-2",
                  done ? "border-mint bg-mint text-white" : current ? "border-brand bg-surface" : "border-line-strong bg-surface"
                )}
              >
                {done && <Check className="h-3 w-3" strokeWidth={3.4} />}
              </span>
              {i < STEPS.length - 1 && <span className={cn("h-[3px] flex-1", i < reached - 1 ? "bg-mint" : "bg-line")} />}
            </span>
            <span className={cn("pr-1 text-[12px] font-bold leading-tight", !done && !current && "text-muted")}>{LABEL[s]}</span>
            <span className="text-[11px] text-muted">{date ? fmtDate(date, { day: "2-digit", month: "short" }) : "-"}</span>
          </li>
        );
      })}
    </ol>
  );
}
