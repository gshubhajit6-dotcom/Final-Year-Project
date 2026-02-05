import { api } from "encore.dev/api";
import db from "../db";

export interface Prescription {
  id: number;
  appointment_id: number | null;
  patient_id: number;
  doctor_id: number;
  medications: string;
  diagnosis: string | null;
  notes: string | null;
  created_at: Date;
}

export interface PrescriptionWithDetails extends Prescription {
  patient_name: string;
  doctor_name: string;
}

interface ListPrescriptionsResponse {
  prescriptions: PrescriptionWithDetails[];
}

// Lists all prescriptions with patient and doctor details.
export const list = api<void, ListPrescriptionsResponse>(
  { auth: true, expose: true, method: "GET", path: "/prescriptions" },
  async () => {
    const prescriptions = await db.queryAll<PrescriptionWithDetails>`
      SELECT pr.*, p.name as patient_name, d.name as doctor_name
      FROM prescriptions pr
      JOIN patients p ON pr.patient_id = p.id
      JOIN doctors d ON pr.doctor_id = d.id
      ORDER BY pr.created_at DESC
    `;
    return { prescriptions };
  }
);
