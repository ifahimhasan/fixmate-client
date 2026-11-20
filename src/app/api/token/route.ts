import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getServerSession, roleOf } from "@/lib/session";

/**
 * GET /api/token - exchanges the BetterAuth session for a short-lived JWT that
 * the Express API verifies with the shared JWT_SECRET (verifyToken middleware).
 */
export async function GET() {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const secret = process.env.JWT_SECRET;
  if (!secret) return NextResponse.json({ message: "JWT_SECRET is not configured" }, { status: 500 });

  const expiresIn = 60 * 60 * 2; // 2 hours
  const token = jwt.sign({ email: session.user.email.toLowerCase(), role: roleOf(session), name: session.user.name }, secret, {
    expiresIn,
    subject: session.user.id,
  });
  return NextResponse.json({ token, expiresAt: Date.now() + expiresIn * 1000 }, { headers: { "Cache-Control": "no-store" } });
}
