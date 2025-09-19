import type { ReactNode } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { useState, useEffect } from "react";
import { FiHome, FiUsers, FiBriefcase, FiSettings, FiLogOut, FiBell } from "react-icons/fi";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  userRole: "employer" | "employee";
}

export function DashboardLayout({ children, title, userRole }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    // Get user data from localStorage
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const userData = JSON.parse(userStr);
        setUser({
          name: userData.name || userData.email || "User",
          email: userData.email || "",
        });
      }
    } catch (error) {
      console.error("Failed to parse user data:", error);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login", { replace: true });
  };

  // Get user initials for avatar
  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const sidebarItems = [
    {
      icon: FiHome,
      label: "Overview",
      href: userRole === "employer" ? "/employer/dashboard" : "/employee-dashboard",
    },
    {
      icon: FiBriefcase,
      label: "Jobs",
      href: "/employer/jobs",
    },
    {
      icon: FiBriefcase,
      label: "Post Job",
      href: "/post-job",
    },
    {
      icon: FiUsers,
      label: userRole === "employer" ? "Candidates" : "Applications",
      href: userRole === "employer" ? "/employer/candidates" : "/applications",
    },
    {
      icon: FiSettings,
      label: "Settings",
      href: "/employer/settings",
    },
  ];

  // Determine active item based on current location
  const getIsActive = (href: string) => {
    return location.pathname === href;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-4 border-b border-gray-200">
            <img src="/images/auth/logo.png" alt="logo" className="w-32 h-10" />
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6">
            <ul className="space-y-2">
              {sidebarItems.map((item) => {
                const isActive = getIsActive(item.href);
                return (
                  <li key={item.label}>
                    <div className="relative">
                      {/* Active indicator - blue bar on the left */}
                      {isActive && (
                        <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#1E73BE] rounded-r-full"></div>
                      )}
                      <Link
                        to={item.href}
                        className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                          isActive
                            ? "bg-[#1E73BE1A] text-[#1E73BE] border-l-4 border-transparent ml-1"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        }`}
                      >
                        <item.icon className={`w-5 h-5 mr-3 ${isActive ? "text-[#1E73BE]" : ""}`} />
                        {item.label}
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User Info & Logout */}
          <div className="px-4 py-4 border-t border-gray-200">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {user ? getUserInitials(user.name) : "U"}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{user?.name || "User"}</p>
                <p className="text-xs text-gray-500 capitalize">{userRole}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <FiLogOut className="w-4 h-4 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
              <div className="flex items-center space-x-4">
                <button className="relative p-2 text-gray-400 hover:text-gray-600">
                  <FiBell className="w-6 h-6" />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {user ? getUserInitials(user.name) : "U"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
