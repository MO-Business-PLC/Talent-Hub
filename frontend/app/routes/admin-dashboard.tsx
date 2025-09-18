import AdminDashboard from "../pages/dashboard/AdminDashboard";

export function meta() {
  return [
    { title: "Admin Dashboard - Talent Hub" },
    { name: "description", content: "Admin analytics and management" },
  ];
}

export default function AdminDashboardRoute() {
  return <AdminDashboard />;
}
