"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  CalendarCheck2,
  CreditCard,
  Home,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Menu,
  MessagesSquare,
  PlusCircle,
  ShieldCheck,
  UserRound,
  Users,
  Wallet,
  X,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import Logo from "@/components/ui/logo";
import ThemeToggle from "@/components/ui/theme-toggle";
import { Avatar, ROLE_BADGE } from "@/components/layout/navbar";
import { signOut, useSession } from "@/lib/auth-client";
import { clearToken } from "@/lib/api";
import type { Role } from "@/lib/constants";
import { cn } from "@/lib/utils";

type Item = { label: string; href: string; icon: LucideIcon };

const MENU: Record<Role, Item[]> = {
  customer: [
    { label: "Overview", href: "/dashboard/customer", icon: LayoutDashboard },
    { label: "My bookings", href: "/dashboard/customer/bookings", icon: CalendarCheck2 },
    { label: "Payment history", href: "/dashboard/customer/payments", icon: CreditCard },
  ],
  technician: [
    { label: "Overview", href: "/dashboard/technician", icon: LayoutDashboard },
    { label: "Add a service", href: "/dashboard/technician/add-service", icon: PlusCircle },
    { label: "My services", href: "/dashboard/technician/my-services", icon: ListChecks },
    { label: "Manage requests", href: "/dashboard/technician/requests", icon: MessagesSquare },
  ],
  admin: [
    { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "Manage users", href: "/dashboard/admin/users", icon: Users },
    { label: "Service approval", href: "/dashboard/admin/services", icon: ShieldCheck },
    { label: "All bookings", href: "/dashboard/admin/bookings", icon: CalendarCheck2 },
    { label: "Transactions", href: "/dashboard/admin/transactions", icon: Wallet },
  ],
};

export default function DashboardShell({ role, children }: { role: Role; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  const user = session?.user as { name: string; email: string; image?: string | null } | undefined;
  const items = [...MENU[role], { label: "Update profile", href: "/dashboard/profile", icon: UserRound }];
  const current = items.find((i) => i.href === pathname) ?? items.filter((i) => pathname.startsWith(i.href)).sort((a, b) => b.href.length - a.href.length)[0];

  const logout = async () => {
    await signOut();
    clearToken();
    toast.success("Signed out");
    router.push("/");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen bg-bg">
      {open && <div className="fixed inset-0 z-[55] bg-[#0e1330]/40 backdrop-blur-sm lg:hidden" onClick={() => setOpen(false)} aria-hidden="true" />}
      <aside
        aria-label="Dashboard menu"
        className={cn(
          "fixed inset-y-0 left-0 z-[60] flex w-[268px] flex-col gap-[21px] border-r border-line bg-surface px-4 py-[21px] transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:bg-surface/75 lg:backdrop-blur-xl",
          open ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-1">
          <Logo size="sm" />
          <button onClick={() => setOpen(false)} aria-label="Close menu" className="grid h-9 w-9 place-items-center rounded-[12px] border border-line lg:hidden">
            <X className="h-4 w-4" />
          </button>
        </div>
        <span className="px-3.5 text-xs font-bold tracking-[0.14em] text-muted uppercase">{role} dashboard</span>
        <nav className="flex flex-col gap-1">
          {items.map(({ label, href, icon: Icon }) => {
            const on = current?.href === href;
            return (
              <Link
                key={href}
                href={href}
                aria-current={on ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-[13px] px-3.5 py-3 text-[15px] transition",
                  on ? "bg-brand font-bold text-white shadow-[0_13px_21px_-13px_rgba(91,61,245,.9)]" : "text-muted hover:bg-brand-soft hover:text-brand"
                )}
              >
                <Icon className="h-[19px] w-[19px]" /> {label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto flex flex-col gap-1 border-t border-line pt-[13px]">
          <Link href="/" className="flex items-center gap-3 rounded-[13px] px-3.5 py-3 text-[15px] text-muted hover:bg-brand-soft hover:text-brand">
            <Home className="h-[19px] w-[19px]" /> Back to home
          </Link>
          <button onClick={logout} className="flex items-center gap-3 rounded-[13px] px-3.5 py-3 text-[15px] font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950">
            <LogOut className="h-[19px] w-[19px]" /> Sign out
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-line bg-bg/80 px-[21px] py-[13px] backdrop-blur-lg lg:px-[29px]">
          <div className="flex min-w-0 items-center gap-3">
            <button onClick={() => setOpen(true)} aria-label="Open menu" className="grid h-11 w-11 place-items-center rounded-[13px] border border-line bg-surface lg:hidden">
              <Menu className="h-5 w-5" />
            </button>
            <span className="truncate text-sm text-muted">
              Dashboard / <span className="font-bold text-ink">{current?.label ?? "Overview"}</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="hidden text-sm text-muted hover:text-brand sm:inline">
              ← Home
            </Link>
            <ThemeToggle />
            {user && (
              <>
                <span className="hidden flex-col items-end leading-tight md:flex">
                  <span className="text-sm font-bold">{user.name}</span>
                  <span className="text-xs text-muted">{user.email}</span>
                </span>
                <span className={cn("hidden rounded-full px-3 py-1 text-xs font-bold capitalize sm:inline-flex", ROLE_BADGE[role])}>{role}</span>
                <Avatar name={user.name} image={user.image} size={42} />
              </>
            )}
          </div>
        </header>
        <main className="flex w-full max-w-[1400px] flex-col gap-[29px] p-[21px] lg:p-[29px]">{children}</main>
      </div>
    </div>
  );
}
