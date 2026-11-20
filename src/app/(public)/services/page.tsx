import { Suspense } from "react";
import type { Metadata } from "next";
import ServicesBrowser from "@/components/services/services-browser";
import { CardGridSkeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "Browse services" };

export default function ServicesPage() {
  return (
    <section className="container-x flex flex-col gap-[29px] pb-[89px] pt-[34px]">
      <div className="flex flex-col items-center gap-[13px] text-center">
        <span className="eyebrow">Browse services</span>
        <h1 className="text-[clamp(38px,5vw,55px)] font-bold leading-[1.08] tracking-[-0.025em]">Find the right fix</h1>
        <p className="max-w-[560px] text-[17px] leading-[1.618] text-muted">Every service here is approved by an admin and available right now.</p>
      </div>
      <Suspense fallback={<CardGridSkeleton />}>
        <ServicesBrowser />
      </Suspense>
    </section>
  );
}
