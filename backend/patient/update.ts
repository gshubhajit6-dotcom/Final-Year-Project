import { api, APIError } from "encore.dev/api";
import db from "../db";
import type { Patient } from "./list";

export interface UpdatePatientRequest {
  id: number;
  name: string;
  age: number;
  gender: string;
  contact: string;
  blood_type?: string;
  address?: string;
  emergency_contact?: string;
}

// Updates an existing patient.
export const update = api<UpdatePatientRequest, Patient>(
  { auth: true, expose: true, method: "PUT", path: "/patients/:id" },
  async (req) => {
    const patient = await db.queryRow<Patient>`
      UPDATE patients
      SET name = ${req.name}, age = ${req.age}, gender = ${req.gender},
          contact = ${req.contact}, blood_type = ${req.blood_type ?? null},
          address = ${req.address ?? null}, emergency_contact = ${req.emergency_contact ?? null}
      WHERE id = ${req.id}
      RETURNING *
    `;
    if (!patient) {
      throw APIError.notFound("patient not found");
    }
    return patient;
  }
);
