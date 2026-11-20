"use client";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
      {children}
      <Toaster position="top-right" richColors closeButton toastOptions={{ style: { fontFamily: "var(--font-sans)" } }} />
    </ThemeProvider>
  );
}
