import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip">
      <div aria-hidden="true" className="pointer-events-none absolute -left-36 -top-36 h-[610px] w-[610px] rounded-full bg-[radial-gradient(circle,rgba(124,92,255,.28),transparent_68%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-36 top-8 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,.22),transparent_68%)]" />
      <Navbar />
      <main className="relative flex-1">{children}</main>
      <Footer />
    </div>
  );
}
