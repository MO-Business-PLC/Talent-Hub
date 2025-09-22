import EmployeeSettings from "../pages/dashboard/EmployeeSettings";

export function meta() {
  return [
    { title: "Employee Settings - Talent Hub" },
    { name: "description", content: "Employee dashboard for Talent Hub" },
  ];
}

export default function EmployeeDashboardPage() {
  return <EmployeeSettings />;
}