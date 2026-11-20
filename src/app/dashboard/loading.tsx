import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-[29px]" role="status" aria-label="Loading">
      <Skeleton className="h-10 w-72" />
      <div className="grid gap-[21px] sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[132px] rounded-[21px]" />
        ))}
      </div>
      <Skeleton className="h-[320px] rounded-[26px]" />
    </div>
  );
}
