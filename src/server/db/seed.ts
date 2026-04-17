/**
 * Development / Preview ortamlarında örnek data seed eder.
 * Çalıştırmak için: pnpm db:seed
 *
 * Production branch'e asla bağlanma — DATABASE_URL stage kontrolü eklenmeli.
 */

import { db, schema } from "./index";

async function seed() {
  if (process.env.NEXT_PUBLIC_APP_STAGE === "production") {
    throw new Error("Seed production stage'de çalıştırılamaz.");
  }

  console.log("Seeding başlıyor...");

  // Örnek paket (Sanity ref bağlanana kadar placeholder)
  const [pkg] = await db
    .insert(schema.packages)
    .values({
      sanityRef: "pkg-growth-sprint",
      slug: "buyume-sprinti",
      pillar: "growth",
      pricing: { TRY: 48000, EUR: 1500, USD: 1700 },
      active: true,
    })
    .onConflictDoNothing()
    .returning();

  console.log("Package:", pkg?.slug ?? "exists");
  console.log("Seed tamamlandı.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
