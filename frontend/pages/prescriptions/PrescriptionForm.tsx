import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

export default function PrescriptionForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const backend = useBackend();
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [formData, setFormData] = useState({
    patient_id: "",
    doctor_id: "",
    medications: "",
    diagnosis: "",
    notes: "",
  });

  useEffect(() => {
    loadData();
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await backend.prescription.create({
        patient_id: Number(formData.patient_id),
        doctor_id: Number(formData.doctor_id),
        medications: formData.medications,
        diagnosis: formData.diagnosis || undefined,
        notes: formData.notes || undefined,
      });
      toast({
        title: "Success",
        description: "Prescription created successfully",
      });
      navigate("/prescriptions");
    } catch (error) {
      console.error("Failed to save prescription:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save prescription",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/prescriptions")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">New Prescription</h1>
          <p className="text-muted-foreground mt-1">Create a new prescription</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Prescription Details</CardTitle>
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
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="diagnosis">Diagnosis</Label>
                <Input
                  id="diagnosis"
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="medications">Medications *</Label>
                <Textarea
                  id="medications"
                  required
                  value={formData.medications}
                  onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
                  rows={4}
                  placeholder="List medications with dosage and instructions"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/prescriptions")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading} style={{ backgroundColor: "#2196F3" }}>
                {loading ? "Saving..." : "Save Prescription"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
