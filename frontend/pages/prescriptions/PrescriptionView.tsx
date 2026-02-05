import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBackend } from "../../lib/backend";
import type { PrescriptionWithDetails } from "~backend/prescription/list";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Printer } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function PrescriptionView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const backend = useBackend();
  const [prescription, setPrescription] = useState<PrescriptionWithDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPrescription();
  }, [id]);

  const loadPrescription = async () => {
    try {
      const data = await backend.prescription.get({ id: Number(id) });
      setPrescription(data);
    } catch (error) {
      console.error("Failed to load prescription:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load prescription",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!prescription) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground">Prescription not found</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/prescriptions")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Prescription Details</h1>
            <p className="text-muted-foreground mt-1">
              {new Date(prescription.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <Button onClick={handlePrint} style={{ backgroundColor: "#2196F3" }}>
          <Printer className="mr-2 h-4 w-4" />
          Print
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Patient Name</p>
              <p className="font-medium">{prescription.patient_name}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Doctor Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Doctor Name</p>
              <p className="font-medium">{prescription.doctor_name}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Diagnosis</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{prescription.diagnosis || "N/A"}</p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Medications</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{prescription.medications}</p>
          </CardContent>
        </Card>

        {prescription.notes && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{prescription.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
