# FixMate - Smart Device & Home Appliance Repair Service Platform

FixMate connects customers with **verified technicians** for phone, laptop, AC, refrigerator, TV,
washing machine and electrical repairs. Every job has a **trackable status**, and the customer
**pays only after the job is completed** (Stripe test mode).

- **Live site:** `https://<your-client>.vercel.app`
- **Server repo / API:** `https://<your-server>.vercel.app` (see the server README)

## Demo accounts (created by `npm run seed`)
| Role | Email | Password |
|---|---|---|
| Admin | `admin@fixmate.com` | `Admin@123` |
| Technician | `tanvir@fixmate.com` | `Tech@123` |
| Technician | `mehedi@fixmate.com` / `sumaiya@fixmate.com` / `arif@fixmate.com` | `Tech@123` |
| Customer | `nabila@fixmate.com` | `Customer@123` |
| Customer | `sajid@fixmate.com` / `farzana@fixmate.com` | `Customer@123` |

Stripe test card: `4242 4242 4242 4242`, any future date, any CVC.

## Key features
- **Role-based platform** - Customer, Technician and Admin, each with its own dashboard and sidebar.
- **BetterAuth + MongoDB adapter** - email/password sign up with role selection (admin can never be chosen),
  live password rules, optional Google login, `role / phone / area / bio` as additional user fields.
- **JWT for the API** - `/api/token` turns the BetterAuth session into a JWT; the Express API protects every
  private route with `verifyToken`, `verifyCustomer`, `verifyTechnician`, `verifyAdmin` (401 / 403).
- **Browse services** - server-side search, category & mode filters, price/newest sort and pagination;
  filters live in the URL, so they survive reloads and `/services?category=AC` opens pre-filtered.
- **Repair requests** - validated request form (today-or-later date, 20+ character problem), duplicate active
  requests blocked, technicians/admins can't request.
- **Job status pipeline** - Requested → Accepted → In Progress → Completed (final amount) or Rejected / Cancelled,
  enforced on the server; visual **job timeline tracker** from `statusHistory`.
- **Pay after service** - Stripe Checkout for completed + unpaid jobs only, success-page verification **and**
  webhook, never saved twice; **PDF invoice** download.
- **Rating & review** after payment, average rating on service cards and details.
- **Technician tools** - add services with ImgBB image upload, full CRUD, availability toggle, manage requests.
- **Admin tools** - approve/reject services, change user roles (not their own), all bookings, transactions + revenue.
- **Dashboards with charts** (Recharts), reusable stats cards, consistent status badge colours.
- **Polish** - Circuit Bloom design (Monda font, glassmorphism, golden-ratio spacing), GSAP + ScrollTrigger
  animations, marquee, dark/light mode, skeleton loaders, empty states, confirmation modals, toasts,
  custom 404 + error page, fully responsive.

## Pages
`/`, `/services`, `/services/[id]`, `/about`, `/sign-up`, `/sign-in`, `/payment/success`, `/payment/cancel`,
`/dashboard/customer` (+ `/bookings`, `/payments`), `/dashboard/technician` (+ `/add-service`, `/my-services`, `/requests`),
`/dashboard/admin` (+ `/users`, `/services`, `/bookings`, `/transactions`), `/dashboard/profile`, 404.

## npm packages
| Package | Used for |
|---|---|
| `next`, `react`, `react-dom` | Next.js 16 App Router |
| `tailwindcss`, `@tailwindcss/turbopack` | Styling (Tailwind v4) |
| `better-auth`, `mongodb` | Authentication with the MongoDB adapter |
| `jsonwebtoken` | Signing the API JWT in `/api/token` |
| `@headlessui/react` | Accessible modals, menus, FAQ disclosure |
| `sonner` | Toast notifications |
| `recharts` | Dashboard charts |
| `gsap`, `@gsap/react` | Animations and ScrollTrigger reveals |
| `lucide-react` | Icons |
| `next-themes` | Dark / light mode |
| `jspdf` | PDF invoices |
| `clsx` | Class names |
| `@fontsource-variable/monda` | Monda font (self-hosted) |
| `tsx` (dev) | Running the seed script |

## Images
All static images are in `src/lib/images.ts` (Unsplash photos, free under the Unsplash License).
To use your own: put the file in `public/images/` and change the URL to `/images/<file>.jpg`.
Service images come from technicians' ImgBB uploads.

## Run locally
```bash
cp .env.example .env.local   # fill in the values (JWT_SECRET must match the server)
npm install
npm run seed                 # optional demo data
npm run dev                  # http://localhost:3000
```

## Deploy (Vercel)
1. Import the repo in Vercel (framework: Next.js) and add every variable from `.env.example`.
2. Set `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` to the production URL (they are BetterAuth trusted origins).
3. Set `NEXT_PUBLIC_API_URL` to the deployed server URL, and add this client URL to the server's `CLIENT_URLS` / `CLIENT_URL`.
4. Optional Google login: add `https://<client>/api/auth/callback/google` as a redirect URI in Google Cloud.
