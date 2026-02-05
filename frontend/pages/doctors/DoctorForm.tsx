import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBackend } from "../../lib/backend";
import type { Department } from "~backend/department/list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function DoctorForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const backend = useBackend();
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    qualifications: "",
    department_id: "",
    contact: "",
  });

  useEffect(() => {
    loadDepartments();
    if (id) {
      loadDoctor();
    }
  }, [id]);

  const loadDepartments = async () => {
    try {
      const data = await backend.department.list();
      setDepartments(data.departments);
    } catch (error) {
      console.error("Failed to load departments:", error);
    }
  };

  const loadDoctor = async () => {
    try {
      const doctor = await backend.doctor.get({ id: Number(id) });
      setFormData({
        name: doctor.name,
        specialization: doctor.specialization,
        qualifications: doctor.qualifications || "",
        department_id: doctor.department_id?.toString() || "",
        contact: doctor.contact,
      });
    } catch (error) {
      console.error("Failed to load doctor:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load doctor",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        await backend.doctor.update({
          id: Number(id),
          name: formData.name,
          specialization: formData.specialization,
          qualifications: formData.qualifications || undefined,
          department_id: formData.department_id ? Number(formData.department_id) : undefined,
          contact: formData.contact,
        });
        toast({
          title: "Success",
          description: "Doctor updated successfully",
        });
      } else {
        await backend.doctor.create({
          name: formData.name,
          specialization: formData.specialization,
          qualifications: formData.qualifications || undefined,
          department_id: formData.department_id ? Number(formData.department_id) : undefined,
          contact: formData.contact,
        });
        toast({
          title: "Success",
          description: "Doctor created successfully",
        });
      }
      navigate("/doctors");
    } catch (error) {
      console.error("Failed to save doctor:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save doctor",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/doctors")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{id ? "Edit" : "Add"} Doctor</h1>
          <p className="text-muted-foreground mt-1">
            {id ? "Update doctor information" : "Register a new doctor"}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Doctor Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization *</Label>
                <Input
                  id="specialization"
                  required
                  value={formData.specialization}
                  onChange={(e) =>
                    setFormData({ ...formData, specialization: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="qualifications">Qualifications</Label>
                <Input
                  id="qualifications"
                  value={formData.qualifications}
                  onChange={(e) =>
                    setFormData({ ...formData, qualifications: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select
                  value={formData.department_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, department_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id.toString()}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact">Contact *</Label>
                <Input
                  id="contact"
                  required
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => navigate("/doctors")}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading} style={{ backgroundColor: "#2196F3" }}>
                {loading ? "Saving..." : "Save Doctor"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
