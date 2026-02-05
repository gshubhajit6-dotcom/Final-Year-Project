import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBackend } from "../../lib/backend";
import type { PrescriptionWithDetails } from "~backend/prescription/list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Search, Eye } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function PrescriptionList() {
  const [prescriptions, setPrescriptions] = useState<PrescriptionWithDetails[]>([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState<PrescriptionWithDetails[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const backend = useBackend();

  useEffect(() => {
    loadPrescriptions();
  }, []);

  useEffect(() => {
    const filtered = prescriptions.filter(
      (p) =>
        p.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.doctor_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPrescriptions(filtered);
  }, [searchTerm, prescriptions]);

  const loadPrescriptions = async () => {
    try {
      const data = await backend.prescription.list();
      setPrescriptions(data.prescriptions);
      setFilteredPrescriptions(data.prescriptions);
    } catch (error) {
      console.error("Failed to load prescriptions:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load prescriptions",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Prescriptions</h1>
          <p className="text-muted-foreground mt-1">Manage patient prescriptions</p>
        </div>
        <Button onClick={() => navigate("/prescriptions/new")} style={{ backgroundColor: "#2196F3" }}>
          <Plus className="mr-2 h-4 w-4" />
          New Prescription
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Prescription List</CardTitle>
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by patient or doctor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Diagnosis</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPrescriptions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No prescriptions found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPrescriptions.map((prescription) => (
                    <TableRow key={prescription.id}>
                      <TableCell className="font-medium">
                        {prescription.patient_name}
                      </TableCell>
                      <TableCell>{prescription.doctor_name}</TableCell>
                      <TableCell>{prescription.diagnosis || "N/A"}</TableCell>
                      <TableCell>
                        {new Date(prescription.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/prescriptions/${prescription.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
