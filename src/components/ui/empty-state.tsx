import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";

export default function EmptyState({
  title,
  text,
  cta,
  href,
  onClick,
  icon: Icon = Inbox,
}: {
  title: string;
  text: string;
  cta?: string;
  href?: string;
  onClick?: () => void;
  icon?: LucideIcon;
}) {
  return (
    <div className="glass flex flex-col items-center gap-4 rounded-[29px] px-6 py-14 text-center">
      <span className="grid h-[72px] w-[72px] place-items-center rounded-[22px] bg-brand-soft text-brand">
        <Icon className="h-8 w-8" />
      </span>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="max-w-md text-[15px] leading-relaxed text-muted">{text}</p>
      {cta && href && (
        <Link href={href} className="btn">
          {cta}
        </Link>
      )}
      {cta && onClick && !href && (
        <button onClick={onClick} className="btn">
          {cta}
        </button>
      )}
    </div>
  );
}
