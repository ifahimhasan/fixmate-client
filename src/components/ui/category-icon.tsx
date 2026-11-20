import { AirVent, Laptop, Refrigerator, Smartphone, Tv, WashingMachine, Zap, type LucideIcon } from "lucide-react";

export const CATEGORY_ICON: Record<string, LucideIcon> = {
  Smartphone: Smartphone,
  "Laptop & PC": Laptop,
  AC: AirVent,
  Refrigerator: Refrigerator,
  TV: Tv,
  "Washing Machine": WashingMachine,
  Electrical: Zap,
};

export default function CategoryIcon({ category, className }: { category: string; className?: string }) {
  const Icon = CATEGORY_ICON[category] ?? Smartphone;
  return <Icon className={className} />;
}
