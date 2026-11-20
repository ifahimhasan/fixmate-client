"use client";
import { useCallback, useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

/** Small data hook for authenticated GET requests. */
export function useApi<T>(path: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!!path);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    if (!path) return;
    setLoading(true);
    setError("");
    try {
      setData(await api<T>(path));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [path]);
  useEffect(() => {
    load();
  }, [load]);
  return { data, setData, loading, error, reload: load };
}

export function PageTitle({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div className="flex flex-col gap-2">
        <h1 className="text-[30px] font-bold leading-tight tracking-tight sm:text-[34px]">{title}</h1>
        {sub && <p className="text-[15px] text-muted">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

const TONES = {
  violet: "bg-brand-soft text-brand",
  amber: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  green: "bg-mint-soft text-emerald-700 dark:text-emerald-300",
  sky: "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
};

/** Reusable stats card used on every overview page. */
export function StatCard({ label, value, note, icon: Icon, tone = "violet" }: { label: string; value: React.ReactNode; note?: string; icon: LucideIcon; tone?: keyof typeof TONES }) {
  return (
    <div className="card lift flex flex-col gap-[13px] p-[21px]">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted">{label}</span>
        <span className={cn("grid h-[42px] w-[42px] place-items-center rounded-[13px]", TONES[tone])}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <span className="text-[34px] font-bold leading-none">{value}</span>
      {note && <span className="text-[13px] text-muted">{note}</span>}
    </div>
  );
}

export function FilterTabs<T extends string>({ tabs, value, onChange }: { tabs: { value: T; label: string; count?: number }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div role="tablist" className="flex flex-wrap gap-2">
      {tabs.map((t) => {
        const on = t.value === value;
        return (
          <button
            key={t.value}
            role="tab"
            aria-selected={on}
            onClick={() => onChange(t.value)}
            className={cn(
              "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition",
              on ? "border-brand bg-brand text-white" : "border-line-strong bg-surface hover:border-brand hover:text-brand"
            )}
          >
            {t.label}
            {t.count !== undefined && <span className={cn("rounded-full px-2 text-xs", on ? "bg-white/25" : "bg-brand-soft text-brand")}>{t.count}</span>}
          </button>
        );
      })}
    </div>
  );
}

export function Panel({ title, action, children, className }: { title?: string; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("card flex min-w-0 flex-col gap-[18px] rounded-[26px] p-[21px] sm:p-[26px]", className)}>
      {(title || action) && (
        <div className="flex flex-wrap items-center justify-between gap-2">
          {title && <h2 className="text-[19px] font-bold">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function ErrorBox({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="card flex flex-col items-center gap-3 p-8 text-center">
      <p className="text-muted">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-outline">
          Try again
        </button>
      )}
    </div>
  );
}
