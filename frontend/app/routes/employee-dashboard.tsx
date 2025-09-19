import EmployeeDashboard from "../pages/dashboard/EmployeeDashboard";

export function meta() {
  return [
    { title: "Employee Dashboard - Talent Hub" },
    { name: "description", content: "Employee dashboard for Talent Hub" },
  ];
}

export default function EmployeeDashboardPage() {
  return <EmployeeDashboard />;
}
