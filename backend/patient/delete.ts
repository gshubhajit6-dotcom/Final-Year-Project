import { api } from "encore.dev/api";
import db from "../db";

// Deletes a patient.
export const deletePatient = api<{ id: number }, void>(
  { auth: true, expose: true, method: "DELETE", path: "/patients/:id" },
  async ({ id }) => {
    await db.exec`DELETE FROM patients WHERE id = ${id}`;
  }
);
