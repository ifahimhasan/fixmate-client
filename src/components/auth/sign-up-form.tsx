"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, Eye, EyeOff, Smartphone, Wrench, X } from "lucide-react";
import { toast } from "sonner";
import AuthCard, { Divider, GoogleButton } from "./auth-card";
import { signIn, signUp } from "@/lib/auth-client";
import { DASHBOARD_HOME, type Role } from "@/lib/constants";
import { cn } from "@/lib/utils";

const RULES = [
  { label: "6+ characters", test: (p: string) => p.length >= 6 },
  { label: "Uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Lowercase letter", test: (p: string) => /[a-z]/.test(p) },
];

export default function SignUpForm({ googleEnabled }: { googleEnabled: boolean }) {
  const router = useRouter();
  const params = useSearchParams();
  const [role, setRole] = useState<Role>(params.get("role") === "technician" ? "technician" : "customer");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [show, setShow] = useState(false);
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);

  const errors = {
    name: form.name.trim().length < 2 ? "Enter your full name" : "",
    email: !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim()) ? "Enter a valid email address" : "",
    password: RULES.every((r) => r.test(form.password)) ? "" : "Password doesn't meet all the rules below",
  };
  const valid = !errors.name && !errors.email && !errors.password;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!valid) return;
    setLoading(true);
    const { error } = await signUp.email({
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
      role,
    });
    setLoading(false);
    if (error) {
      toast.error(error.code === "USER_ALREADY_EXISTS" || /exist/i.test(error.message || "") ? "An account with this email already exists" : error.message || "Sign up failed");
      return;
    }
    toast.success(`Welcome to FixMate, ${form.name.split(" ")[0]}!`);
    router.push(DASHBOARD_HOME[role]);
    router.refresh();
  };

  const google = async () => {
    await signIn.social({ provider: "google", callbackURL: "/dashboard/customer" });
  };

  const roleCard = (id: Role, title: string, text: string, Icon: typeof Smartphone) => {
    const on = role === id;
    return (
      <button
        type="button"
        onClick={() => setRole(id)}
        aria-pressed={on}
        className={cn(
          "flex flex-col gap-3 rounded-[18px] border-2 p-4 text-left transition",
          on ? "border-brand bg-brand-soft/50" : "border-line hover:border-line-strong"
        )}
      >
        <span className="flex items-center justify-between">
          <span className={cn("grid h-10 w-10 place-items-center rounded-[12px]", on ? "bg-brand text-white" : "bg-brand-soft text-brand")}>
            <Icon className="h-[19px] w-[19px]" />
          </span>
          <span className={cn("h-5 w-5 rounded-full border-2", on ? "border-brand bg-brand shadow-[inset_0_0_0_3px_var(--surface)]" : "border-line-strong")} />
        </span>
        <span className="flex flex-col gap-0.5">
          <span className="text-[15px] font-bold">{title}</span>
          <span className="text-[13px] text-muted">{text}</span>
        </span>
      </button>
    );
  };

  return (
    <AuthCard mode="up">
      <div className="flex flex-col gap-1.5">
        <h2 className="text-[28px] font-bold leading-tight">Create your account</h2>
        <p className="text-[15px] text-muted">It takes less than a minute.</p>
      </div>
      <form onSubmit={submit} noValidate className="flex flex-col gap-[18px]">
        <fieldset className="flex flex-col gap-2.5">
          <legend className="mb-2.5 text-[13px] font-bold">I want to…</legend>
          <div className="grid grid-cols-2 gap-2.5">
            {roleCard("customer", "Get things fixed", "Request & track repairs", Smartphone)}
            {roleCard("technician", "Offer repairs", "List services, take jobs", Wrench)}
          </div>
        </fieldset>
        <label className="label">
          Full name
          <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" placeholder="Your full name" />
          {touched && errors.name && <span className="field-error">{errors.name}</span>}
        </label>
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
              className={cn("input pr-12", touched && errors.password && "!border-red-400")}
              type={show ? "text" : "password"}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              autoComplete="new-password"
              placeholder="Create a password"
            />
            <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted hover:text-ink">
              {show ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
            </button>
          </div>
          <ul className="flex flex-wrap gap-2 pt-1">
            {RULES.map((r) => {
              const ok = r.test(form.password);
              return (
                <li
                  key={r.label}
                  className={cn(
                    "flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold",
                    ok ? "bg-mint-soft text-emerald-700 dark:text-emerald-300" : touched ? "bg-red-50 text-red-600 dark:bg-red-950" : "bg-surface-2 text-muted"
                  )}
                >
                  {ok ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />} {r.label}
                </li>
              );
            })}
          </ul>
          {touched && errors.password && <span className="field-error">{errors.password}</span>}
        </div>
        <button disabled={loading} className="btn mt-1 !py-4 !text-base">
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>
      {googleEnabled && (
        <>
          <Divider />
          <GoogleButton onClick={google} />
        </>
      )}
      <p className="text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-bold text-brand hover:underline">
          Sign in
        </Link>
      </p>
    </AuthCard>
  );
}
