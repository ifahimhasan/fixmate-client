import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { HowItWorks } from "@/components/home/sections";
import Reveal from "@/components/ui/reveal";
import Faq from "@/components/home/faq";
import { IMAGES } from "@/lib/images";

export const metadata: Metadata = { title: "How it works / About" };

const ROLES = [
  {
    tag: "For customers",
    title: "Get things fixed without the guesswork",
    items: ["Browse verified services with clear starting prices", "Track each step on a live job ticket", "Pay only after completion", "Rate the job after you pay"],
    cta: "Browse services",
    href: "/services",
    tagCls: "bg-brand-soft text-brand",
  },
  {
    tag: "For technicians",
    title: "A structured place for your repair work",
    items: ["List your services with photos and prices", "Accept or reject incoming requests", "Move each job through clear statuses", "Get paid through Stripe when you finish"],
    cta: "Join as a technician",
    href: "/sign-up?role=technician",
    tagCls: "bg-mint-soft text-emerald-700 dark:text-emerald-300",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="container-x grid items-center gap-[55px] pb-[55px] pt-[34px] lg:grid-cols-[1fr_1fr]">
        <Reveal immediate className="flex flex-col gap-[21px]">
          <span className="eyebrow">How it works · About FixMate</span>
          <h1 className="text-[clamp(40px,5vw,64px)] font-bold leading-[1.05] tracking-[-0.03em]">
            Repairs should be <span className="bg-gradient-to-r from-brand to-sky bg-clip-text text-transparent">visible and fair</span>
          </h1>
          <p className="text-lg leading-[1.618] text-muted">
            In Bangladesh and everywhere else, people hand over a device and hear nothing for days - then pay before seeing the result. Skilled technicians have no structured
            place to show their work. FixMate gives every job a trackable status, and payment happens only after the work is delivered.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/services" className="btn">Find a service</Link>
            <Link href="/sign-up?role=technician" className="btn-outline">Become a technician</Link>
          </div>
        </Reveal>
        <div className="glass rounded-[34px] p-2.5">
          <div className="relative aspect-[1.618/1] overflow-hidden rounded-[26px]">
            <Image src={IMAGES.about} alt="Technician repairing a laptop" fill priority sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
          </div>
        </div>
      </section>
      <HowItWorks />
      <section className="container-x pb-[89px] pt-[34px]">
        <Reveal className="grid gap-[21px] md:grid-cols-2">
          {ROLES.map((r) => (
            <div key={r.tag} className="card flex flex-col gap-[18px] rounded-[29px] p-[34px]">
              <span className={`self-start rounded-full px-3.5 py-1.5 text-[13px] font-bold ${r.tagCls}`}>{r.tag}</span>
              <h2 className="text-[28px] font-bold leading-tight">{r.title}</h2>
              <ul className="flex flex-col gap-[13px]">
                {r.items.map((i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[15px] leading-relaxed"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-mint" />{i}</li>
                ))}
              </ul>
              <Link href={r.href} className="btn mt-auto self-start">{r.cta}</Link>
            </div>
          ))}
        </Reveal>
      </section>
      <section className="mx-auto max-w-[860px] px-[21px] pb-[89px]">
        <div className="mb-[34px] flex flex-col items-center gap-[13px] text-center">
          <span className="eyebrow">FAQ</span>
          <h2 className="h2">Common questions</h2>
        </div>
        <Faq />
      </section>
    </>
  );
}
