import CategoryIcon from "@/components/ui/category-icon";
import { CATEGORIES } from "@/lib/constants";

const TRUST = ["Pay after service", "Admin-verified technicians", "Live job tracking", "Stripe secured payments", "Rate after you pay"];

export default function MarqueeBand() {
  return (
    <section aria-label="Repair categories" className="relative -rotate-[1.4deg] pb-[34px]">
      <div className="marquee-wrap bg-gradient-to-r from-brand to-indigo-600 py-[18px] shadow-[0_21px_34px_-21px_rgba(91,61,245,.8)]">
        <div className="marquee">
          {[...CATEGORIES, ...CATEGORIES].map((c, i) => (
            <span key={i} className="flex items-center gap-[13px] whitespace-nowrap px-[26px] text-xl font-bold text-white">
              <CategoryIcon category={c} className="h-[22px] w-[22px] text-emerald-200" />
              {c}
              <span className="pl-[26px] text-emerald-200">✦</span>
            </span>
          ))}
        </div>
      </div>
      <div className="marquee-wrap border-b border-line bg-surface py-[14px]">
        <div className="marquee reverse">
          {[...TRUST, ...TRUST].map((t, i) => (
            <span key={i} className="flex items-center gap-[13px] whitespace-nowrap px-[26px] text-base">
              {t}
              <span className="pl-[26px] text-mint">●</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
