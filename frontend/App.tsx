import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ClerkProvider, SignedIn, SignedOut, SignIn } from "@clerk/clerk-react";
import { Toaster } from "@/components/ui/toaster";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import PatientList from "./pages/patients/PatientList";
import PatientForm from "./pages/patients/PatientForm";
import PatientProfile from "./pages/patients/PatientProfile";
import DoctorList from "./pages/doctors/DoctorList";
import DoctorForm from "./pages/doctors/DoctorForm";
import DoctorProfile from "./pages/doctors/DoctorProfile";
import AppointmentList from "./pages/appointments/AppointmentList";
import AppointmentForm from "./pages/appointments/AppointmentForm";
import DepartmentList from "./pages/departments/DepartmentList";
import PrescriptionList from "./pages/prescriptions/PrescriptionList";
import PrescriptionForm from "./pages/prescriptions/PrescriptionForm";
import PrescriptionView from "./pages/prescriptions/PrescriptionView";

const PUBLISHABLE_KEY = "pk_test_Z29yZ2VvdXMtZ25hdC0yMC5jbGVyay5hY2NvdW50cy5kZXYk";

function AppInner() {
  return (
    <div className="dark">
      <SignedOut>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <SignIn routing="hash" />
        </div>
      </SignedOut>
      <SignedIn>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="patients" element={<PatientList />} />
              <Route path="patients/new" element={<PatientForm />} />
              <Route path="patients/:id/edit" element={<PatientForm />} />
              <Route path="patients/:id" element={<PatientProfile />} />
              <Route path="doctors" element={<DoctorList />} />
              <Route path="doctors/new" element={<DoctorForm />} />
              <Route path="doctors/:id/edit" element={<DoctorForm />} />
              <Route path="doctors/:id" element={<DoctorProfile />} />
              <Route path="appointments" element={<AppointmentList />} />
              <Route path="appointments/new" element={<AppointmentForm />} />
              <Route path="appointments/:id/edit" element={<AppointmentForm />} />
              <Route path="departments" element={<DepartmentList />} />
              <Route path="prescriptions" element={<PrescriptionList />} />
              <Route path="prescriptions/new" element={<PrescriptionForm />} />
              <Route path="prescriptions/:id" element={<PrescriptionView />} />
            </Route>
          </Routes>
          <Toaster />
        </Router>
      </SignedIn>
    </div>
  );
}

export default function App() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <AppInner />
    </ClerkProvider>
  );
}
