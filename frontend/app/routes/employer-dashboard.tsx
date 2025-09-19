import EmployerDashboard from "../pages/dashboard/EmployerDashboard";

export function meta() {
  return [
    { title: "Employer Dashboard - Talent Hub" },
    { name: "description", content: "Employer dashboard for Talent Hub" },
  ];
}

export default function EmployerDashboardPage() {
  return <EmployerDashboard />;
}
