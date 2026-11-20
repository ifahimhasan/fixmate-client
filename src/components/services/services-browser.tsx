"use client";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Search, SearchX } from "lucide-react";
import ServiceCard from "./service-card";
import EmptyState from "@/components/ui/empty-state";
import { CardGridSkeleton } from "@/components/ui/skeleton";
import { CATEGORIES, SERVICE_MODES } from "@/lib/constants";
import { api } from "@/lib/api";
import type { Service } from "@/lib/types";
import { cn } from "@/lib/utils";

type Result = { services: Service[]; total: number; page: number; totalPages: number };

export default function ServicesBrowser() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // URL is the single source of truth → filters survive a reload
  const category = params.get("category") || "all";
  const mode = params.get("mode") || "any";
  const sort = params.get("sort") || "newest";
  const search = params.get("search") || "";
  const page = Math.max(1, Number(params.get("page")) || 1);

  const [term, setTerm] = useState(search);
  const [data, setData] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => setTerm(search), [search]);

  const setParams = (next: Record<string, string>, resetPage = true) => {
    const p = new URLSearchParams(params.toString());
    Object.entries(next).forEach(([k, v]) => (v && v !== "all" && v !== "any" ? p.set(k, v) : p.delete(k)));
    if (resetPage) p.delete("page");
    router.replace(`${pathname}${p.toString() ? `?${p}` : ""}`, { scroll: false });
  };

  // debounce typing into the URL
  useEffect(() => {
    if (term === search) return;
    const t = setTimeout(() => setParams({ search: term.trim() }), 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [term]);

  const query = useMemo(() => {
    const p = new URLSearchParams({ sort, page: String(page), limit: "8" });
    if (category !== "all") p.set("category", category);
    if (mode !== "any") p.set("mode", mode);
    if (search) p.set("search", search);
    return p.toString();
  }, [category, mode, sort, search, page]);

  useEffect(() => {
    const ctrl = new AbortController();
    setLoading(true);
    setError("");
    api<Result>(`/api/services?${query}`, { auth: false, signal: ctrl.signal })
      .then(setData)
      .catch((e) => {
        if (e.name !== "AbortError") setError(e.message || "Could not load services");
      })
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, [query]);

  const hasFilters = category !== "all" || mode !== "any" || !!search;

  return (
    <div className="flex flex-col gap-[29px]">
      <div className="glass flex flex-wrap gap-2 rounded-[26px] p-2.5">
        <label className="flex min-w-[260px] flex-1 items-center gap-2.5 rounded-[16px] bg-surface px-4">
          <Search className="h-5 w-5 text-brand" />
          <span className="sr-only">Search by title or category</span>
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search by title or category…"
            className="h-[55px] w-full bg-transparent text-base outline-none placeholder:text-muted/70"
          />
        </label>
        <label className="flex items-center gap-2 rounded-[16px] bg-surface px-4 text-[13px] text-muted">
          Mode
          <select value={mode} onChange={(e) => setParams({ mode: e.target.value })} className="h-[55px] bg-transparent text-[15px] font-bold text-ink outline-none">
            <option value="any">Any</option>
            {SERVICE_MODES.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 rounded-[16px] bg-surface px-4 text-[13px] text-muted">
          Sort
          <select value={sort} onChange={(e) => setParams({ sort: e.target.value })} className="h-[55px] bg-transparent text-[15px] font-bold text-ink outline-none">
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </label>
      </div>

      <div role="group" aria-label="Category" className="flex flex-wrap justify-center gap-2">
        {["all", ...CATEGORIES].map((c) => {
          const on = c === category;
          return (
            <button
              key={c}
              onClick={() => setParams({ category: c })}
              aria-pressed={on}
              className={cn(
                "rounded-full border px-4 py-2.5 text-sm font-bold transition",
                on ? "border-brand bg-brand text-white shadow-[0_13px_21px_-13px_rgba(91,61,245,.9)]" : "border-line-strong bg-surface/80 hover:border-brand hover:text-brand"
              )}
            >
              {c === "all" ? "All" : c}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted">
        <span>{data ? `${data.total} service${data.total === 1 ? "" : "s"} found` : "Loading services…"}</span>
        {hasFilters && (
          <button onClick={() => setParams({ category: "all", mode: "any", search: "" })} className="font-bold text-brand hover:underline">
            Clear filters
          </button>
        )}
      </div>

      {loading ? (
        <CardGridSkeleton />
      ) : error ? (
        <EmptyState title="Couldn't load services" text={error} cta="Try again" onClick={() => router.refresh()} icon={SearchX} />
      ) : !data?.services.length ? (
        <EmptyState
          title="No services match these filters"
          text="Try another category or clear the filters - new services are approved every week."
          cta="Clear filters"
          onClick={() => setParams({ category: "all", mode: "any", search: "" })}
          icon={SearchX}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-[21px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data.services.map((s) => (
              <ServiceCard key={s._id} service={s} />
            ))}
          </div>
          {data.totalPages > 1 && (
            <nav aria-label="Pagination" className="flex flex-wrap justify-center gap-2 pt-[34px]">
              <button disabled={page <= 1} onClick={() => setParams({ page: String(page - 1) }, false)} className="btn-outline !px-4 !py-2.5">
                <ChevronLeft className="h-4 w-4" /> Previous
              </button>
              {Array.from({ length: data.totalPages }).map((_, i) => (
                <button
                  key={i}
                  aria-current={page === i + 1 ? "page" : undefined}
                  onClick={() => setParams({ page: String(i + 1) }, false)}
                  className={page === i + 1 ? "btn !w-[46px] !px-0 !py-2.5" : "btn-outline !w-[46px] !px-0 !py-2.5"}
                >
                  {i + 1}
                </button>
              ))}
              <button disabled={page >= data.totalPages} onClick={() => setParams({ page: String(page + 1) }, false)} className="btn-outline !px-4 !py-2.5">
                Next <ChevronRight className="h-4 w-4" />
              </button>
            </nav>
          )}
        </>
      )}
    </div>
  );
}
