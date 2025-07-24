// src\db\schema\schema.ts
// src/db/schema/schema.ts
import { pgTable, varchar, timestamp } from "drizzle-orm/pg-core";

export const clientMeta = pgTable("client_meta", {
  id: varchar("id").primaryKey(),
  ip: varchar("ip", { length: 64 }),
  userAgent: varchar("user_agent", { length: 256 }),
  screenWidth: varchar("screen_width"),
  screenHeight: varchar("screen_height"),
  language: varchar("language"),
  createdAt: timestamp("created_at").defaultNow(),
});
