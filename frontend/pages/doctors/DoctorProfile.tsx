import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBackend } from "../../lib/backend";
import type { Doctor } from "~backend/doctor/list";
import type { Department } from "~backend/department/list";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Pencil } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function DoctorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const backend = useBackend();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [department, setDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDoctor();
  }, [id]);

  const loadDoctor = async () => {
    try {
      const data = await backend.doctor.get({ id: Number(id) });
      setDoctor(data);
      if (data.department_id) {
        const dept = await backend.department.get({ id: data.department_id });
        setDepartment(dept);
      }
    } catch (error) {
      console.error("Failed to load doctor:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load doctor",
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

  if (!doctor) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground">Doctor not found</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/doctors")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{doctor.name}</h1>
            <p className="text-muted-foreground mt-1">Doctor Profile</p>
          </div>
        </div>
        <Button onClick={() => navigate(`/doctors/${id}/edit`)} style={{ backgroundColor: "#2196F3" }}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Professional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{doctor.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Specialization</p>
              <p className="font-medium">{doctor.specialization}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Qualifications</p>
              <p className="font-medium">{doctor.qualifications || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Department</p>
              <p className="font-medium">{department?.name || "N/A"}</p>
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
              <p className="font-medium">{doctor.contact}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
