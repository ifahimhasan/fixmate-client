import Link from "next/link";

export default function AuthCard({ mode, children }: { mode: "in" | "up"; children: React.ReactNode }) {
  return (
    <div className="glass w-full max-w-[470px] rounded-[34px] p-2.5">
      <div className="flex flex-col gap-[26px] rounded-[26px] bg-surface p-6 sm:p-[34px]">
        <div role="tablist" className="grid grid-cols-2 rounded-[16px] bg-brand-soft p-1.5">
          <Link
            href="/sign-up"
            role="tab"
            aria-selected={mode === "up"}
            className={`rounded-[12px] py-3 text-center text-[15px] font-bold transition ${mode === "up" ? "bg-surface text-brand shadow-[0_5px_13px_-5px_rgba(46,38,140,.3)]" : "text-muted hover:text-ink"}`}
          >
            Sign up
          </Link>
          <Link
            href="/sign-in"
            role="tab"
            aria-selected={mode === "in"}
            className={`rounded-[12px] py-3 text-center text-[15px] font-bold transition ${mode === "in" ? "bg-surface text-brand shadow-[0_5px_13px_-5px_rgba(46,38,140,.3)]" : "text-muted hover:text-ink"}`}
          >
            Sign in
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}

export function GoogleButton({ onClick, loading }: { onClick: () => void; loading?: boolean }) {
  return (
    <button type="button" onClick={onClick} disabled={loading} className="btn-outline w-full !py-3.5">
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#4285F4" d="M22 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.6a4.8 4.8 0 0 1-2.1 3.1v2.6h3.4c2-1.8 3.1-4.5 3.1-7.6z" />
        <path fill="#34A853" d="M12 22c2.8 0 5.2-.9 6.9-2.5l-3.4-2.6c-.9.6-2.1 1-3.5 1-2.7 0-5-1.8-5.8-4.3H2.7v2.7A10 10 0 0 0 12 22z" />
        <path fill="#FBBC05" d="M6.2 13.6a6 6 0 0 1 0-3.8V7.1H2.7a10 10 0 0 0 0 9.2z" />
        <path fill="#EA4335" d="M12 5.9c1.5 0 2.9.5 4 1.5l3-3A10 10 0 0 0 2.7 7.1l3.5 2.7C7 7.7 9.3 5.9 12 5.9z" />
      </svg>
      Continue with Google
    </button>
  );
}

export function Divider() {
  return (
    <div className="flex items-center gap-3 text-[13px] text-muted">
      <span className="h-px flex-1 bg-line" />
      or
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}
