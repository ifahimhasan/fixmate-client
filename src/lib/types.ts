import type { BookingStatus, Role } from "./constants";

export interface Service {
  _id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  basePrice: number;
  estimatedDuration: string;
  serviceMode: "Home Visit" | "Shop Drop-off";
  serviceArea: string;
  technicianName: string;
  technicianEmail: string;
  approvalStatus: "pending" | "approved" | "rejected";
  isAvailable: boolean;
  createdAt: string;
  averageRating?: number;
  reviewCount?: number;
}

export interface ServiceDetails extends Service {
  technician: { name: string; email: string; image?: string; area?: string; bio?: string };
  reviews: { _id: string; customerName: string; rating: number; review?: string; reviewedAt: string }[];
}

export interface StatusEvent {
  status: BookingStatus | "paid";
  changedAt: string;
}

export interface Booking {
  _id: string;
  serviceId: string;
  serviceTitle: string;
  serviceImage: string;
  category: string;
  basePrice: number;
  technicianName: string;
  technicianEmail: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  preferredDate: string;
  problemDescription: string;
  status: BookingStatus;
  finalAmount: number;
  paymentStatus: "unpaid" | "paid";
  statusHistory?: StatusEvent[];
  rating?: number;
  review?: string;
  createdAt: string;
}

export interface Payment {
  _id: string;
  bookingId: string;
  serviceTitle: string;
  customerName: string;
  customerEmail: string;
  technicianName: string;
  technicianEmail: string;
  amount: number;
  currency: string;
  transactionId: string;
  stripeSessionId: string;
  paymentStatus: "paid";
  paidAt: string;
}

export interface AppUser {
  _id: string;
  id?: string;
  name: string;
  email: string;
  image?: string | null;
  role: Role;
  phone?: string;
  area?: string;
  bio?: string;
  createdAt?: string;
}
