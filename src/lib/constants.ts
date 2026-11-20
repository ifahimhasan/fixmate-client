export const CATEGORIES = [
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
] as const;
export type Category = (typeof CATEGORIES)[number];

export const SERVICE_MODES = ["Home Visit", "Shop Drop-off"] as const;

export type Role = "customer" | "technician" | "admin";

export const DASHBOARD_HOME: Record<Role, string> = {
  customer: "/dashboard/customer",
  technician: "/dashboard/technician",
  admin: "/dashboard/admin",
};

export type BookingStatus = "requested" | "accepted" | "rejected" | "in-progress" | "completed" | "cancelled";

/** Same badge colours on every dashboard (requirement). */
export const STATUS_STYLE: Record<BookingStatus, { label: string; className: string }> = {
  requested: { label: "Requested", className: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300" },
  accepted: { label: "Accepted", className: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300" },
  "in-progress": { label: "In progress", className: "bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300" },
  completed: { label: "Completed", className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" },
  rejected: { label: "Rejected", className: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300" },
  cancelled: { label: "Cancelled", className: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300" },
};

/** Tint + icon colour per category (used for chips and icon tiles). */
export const CATEGORY_STYLE: Record<Category, { bg: string; fg: string }> = {
  Smartphone: { bg: "bg-violet-50 dark:bg-violet-950/60", fg: "text-violet-600 dark:text-violet-300" },
  "Laptop & PC": { bg: "bg-sky-50 dark:bg-sky-950/60", fg: "text-sky-700 dark:text-sky-300" },
  AC: { bg: "bg-emerald-50 dark:bg-emerald-950/60", fg: "text-emerald-700 dark:text-emerald-300" },
  Refrigerator: { bg: "bg-cyan-50 dark:bg-cyan-950/60", fg: "text-cyan-700 dark:text-cyan-300" },
  TV: { bg: "bg-orange-50 dark:bg-orange-950/60", fg: "text-orange-700 dark:text-orange-300" },
  "Washing Machine": { bg: "bg-amber-50 dark:bg-amber-950/60", fg: "text-amber-700 dark:text-amber-300" },
  Electrical: { bg: "bg-pink-50 dark:bg-pink-950/60", fg: "text-pink-700 dark:text-pink-300" },
};

export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
