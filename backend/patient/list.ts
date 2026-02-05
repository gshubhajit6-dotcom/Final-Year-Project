import { api } from "encore.dev/api";
import db from "../db";

export interface Patient {
  id: number;
  user_id: string | null;
  name: string;
  age: number;
  gender: string;
  contact: string;
  blood_type: string | null;
  address: string | null;
  emergency_contact: string | null;
  created_at: Date;
}

interface ListPatientsResponse {
  patients: Patient[];
}

// Lists all patients.
export const list = api<void, ListPatientsResponse>(
  { auth: true, expose: true, method: "GET", path: "/patients" },
  async () => {
    const patients = await db.queryAll<Patient>`
      SELECT * FROM patients ORDER BY created_at DESC
    `;
    return { patients };
  }
);
