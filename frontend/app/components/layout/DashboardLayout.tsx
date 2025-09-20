import type { ReactNode } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { useState, useEffect } from "react";
import {
  FiHome,
  FiUsers,
  FiBriefcase,
  FiSettings,
  FiLogOut,
  FiBell,
  FiHeart,
} from "react-icons/fi";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  userRole: "employer" | "employee";
}

export function DashboardLayout({
  children,
  title,
  userRole,
}: DashboardLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );

  useEffect(() => {
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

  const getUserInitials = (name: string) =>
    name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const sidebarItems =
    userRole === "employee"
      ? [
          {
            icon: FiHome,
            label: "Overview",
            href: "/employee/dashboard",
          },
          {
            icon: FiBriefcase,
            label: "Applied Jobs",
            href: "/employee/applied-jobs",
          },
          {
            icon: FiHeart,
            label: "Favourite Jobs",
            href: "/employee/favourite",
          },
          {
            icon: FiSettings,
            label: "Settings",
            href: "/employee/settings",
          },
        ]
      : [
          {
            icon: FiHome,
            label: "Overview",
            href: "/employer/dashboard",
          },
          {
            icon: FiBriefcase,
            label: "Jobs",
            href: "/employer/jobs",
          },
          {
            icon: FiBriefcase,
            label: "Post Job",
            href: "/employer/post-job",
          },
          {
            icon: FiUsers,
            label: userRole === "employer" ? "Candidates" : "Applications",
            href:
              userRole === "employer"
                ? "/employer/candidates"
                : "/applications",
          },
          {
            icon: FiSettings,
            label: "Settings",
            href: "/employer/settings",
          },
        ];

  const getIsActive = (href: string) => location.pathname === href;

  return (
    <div className="min-h-screen bg-gray-50 grid grid-rows-[auto_auto_1fr] p-4 gap-4">
      {/* First Row: Header with Logo */}
      <header className="bg-white shadow-sm border border-gray-200 rounded-lg">
        <div className="px-4 lg:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <img src="/images/auth/logo.png" alt="logo" className="w-32 h-10" />
          </div>

          {userRole === "employee" && (
            <nav className="flex items-center space-x-8">
              <Link
                to="/jobs"
                className="text-gray-700 hover:text-[#0366c2] font-medium"
              >
                Find Job
              </Link>
              <Link
                to="/employee/dashboard"
                className="bg-blue-100 text-[#0366c2] font-medium px-3 py-1 rounded-md"
              >
                Dashboard
              </Link>
            </nav>
          )}

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
      </header>

      {/* Second Row: Selected Labels and Breadcrumb */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
        <div className="px-4 lg:px-6 py-4 flex items-center justify-between">
          {/* Selected Labels (Left) */}
          <div className="flex items-center space-x-6">
            <h1 className="text-lg lg:text-2xl font-semibold text-gray-900">
              {title}
            </h1>

            {/* Mobile horizontal nav */}
            <nav className="lg:hidden flex overflow-x-auto scrollbar-thin">
              <ul className="flex space-x-2 whitespace-nowrap">
                {sidebarItems.map(item => {
                  const isActive = getIsActive(item.href);
                  return (
                    <li key={item.label}>
                      <Link
                        to={item.href}
                        className={`flex flex-col items-center justify-center text-xs font-medium px-4 py-2 rounded-lg transition-colors duration-200 ${
                          isActive
                            ? "text-[#1E73BE] bg-[#1E73BE33]"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        <item.icon className="w-4 h-4 mb-1" />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          {/* Breadcrumb (Right) */}
          <nav className="hidden lg:flex items-center space-x-2 text-sm text-gray-500">
            <span>Dashboard</span>
            <span>/</span>
            <span className="text-gray-900 font-medium">{title}</span>
          </nav>
        </div>
      </div>

      {/* Third Row: Sidebar and Main Content */}
      <div className="grid lg:grid-cols-[280px_1fr] gap-4 min-h-0">
        {/* Sidebar (desktop only) */}
        <div className="hidden lg:block bg-white shadow-sm border border-gray-200 rounded-lg">
          <div className="flex flex-col h-full">
            {/* Navigation */}
            <nav className="flex-1 px-4 py-6">
              <ul className="space-y-2">
                {sidebarItems.map(item => {
                  const isActive = getIsActive(item.href);
                  return (
                    <li className="relative" key={item.label}>
                      {isActive && (
                        <div className="absolute left-0 top-2 bottom-2 w-1 bg-[#1E73BE] rounded-r-full"></div>
                      )}
                      <Link
                        to={item.href}
                        className={`flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                          isActive
                            ? "bg-[#1E73BE1A] text-[#1E73BE]"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        }`}
                      >
                        <item.icon
                          className={`w-5 h-5 ${isActive ? "text-[#1E73BE]" : ""}`}
                        />
                        <span className="ml-3">{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* User Info & Logout */}
            <div className="px-4 py-4 border-t border-gray-200">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-base rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {user ? getUserInitials(user.name) : "U"}
                  </span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">{userRole}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <FiLogOut className="w-4 h-4 mr-3" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
          <main className="p-4 lg:p-6 h-full overflow-auto">{children}</main>
        </div>
      </div>
    </div>
  );
}
