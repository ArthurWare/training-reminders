import type { Config, Context } from "@netlify/functions";
import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { reminders } from "../../db/schema.js";

export default async (req: Request, context: Context) => {
  const id = Number(context.params.id);
  if (!Number.isInteger(id)) {
    return Response.json({ error: "invalid id" }, { status: 400 });
  }

  if (req.method === "PATCH") {
    const body = await req.json();
    const updates: Partial<typeof reminders.$inferInsert> = {};

    if (typeof body.name === "string" && body.name.trim()) updates.name = body.name.trim();
    if (typeof body.due === "string" && body.due.trim()) updates.due = body.due.trim();
    if (typeof body.department === "string") updates.department = body.department;
    if (typeof body.employee === "string") updates.employee = body.employee;
    if (typeof body.email === "string") updates.email = body.email;
    if (typeof body.scheduleOn === "boolean") updates.scheduleOn = body.scheduleOn;

    if (Object.keys(updates).length === 0) {
      return Response.json({ error: "no valid fields to update" }, { status: 400 });
    }

    const [updated] = await db.update(reminders).set(updates).where(eq(reminders.id, id)).returning();

    if (!updated) {
      return Response.json({ error: "not found" }, { status: 404 });
    }

    return Response.json(updated);
  }

  if (req.method === "DELETE") {
    const [deleted] = await db.delete(reminders).where(eq(reminders.id, id)).returning();
    if (!deleted) {
      return Response.json({ error: "not found" }, { status: 404 });
    }
    return Response.json(deleted);
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = {
  path: "/api/reminders/:id",
};
