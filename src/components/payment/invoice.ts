"use client";
import type { Payment } from "@/lib/types";

/** Generate and download a simple PDF invoice for a paid job (jsPDF). */
export async function downloadInvoice(p: Payment) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  doc.setFillColor(91, 61, 245);
  doc.rect(0, 0, W, 110, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.text("FixMate", 48, 64);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("Repair invoice", 48, 86);
  doc.text(`Invoice #${p._id.slice(-8).toUpperCase()}`, W - 48, 64, { align: "right" });
  doc.text(new Date(p.paidAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }), W - 48, 86, { align: "right" });

  doc.setTextColor(14, 19, 48);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Billed to", 48, 160);
  doc.text("Technician", W / 2, 160);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text([p.customerName, p.customerEmail], 48, 180);
  doc.text([p.technicianName, p.technicianEmail], W / 2, 180);

  doc.setFillColor(248, 247, 255);
  doc.rect(48, 240, W - 96, 32, "F");
  doc.setFont("helvetica", "bold");
  doc.text("Service", 60, 260);
  doc.text("Amount", W - 60, 260, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.text(p.serviceTitle, 60, 300);
  doc.text(`$${p.amount.toFixed(2)}`, W - 60, 300, { align: "right" });
  doc.setDrawColor(220, 215, 255);
  doc.line(48, 320, W - 48, 320);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Total paid", 60, 350);
  doc.text(`$${p.amount.toFixed(2)} ${p.currency.toUpperCase()}`, W - 60, 350, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(84, 91, 120);
  doc.text(`Transaction ID: ${p.transactionId}`, 48, 400);
  doc.text("Paid with Stripe (test mode). Thank you for choosing FixMate!", 48, 418);
  doc.save(`FixMate-invoice-${p._id.slice(-6)}.pdf`);
}
