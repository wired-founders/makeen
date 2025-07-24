// src/db/schema/index.ts
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema"; // ✅ just schema import here

const client = postgres(process.env.DATABASE_URL!);
export const db: PostgresJsDatabase<typeof schema> = drizzle(client, { schema });

export * from "./schema"; // export your table(s)
