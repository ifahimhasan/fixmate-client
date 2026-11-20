import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/providers";

export const metadata: Metadata = {
  title: { default: "FixMate - Repairs by verified technicians", template: "%s · FixMate" },
  description:
    "Book phone, laptop and home-appliance repairs from verified technicians, track every step of the job and pay only after it's done.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
