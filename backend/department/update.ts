import { api, APIError } from "encore.dev/api";
import db from "../db";
import type { Department } from "./list";

export interface UpdateDepartmentRequest {
  id: number;
  name: string;
  description?: string;
}

// Updates an existing department.
export const update = api<UpdateDepartmentRequest, Department>(
  { auth: true, expose: true, method: "PUT", path: "/departments/:id" },
  async (req) => {
    const department = await db.queryRow<Department>`
      UPDATE departments
      SET name = ${req.name}, description = ${req.description ?? null}
      WHERE id = ${req.id}
      RETURNING *
    `;
    if (!department) {
      throw APIError.notFound("department not found");
    }
    return department;
  }
);
