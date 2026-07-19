import path from "node:path";
import { defineConfig } from "prisma/config";
import { config } from "dotenv";

// prisma.config.ts skips automatic .env loading - load it explicitly
config({ path: path.join(__dirname, ".env") });

export default defineConfig({
  schema: path.join(__dirname, "prisma/schema.prisma"),
  datasource: {
    url: process.env.DATABASE_URL!,
  },
  migrations: {
    path: "prisma/migrations",
    seed: "ts-node --project tsconfig.json prisma/seed.ts",
  },
});
