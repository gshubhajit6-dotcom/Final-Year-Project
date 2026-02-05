import { api } from "encore.dev/api";
import db from "../db";

// Deletes a doctor.
export const deleteDoctor = api<{ id: number }, void>(
  { auth: true, expose: true, method: "DELETE", path: "/doctors/:id" },
  async ({ id }) => {
    await db.exec`DELETE FROM doctors WHERE id = ${id}`;
  }
);
