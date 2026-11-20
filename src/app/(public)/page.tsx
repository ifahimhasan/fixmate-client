import Hero from "@/components/home/hero";
import MarqueeBand from "@/components/home/marquee";
import { CategoriesSection, FeaturedSection, HowItWorks, TechnicianCta, Testimonials, WhyChoose } from "@/components/home/sections";
import { serverGet } from "@/lib/server-api";
import type { Service } from "@/lib/types";

export default async function HomePage() {
  const [featured, counts] = await Promise.all([
    serverGet<Service[]>("/api/services/featured", []),
    serverGet<Record<string, number>>("/api/services/categories/counts", {}),
  ]);
  return (
    <>
      <Hero />
      <MarqueeBand />
      <CategoriesSection counts={counts} />
      <FeaturedSection services={featured} />
      <HowItWorks />
      <WhyChoose />
      <Testimonials />
      <TechnicianCta />
    </>
  );
}
