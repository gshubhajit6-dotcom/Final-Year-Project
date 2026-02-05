import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import db from "../db";

export interface Appointment {
  id: number;
  patient_id: number;
  doctor_id: number;
  appointment_date: Date;
  appointment_time: string;
  reason: string | null;
  status: string;
  created_at: Date;
}

export interface AppointmentWithDetails extends Appointment {
  patient_name: string;
  doctor_name: string;
}

interface ListAppointmentsParams {
  date?: Query<string>;
}

interface ListAppointmentsResponse {
  appointments: AppointmentWithDetails[];
}

// Lists all appointments with patient and doctor details.
export const list = api<ListAppointmentsParams, ListAppointmentsResponse>(
  { auth: true, expose: true, method: "GET", path: "/appointments" },
  async ({ date }) => {
    let query = `
      SELECT a.*, p.name as patient_name, d.name as doctor_name
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN doctors d ON a.doctor_id = d.id
    `;
    const params: any[] = [];
    
    if (date) {
      query += ` WHERE a.appointment_date = $1`;
      params.push(date);
    }
    
    query += ` ORDER BY a.appointment_date DESC, a.appointment_time DESC`;
    
    const appointments = await db.rawQueryAll<AppointmentWithDetails>(query, ...params);
    return { appointments };
  }
);
