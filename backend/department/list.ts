import { api } from "encore.dev/api";
import db from "../db";

export interface Department {
  id: number;
  name: string;
  description: string | null;
  created_at: Date;
}

interface ListDepartmentsResponse {
  departments: Department[];
}

// Lists all departments.
export const list = api<void, ListDepartmentsResponse>(
  { auth: true, expose: true, method: "GET", path: "/departments" },
  async () => {
    const departments = await db.queryAll<Department>`
      SELECT * FROM departments ORDER BY name ASC
    `;
    return { departments };
  }
);
