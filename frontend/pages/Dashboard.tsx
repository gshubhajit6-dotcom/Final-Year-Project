import { useEffect, useState } from "react";
import { useBackend } from "../lib/backend";
import StatCard from "../components/StatCard";
import { Users, Calendar, UserCog, Building2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function Dashboard() {
  const [stats, setStats] = useState({
    total_patients: 0,
    today_appointments: 0,
    total_doctors: 0,
    total_departments: 0,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const backend = useBackend();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await backend.stats.get();
      setStats(data);
    } catch (error) {
      console.error("Failed to load stats:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load dashboard statistics",
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome to the Hospital Information System
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Patients"
          value={stats.total_patients}
          icon={Users}
          description="Registered patients"
        />
        <StatCard
          title="Today's Appointments"
          value={stats.today_appointments}
          icon={Calendar}
          description="Scheduled for today"
        />
        <StatCard
          title="Total Doctors"
          value={stats.total_doctors}
          icon={UserCog}
          description="Active doctors"
        />
        <StatCard
          title="Departments"
          value={stats.total_departments}
          icon={Building2}
          description="Active departments"
        />
      </div>
    </div>
  );
}
