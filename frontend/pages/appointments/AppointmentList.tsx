import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBackend } from "../../lib/backend";
import type { AppointmentWithDetails } from "~backend/appointment/list";
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
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

export default function AppointmentList() {
  const [appointments, setAppointments] = useState<AppointmentWithDetails[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<AppointmentWithDetails[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const backend = useBackend();

  useEffect(() => {
    loadAppointments();
  }, []);

  useEffect(() => {
    const filtered = appointments.filter(
      (a) =>
        a.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.doctor_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAppointments(filtered);
  }, [searchTerm, appointments]);

  const loadAppointments = async () => {
    try {
      const data = await backend.appointment.list({});
      setAppointments(data.appointments);
      setFilteredAppointments(data.appointments);
    } catch (error) {
      console.error("Failed to load appointments:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load appointments",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await backend.appointment.deleteAppointment({ id: deleteId });
      toast({
        title: "Success",
        description: "Appointment deleted successfully",
      });
      loadAppointments();
    } catch (error) {
      console.error("Failed to delete appointment:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete appointment",
      });
    } finally {
      setDeleteId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-500";
      case "completed":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Appointments</h1>
          <p className="text-muted-foreground mt-1">Manage patient appointments</p>
        </div>
        <Button onClick={() => navigate("/appointments/new")} style={{ backgroundColor: "#2196F3" }}>
          <Plus className="mr-2 h-4 w-4" />
          Book Appointment
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appointment List</CardTitle>
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
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No appointments found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAppointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell className="font-medium">{appointment.patient_name}</TableCell>
                      <TableCell>{appointment.doctor_name}</TableCell>
                      <TableCell>
                        {new Date(appointment.appointment_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{appointment.appointment_time}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/appointments/${appointment.id}/edit`)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteId(appointment.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the appointment.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
