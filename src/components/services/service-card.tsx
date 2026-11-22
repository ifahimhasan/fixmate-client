import Link from "next/link";
import Image from "next/image";
import { MapPin, Star } from "lucide-react";
import type { Service } from "@/lib/types";
import { IMAGES } from "@/lib/images";
import { money } from "@/lib/utils";
import { Avatar } from "@/components/layout/navbar";

export default function ServiceCard({ service }: { service: Service }) {
  const img = service.image || IMAGES.category[service.category] || IMAGES.serviceFallback;
  return (
    <article className="glass lift group flex h-full flex-col rounded-[26px] p-2.5">
      <div className="relative aspect-[1.618/1] overflow-hidden rounded-[18px] bg-brand-soft">
        <Image
          src={img}
          alt={service.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span className="absolute left-2.5 top-2.5 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#0e1330] backdrop-blur">{service.category}</span>
        <span className="absolute bottom-2.5 left-2.5 rounded-full bg-[#0e1330]/80 px-3 py-1 text-xs font-bold text-white backdrop-blur">
          {service.serviceMode}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 px-2.5 pb-2.5 pt-4">
        <h3 className="line-clamp-2 min-h-[46px] text-[17px] font-bold leading-snug">{service.title}</h3>
        <div className="flex flex-col gap-1.5 text-[13px] text-muted">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-brand" />
            {service.serviceArea}
          </span>
          <span className="flex items-center gap-1.5">
            <Avatar name={service.technicianName} size={22} />
            <span className="font-bold text-ink">{service.technicianName}</span>
            {service.reviewCount ? (
              <span className="ml-auto flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                {service.averageRating?.toFixed(1)}
              </span>
            ) : (
              <span className="ml-auto text-xs">New</span>
            )}
          </span>
        </div>
        <div className="mt-auto flex items-center justify-between border-t border-line pt-3">
          <span className="flex flex-col">
            <span className="text-[11px] text-muted">Starting from</span>
            <span className="text-[22px] font-bold">{money(service.basePrice)}</span>
          </span>
          <Link href={`/services/${service._id}`} className="btn !px-3.5 !py-2.5 !text-[13px]">
            View details
          </Link>
        </div>
      </div>
    </article>
  );
}
