import { api, APIError } from "encore.dev/api";
import db from "../db";
import type { AppointmentWithDetails } from "./list";

// Retrieves an appointment by ID.
export const get = api<{ id: number }, AppointmentWithDetails>(
  { auth: true, expose: true, method: "GET", path: "/appointments/:id" },
  async ({ id }) => {
    const appointment = await db.queryRow<AppointmentWithDetails>`
      SELECT a.*, p.name as patient_name, d.name as doctor_name
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN doctors d ON a.doctor_id = d.id
      WHERE a.id = ${id}
    `;
    if (!appointment) {
      throw APIError.notFound("appointment not found");
    }
    return appointment;
  }
);
