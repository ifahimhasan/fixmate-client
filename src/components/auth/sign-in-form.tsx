"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import AuthCard, { Divider, GoogleButton } from "./auth-card";
import { authClient, signIn } from "@/lib/auth-client";
import { DASHBOARD_HOME, type Role } from "@/lib/constants";

/** Only allow same-site relative redirects. */
function safeRedirect(r: string | null) {
  return r && r.startsWith("/") && !r.startsWith("//") ? r : null;
}

export default function SignInForm({ googleEnabled }: { googleEnabled: boolean }) {
  const router = useRouter();
  const params = useSearchParams();
  const redirectTo = safeRedirect(params.get("redirect"));
  const [form, setForm] = useState({ email: "", password: "" });
  const [show, setShow] = useState(false);
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);

  const errors = {
    email: !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim()) ? "Enter a valid email address" : "",
    password: !form.password ? "Enter your password" : "",
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (errors.email || errors.password) return;
    setLoading(true);
    const { error } = await signIn.email({ email: form.email.trim().toLowerCase(), password: form.password });
    if (error) {
      setLoading(false);
      toast.error(error.status === 401 || /invalid/i.test(error.message || "") ? "Wrong email or password" : error.message || "Sign in failed");
      return;
    }
    const { data } = await authClient.getSession();
    const role = ((data?.user as { role?: Role } | undefined)?.role || "customer") as Role;
    toast.success(`Welcome back, ${data?.user.name?.split(" ")[0] || "there"}!`);
    router.push(redirectTo || DASHBOARD_HOME[role]);
    router.refresh();
  };

  const google = async () => {
    await signIn.social({ provider: "google", callbackURL: redirectTo || "/dashboard/customer" });
  };

  return (
    <AuthCard mode="in">
      <div className="flex flex-col gap-1.5">
        <h2 className="text-[28px] font-bold leading-tight">Welcome back</h2>
        <p className="text-[15px] text-muted">{redirectTo ? "Sign in to continue where you left off." : "Sign in to your FixMate account."}</p>
      </div>
      <form onSubmit={submit} noValidate className="flex flex-col gap-[18px]">
        <label className="label">
          Email
          <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" placeholder="you@example.com" />
          {touched && errors.email && <span className="field-error">{errors.email}</span>}
        </label>
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-[13px] font-bold">Password</label>
          <div className="relative">
            <input
              id="password"
              className="input pr-12"
              type={show ? "text" : "password"}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              autoComplete="current-password"
              placeholder="Your password"
            />
            <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted hover:text-ink">
              {show ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
            </button>
          </div>
          {touched && errors.password && <span className="field-error">{errors.password}</span>}
        </div>
        <button disabled={loading} className="btn mt-1 !py-4 !text-base">
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
      {googleEnabled && (
        <>
          <Divider />
          <GoogleButton onClick={google} />
        </>
      )}
      <p className="text-center text-sm text-muted">
        New to FixMate?{" "}
        <Link href="/sign-up" className="font-bold text-brand hover:underline">
          Create an account
        </Link>
      </p>
    </AuthCard>
  );
}
