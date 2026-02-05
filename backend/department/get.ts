import { api, APIError } from "encore.dev/api";
import db from "../db";
import type { Department } from "./list";

// Retrieves a department by ID.
export const get = api<{ id: number }, Department>(
  { auth: true, expose: true, method: "GET", path: "/departments/:id" },
  async ({ id }) => {
    const department = await db.queryRow<Department>`
      SELECT * FROM departments WHERE id = ${id}
    `;
    if (!department) {
      throw APIError.notFound("department not found");
    }
    return department;
  }
);
