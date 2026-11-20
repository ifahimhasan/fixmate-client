"use client";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { Plus } from "lucide-react";

const FAQ = [
  ["When do I pay?", "Only after the technician marks your job completed and sets the final amount. Then a Pay Now button appears in My Bookings and you pay securely with Stripe."],
  ["Can I cancel a request?", "Yes - while the job is still “Requested”. Once a technician accepts it, the job moves forward step by step."],
  ["How are technicians verified?", "Technicians create an account and add services. Every service stays pending until an admin reviews and approves it."],
  ["Can I leave a review?", "After a booking is paid you can rate it from 1 to 5 stars and write a short review. Ratings show on the service page."],
];

export default function Faq() {
  return (
    <div className="flex flex-col gap-[13px]">
      {FAQ.map(([q, a], i) => (
        <Disclosure key={q} as="div" defaultOpen={i === 0} className="glass overflow-hidden rounded-[21px]">
          <DisclosureButton className="group flex w-full items-center justify-between gap-3 px-[26px] py-[21px] text-left text-[17px] font-bold">
            {q}
            <span className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full bg-brand-soft text-brand transition group-data-[open]:rotate-45 group-data-[open]:bg-brand group-data-[open]:text-white">
              <Plus className="h-4 w-4" />
            </span>
          </DisclosureButton>
          <DisclosurePanel className="px-[26px] pb-[21px] text-[15px] leading-[1.618] text-muted">{a}</DisclosurePanel>
        </Disclosure>
      ))}
    </div>
  );
}
