import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

const postgresUrl = process.env.POSTGRES_URL;

if (!postgresUrl) {
  throw new Error("POSTGRES_URL environment variable is not set.");
}

export default {
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: postgresUrl,
  },
} satisfies Config;
