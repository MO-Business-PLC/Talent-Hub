import {FavoriteJobs} from "../pages/dashboard/FavouriteJobs";

export function meta() {
  return [
    { title: "Employee Favourite - Talent Hub" },
    { name: "description", content: "Employee dashboard for Talent Hub" },
  ];
}

export default function EmployeeDashboardPage() {
  return <FavoriteJobs />;
}