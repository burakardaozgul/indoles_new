import { drizzle as drizzleNeon, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { neon } from "@neondatabase/serverless";
import { Pool } from "pg";
import * as schema from "./schema";

type Schema = typeof schema;

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const isLocal = /localhost|127\.0\.0\.1/.test(connectionString);

// Both drivers share the same pg-core query builder API. Cast to the Neon type
// for static consumers (production path); runtime honors the actual driver.
export const db = (
  isLocal
    ? drizzlePg(new Pool({ connectionString }), { schema })
    : drizzleNeon(neon(connectionString), { schema })
) as unknown as NeonHttpDatabase<Schema>;

export type Database = typeof db;
export { schema };
