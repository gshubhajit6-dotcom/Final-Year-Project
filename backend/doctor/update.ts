import { api, APIError } from "encore.dev/api";
import db from "../db";
import type { Doctor } from "./list";

export interface UpdateDoctorRequest {
  id: number;
  name: string;
  specialization: string;
  qualifications?: string;
  department_id?: number;
  contact: string;
}

// Updates an existing doctor.
export const update = api<UpdateDoctorRequest, Doctor>(
  { auth: true, expose: true, method: "PUT", path: "/doctors/:id" },
  async (req) => {
    const doctor = await db.queryRow<Doctor>`
      UPDATE doctors
      SET name = ${req.name}, specialization = ${req.specialization},
          qualifications = ${req.qualifications ?? null}, department_id = ${req.department_id ?? null},
          contact = ${req.contact}
      WHERE id = ${req.id}
      RETURNING *
    `;
    if (!doctor) {
      throw APIError.notFound("doctor not found");
    }
    return doctor;
  }
);
