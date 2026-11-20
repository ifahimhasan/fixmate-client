"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowRight, Check, Lock, Search, Smartphone } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";

gsap.registerPlugin(useGSAP);

const STEPS = [
  { l: "Requested", t: "Mon 10:12", s: "done" },
  { l: "Accepted", t: "Mon 11:40", s: "done" },
  { l: "In progress", t: "Now", s: "current" },
  { l: "Completed", t: "-", s: "todo" },
  { l: "Paid", t: "-", s: "todo" },
] as const;

const FEED = [
  { m: "Original-grade display fitted, testing Face ID now", t: "Just now", c: "bg-brand" },
  { m: "Device received at the shop, diagnosis done", t: "Mon 12:05", c: "bg-mint" },
  { m: "Request accepted - drop-off confirmed for today", t: "Mon 11:40", c: "bg-mint" },
];

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from("[data-hero]", { y: 34, opacity: 0, duration: 0.9, stagger: 0.09, ease: "power3.out" });
      gsap.from("[data-tilt]", { rotateX: 18, y: 55, opacity: 0, duration: 1.3, delay: 0.35, ease: "power3.out" });
      gsap.from("[data-bar]", { width: 0, duration: 1.6, delay: 1, ease: "power2.out" });
    },
    { scope: ref }
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (q.trim()) p.set("search", q.trim());
    if (cat !== "all") p.set("category", cat);
    router.push(`/services${p.toString() ? `?${p}` : ""}`);
  };

  return (
    <div ref={ref}>
      <section className="container-x relative flex flex-col items-center gap-[21px] pb-[34px] pt-[34px] text-center sm:pt-[55px]">
        <span data-hero className="glass flex items-center gap-2.5 rounded-full py-2 pl-2.5 pr-4 text-sm font-bold">
          <span className="live-dot h-2.5 w-2.5 rounded-full bg-mint" />
          Verified technicians across Dhaka
        </span>
        <h1 data-hero className="max-w-[980px] text-[clamp(40px,6vw,76px)] font-bold leading-[1.04] tracking-[-0.03em]">
          Broken device? Get it fixed by{" "}
          <span className="bg-gradient-to-r from-brand to-sky bg-clip-text text-transparent">verified technicians</span>
        </h1>
        <p data-hero className="max-w-[610px] text-[17px] leading-[1.618] text-muted sm:text-lg">
          Phones, laptops, ACs, fridges and more. Follow your repair on a live job ticket - and pay only after the work is done.
        </p>
        <form data-hero onSubmit={submit} className="glass mt-2 flex w-full max-w-[720px] flex-wrap gap-2 rounded-[21px] p-2">
          <label className="flex min-w-[220px] flex-1 items-center gap-2.5 rounded-[13px] bg-surface px-4">
            <Search className="h-5 w-5 text-brand" />
            <span className="sr-only">What needs fixing?</span>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="What needs fixing?" className="h-[55px] w-full bg-transparent text-base outline-none placeholder:text-muted/70" />
          </label>
          <label className="hidden items-center rounded-[13px] bg-surface px-3 sm:flex">
            <span className="sr-only">Category</span>
            <select value={cat} onChange={(e) => setCat(e.target.value)} className="h-[55px] bg-transparent text-[15px] outline-none">
              <option value="all">All categories</option>
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <button className="btn !h-[55px] !px-7 !text-base max-sm:w-full">
            Find a fix <ArrowRight className="h-[18px] w-[18px]" />
          </button>
        </form>
        <div data-hero className="flex flex-wrap items-center justify-center gap-2 text-sm text-muted">
          <span>Popular:</span>
          {[
            ["iPhone screen", "search=screen"],
            ["AC servicing", "category=AC"],
            ["Laptop", "category=Laptop%20%26%20PC"],
            ["Fridge not cooling", "category=Refrigerator"],
          ].map(([l, qs]) => (
            <a key={l} href={`/services?${qs}`} className="rounded-full border border-line bg-surface/80 px-3.5 py-2 text-ink transition hover:border-brand hover:text-brand">
              {l}
            </a>
          ))}
        </div>
      </section>

      {/* Live ticket preview */}
      <section aria-label="Live job ticket preview" className="container-x relative pb-[89px] pt-[21px] [perspective:1400px]">
        <div aria-hidden="true" className="absolute left-1/2 top-[45%] h-[320px] w-[760px] max-w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[conic-gradient(from_200deg,#7c5cff,#38bdf8,#12b886,#7c5cff)] opacity-35 blur-[80px]" />
        <div data-tilt className="glass relative mx-auto max-w-[1060px] origin-top rounded-[34px] p-[13px]">
          <div className="grid overflow-hidden rounded-[26px] bg-surface/90 lg:grid-cols-[1.618fr_1fr]">
            <div className="flex min-w-0 flex-col gap-[29px] p-6 text-left sm:p-[29px]">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-4">
                  <span className="grid h-[58px] w-[58px] shrink-0 place-items-center rounded-[18px] bg-gradient-to-br from-violet-100 to-violet-200 text-brand dark:from-violet-950 dark:to-violet-900">
                    <Smartphone className="h-7 w-7" />
                  </span>
                  <span className="flex flex-col gap-1">
                    <span className="text-xs tracking-[0.08em] text-muted">JOB TICKET · #FM-2041</span>
                    <span className="text-[21px] font-bold leading-tight">iPhone 13 screen replacement</span>
                  </span>
                </div>
                <span className="flex items-center gap-2 rounded-full bg-amber-50 px-3.5 py-2 text-[13px] font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  <span className="h-2 w-2 rounded-full bg-amber-600" /> In progress
                </span>
              </div>
              <div className="relative">
                <div aria-hidden="true" className="absolute left-[10%] right-[10%] top-[19px] hidden h-1 rounded-full bg-brand-soft sm:block">
                  <span data-bar className="block h-1 w-1/2 rounded-full bg-gradient-to-r from-mint to-brand" />
                </div>
                <ol className="relative grid gap-3 sm:grid-cols-5 sm:gap-2">
                  {STEPS.map((s) => (
                    <li key={s.l} className="flex items-center gap-3 sm:flex-col sm:text-center">
                      <span
                        className={
                          s.s === "done"
                            ? "grid h-[42px] w-[42px] shrink-0 place-items-center rounded-full border-[3px] border-mint bg-mint text-white"
                            : s.s === "current"
                              ? "grid h-[42px] w-[42px] shrink-0 place-items-center rounded-full border-[3px] border-brand bg-surface shadow-[0_0_0_6px_rgba(91,61,245,.14)]"
                              : "h-[42px] w-[42px] shrink-0 rounded-full border-[3px] border-line-strong bg-surface"
                        }
                      >
                        {s.s === "done" && <Check className="h-4 w-4" strokeWidth={3.4} />}
                        {s.s === "current" && <span className="h-2.5 w-2.5 rounded-full bg-brand" />}
                      </span>
                      <span className="flex flex-col gap-1">
                        <span className={`text-sm font-bold ${s.s === "todo" ? "text-muted" : ""}`}>{s.l}</span>
                        <span className="text-xs text-muted">{s.t}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-line-strong pt-[21px]">
                <span className="flex gap-[34px]">
                  <span className="flex flex-col gap-1">
                    <span className="text-xs text-muted">Starting price</span>
                    <span className="text-[26px] font-bold">$45</span>
                  </span>
                  <span className="flex flex-col gap-1">
                    <span className="text-xs text-muted">Preferred date</span>
                    <span className="pt-1.5 text-[17px] font-bold">Mon, 24 Nov</span>
                  </span>
                </span>
                <span className="flex items-center gap-2.5 rounded-[13px] bg-brand-soft px-[18px] py-[13px] text-sm font-bold text-brand">
                  <Lock className="h-4 w-4" /> Pay Now unlocks when completed
                </span>
              </div>
            </div>
            <aside className="flex min-w-0 flex-col gap-[18px] border-line bg-gradient-to-b from-violet-50 to-sky-50 p-[26px] text-left max-lg:border-t lg:border-l dark:from-[#1d2136] dark:to-[#1a2236]">
              <div className="flex items-center gap-3">
                <span className="relative grid h-[52px] w-[52px] place-items-center rounded-full bg-[#0e1330] font-bold text-white">
                  TA
                  <span className="absolute -bottom-0.5 -right-0.5 grid h-5 w-5 place-items-center rounded-full border-2 border-white bg-mint">
                    <Check className="h-2.5 w-2.5 text-white" strokeWidth={4} />
                  </span>
                </span>
                <span className="flex flex-col gap-0.5">
                  <span className="font-bold">Tanvir Alam</span>
                  <span className="text-xs text-muted">Verified · Dhanmondi · ★ 4.9</span>
                </span>
              </div>
              <span className="text-xs font-bold tracking-[0.1em] text-brand">LIVE UPDATES</span>
              <div className="flex flex-col gap-[13px]">
                {FEED.map((f) => (
                  <div key={f.m} className="flex items-start gap-2.5">
                    <span className={`mt-[7px] h-2 w-2 shrink-0 rounded-full ${f.c}`} />
                    <span className="flex flex-col gap-0.5">
                      <span className="text-sm leading-snug">{f.m}</span>
                      <span className="text-xs text-muted">{f.t}</span>
                    </span>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
