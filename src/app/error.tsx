"use client";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="container-x flex min-h-[70vh] flex-col items-center justify-center gap-5 py-16 text-center">
      <span className="grid h-20 w-20 place-items-center rounded-[26px] bg-red-50 text-red-500 dark:bg-red-950"><AlertTriangle className="h-10 w-10" /></span>
      <h1 className="text-3xl font-bold">Something went wrong</h1>
      <p className="max-w-md text-muted">{error.message || "An unexpected error happened while loading this page."}</p>
      <div className="flex gap-2.5">
        <button onClick={reset} className="btn">Try again</button>
        <Link href="/" className="btn-outline">Go home</Link>
      </div>
    </main>
  );
}
