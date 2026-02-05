import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBackend } from "../../lib/backend";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function PatientForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const backend = useBackend();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    contact: "",
    blood_type: "",
    address: "",
    emergency_contact: "",
  });

  useEffect(() => {
    if (id) {
      loadPatient();
    }
  }, [id]);

  const loadPatient = async () => {
    try {
      const patient = await backend.patient.get({ id: Number(id) });
      setFormData({
        name: patient.name,
        age: patient.age.toString(),
        gender: patient.gender,
        contact: patient.contact,
        blood_type: patient.blood_type || "",
        address: patient.address || "",
        emergency_contact: patient.emergency_contact || "",
      });
    } catch (error) {
      console.error("Failed to load patient:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load patient",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        await backend.patient.update({
          id: Number(id),
          name: formData.name,
          age: Number(formData.age),
          gender: formData.gender,
          contact: formData.contact,
          blood_type: formData.blood_type || undefined,
          address: formData.address || undefined,
          emergency_contact: formData.emergency_contact || undefined,
        });
        toast({
          title: "Success",
          description: "Patient updated successfully",
        });
      } else {
        await backend.patient.create({
          name: formData.name,
          age: Number(formData.age),
          gender: formData.gender,
          contact: formData.contact,
          blood_type: formData.blood_type || undefined,
          address: formData.address || undefined,
          emergency_contact: formData.emergency_contact || undefined,
        });
        toast({
          title: "Success",
          description: "Patient created successfully",
        });
      }
      navigate("/patients");
    } catch (error) {
      console.error("Failed to save patient:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save patient",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/patients")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{id ? "Edit" : "Add"} Patient</h1>
          <p className="text-muted-foreground mt-1">
            {id ? "Update patient information" : "Register a new patient"}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Patient Information</CardTitle>
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
                <Label htmlFor="age">Age *</Label>
                <Input
                  id="age"
                  type="number"
                  required
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => setFormData({ ...formData, gender: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
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
              <div className="space-y-2">
                <Label htmlFor="blood_type">Blood Type</Label>
                <Select
                  value={formData.blood_type}
                  onValueChange={(value) => setFormData({ ...formData, blood_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergency_contact">Emergency Contact</Label>
                <Input
                  id="emergency_contact"
                  value={formData.emergency_contact}
                  onChange={(e) =>
                    setFormData({ ...formData, emergency_contact: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => navigate("/patients")}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading} style={{ backgroundColor: "#2196F3" }}>
                {loading ? "Saving..." : "Save Patient"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
