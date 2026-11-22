/**
 * FixMate demo seed - run once against your database:
 *   npm run seed            (reads .env.local: MONGODB_URI, DB_NAME)
 *
 * Creates (or recreates) demo accounts, 14 approved services across all
 * categories, a few pending/rejected ones, bookings in every status, payments
 * for paid jobs and some reviews. Safe to run again: it only replaces demo data.
 */
import { MongoClient, ObjectId } from "mongodb";
import { hashPassword } from "better-auth/crypto";
import { PEOPLE } from "../src/lib/images";

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || "fixmate";
if (!uri) throw new Error("MONGODB_URI missing - create .env.local first");

const img = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=80`;
const day = 24 * 60 * 60 * 1000;
const ago = (d: number) => new Date(Date.now() - d * day);
const ahead = (d: number) => new Date(Date.now() + d * day);

type U = { name: string; email: string; password: string; role: "admin" | "technician" | "customer"; phone: string; area: string; bio: string };

export const USERS: U[] = [
  { name: "FixMate Admin", email: "admin@fixmate.com", password: "Admin@123", role: "admin", phone: "01700-000000", area: "Gulshan, Dhaka", bio: "Platform administrator." },
  { name: "Tanvir Alam", email: "tanvir@fixmate.com", password: "Tech@123", role: "technician", phone: "01819-330021", area: "Dhanmondi, Dhaka", bio: "Phone and tablet technician with 6 years of experience. Specialises in screen, battery and charging-port repairs, plus home electrical work." },
  { name: "Mehedi Hasan", email: "mehedi@fixmate.com", password: "Tech@123", role: "technician", phone: "01712-448899", area: "Farmgate, Dhaka", bio: "Laptop, PC and Smart TV technician. Board-level diagnosis, cleaning and part replacement." },
  { name: "Sumaiya Akter", email: "sumaiya@fixmate.com", password: "Tech@123", role: "technician", phone: "01911-765432", area: "Gulshan, Dhaka", bio: "Certified AC and washing machine technician. Home visits across Gulshan, Banani and Baridhara." },
  { name: "Arif Chowdhury", email: "arif@fixmate.com", password: "Tech@123", role: "technician", phone: "01555-102030", area: "Mohammadpur, Dhaka", bio: "Refrigerator and home appliance specialist - cooling problems, compressor relays and gas refills." },
  { name: "Nabila Rahman", email: "nabila@fixmate.com", password: "Customer@123", role: "customer", phone: "01711-204455", area: "Dhanmondi, Dhaka", bio: "" },
  { name: "Sajid Karim", email: "sajid@fixmate.com", password: "Customer@123", role: "customer", phone: "01922-118833", area: "Uttara, Dhaka", bio: "" },
  { name: "Farzana Islam", email: "farzana@fixmate.com", password: "Customer@123", role: "customer", phone: "01818-650077", area: "Lalmatia, Dhaka", bio: "" },
];

type S = { key: string; title: string; category: string; description: string; image: string; basePrice: number; estimatedDuration: string; serviceMode: "Home Visit" | "Shop Drop-off"; serviceArea: string; tech: string; approvalStatus?: string; daysAgo: number };

const SERVICES: S[] = [
  { key: "iphone", title: "iPhone Screen Replacement (OEM grade)", category: "Smartphone", image: img("1550041473-d296a3a8a18a"), basePrice: 45, estimatedDuration: "2-3 hours", serviceMode: "Shop Drop-off", serviceArea: "Dhanmondi, Dhaka", tech: "tanvir@fixmate.com", daysAgo: 2, description: "Cracked or unresponsive display replaced with an OEM-grade panel. Free diagnosis before any work. Face ID and True Tone tested before handover. 30-day warranty on the part." },
  { key: "port", title: "Android Charging Port Replacement", category: "Smartphone", image: img("1639776738932-956082f0b704"), basePrice: 15, estimatedDuration: "1 hour", serviceMode: "Shop Drop-off", serviceArea: "Dhanmondi, Dhaka", tech: "tanvir@fixmate.com", daysAgo: 20, description: "Phone only charges at an angle or not at all? We replace the charging port or flex cable. Port cleaning included. Charging speed tested after repair." },
  { key: "wiring", title: "House Wiring Fault Finding", category: "Electrical", image: img("1621905251189-08b45d6a269e"), basePrice: 18, estimatedDuration: "1-3 hours", serviceMode: "Home Visit", serviceArea: "Mirpur, Dhaka", tech: "tanvir@fixmate.com", daysAgo: 6, description: "Breakers tripping or sockets dead? We trace the fault safely and fix the wiring at the source. Circuit and breaker testing. Earthing check. Short safety report after the fix." },
  { key: "fan", title: "Ceiling Fan & Switchboard Repair", category: "Electrical", image: img("1758101755915-462eddc23f57"), basePrice: 12, estimatedDuration: "1 hour", serviceMode: "Home Visit", serviceArea: "Dhanmondi, Dhaka", tech: "tanvir@fixmate.com", daysAgo: 30, description: "Fan humming, slow or not spinning, or a burnt switchboard. Capacitor and regulator replacement. Loose connection repair. Safe testing before we leave." },
  { key: "laptopclean", title: "Laptop Deep Cleaning & Thermal Paste", category: "Laptop & PC", image: img("1721333089073-215a56fd710c"), basePrice: 20, estimatedDuration: "1 day", serviceMode: "Shop Drop-off", serviceArea: "Farmgate, Dhaka", tech: "mehedi@fixmate.com", daysAgo: 3, description: "Full internal dust clean-out and premium thermal paste to bring temperatures and fan noise back down. Fan and vent cleaning. Before and after temperature report. Keyboard surface clean." },
  { key: "laptopboard", title: "Laptop Motherboard Diagnosis & Repair", category: "Laptop & PC", image: img("1721332154191-ba5f1534266e"), basePrice: 35, estimatedDuration: "2-3 days", serviceMode: "Shop Drop-off", serviceArea: "Farmgate, Dhaka", tech: "mehedi@fixmate.com", daysAgo: 25, description: "Laptop not powering on or randomly shutting down. Board-level diagnosis with a clear quote before repair. Chip-level fixes for power and charging circuits. Data stays safe." },
  { key: "tv", title: "Smart TV Panel & Board Diagnosis", category: "TV", image: img("1584280795027-321f4d68e77b"), basePrice: 25, estimatedDuration: "1-2 hours", serviceMode: "Home Visit", serviceArea: "Uttara, Dhaka", tech: "mehedi@fixmate.com", daysAgo: 8, description: "No picture, lines on screen or boot loops - we find out whether it is the panel, backlight or main board. Backlight and panel test. Software reset and update. Clear repair quote." },
  { key: "tvmount", title: "TV Wall Mount & Setup", category: "TV", image: img("1567690187548-f07b1d7bf5a9"), basePrice: 20, estimatedDuration: "1-2 hours", serviceMode: "Home Visit", serviceArea: "Farmgate, Dhaka", tech: "mehedi@fixmate.com", daysAgo: 40, description: "Safe wall mounting for TVs up to 75 inches. Bracket fitting on brick or concrete walls. Cable management. Smart TV setup and channel tuning." },
  { key: "ac", title: "Split AC Full Servicing & Gas Check", category: "AC", image: img("1718203862467-c33159fdc504"), basePrice: 30, estimatedDuration: "1-2 hours", serviceMode: "Home Visit", serviceArea: "Gulshan, Dhaka", tech: "sumaiya@fixmate.com", daysAgo: 1, description: "Indoor and outdoor unit wash, filter clean and gas pressure check so your AC cools properly again. Filter and coil cleaning. Drain line flush. Cooling test before we leave." },
  { key: "acinstall", title: "AC Installation & Shifting", category: "AC", image: img("1667983453881-4992fe86ab1b"), basePrice: 40, estimatedDuration: "3-4 hours", serviceMode: "Home Visit", serviceArea: "Banani, Dhaka", tech: "sumaiya@fixmate.com", daysAgo: 15, description: "New split AC installation or shifting to a new home. Copper pipe and drain setup. Vacuuming and leak test. Outdoor bracket fitting." },
  { key: "washer", title: "Front-load Washer Drum & Drain Fix", category: "Washing Machine", image: img("1626806787461-102c1bfaaea1"), basePrice: 28, estimatedDuration: "2 hours", serviceMode: "Home Visit", serviceArea: "Banani, Dhaka", tech: "sumaiya@fixmate.com", daysAgo: 10, description: "Drum not spinning, water not draining or loud noises during spin. Drain pump and filter cleaning. Belt and bearing check. Test wash after repair." },
  { key: "washer2", title: "Washing Machine Error Code Repair", category: "Washing Machine", image: img("1604335399105-a0c585fd81a1"), basePrice: 22, estimatedDuration: "1-2 hours", serviceMode: "Home Visit", serviceArea: "Mohammadpur, Dhaka", tech: "arif@fixmate.com", daysAgo: 35, description: "Error codes, door lock problems or machines that stop mid-cycle. Sensor and door lock testing. Control board reset. Inlet valve check." },
  { key: "fridge", title: "Refrigerator Cooling Problem Fix", category: "Refrigerator", image: img("1722603929403-de9e80c46a9a"), basePrice: 35, estimatedDuration: "2-4 hours", serviceMode: "Home Visit", serviceArea: "Mohammadpur, Dhaka", tech: "arif@fixmate.com", daysAgo: 4, description: "Diagnosis and repair for fridges that stop cooling - thermostat, compressor relay, fan or gas issues. On-site diagnosis. Gas top-up if needed. Cooling test before leaving." },
  { key: "fridgegas", title: "Refrigerator Gas Refill & Leak Repair", category: "Refrigerator", image: img("1536353284924-9220c464e262"), basePrice: 30, estimatedDuration: "2-3 hours", serviceMode: "Home Visit", serviceArea: "Dhanmondi, Dhaka", tech: "arif@fixmate.com", daysAgo: 50, description: "Leak detection, brazing and refrigerant refill for single and double-door fridges. Pressure test. Correct gas type for your model. Temperature check after 30 minutes." },
  // not public
  { key: "pending1", title: "Samsung Battery Replacement", category: "Smartphone", image: img("1639776738932-956082f0b704"), basePrice: 22, estimatedDuration: "1 hour", serviceMode: "Shop Drop-off", serviceArea: "Dhanmondi, Dhaka", tech: "tanvir@fixmate.com", approvalStatus: "pending", daysAgo: 0, description: "Original-capacity battery replacement for Samsung Galaxy phones. Battery health check before and after. Old battery disposed safely." },
  { key: "pending2", title: "Window AC Repair", category: "AC", image: img("1667983453881-4992fe86ab1b"), basePrice: 25, estimatedDuration: "2 hours", serviceMode: "Home Visit", serviceArea: "Gulshan, Dhaka", tech: "sumaiya@fixmate.com", approvalStatus: "pending", daysAgo: 1, description: "Window AC not cooling, leaking water or making noise. Coil cleaning, fan motor check and gas pressure test." },
  { key: "rejected1", title: "MacBook Keyboard Cleaning", category: "Laptop & PC", image: img("1721332154191-ba5f1534266e"), basePrice: 25, estimatedDuration: "1 day", serviceMode: "Shop Drop-off", serviceArea: "Farmgate, Dhaka", tech: "mehedi@fixmate.com", approvalStatus: "rejected", daysAgo: 12, description: "Sticky or unresponsive MacBook keys cleaned without removing the top case." },
];

async function main() {
  const client = await new MongoClient(uri!).connect();
  const db = client.db(dbName);
  const users = db.collection("user");
  const accounts = db.collection("account");
  const sessions = db.collection("session");
  const services = db.collection("services");
  const bookings = db.collection("bookings");
  const payments = db.collection("payments");
  const emails = USERS.map((u) => u.email);

  console.log("Removing old demo data…");
  const old = await users.find({ email: { $in: emails } }).toArray();
  const oldIds = old.map((u) => u._id);
  await Promise.all([
    accounts.deleteMany({ userId: { $in: oldIds } }),
    sessions.deleteMany({ userId: { $in: oldIds } }),
    users.deleteMany({ _id: { $in: oldIds } }),
    services.deleteMany({ technicianEmail: { $in: emails } }),
    bookings.deleteMany({ $or: [{ customerEmail: { $in: emails } }, { technicianEmail: { $in: emails } }] }),
    payments.deleteMany({ $or: [{ customerEmail: { $in: emails } }, { technicianEmail: { $in: emails } }] }),
  ]);

  console.log("Creating users…");
  const byEmail: Record<string, U & { _id: ObjectId }> = {};
  for (const [i, u] of USERS.entries()) {
    const _id = new ObjectId();
    const createdAt = ago(60 - i * 5);
    await users.insertOne({ _id, name: u.name, email: u.email, emailVerified: true, image: PEOPLE[u.name] ?? null, role: u.role, phone: u.phone, area: u.area, bio: u.bio, createdAt, updatedAt: createdAt });
    await accounts.insertOne({ _id: new ObjectId(), accountId: _id.toHexString(), providerId: "credential", userId: _id, password: await hashPassword(u.password), createdAt, updatedAt: createdAt });
    byEmail[u.email] = { ...u, _id };
  }

  console.log("Creating services…");
  const svc: Record<string, { _id: ObjectId } & S> = {};
  for (const s of SERVICES) {
    const _id = new ObjectId();
    const t = byEmail[s.tech];
    await services.insertOne({
      _id,
      title: s.title,
      category: s.category,
      description: s.description,
      image: s.image,
      basePrice: s.basePrice,
      estimatedDuration: s.estimatedDuration,
      serviceMode: s.serviceMode,
      serviceArea: s.serviceArea,
      technicianName: t.name,
      technicianEmail: t.email,
      approvalStatus: s.approvalStatus || "approved",
      isAvailable: true,
      createdAt: ago(s.daysAgo),
    });
    svc[s.key] = { ...s, _id };
  }

  console.log("Creating bookings & payments…");
  type B = { s: string; c: string; status: string; daysAgo: number; final?: number; paid?: boolean; rating?: number; review?: string; problem: string };
  const plan: B[] = [
    { s: "iphone", c: "nabila@fixmate.com", status: "requested", daysAgo: 0, problem: "Screen cracked after a drop and touch is not working on the left side." },
    { s: "fridge", c: "nabila@fixmate.com", status: "requested", daysAgo: 1, problem: "The fridge stopped cooling two days ago but the light still works." },
    { s: "wiring", c: "sajid@fixmate.com", status: "accepted", daysAgo: 2, problem: "Bedroom sockets trip the breaker whenever the AC turns on." },
    { s: "laptopclean", c: "nabila@fixmate.com", status: "in-progress", daysAgo: 3, problem: "Laptop gets very hot and the fan is loud even when idle." },
    { s: "tv", c: "farzana@fixmate.com", status: "completed", daysAgo: 4, final: 28, problem: "Smart TV shows a black screen but sound is working fine." },
    { s: "port", c: "nabila@fixmate.com", status: "completed", daysAgo: 150, final: 15, paid: true, rating: 5, review: "Fixed in under an hour and charging is fast again.", problem: "Phone charges only when the cable is held at an angle." },
    { s: "ac", c: "nabila@fixmate.com", status: "completed", daysAgo: 120, final: 32, paid: true, rating: 5, review: "Came on time and cleaned everything properly.", problem: "AC is running but barely cooling the room." },
    { s: "iphone", c: "farzana@fixmate.com", status: "completed", daysAgo: 95, final: 45, paid: true, rating: 5, review: "Screen looks original and Face ID still works.", problem: "Cracked glass, display itself still works." },
    { s: "washer", c: "sajid@fixmate.com", status: "completed", daysAgo: 70, final: 30, paid: true, rating: 4, review: "Good work, took a bit longer than expected.", problem: "Drum is not draining water after the wash cycle." },
    { s: "fridge", c: "farzana@fixmate.com", status: "completed", daysAgo: 45, final: 40, paid: true, rating: 5, review: "Cooling is back to normal. Very professional.", problem: "Freezer works but the fridge section is warm." },
    { s: "laptopboard", c: "sajid@fixmate.com", status: "completed", daysAgo: 20, final: 55, paid: true, rating: 4, review: "Laptop works again, clear explanation of the fault.", problem: "Dell laptop does not power on at all, no lights when charger is connected." },
    { s: "wiring", c: "farzana@fixmate.com", status: "completed", daysAgo: 8, final: 22, paid: true, problem: "Kitchen sockets stopped working after a storm." },
    { s: "acinstall", c: "sajid@fixmate.com", status: "rejected", daysAgo: 9, problem: "Need an AC shifted to the 6th floor with no lift." },
    { s: "fan", c: "nabila@fixmate.com", status: "cancelled", daysAgo: 12, problem: "Ceiling fan is very slow on every speed setting." },
  ];

  for (const p of plan) {
    const s = svc[p.s];
    const t = byEmail[s.tech];
    const c = byEmail[p.c];
    const created = ago(p.daysAgo);
    const hist: { status: string; changedAt: Date }[] = [{ status: "requested", changedAt: created }];
    const step = (st: string, h: number) => hist.push({ status: st, changedAt: new Date(created.getTime() + h * 3600 * 1000) });
    if (p.status === "rejected") step("rejected", 3);
    if (p.status === "cancelled") step("cancelled", 2);
    if (["accepted", "in-progress", "completed"].includes(p.status)) step("accepted", 2);
    if (["in-progress", "completed"].includes(p.status)) step("in-progress", 20);
    if (p.status === "completed") step("completed", 28);
    if (p.paid) step("paid", 30);

    const _id = new ObjectId();
    await bookings.insertOne({
      _id,
      serviceId: s._id.toHexString(),
      serviceTitle: s.title,
      serviceImage: s.image,
      category: s.category,
      basePrice: s.basePrice,
      technicianName: t.name,
      technicianEmail: t.email,
      customerName: c.name,
      customerEmail: c.email,
      customerPhone: c.phone,
      address: `${c.area}`,
      preferredDate: p.daysAgo === 0 ? ahead(3) : new Date(created.getTime() + day),
      problemDescription: p.problem,
      status: p.status,
      finalAmount: p.final ?? s.basePrice,
      paymentStatus: p.paid ? "paid" : "unpaid",
      statusHistory: hist,
      createdAt: created,
      ...(p.rating ? { rating: p.rating, review: p.review, reviewedAt: new Date(created.getTime() + 2 * day) } : {}),
    });
    if (p.paid) {
      const sessionId = `cs_test_seed_${_id.toHexString()}`;
      await payments.insertOne({
        bookingId: _id.toHexString(),
        serviceTitle: s.title,
        customerName: c.name,
        customerEmail: c.email,
        technicianName: t.name,
        technicianEmail: t.email,
        amount: p.final,
        currency: "usd",
        transactionId: `pi_seed_${_id.toHexString().slice(-12)}`,
        stripeSessionId: sessionId,
        paymentStatus: "paid",
        paidAt: new Date(created.getTime() + 30 * 3600 * 1000),
      });
    }
  }

  await payments.createIndex({ stripeSessionId: 1 }, { unique: true });
  await payments.createIndex({ bookingId: 1 }, { unique: true });

  console.log("\n✅ Seed complete. Demo logins:");
  for (const u of USERS) console.log(`  ${u.role.padEnd(10)} ${u.email.padEnd(22)} ${u.password}`);
  await client.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
