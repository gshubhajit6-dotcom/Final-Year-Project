import { api } from "encore.dev/api";
import db from "../db";
import type { Appointment } from "./list";

export interface CreateAppointmentRequest {
  patient_id: number;
  doctor_id: number;
  appointment_date: Date;
  appointment_time: string;
  reason?: string;
  status?: string;
}

// Creates a new appointment.
export const create = api<CreateAppointmentRequest, Appointment>(
  { auth: true, expose: true, method: "POST", path: "/appointments" },
  async (req) => {
    const appointment = await db.queryRow<Appointment>`
      INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, reason, status)
      VALUES (${req.patient_id}, ${req.doctor_id}, ${req.appointment_date}, ${req.appointment_time},
              ${req.reason ?? null}, ${req.status ?? 'scheduled'})
      RETURNING *
    `;
    return appointment!;
  }
);
