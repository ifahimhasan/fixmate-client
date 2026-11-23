# FixMate - Smart Device & Home Appliance Repair Platform

FixMate connects customers with **verified technicians** for smartphone, laptop, AC, refrigerator, TV,
washing machine and electrical repairs. A customer sends a repair request, follows the job on a live
status timeline, and **pays online only after the job is completed**.

| | |
|---|---|
| **Live site** | https://fixmate-client-xi.vercel.app |
| **Live API** | https://fixmate-server-rho.vercel.app |
| **Server repo** | https://github.com/ifahimhasan/fixmate-server |

---

## Demo accounts

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@fixmate.com` | `Admin@123` |
| Technician | `tanvir@fixmate.com` | `Tech@123` |
| Technician | `mehedi@fixmate.com`, `sumaiya@fixmate.com`, `arif@fixmate.com` | `Tech@123` |
| Customer | `nabila@fixmate.com` | `Customer@123` |
| Customer | `sajid@fixmate.com`, `farzana@fixmate.com` | `Customer@123` |

**Stripe test card:** `4242 4242 4242 4242` · any future date · any CVC · any ZIP

The demo data includes approved services from every technician and bookings in every status
(requested, accepted, in progress, completed, paid, cancelled, rejected), so each flow can be checked right away.

---

## How it works

1. **Sign up** as a Customer or Technician (Admin is created only by the seed script).
2. **Technician** adds a repair service with an image (ImgBB). It stays **pending** until an admin approves it.
3. **Admin** approves or rejects the service. Only approved and available services appear publicly.
4. **Customer** opens a service and sends a repair request with a preferred date, address and problem details.
5. **Technician** accepts the job, starts work and marks it completed with the final amount.
6. **Customer** pays through Stripe Checkout, downloads a PDF invoice and leaves a rating & review.

---

## Key features

**Authentication & roles**
- BetterAuth with the MongoDB adapter, email & password login, optional Google login
- Role selection on sign up (Customer / Technician); admin can never be chosen, checked on the server too
- Live password rules (6+ characters, one uppercase, one lowercase) shown under the field
- `role`, `phone`, `area`, `bio` stored as BetterAuth additional fields
- Protected dashboards: logged-out users go to Sign In and come back after login, wrong role goes to its own dashboard
- No logout on page reload of any private route

**Customer**
- Browse services with **server-side** search, category & mode filters, sort and pagination
- Filters stay in the URL, so they survive a reload and `/services?category=AC` opens pre-filtered
- Repair request form with validation and duplicate-request protection
- My bookings with a visual **job timeline tracker** (Requested → Accepted → In Progress → Completed → Paid)
- Cancel a pending request, pay after completion, download a **PDF invoice**, payment history
- **Rating & review** after payment, average rating shown on cards and details

**Technician**
- Add, edit and delete services with ImgBB image upload (edits go back to pending)
- Availability toggle
- Manage requests: accept, reject, start work, mark completed with the final amount
- Overview with earnings and job charts

**Admin**
- Approve or reject services, pending shown first
- Manage users and change roles (never their own)
- All bookings with a status filter, all transactions and revenue charts

**UI & experience**
- Modern responsive design with the Monda font, glassmorphism cards and golden-ratio spacing
- GSAP + ScrollTrigger animations, marquee, dark / light mode
- Toasts for every action, confirmation modals, skeleton loaders, empty states
- Custom 404 and error pages

---

## Pages

| Area | Routes |
|---|---|
| Public | `/`, `/services`, `/services/[id]`, `/about` |
| Auth | `/sign-in`, `/sign-up` |
| Payment | `/payment/success`, `/payment/cancel` |
| Customer | `/dashboard/customer`, `/dashboard/customer/bookings`, `/dashboard/customer/payments` |
| Technician | `/dashboard/technician`, `/dashboard/technician/add-service`, `/dashboard/technician/my-services`, `/dashboard/technician/requests` |
| Admin | `/dashboard/admin`, `/dashboard/admin/users`, `/dashboard/admin/services`, `/dashboard/admin/bookings`, `/dashboard/admin/transactions` |
| Shared | `/dashboard/profile` |

---

## Tech stack

| Area | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack), React 19, TypeScript |
| Styling | Tailwind CSS v4, Headless UI |
| Auth | BetterAuth + MongoDB adapter, JWT for the Express API |
| Backend | Express 5 API (separate repo), MongoDB |
| Payments & media | Stripe Checkout (test mode), ImgBB |
| Hosting | Vercel |

## npm packages

| Package | Used for |
|---|---|
| `next`, `react`, `react-dom` | Next.js App Router |
| `tailwindcss`, `@tailwindcss/turbopack` | Styling |
| `better-auth`, `mongodb` | Authentication with the MongoDB adapter |
| `jsonwebtoken` | Signing the API token in `/api/token` |
| `@headlessui/react` | Modals, menus and FAQ |
| `sonner` | Toast notifications |
| `recharts` | Dashboard charts |
| `gsap`, `@gsap/react` | Animations and scroll reveals |
| `lucide-react` | Icons |
| `next-themes` | Dark / light mode |
| `jspdf` | PDF invoices |
| `clsx` | Conditional class names |
| `@fontsource-variable/monda` | Monda font |
| `server-only` | Keeping server code out of the browser |
| `tsx` (dev) | Running the seed script |

---

## Environment variables

Create `.env.local` from `.env.example`:

| Variable | Description |
|---|---|
| `BETTER_AUTH_SECRET` | Random secret for BetterAuth |
| `BETTER_AUTH_URL` | Client URL (`http://localhost:3000` locally) |
| `NEXT_PUBLIC_APP_URL` | Client URL |
| `MONGODB_URI` | MongoDB connection string (same as the server) |
| `DB_NAME` | Database name (`fixmate`) |
| `JWT_SECRET` | Must be the same as the server's `JWT_SECRET` |
| `NEXT_PUBLIC_API_URL` | Server URL (`http://localhost:5000` locally) |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Optional, for Google login |

## Run locally

```bash
git clone https://github.com/ifahimhasan/fixmate-client.git
cd fixmate-client
npm install
cp .env.example .env.local   # fill in the values
npm run seed                 # demo users, services, bookings and payments
npm run dev                  # http://localhost:3000
```

The server must be running too (see the server repo).

## Images

All site images live in `src/lib/images.ts` (free Unsplash photos). To use your own, put the file in
`public/images/` and change the URL to `/images/<file-name>.jpg`. Service images come from the
technicians' ImgBB uploads.
