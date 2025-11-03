import { defineConfig } from "drizzle-kit";

// Make DATABASE_URL optional for development with memory storage
const databaseUrl = process.env.DATABASE_URL || "postgresql://localhost:5432/temp";

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
});
