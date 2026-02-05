import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBackend } from "../../lib/backend";
import type { Patient } from "~backend/patient/list";
import type { Doctor } from "~backend/doctor/list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function AppointmentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const backend = useBackend();
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [formData, setFormData] = useState({
    patient_id: "",
    doctor_id: "",
    appointment_date: "",
    appointment_time: "",
    reason: "",
    status: "scheduled",
  });

  useEffect(() => {
    loadData();
    if (id) {
      loadAppointment();
    }
  }, [id]);

  const loadData = async () => {
    try {
      const [patientsData, doctorsData] = await Promise.all([
        backend.patient.list(),
        backend.doctor.list(),
      ]);
      setPatients(patientsData.patients);
      setDoctors(doctorsData.doctors);
    } catch (error) {
      console.error("Failed to load data:", error);
    }
  };

  const loadAppointment = async () => {
    try {
      const appointment = await backend.appointment.get({ id: Number(id) });
      setFormData({
        patient_id: appointment.patient_id.toString(),
        doctor_id: appointment.doctor_id.toString(),
        appointment_date: new Date(appointment.appointment_date).toISOString().split("T")[0],
        appointment_time: appointment.appointment_time,
        reason: appointment.reason || "",
        status: appointment.status,
      });
    } catch (error) {
      console.error("Failed to load appointment:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load appointment",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        await backend.appointment.update({
          id: Number(id),
          patient_id: Number(formData.patient_id),
          doctor_id: Number(formData.doctor_id),
          appointment_date: new Date(formData.appointment_date),
          appointment_time: formData.appointment_time,
          reason: formData.reason || undefined,
          status: formData.status,
        });
        toast({
          title: "Success",
          description: "Appointment updated successfully",
        });
      } else {
        await backend.appointment.create({
          patient_id: Number(formData.patient_id),
          doctor_id: Number(formData.doctor_id),
          appointment_date: new Date(formData.appointment_date),
          appointment_time: formData.appointment_time,
          reason: formData.reason || undefined,
          status: formData.status,
        });
        toast({
          title: "Success",
          description: "Appointment created successfully",
        });
      }
      navigate("/appointments");
    } catch (error) {
      console.error("Failed to save appointment:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save appointment",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/appointments")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{id ? "Edit" : "Book"} Appointment</h1>
          <p className="text-muted-foreground mt-1">
            {id ? "Update appointment details" : "Schedule a new appointment"}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appointment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="patient">Patient *</Label>
                <Select
                  value={formData.patient_id}
                  onValueChange={(value) => setFormData({ ...formData, patient_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id.toString()}>
                        {patient.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="doctor">Doctor *</Label>
                <Select
                  value={formData.doctor_id}
                  onValueChange={(value) => setFormData({ ...formData, doctor_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id.toString()}>
                        {doctor.name} - {doctor.specialization}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  required
                  value={formData.appointment_date}
                  onChange={(e) =>
                    setFormData({ ...formData, appointment_date: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time *</Label>
                <Input
                  id="time"
                  type="time"
                  required
                  value={formData.appointment_time}
                  onChange={(e) =>
                    setFormData({ ...formData, appointment_time: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="reason">Reason for Visit</Label>
                <Textarea
                  id="reason"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/appointments")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading} style={{ backgroundColor: "#2196F3" }}>
                {loading ? "Saving..." : "Save Appointment"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
