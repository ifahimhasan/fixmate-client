"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDown, LayoutDashboard, LogOut, Menu as MenuIcon, UserRound, X } from "lucide-react";
import { toast } from "sonner";
import Logo from "@/components/ui/logo";
import ThemeToggle from "@/components/ui/theme-toggle";
import { signOut, useSession } from "@/lib/auth-client";
import { clearToken } from "@/lib/api";
import { DASHBOARD_HOME, type Role } from "@/lib/constants";
import { cn, initials } from "@/lib/utils";
import { PEOPLE } from "@/lib/images";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
];

export function Avatar({ name, image, size = 38 }: { name: string; image?: string | null; size?: number }) {
  const src = image || PEOPLE[name];
  return src ? (
    <Image src={src} alt={name} width={size} height={size} className="shrink-0 rounded-full object-cover" style={{ width: size, height: size }} />
  ) : (
    <span className="grid place-items-center rounded-full bg-brand-soft text-[13px] font-bold text-brand" style={{ width: size, height: size }}>
      {initials(name)}
    </span>
  );
}

export const ROLE_BADGE: Record<Role, string> = {
  customer: "bg-brand-soft text-brand",
  technician: "bg-mint-soft text-emerald-700 dark:text-emerald-300",
  admin: "bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
};

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => setOpen(false), [pathname]);

  const user = session?.user as { name: string; email: string; image?: string | null; role?: string } | undefined;
  const role = (user?.role as Role) || "customer";
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  const handleSignOut = async () => {
    await signOut();
    clearToken();
    toast.success("Signed out. See you soon!");
    router.push("/");
    router.refresh();
  };

  return (
    <header className={cn("sticky top-0 z-50 px-[21px] transition-all duration-300", scrolled ? "py-2" : "py-[13px]")}>
      <div
        className={cn(
          "glass mx-auto flex max-w-[1240px] items-center justify-between gap-3 rounded-[21px] py-2.5 pl-[21px] pr-[13px] transition-shadow",
          scrolled && "shadow-[0_21px_34px_-18px_rgba(46,38,140,.35)]"
        )}
      >
        <Logo />
        <nav aria-label="Main" className="hidden items-center gap-1 rounded-full bg-brand-soft/70 p-1 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href) ? "page" : undefined}
              className={cn(
                "rounded-full px-[21px] py-2.5 text-[15px] transition",
                isActive(l.href) ? "bg-surface font-bold text-brand shadow-[0_5px_13px_-5px_rgba(46,38,140,.3)]" : "text-ink hover:text-brand"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle className="hidden sm:grid" />
          {isPending ? (
            <span className="h-11 w-24 animate-pulse rounded-[13px] bg-line" />
          ) : user ? (
            <Menu as="div" className="relative">
              <MenuButton className="flex items-center gap-2 rounded-full border border-line bg-surface py-1 pl-1 pr-2.5" aria-label="Open account menu">
                <Avatar name={user.name} image={user.image} />
                <ChevronDown className="h-4 w-4 text-muted" />
              </MenuButton>
              <MenuItems
                anchor="bottom end"
                className="glass z-[60] mt-2 w-[260px] rounded-[21px] !bg-surface/95 p-2 focus:outline-none"
              >
                <div className="flex flex-col gap-1 border-b border-line px-3 pb-3 pt-2">
                  <span className="font-bold">{user.name}</span>
                  <span className="truncate text-[13px] text-muted">{user.email}</span>
                  <span className={cn("mt-1.5 self-start rounded-full px-3 py-1 text-xs font-bold capitalize", ROLE_BADGE[role])}>{role}</span>
                </div>
                <MenuItem>
                  <Link href={DASHBOARD_HOME[role]} className="flex items-center gap-2.5 rounded-[13px] px-3 py-2.5 text-sm data-[focus]:bg-brand-soft data-[focus]:text-brand">
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link href="/dashboard/profile" className="flex items-center gap-2.5 rounded-[13px] px-3 py-2.5 text-sm data-[focus]:bg-brand-soft data-[focus]:text-brand">
                    <UserRound className="h-4 w-4" /> Update profile
                  </Link>
                </MenuItem>
                <MenuItem>
                  <button onClick={handleSignOut} className="flex w-full items-center gap-2.5 rounded-[13px] px-3 py-2.5 text-sm font-bold text-red-600 data-[focus]:bg-red-50 dark:data-[focus]:bg-red-950">
                    <LogOut className="h-4 w-4" /> Sign out
                  </button>
                </MenuItem>
              </MenuItems>
            </Menu>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link href="/sign-in" className="rounded-[13px] px-[18px] py-2.5 text-[15px] font-bold hover:text-brand">
                Sign in
              </Link>
              <Link href="/sign-up" className="btn !py-2.5">
                Sign up
              </Link>
            </div>
          )}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="grid h-11 w-11 place-items-center rounded-[13px] border border-line bg-surface md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="glass mx-auto mt-2 flex max-w-[1240px] flex-col gap-1 rounded-[21px] p-3 md:hidden">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className={cn("rounded-[13px] px-4 py-3", isActive(l.href) ? "bg-brand-soft font-bold text-brand" : "")}>
              {l.label}
            </Link>
          ))}
          <div className="flex items-center gap-2 pt-2">
            <ThemeToggle />
            {!user && (
              <>
                <Link href="/sign-in" className="btn-outline flex-1">
                  Sign in
                </Link>
                <Link href="/sign-up" className="btn flex-1">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
