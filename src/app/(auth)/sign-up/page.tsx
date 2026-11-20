import { Suspense } from "react";
import type { Metadata } from "next";
import SignUpForm from "@/components/auth/sign-up-form";

export const metadata: Metadata = { title: "Sign up" };

export default function SignUpPage() {
  return (
    <Suspense>
      <SignUpForm googleEnabled={!!process.env.GOOGLE_CLIENT_ID} />
    </Suspense>
  );
}
