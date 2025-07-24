// src\db\schema\clientMeta.ts
import { pgTable, text, timestamp, serial } from "drizzle-orm/pg-core";

export const clientMeta = pgTable("client_meta", {
  id: serial("id").primaryKey(),
  ip: text("ip"),
  city: text("city"),
  region: text("region"),
  country: text("country"),
  org: text("org"),
  userAgent: text("user_agent"),
  language: text("language"),
  screenWidth: text("screen_width"),
  screenHeight: text("screen_height"),
  createdAt: timestamp("created_at").defaultNow(),
});
