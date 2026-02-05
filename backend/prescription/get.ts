import { api, APIError } from "encore.dev/api";
import db from "../db";
import type { PrescriptionWithDetails } from "./list";

// Retrieves a prescription by ID.
export const get = api<{ id: number }, PrescriptionWithDetails>(
  { auth: true, expose: true, method: "GET", path: "/prescriptions/:id" },
  async ({ id }) => {
    const prescription = await db.queryRow<PrescriptionWithDetails>`
      SELECT pr.*, p.name as patient_name, d.name as doctor_name
      FROM prescriptions pr
      JOIN patients p ON pr.patient_id = p.id
      JOIN doctors d ON pr.doctor_id = d.id
      WHERE pr.id = ${id}
    `;
    if (!prescription) {
      throw APIError.notFound("prescription not found");
    }
    return prescription;
  }
);
