import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBackend } from "../../lib/backend";
import type { Patient } from "~backend/patient/list";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Pencil } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function PatientProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const backend = useBackend();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPatient();
  }, [id]);

  const loadPatient = async () => {
    try {
      const data = await backend.patient.get({ id: Number(id) });
      setPatient(data);
    } catch (error) {
      console.error("Failed to load patient:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load patient",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground">Patient not found</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/patients")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{patient.name}</h1>
            <p className="text-muted-foreground mt-1">Patient Profile</p>
          </div>
        </div>
        <Button onClick={() => navigate(`/patients/${id}/edit`)} style={{ backgroundColor: "#2196F3" }}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{patient.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Age</p>
              <p className="font-medium">{patient.age} years</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Gender</p>
              <p className="font-medium">{patient.gender}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Blood Type</p>
              <p className="font-medium">{patient.blood_type || "N/A"}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Contact Number</p>
              <p className="font-medium">{patient.contact}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Emergency Contact</p>
              <p className="font-medium">{patient.emergency_contact || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Address</p>
              <p className="font-medium">{patient.address || "N/A"}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
