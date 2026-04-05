#!/usr/bin/env node
/**
 * Sentry App — Booking Partners Database Seeder
 * ─────────────────────────────────────────────
 * Seeds the live PostgreSQL database with verified, safe booking
 * partners for the Delhi Tourist Safety App.
 *
 * Run:  node scripts/seedBookingPartners.mjs
 *  or:  npm run seed:partners
 */
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { PrismaClient } from "../src/generated/prisma/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } },
});

// ============================================================
// Verified Booking Partner Data
// All URLs are HTTPS — validated here and again in the backend.
// Priority: higher number = shown first in the app UI.
// ============================================================
const BOOKING_PARTNERS = [
  {
    name: "MakeMyTrip",
    description: "Book flights, hotels & holiday packages securely",
    url: "https://www.makemytrip.com",
    logoUrl: "https://imgak.mmtcdn.com/pwa_v3/pwa_header_assets/logo.png",
    category: "flights",
    isVerified: true,
    isActive: true,
    priority: 100,
  },
  {
    name: "IRCTC Train Booking",
    description: "Official Indian Railways — book train tickets safely",
    url: "https://www.irctc.co.in/nget/train-search",
    logoUrl: "https://www.irctc.co.in/nget/assets/images/NEW_IRCTC_LOGO.png",
    category: "trains",
    isVerified: true,
    isActive: true,
    priority: 95,
  },
  {
    name: "OYO Rooms",
    description: "Budget & premium hotel stays across India",
    url: "https://www.oyorooms.com",
    logoUrl: "https://www.oyorooms.com/blog/wp-content/uploads/2019/01/OYO-Red.png",
    category: "hotels",
    isVerified: true,
    isActive: true,
    priority: 90,
  },
  {
    name: "RedBus",
    description: "Intercity bus tickets with live seat tracking",
    url: "https://www.redbus.in",
    logoUrl: "https://st.redbus.in/obs/resource/img/rb_logo.png",
    category: "buses",
    isVerified: true,
    isActive: true,
    priority: 85,
  },
  {
    name: "Rapido",
    description: "Affordable bike taxis & cabs within Delhi",
    url: "https://rapido.bike",
    logoUrl: "https://play-lh.googleusercontent.com/LFsxvqU7I-W0VO4H37l3obKQoSVxP-t7SMxDfcTHNSc5s63J0CaZLgMR4bOIc8uIyuo",
    category: "local_transport",
    isVerified: true,
    isActive: true,
    priority: 80,
  },
  {
    name: "Goibibo",
    description: "Compare & book cheap flights and hotels",
    url: "https://www.goibibo.com",
    logoUrl: "https://res.goibibo.com/vcb/images/goibibo_logo_2021_v2.png",
    category: "flights",
    isVerified: true,
    isActive: true,
    priority: 75,
  },
  {
    name: "Booking.com India",
    description: "International hotels with free cancellation",
    url: "https://www.booking.com",
    logoUrl: "https://r-xx.bstatic.com/static/img/favicon/favicon-booking.png",
    category: "hotels",
    isVerified: true,
    isActive: true,
    priority: 70,
  },
  {
    name: "IndiGo Airlines",
    description: "Affordable domestic flights across India",
    url: "https://www.goindigo.in",
    logoUrl: "https://www.goindigo.in/content/dam/indigo/global-header/logo.png",
    category: "flights",
    isVerified: true,
    isActive: true,
    priority: 65,
  },
];

// ============================================================
// Main Seed Function
// Uses upsert so you can safely run this multiple times
// without creating duplicate entries.
// ============================================================
async function main() {
  console.log("🌱 Sentry App — Seeding Booking Partners...\n");

  let seeded = 0;
  let skipped = 0;

  for (const partner of BOOKING_PARTNERS) {
    // Security guard: reject any non-HTTPS URL even before DB write
    if (!partner.url.startsWith("https://")) {
      console.warn(`⚠️  SKIPPED (non-HTTPS URL): ${partner.name}`);
      skipped++;
      continue;
    }

    // Upsert by (name + category) to avoid duplicates on re-run
    const result = await prisma.bookingPartner.upsert({
      where: {
        // We need a unique identifier — use name as unique key.
        // If this fails, add @@unique([name]) to your schema.
        id: `seed-${partner.name.toLowerCase().replace(/\s+/g, "-")}`,
      },
      update: {
        // On re-run: update priority, description, logo, URLs
        description: partner.description,
        url: partner.url,
        logoUrl: partner.logoUrl,
        priority: partner.priority,
        isActive: partner.isActive,
        isVerified: partner.isVerified,
      },
      create: {
        id: `seed-${partner.name.toLowerCase().replace(/\s+/g, "-")}`,
        ...partner,
      },
    });

    console.log(`✅  ${result.name} (${result.category}) — priority: ${result.priority}`);
    seeded++;
  }

  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Seeded/Updated : ${seeded} partners`);
  console.log(`   ⚠️  Skipped        : ${skipped} partners`);
  console.log(`\n🚀 Done! Restart your backend and the API will now return real data.\n`);
}

main()
  .catch((err) => {
    console.error("\n❌ Seed failed:", err.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
