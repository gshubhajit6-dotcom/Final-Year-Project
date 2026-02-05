import { api } from "encore.dev/api";
import db from "../db";
import type { Doctor } from "./list";

export interface CreateDoctorRequest {
  user_id?: string;
  name: string;
  specialization: string;
  qualifications?: string;
  department_id?: number;
  contact: string;
}

// Creates a new doctor.
export const create = api<CreateDoctorRequest, Doctor>(
  { auth: true, expose: true, method: "POST", path: "/doctors" },
  async (req) => {
    const doctor = await db.queryRow<Doctor>`
      INSERT INTO doctors (user_id, name, specialization, qualifications, department_id, contact)
      VALUES (${req.user_id ?? null}, ${req.name}, ${req.specialization}, 
              ${req.qualifications ?? null}, ${req.department_id ?? null}, ${req.contact})
      RETURNING *
    `;
    return doctor!;
  }
);
