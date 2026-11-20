import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CalendarClock, CheckCircle2, Home, MapPin, ShieldCheck, Star } from "lucide-react";
import RequestRepair from "@/components/services/request-repair";
import CategoryIcon from "@/components/ui/category-icon";
import { Avatar } from "@/components/layout/navbar";
import { API_URL } from "@/lib/constants";
import { IMAGES } from "@/lib/images";
import type { ServiceDetails } from "@/lib/types";
import { fmtDate, money } from "@/lib/utils";

async function getService(id: string): Promise<ServiceDetails | null> {
  try {
    const res = await fetch(`${API_URL}/api/services/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const s = await getService((await params).id);
  return { title: s ? s.title : "Service not found" };
}

export default async function ServiceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const s = await getService(id);
  if (!s) notFound(); // missing, not approved or unavailable → 404 page

  const facts = [
    { k: "Estimated time", v: s.estimatedDuration, icon: CalendarClock },
    { k: "Service mode", v: s.serviceMode, icon: Home },
    { k: "Service area", v: s.serviceArea, icon: MapPin },
  ];
  const points = s.description
    .split(/[.\n]/)
    .map((p) => p.trim())
    .filter((p) => p.length > 8)
    .slice(0, 4);

  return (
    <div className="container-x flex flex-col gap-[29px] pb-[89px] pt-[21px]">
      <nav aria-label="Breadcrumb" className="flex flex-wrap gap-2 text-sm text-muted">
        <Link href="/services" className="hover:text-brand">Services</Link>
        <span>/</span>
        <Link href={`/services?category=${encodeURIComponent(s.category)}`} className="hover:text-brand">{s.category}</Link>
        <span>/</span>
        <span className="font-bold text-ink">{s.title}</span>
      </nav>

      <div className="grid items-start gap-[34px] lg:grid-cols-[1.618fr_1fr]">
        <div className="flex min-w-0 flex-col gap-[29px]">
          <div className="glass rounded-[34px] p-2.5">
            <div className="relative aspect-[1.618/1] overflow-hidden rounded-[26px] bg-brand-soft">
              <Image src={s.image || IMAGES.category[s.category] || IMAGES.serviceFallback} alt={s.title} fill priority sizes="(max-width:1024px) 100vw, 60vw" className="object-cover" />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              <span className="flex items-center gap-1.5 rounded-full bg-brand-soft px-3.5 py-1.5 text-[13px] font-bold text-brand"><CategoryIcon category={s.category} className="h-3.5 w-3.5" />{s.category}</span>
              <span className="rounded-full bg-ink px-3.5 py-1.5 text-[13px] font-bold text-bg">{s.serviceMode}</span>
              {s.reviewCount ? (
                <span className="flex items-center gap-1 rounded-full bg-amber-50 px-3.5 py-1.5 text-[13px] font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  <Star className="h-3.5 w-3.5 fill-current" /> {s.averageRating?.toFixed(1)} · {s.reviewCount} review{s.reviewCount > 1 ? "s" : ""}
                </span>
              ) : (
                <span className="rounded-full bg-mint-soft px-3.5 py-1.5 text-[13px] font-bold text-emerald-700 dark:text-emerald-300">New service</span>
              )}
            </div>
            <h1 className="text-[clamp(32px,4vw,48px)] font-bold leading-[1.1] tracking-[-0.025em]">{s.title}</h1>
            <p className="whitespace-pre-line text-[17px] leading-[1.618] text-muted">{s.description}</p>
          </div>

          <div className="grid gap-[21px] sm:grid-cols-3">
            {facts.map(({ k, v, icon: Icon }) => (
              <div key={k} className="card flex flex-col gap-2.5 p-[18px]">
                <span className="grid h-[38px] w-[38px] place-items-center rounded-[12px] bg-brand-soft text-brand"><Icon className="h-[18px] w-[18px]" /></span>
                <span className="text-xs text-muted">{k}</span>
                <span className="text-[15px] font-bold">{v}</span>
              </div>
            ))}
          </div>

          {points.length > 1 && (
            <div className="card flex flex-col gap-4 rounded-[26px] p-[26px]">
              <h2 className="text-[21px] font-bold">What&apos;s included</h2>
              <ul className="grid gap-[13px] sm:grid-cols-2">
                {points.map((p) => (
                  <li key={p} className="flex items-start gap-2.5 text-[15px] leading-relaxed">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-mint" /> {p}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="card flex flex-col gap-[18px] rounded-[26px] p-[26px]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-[21px] font-bold">Customer reviews</h2>
              {s.reviewCount ? (
                <span className="flex items-center gap-2 text-2xl font-bold">
                  {s.averageRating?.toFixed(1)} <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                </span>
              ) : null}
            </div>
            {s.reviews.length ? (
              s.reviews.map((r) => (
                <div key={r._id} className="flex gap-3 border-t border-line pt-[18px]">
                  <Avatar name={r.customerName} size={42} />
                  <div className="flex flex-col gap-1">
                    <span className="flex items-center gap-2 font-bold">
                      {r.customerName}
                      <span className="flex text-amber-400">{Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current" />)}</span>
                    </span>
                    {r.review && <p className="text-[15px] leading-[1.618] text-muted">{r.review}</p>}
                    <span className="text-xs text-muted">Verified paid job · {fmtDate(r.reviewedAt)}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-[15px] text-muted">No reviews yet - reviews appear after customers pay for completed jobs.</p>
            )}
          </div>
        </div>

        <aside className="flex min-w-0 flex-col gap-[21px] lg:sticky lg:top-[110px]">
          <div className="glass flex flex-col gap-[18px] rounded-[29px] p-[26px]">
            <div className="flex items-end justify-between gap-3">
              <span className="flex flex-col">
                <span className="text-[13px] text-muted">Starting price</span>
                <span className="text-[42px] font-bold leading-none">{money(s.basePrice)}</span>
              </span>
              <span className="text-right text-[13px] leading-relaxed text-muted">Final amount set<br />at completion</span>
            </div>
            <RequestRepair serviceId={s._id} title={s.title} basePrice={s.basePrice} />
            <ul className="flex flex-col gap-2.5 border-t border-dashed border-line-strong pt-4 text-sm">
              {["No payment until the job is completed", "Track every status on your ticket", "Cancel free while still “Requested”"].map((t) => (
                <li key={t} className="flex items-center gap-2.5"><CheckCircle2 className="h-[18px] w-[18px] text-mint" />{t}</li>
              ))}
            </ul>
          </div>
          <div className="card flex flex-col gap-4 rounded-[29px] p-[26px]">
            <span className="eyebrow !text-xs">Your technician</span>
            <div className="flex items-center gap-3">
              <span className="relative">
                <Avatar name={s.technician.name} image={s.technician.image} size={58} />
                <ShieldCheck className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-surface p-0.5 text-mint" />
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="text-[17px] font-bold">{s.technician.name}</span>
                <span className="text-[13px] text-muted">{s.technician.area || s.serviceArea}</span>
              </span>
            </div>
            <p className="text-[15px] leading-[1.618] text-muted">{s.technician.bio || "Verified FixMate technician."}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
