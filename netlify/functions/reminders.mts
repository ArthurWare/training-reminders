import type { Config } from "@netlify/functions";
import { asc } from "drizzle-orm";
import { db } from "../../db/index.js";
import { reminders } from "../../db/schema.js";

const SEED_REMINDERS = [
  { name: "Boiler service", due: "2027-01-14", department: "Facilities", employee: "", email: "", source: "Manual entry", scheduleOn: true },
  { name: "MOT", due: "2027-05-21", department: "Fleet", employee: "", email: "", source: "Manual entry", scheduleOn: true },
  { name: "Vehicle service", due: "2027-01-10", department: "Fleet", employee: "", email: "", source: "Manual entry", scheduleOn: true },
  { name: "PAT testing", due: "2027-12-01", department: "Facilities", employee: "", email: "", source: "Manual entry", scheduleOn: true },
  { name: "Priory air con service", due: "2026-09-23", department: "Facilities", employee: "", email: "", source: "Manual entry", scheduleOn: true },
  { name: "F/Lea air con service", due: "2026-03-23", department: "Facilities", employee: "", email: "", source: "Manual entry", scheduleOn: true },
];

async function ensureSeeded() {
  const existing = await db.select({ id: reminders.id }).from(reminders).limit(1);
  if (existing.length === 0) {
    await db.insert(reminders).values(SEED_REMINDERS);
  }
}

export default async (req: Request) => {
  if (req.method === "GET") {
    await ensureSeeded();
    const all = await db.select().from(reminders).orderBy(asc(reminders.due));
    return Response.json(all);
  }

  if (req.method === "POST") {
    const body = await req.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const due = typeof body.due === "string" ? body.due.trim() : "";

    if (!name || !due) {
      return Response.json({ error: "name and due are required" }, { status: 400 });
    }

    const [created] = await db
      .insert(reminders)
      .values({
        name,
        due,
        department: typeof body.department === "string" ? body.department : "",
        employee: typeof body.employee === "string" ? body.employee : "",
        email: typeof body.email === "string" ? body.email : "",
        source: "Manual entry",
        scheduleOn: body.scheduleOn !== false,
      })
      .returning();

    return Response.json(created, { status: 201 });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = {
  path: "/api/reminders",
};
