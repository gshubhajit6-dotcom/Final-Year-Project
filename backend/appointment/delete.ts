import { api } from "encore.dev/api";
import db from "../db";

// Deletes an appointment.
export const deleteAppointment = api<{ id: number }, void>(
  { auth: true, expose: true, method: "DELETE", path: "/appointments/:id" },
  async ({ id }) => {
    await db.exec`DELETE FROM appointments WHERE id = ${id}`;
  }
);
