import Link from "next/link";
import { ArrowRight, Check, ClipboardList, CreditCard, Grid2x2Plus, Lock, ReceiptText, Search, ShieldCheck, Star, Wrench } from "lucide-react";
import Reveal from "@/components/ui/reveal";
import CategoryIcon from "@/components/ui/category-icon";
import ServiceCard from "@/components/services/service-card";
import EmptyState from "@/components/ui/empty-state";
import { CATEGORIES, CATEGORY_STYLE } from "@/lib/constants";
import type { Service } from "@/lib/types";
import { cn } from "@/lib/utils";

function Heading({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <Reveal className="mb-[55px] flex flex-col items-center gap-[13px] text-center">
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="h2 max-w-[720px]">{title}</h2>
      {text && <p className="max-w-[540px] text-[17px] leading-[1.618] text-muted">{text}</p>}
    </Reveal>
  );
}

export function CategoriesSection({ counts }: { counts: Record<string, number> }) {
  return (
    <section className="container-x pb-[55px] pt-[89px]">
      <Heading eyebrow="Popular categories" title="What can we fix for you today?" text="Pick a category and we'll open the services page already filtered for you." />
      <Reveal className="grid grid-cols-1 gap-[21px] sm:grid-cols-2 lg:grid-cols-4">
        {CATEGORIES.map((c) => (
          <Link key={c} href={`/services?category=${encodeURIComponent(c)}`} className="glass lift flex items-center gap-[18px] rounded-[26px] p-[26px]">
            <span className={cn("grid h-[58px] w-[58px] shrink-0 place-items-center rounded-[18px]", CATEGORY_STYLE[c].bg, CATEGORY_STYLE[c].fg)}>
              <CategoryIcon category={c} className="h-[27px] w-[27px]" />
            </span>
            <span className="flex min-w-0 flex-col gap-1">
              <span className="whitespace-nowrap text-lg font-bold leading-tight">{c}</span>
              <span className="text-sm text-muted">{counts[c] ?? 0} services</span>
            </span>
          </Link>
        ))}
        <Link
          href="/services"
          className="lift relative flex items-center gap-[18px] overflow-hidden rounded-[26px] bg-gradient-to-br from-brand via-[#7c5cff] to-sky p-[26px] text-white shadow-[0_21px_34px_-18px_rgba(91,61,245,.8)]"
        >
          <span aria-hidden="true" className="absolute -right-8 -top-14 h-36 w-36 rounded-full bg-white/15" />
          <span className="relative grid h-[58px] w-[58px] shrink-0 place-items-center rounded-[18px] bg-white/20">
            <Grid2x2Plus className="h-[27px] w-[27px]" />
          </span>
          <span className="relative flex flex-col gap-1">
            <span className="text-lg font-bold leading-tight">Not listed?</span>
            <span className="text-sm text-violet-100">Browse all services →</span>
          </span>
        </Link>
      </Reveal>
    </section>
  );
}

export function FeaturedSection({ services }: { services: Service[] }) {
  return (
    <section className="container-x pb-[89px] pt-[55px]">
      <Heading eyebrow="Featured services" title="Fresh from verified technicians" text="The six newest services approved by our admins." />
      {services.length ? (
        <Reveal className="grid grid-cols-1 gap-[21px] sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <ServiceCard key={s._id} service={s} />
          ))}
        </Reveal>
      ) : (
        <EmptyState title="No services yet" text="Approved services will show up here. Check back soon!" cta="Browse services" href="/services" icon={Wrench} />
      )}
      <div className="flex justify-center pt-[55px]">
        <Link href="/services" className="btn-outline !border-brand !text-brand">
          View all services <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

