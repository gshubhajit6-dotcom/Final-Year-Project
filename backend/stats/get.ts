import { api } from "encore.dev/api";
import db from "../db";

interface DashboardStats {
  total_patients: number;
  today_appointments: number;
  total_doctors: number;
  total_departments: number;
}

// Retrieves dashboard statistics.
export const get = api<void, DashboardStats>(
  { auth: true, expose: true, method: "GET", path: "/stats" },
  async () => {
    const patientCount = await db.queryRow<{ count: number }>`
      SELECT COUNT(*) as count FROM patients
    `;
    
    const appointmentCount = await db.queryRow<{ count: number }>`
      SELECT COUNT(*) as count FROM appointments
      WHERE appointment_date = CURRENT_DATE
    `;
    
    const doctorCount = await db.queryRow<{ count: number }>`
      SELECT COUNT(*) as count FROM doctors
    `;
    
    const departmentCount = await db.queryRow<{ count: number }>`
      SELECT COUNT(*) as count FROM departments
    `;
    
    return {
      total_patients: patientCount?.count || 0,
      today_appointments: appointmentCount?.count || 0,
      total_doctors: doctorCount?.count || 0,
      total_departments: departmentCount?.count || 0,
    };
  }
);
