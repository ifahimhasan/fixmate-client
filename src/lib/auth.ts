import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { createAuthMiddleware, APIError } from "better-auth/api";
import { db, mongoClient } from "./db";

const appUrl = (process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");

const trustedOrigins = Array.from(
  new Set([appUrl, process.env.NEXT_PUBLIC_APP_URL || "", "http://localhost:3000"].map((u) => u.replace(/\/$/, "")).filter(Boolean))
);

const ALLOWED_SIGNUP_ROLES = ["customer", "technician"];

export const auth = betterAuth({
  baseURL: appUrl,
  secret: process.env.BETTER_AUTH_SECRET,
  database: mongodbAdapter(db, { client: mongoClient }),
  trustedOrigins,
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    autoSignIn: true,
  },
  socialProviders:
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        }
      : undefined,
  user: {
    // Extra fields on BetterAuth's user collection (= our `users` collection)
    additionalFields: {
      role: { type: "string", required: false, defaultValue: "customer", input: true },
      phone: { type: "string", required: false, defaultValue: "", input: false },
      area: { type: "string", required: false, defaultValue: "", input: false },
      bio: { type: "string", required: false, defaultValue: "", input: false },
    },
  },
  databaseHooks: {
    user: {
      create: {
        // Nobody can sign up as admin: anything other than customer/technician → customer
        before: async (user) => {
          const requested = String(user.role ?? "");
          const role = ALLOWED_SIGNUP_ROLES.includes(requested) ? requested : "customer";
          return { data: { ...user, role } };
        },
      },
    },
  },
  hooks: {
    // Server-side password rules (min 6, one uppercase, one lowercase)
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== "/sign-up/email") return;
      const password = String(ctx.body?.password || "");
      if (password.length < 6 || !/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
        throw new APIError("BAD_REQUEST", {
          message: "Password must be at least 6 characters with one uppercase and one lowercase letter",
        });
      }
    }),
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
