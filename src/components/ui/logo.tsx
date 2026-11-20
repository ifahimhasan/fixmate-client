import Link from "next/link";
import { Wrench } from "lucide-react";

export default function Logo({ size = "md", href = "/" }: { size?: "sm" | "md"; href?: string }) {
  const box = size === "sm" ? "h-9 w-9" : "h-10 w-10";
  const text = size === "sm" ? "text-[21px]" : "text-[23px]";
  return (
    <Link href={href} className="flex items-center gap-2.5" aria-label="FixMate home">
      <span className={`${box} grid place-items-center rounded-[13px] bg-gradient-to-br from-[#7c5cff] to-[#5b3df5] shadow-[0_8px_21px_-8px_rgba(91,61,245,.7)]`}>
        <Wrench className="h-5 w-5 text-white" strokeWidth={2.2} />
      </span>
      <span className={`${text} font-bold tracking-tight text-ink`}>
        Fix<span className="text-brand">Mate</span>
      </span>
    </Link>
  );
}
