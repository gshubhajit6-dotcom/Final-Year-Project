import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Calendar,
  UserCog,
  Building2,
  FileText,
  Activity,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Patients", href: "/patients", icon: Users },
  { name: "Appointments", href: "/appointments", icon: Calendar },
  { name: "Doctors", href: "/doctors", icon: UserCog },
  { name: "Departments", href: "/departments", icon: Building2 },
  { name: "Prescriptions", href: "/prescriptions", icon: FileText },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2">
          <Activity className="h-8 w-8" style={{ color: "#2196F3" }} />
          <div>
            <h1 className="text-xl font-bold text-foreground">HealthCare</h1>
            <p className="text-sm text-muted-foreground">Hospital System</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#2196F3] text-white"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