const STEPS = [
  { n: 1, title: "Find a service", text: "Search, filter by category or mode, and compare starting prices.", icon: Search, c: "text-brand", ring: "bg-brand" },
  { n: 2, title: "Send a request", text: "Describe the problem, pick a date and share your address.", icon: ClipboardList, c: "text-[#4f7bf7]", ring: "bg-[#4f7bf7]" },
  { n: 3, title: "Technician fixes it", text: "Watch the ticket move: accepted, in progress, completed.", icon: Wrench, c: "text-sky", ring: "bg-sky" },
  { n: 4, title: "Pay after completion", text: "Pay securely with Stripe only when the work is delivered.", icon: ReceiptText, c: "text-mint", ring: "bg-mint" },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative bg-gradient-to-b from-transparent via-brand-soft/80 to-transparent px-[21px] py-[89px]">
      <div className="mx-auto max-w-[1240px]">
        <Heading eyebrow="How FixMate works" title="Four steps. No guesswork." text="From the first request to the final payment, every step shows up on your job ticket." />
        <div className="relative">
          <div aria-hidden="true" className="absolute left-[12.5%] right-[12.5%] top-[55px] hidden h-0.5 bg-gradient-to-r from-brand via-sky to-mint lg:block" />
          <Reveal className="relative grid gap-[34px] sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(({ n, title, text, icon: Icon, c, ring }) => (
              <div key={n} className="flex flex-col items-center gap-[21px] text-center">
                <span className="relative grid h-[110px] w-[110px] place-items-center rounded-[34px] border border-white bg-surface shadow-[0_21px_34px_-18px_rgba(46,38,140,.45)] dark:border-line">
                  <Icon className={cn("h-[46px] w-[46px]", c)} strokeWidth={1.7} />
                  <span className={cn("absolute -right-2.5 -top-2.5 grid h-[34px] w-[34px] place-items-center rounded-full border-[3px] border-bg text-[13px] font-bold text-white", ring)}>
                    {n}
                  </span>
                </span>
                <div className="flex max-w-[260px] flex-col gap-2">
                  <span className="text-xl font-bold">{title}</span>
                  <span className="text-[15px] leading-[1.618] text-muted">{text}</span>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function WhyChoose() {
  const techs = [
    { n: "Tanvir Alam", s: "Smartphone · Dhanmondi", i: "TA", c: "bg-[#0e1330] text-white" },
    { n: "Sumaiya Akter", s: "AC · Gulshan", i: "SA", c: "bg-mint-soft text-emerald-700" },
    { n: "Mehedi Hasan", s: "Laptop & TV · Farmgate", i: "MH", c: "bg-sky-100 text-sky-700" },
  ];
  const bars = [86, 10, 3, 1, 0];
  return (
    <section className="container-x py-[89px]">
      <Heading eyebrow="Why choose FixMate" title="Repairs you can see, prices you can trust" text="Four promises built into every job on FixMate - not just written on a banner." />
      <Reveal className="grid gap-[21px] md:grid-cols-2 lg:grid-cols-3">
        <div className="glass lift grid items-center gap-[29px] rounded-[29px] p-[29px] sm:grid-cols-2 md:col-span-2">
          <div className="flex flex-col gap-[13px]">
            <span className="self-start rounded-full bg-brand-soft px-3 py-1.5 text-xs font-bold text-brand">Pay after service</span>
            <h3 className="text-[26px] font-bold leading-tight">You pay only after it&apos;s fixed</h3>
            <p className="text-[15px] leading-[1.618] text-muted">The Pay Now button stays locked while the job is in progress. It unlocks only when the technician marks it completed.</p>
          </div>
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between gap-2 rounded-[18px] border border-line bg-surface p-4">
              <span className="flex flex-col gap-0.5"><span className="text-xs text-muted">In progress</span><span className="font-bold">$45 due later</span></span>
              <span className="flex items-center gap-1.5 rounded-[12px] bg-slate-100 px-3 py-2.5 text-[13px] font-bold text-slate-400 dark:bg-slate-800"><Lock className="h-3.5 w-3.5" />Pay Now</span>
            </div>
            <span className="text-center text-violet-300">↓</span>
            <div className="flex items-center justify-between gap-2 rounded-[18px] border-[1.5px] border-mint bg-surface p-4 shadow-[0_13px_34px_-18px_rgba(18,184,134,.6)]">
              <span className="flex flex-col gap-0.5"><span className="text-xs font-bold text-emerald-600">✓ Completed</span><span className="font-bold">Final amount $45</span></span>
              <span className="rounded-[12px] bg-brand px-4 py-2.5 text-[13px] font-bold text-white">Pay Now</span>
            </div>
          </div>
        </div>
        <div className="glass lift flex flex-col gap-[21px] rounded-[29px] p-[29px]">
          <span className="self-start rounded-full bg-mint-soft px-3 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">Verified</span>
          <h3 className="text-[22px] font-bold leading-snug">Every listing reviewed by an admin</h3>
          <div className="mt-auto flex flex-col gap-2">
            {techs.map((t) => (
              <div key={t.n} className="flex items-center gap-2.5 rounded-[14px] border border-line bg-surface px-3 py-2.5">
                <span className={cn("grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full text-xs font-bold", t.c)}>{t.i}</span>
                <span className="flex min-w-0 flex-1 flex-col leading-tight"><span className="text-sm font-bold">{t.n}</span><span className="text-xs text-muted">{t.s}</span></span>
                <span className="rounded-full bg-mint-soft px-2 py-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">Approved</span>
              </div>
            ))}
          </div>
        </div>
        <div className="glass lift flex flex-col gap-[21px] rounded-[29px] p-[29px]">
          <span className="self-start rounded-full bg-sky-100 px-3 py-1.5 text-xs font-bold text-sky-700 dark:bg-sky-950 dark:text-sky-300">Live tracking</span>
          <h3 className="text-[22px] font-bold leading-snug">Know exactly where your job is</h3>
          <ol className="mt-auto flex flex-col rounded-[18px] border border-line bg-surface p-4">
            {[
              ["Requested", "10:12", "done"],
              ["Accepted", "11:40", "done"],
              ["In progress", "Now", "cur"],
              ["Completed", "-", "todo"],
            ].map(([l, t, s], i, arr) => (
              <li key={l} className="flex gap-3">
                <span className="flex w-4 flex-col items-center">
                  <span className={cn("h-4 w-4 rounded-full border-2", s === "done" ? "border-mint bg-mint" : s === "cur" ? "border-brand bg-surface" : "border-line-strong bg-surface")} />
                  {i < arr.length - 1 && <span className={cn("min-h-4 w-0.5 flex-1", s === "done" ? "bg-mint" : "bg-line-strong")} />}
                </span>
                <span className="flex flex-1 justify-between pb-2.5 text-sm leading-tight">
                  <span className={cn("font-bold", s === "todo" && "text-muted")}>{l}</span>
                  <span className="text-xs text-muted">{t}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
        <div className="glass lift grid items-center gap-[29px] rounded-[29px] p-[29px] sm:grid-cols-2 md:col-span-2">
          <div className="flex flex-col gap-[13px]">
            <span className="self-start rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700 dark:bg-amber-950 dark:text-amber-300">Honest reviews</span>
            <h3 className="text-[26px] font-bold leading-tight">Ratings only from customers who paid</h3>
            <p className="text-[15px] leading-[1.618] text-muted">After a job is paid, the customer can leave a 1–5 star rating and a short review. No paid job, no review.</p>
          </div>
          <div className="flex items-center gap-[21px] rounded-[21px] border border-line bg-surface p-[21px]">
            <span className="flex shrink-0 flex-col items-center gap-1">
              <span className="text-[42px] font-bold leading-none">4.9</span>
              <span className="flex text-amber-400">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current" />)}</span>
            </span>
            <div className="flex flex-1 flex-col gap-2">
              {bars.map((w, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-muted">
                  <span className="w-2.5">{5 - i}</span>
                  <span className="h-2 flex-1 overflow-hidden rounded-full bg-line"><span className="block h-2 rounded-full bg-amber-400" style={{ width: `${w}%` }} /></span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

const QUOTES = [
  { text: "I could see exactly when my laptop was being worked on, and paid only after testing it at home.", name: "Nabila Rahman", job: "Laptop deep cleaning", i: "NR", c: "bg-brand-soft text-brand" },
  { text: "The AC technician came on the date I picked, and the final price matched the estimate.", name: "Sajid Karim", job: "Split AC servicing", i: "SK", c: "bg-mint-soft text-emerald-700" },
  { text: "Finally a repair app where I don't pay upfront. The ticket tracker is the best part.", name: "Farzana Islam", job: "iPhone screen", i: "FI", c: "bg-orange-100 text-orange-700" },
  { text: "Fridge stopped cooling on a Friday. Booked in two minutes and it was fixed by Saturday.", name: "Rakib Hossain", job: "Refrigerator repair", i: "RH", c: "bg-cyan-100 text-cyan-700" },
  { text: "Clear updates at every step. I never had to call anyone to ask what was happening.", name: "Mitu Das", job: "House wiring", i: "MD", c: "bg-pink-100 text-pink-700" },
];

export function Testimonials() {
  return (
    <section className="py-[55px] pb-[89px]">
      <Reveal className="container-x mb-[34px] flex flex-wrap items-end justify-between gap-[21px]">
        <div className="flex flex-col gap-[13px]">
          <span className="eyebrow">Testimonials</span>
          <h2 className="h2">Loved by people who hate waiting</h2>
        </div>
        <div className="glass flex items-center gap-3 rounded-[21px] px-[21px] py-[13px]">
          <span className="text-[34px] font-bold">4.9</span>
          <span className="flex flex-col leading-snug">
            <span className="flex text-amber-400">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}</span>
            <span className="text-[13px] text-muted">from verified paid jobs</span>
          </span>
        </div>
      </Reveal>
      <div className="marquee-wrap">
        <div className="marquee !py-[13px] [animation-duration:60s]">
          {[...QUOTES, ...QUOTES].map((q, i) => (
            <figure key={i} className="glass mx-2.5 flex w-[380px] shrink-0 flex-col gap-4 rounded-[26px] p-[26px]">
              <span className="flex text-amber-400" aria-label="5 out of 5 stars">{Array.from({ length: 5 }).map((_, k) => <Star key={k} className="h-4 w-4 fill-current" />)}</span>
              <blockquote className="min-h-[78px] text-base leading-[1.618]">{q.text}</blockquote>
              <figcaption className="flex items-center gap-3 border-t border-line pt-3">
                <span className={cn("grid h-[42px] w-[42px] place-items-center rounded-full text-sm font-bold", q.c)}>{q.i}</span>
                <span className="flex flex-col leading-snug"><span className="text-[15px] font-bold">{q.name}</span><span className="text-[13px] text-muted">{q.job}</span></span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TechnicianCta() {
  return (
    <section className="container-x pb-[89px]">
      <Reveal className="glass rounded-[34px] p-[13px]">
        <div className="relative grid items-center gap-[34px] overflow-hidden rounded-[26px] bg-gradient-to-br from-surface via-violet-50 to-sky-50 p-8 sm:p-[55px] lg:grid-cols-2 dark:from-surface dark:via-[#1d2136] dark:to-[#1a2236]">
          <div aria-hidden="true" className="dots absolute inset-0 [mask-image:linear-gradient(90deg,transparent,#000)]" />
          <div className="relative flex flex-col gap-[18px]">
            <span className="self-start rounded-full bg-mint-soft px-3.5 py-1.5 text-[13px] font-bold text-emerald-700 dark:text-emerald-300">For technicians</span>
            <h2 className="h2">Good with tools? Turn your skills into steady jobs.</h2>
            <p className="text-[17px] leading-[1.618] text-muted">List your services, accept requests and get paid through Stripe - all from one dashboard.</p>
            <div className="flex flex-wrap gap-[13px] pt-1">
              <Link href="/sign-up?role=technician" className="btn">Join as a technician</Link>
              <Link href="/about" className="btn-outline">How it works</Link>
            </div>
          </div>
          <div className="glass relative flex flex-col gap-[13px] rounded-[21px] p-[21px]">
            <div className="flex items-center justify-between"><span className="font-bold">New requests</span><span className="rounded-full bg-brand px-2.5 py-1 text-xs font-bold text-white">3 new</span></div>
            {[
              ["iPhone screen replacement", "Nabila · Dhanmondi · 24 Nov", "$45", "Smartphone"],
              ["House wiring fault", "Mitu · Mirpur 10 · 22 Nov", "$18", "Electrical"],
              ["Split AC servicing", "Sajid · Uttara · 25 Nov", "$30", "AC"],
            ].map(([t, s, p, c]) => (
              <div key={t} className="flex items-center gap-3 rounded-[13px] bg-surface p-3">
                <span className={cn("grid h-[38px] w-[38px] shrink-0 place-items-center rounded-[12px]", CATEGORY_STYLE[c as keyof typeof CATEGORY_STYLE].bg, CATEGORY_STYLE[c as keyof typeof CATEGORY_STYLE].fg)}>
                  <CategoryIcon category={c} className="h-[18px] w-[18px]" />
                </span>
                <span className="flex min-w-0 flex-1 flex-col leading-snug"><span className="text-sm font-bold">{t}</span><span className="text-xs text-muted">{s}</span></span>
                <span className="font-bold">{p}</span>
              </div>
            ))}
            <div className="flex flex-wrap gap-2 pt-1 text-xs text-muted">
              <span className="flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-mint" />Admin approved</span>
              <span className="flex items-center gap-1"><CreditCard className="h-3.5 w-3.5 text-brand" />Stripe payouts</span>
              <span className="flex items-center gap-1"><Check className="h-3.5 w-3.5 text-mint" />Clear statuses</span>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
