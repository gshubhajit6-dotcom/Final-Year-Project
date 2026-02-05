import { api, APIError } from "encore.dev/api";
import db from "../db";
import type { Patient } from "./list";

// Retrieves a patient by ID.
export const get = api<{ id: number }, Patient>(
  { auth: true, expose: true, method: "GET", path: "/patients/:id" },
  async ({ id }) => {
    const patient = await db.queryRow<Patient>`
      SELECT * FROM patients WHERE id = ${id}
    `;
    if (!patient) {
      throw APIError.notFound("patient not found");
    }
    return patient;
  }
);
