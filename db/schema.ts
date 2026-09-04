import { pgTable, serial, text, date, boolean, timestamp } from "drizzle-orm/pg-core";

export const reminders = pgTable("reminders", {
  id: serial().primaryKey(),
  name: text().notNull(),
  due: date({ mode: "string" }).notNull(),
  department: text().default(""),
  employee: text().default(""),
  email: text().default(""),
  source: text().default("Manual entry"),
  scheduleOn: boolean("schedule_on").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});
