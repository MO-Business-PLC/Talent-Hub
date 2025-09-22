import EmployeeOverview from "../pages/dashboard/EmployeeOverview";

export function meta() {
  return [
    { title: "Employee Dashboard - Talent Hub" },
    { name: "description", content: "Employee dashboard for Talent Hub" },
  ];
}

export default function EmployeeDashboardPage() {
  return <EmployeeOverview />;
}
