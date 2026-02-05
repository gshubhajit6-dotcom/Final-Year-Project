import { api } from "encore.dev/api";
import db from "../db";
import type { Department } from "./list";

export interface CreateDepartmentRequest {
  name: string;
  description?: string;
}

// Creates a new department.
export const create = api<CreateDepartmentRequest, Department>(
  { auth: true, expose: true, method: "POST", path: "/departments" },
  async (req) => {
    const department = await db.queryRow<Department>`
      INSERT INTO departments (name, description)
      VALUES (${req.name}, ${req.description ?? null})
      RETURNING *
    `;
    return department!;
  }
);
