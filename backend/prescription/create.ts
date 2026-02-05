import { api } from "encore.dev/api";
import db from "../db";
import type { Prescription } from "./list";

export interface CreatePrescriptionRequest {
  appointment_id?: number;
  patient_id: number;
  doctor_id: number;
  medications: string;
  diagnosis?: string;
  notes?: string;
}

// Creates a new prescription.
export const create = api<CreatePrescriptionRequest, Prescription>(
  { auth: true, expose: true, method: "POST", path: "/prescriptions" },
  async (req) => {
    const prescription = await db.queryRow<Prescription>`
      INSERT INTO prescriptions (appointment_id, patient_id, doctor_id, medications, diagnosis, notes)
      VALUES (${req.appointment_id ?? null}, ${req.patient_id}, ${req.doctor_id},
              ${req.medications}, ${req.diagnosis ?? null}, ${req.notes ?? null})
      RETURNING *
    `;
    return prescription!;
  }
);
