"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PageTitle } from "@/components/dashboard/ui";
import ServiceForm, { type ServiceInput } from "@/components/dashboard/service-form";
import { api } from "@/lib/api";

export default function AddService() {
  const router = useRouter();
  const create = async (data: ServiceInput) => {
    try {
      await api("/api/services", { method: "POST", body: data });
      toast.success("Service submitted!", { description: "It's waiting for admin approval before it goes live." });
      router.push("/dashboard/technician/my-services");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not add the service");
    }
  };
  return (
    <>
      <PageTitle title="Add a service" sub="New services stay pending until an admin approves them." />
      <div className="glass max-w-[760px] rounded-[29px] p-2.5">
        <div className="rounded-[21px] bg-surface p-6 sm:p-[29px]">
          <ServiceForm submitLabel="Submit for approval" onSubmit={create} />
        </div>
      </div>
    </>
  );
}
