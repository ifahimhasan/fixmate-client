import Link from "next/link";
import { Wrench } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="container-x flex flex-1 flex-col items-center gap-[21px] py-[55px] text-center">
        <div className="relative flex h-[300px] w-full max-w-[640px] items-center justify-center">
          <span aria-hidden="true" className="select-none text-[clamp(140px,26vw,260px)] font-bold leading-none tracking-[-0.05em] text-transparent [-webkit-text-stroke:2px_#cfc7ff]">404</span>
          <span className="glass absolute grid h-36 w-36 place-items-center rounded-[42px] text-brand">
            <Wrench className="h-16 w-16" strokeWidth={1.6} />
          </span>
        </div>
        <h1 className="text-[clamp(32px,4.5vw,46px)] font-bold leading-tight tracking-tight">This page is out for repair</h1>
        <p className="max-w-[480px] text-[17px] leading-[1.618] text-muted">The link may be broken, or the service you&apos;re looking for is no longer available.</p>
        <div className="flex flex-wrap justify-center gap-2.5">
          <Link href="/" className="btn">Back to Home</Link>
          <Link href="/services" className="btn-outline">Browse services</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
