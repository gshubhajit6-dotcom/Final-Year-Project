import { api } from "encore.dev/api";
import db from "../db";

// Deletes a department.
export const deleteDepartment = api<{ id: number }, void>(
  { auth: true, expose: true, method: "DELETE", path: "/departments/:id" },
  async ({ id }) => {
    await db.exec`DELETE FROM departments WHERE id = ${id}`;
  }
);
