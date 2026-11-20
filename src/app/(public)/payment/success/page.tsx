import { Suspense } from "react";
import type { Metadata } from "next";
import PaymentSuccess from "@/components/payment/payment-success";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "Payment received" };

export default function PaymentSuccessPage() {
  return (
    <section className="container-x flex justify-center pb-[89px] pt-[55px]">
      <Suspense fallback={<Skeleton className="h-[480px] w-full max-w-[560px] rounded-[29px]" />}>
        <PaymentSuccess />
      </Suspense>
    </section>
  );
}
