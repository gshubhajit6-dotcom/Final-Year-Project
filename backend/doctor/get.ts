import { api, APIError } from "encore.dev/api";
import db from "../db";
import type { Doctor } from "./list";

// Retrieves a doctor by ID.
export const get = api<{ id: number }, Doctor>(
  { auth: true, expose: true, method: "GET", path: "/doctors/:id" },
  async ({ id }) => {
    const doctor = await db.queryRow<Doctor>`
      SELECT * FROM doctors WHERE id = ${id}
    `;
    if (!doctor) {
      throw APIError.notFound("doctor not found");
    }
    return doctor;
  }
);
