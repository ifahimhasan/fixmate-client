import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import Logo from "@/components/ui/logo";
import SocialIcons from "@/components/ui/social-icons";
import { CATEGORIES } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line-strong bg-brand-soft/60">
      <div className="container-x flex flex-col gap-[34px] pb-[21px] pt-[55px]">
        <div className="grid gap-[34px] sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-[18px]">
            <Logo />
            <p className="text-[15px] leading-[1.618] text-muted">Trackable repairs by verified technicians. Pay only after the job is done.</p>
            <SocialIcons />
          </div>
          <div className="flex flex-col gap-[13px] text-[15px]">
            <span className="font-bold">Quick links</span>
            <Link href="/" className="text-muted hover:text-brand">Home</Link>
            <Link href="/services" className="text-muted hover:text-brand">Services</Link>
            <Link href="/about" className="text-muted hover:text-brand">About / How it works</Link>
          </div>
          <div className="flex flex-col gap-[13px] text-[15px]">
            <span className="font-bold">Popular categories</span>
            {CATEGORIES.slice(0, 5).map((c) => (
              <Link key={c} href={`/services?category=${encodeURIComponent(c)}`} className="text-muted hover:text-brand">
                {c}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-[13px] text-[15px]">
            <span className="font-bold">Contact</span>
            {[
              { icon: Mail, text: "support@fixmate.com" },
              { icon: Phone, text: "+880 1700-000000" },
              { icon: MapPin, text: "Dhanmondi, Dhaka 1209" },
            ].map(({ icon: Icon, text }) => (
              <span key={text} className="flex items-center gap-2.5 text-muted">
                <span className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full border border-line-strong bg-surface text-brand">
                  <Icon className="h-[15px] w-[15px]" />
                </span>
                {text}
              </span>
            ))}
          </div>
        </div>
        <div
          aria-hidden="true"
          className="-mb-5 select-none text-center text-[clamp(68px,17vw,233px)] font-bold leading-[.85] tracking-[-0.04em] text-transparent [-webkit-text-stroke:1.5px_#b9aeff]"
        >
          FixMate
        </div>
        <div className="flex flex-wrap justify-between gap-3 border-t border-line-strong pt-[21px] text-sm text-muted">
          <span>© {new Date().getFullYear()} FixMate. All rights reserved.</span>
          <span>Payments secured by Stripe (test mode)</span>
        </div>
      </div>
    </footer>
  );
}
