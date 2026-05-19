import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { defineConfig } from "prisma/config";

// Prisma v7 config — datasource URL for migrations
// Runtime connection is handled separately in lib/db.ts via PrismaPg adapter
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL ?? "",
  },
  migrations: {
    seed: "npx tsx prisma/seed.ts",
  },
});
