import { api } from "encore.dev/api";
import db from "../db";
import type { Patient } from "./list";

export interface CreatePatientRequest {
  user_id?: string;
  name: string;
  age: number;
  gender: string;
  contact: string;
  blood_type?: string;
  address?: string;
  emergency_contact?: string;
}

// Creates a new patient.
export const create = api<CreatePatientRequest, Patient>(
  { auth: true, expose: true, method: "POST", path: "/patients" },
  async (req) => {
    const patient = await db.queryRow<Patient>`
      INSERT INTO patients (user_id, name, age, gender, contact, blood_type, address, emergency_contact)
      VALUES (${req.user_id ?? null}, ${req.name}, ${req.age}, ${req.gender}, ${req.contact}, 
              ${req.blood_type ?? null}, ${req.address ?? null}, ${req.emergency_contact ?? null})
      RETURNING *
    `;
    return patient!;
  }
);
