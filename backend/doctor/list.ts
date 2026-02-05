import { api } from "encore.dev/api";
import db from "../db";

export interface Doctor {
  id: number;
  user_id: string | null;
  name: string;
  specialization: string;
  qualifications: string | null;
  department_id: number | null;
  contact: string;
  created_at: Date;
}

interface ListDoctorsResponse {
  doctors: Doctor[];
}

// Lists all doctors.
export const list = api<void, ListDoctorsResponse>(
  { auth: true, expose: true, method: "GET", path: "/doctors" },
  async () => {
    const doctors = await db.queryAll<Doctor>`
      SELECT * FROM doctors ORDER BY created_at DESC
    `;
    return { doctors };
  }
);
