import { api, APIError } from "encore.dev/api";
import db from "../db";
import type { Appointment } from "./list";

export interface UpdateAppointmentRequest {
  id: number;
  patient_id: number;
  doctor_id: number;
  appointment_date: Date;
  appointment_time: string;
  reason?: string;
  status: string;
}

// Updates an existing appointment.
export const update = api<UpdateAppointmentRequest, Appointment>(
  { auth: true, expose: true, method: "PUT", path: "/appointments/:id" },
  async (req) => {
    const appointment = await db.queryRow<Appointment>`
      UPDATE appointments
      SET patient_id = ${req.patient_id}, doctor_id = ${req.doctor_id},
          appointment_date = ${req.appointment_date}, appointment_time = ${req.appointment_time},
          reason = ${req.reason ?? null}, status = ${req.status}
      WHERE id = ${req.id}
      RETURNING *
    `;
    if (!appointment) {
      throw APIError.notFound("appointment not found");
    }
    return appointment;
  }
);
