import { Wrench } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4" role="status" aria-label="Loading">
      <span className="relative grid h-16 w-16 place-items-center">
        <span className="absolute inset-0 animate-spin rounded-full border-4 border-brand-soft border-t-brand" />
        <Wrench className="h-6 w-6 text-brand" />
      </span>
      <span className="text-sm text-muted">Loading…</span>
    </div>
  );
}
