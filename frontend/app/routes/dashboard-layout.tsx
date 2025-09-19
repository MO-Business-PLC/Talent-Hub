import { Outlet, useLocation } from "react-router";
import { useEffect } from "react";
import { DashboardLayout } from "../components";

export default function DashboardLayoutRoute() {
  const location = useLocation();

  useEffect(() => {
    console.log("DashboardLayoutRoute");
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem("user");
    if (!isAuthenticated) {
      console.log("Not authenticated");
      window.location.href = "/login";
      return;
    }

    // Check if user has a valid role
    const userStr = localStorage.getItem("user");
    if (userStr) {
      console.log("Not authenticated");
      const user = JSON.parse(userStr);
      if (!user.role || !["employer", "employee"].includes(user.role)) {
        window.location.href = "/login";
      }
    }
  }, []);

  // Determine user role and title based on current route
  const getUserRole = (): "employer" | "employee" => {
    if (location.pathname.includes("employer")) {
      return "employer";
    }
    return "employee";
  };

  const getPageTitle = (): string => {
    if (location.pathname.includes("employer")) {
      return "Employer Dashboard";
    }
    return "Employee Dashboard";
  };

  return (
    <DashboardLayout title={getPageTitle()} userRole={getUserRole()}>
      <Outlet />
    </DashboardLayout>
  );
}
