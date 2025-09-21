import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useUserApplications, type UserApplication } from "../../hooks/useUserApplications";
import { isAuthenticated } from "../../lib/auth";
import { Menu, X } from "lucide-react"; 

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("overview");
  const [user, setUser] = useState(null);
  const { applications, isLoading, error } = useUserApplications();
   const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Check if user is authenticated using JWT tokens
    if (!isAuthenticated()) {
      navigate("/login", { replace: true });
      return;
    }

    // Check if user is actually an employee
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const userData = JSON.parse(userStr);
      if (userData.role !== "employee") {
        navigate("/login", { replace: true });
      } else {
        setUser(userData);
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
    navigate("/login", { replace: true });
  };

  // Function to get user initials
  const getUserInitials = () => {
    if (!user || !user.name) return "U";
    return user.name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Function to navigate to job detail page
  const handleViewJobDetail = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  // Function to navigate to settings page
  const handleNavigateToSettings = () => {
    setActivePage("settings");
  };

  const renderContent = () => {
    switch (activePage) {
      case "overview":
        return (
          <Overview
            applications={applications}
            isLoading={isLoading}
            error={error}
            onViewDetail={handleViewJobDetail}
            onNavigateToSettings={handleNavigateToSettings}
          />
        );
      case "applied-jobs":
        return (
          <AppliedJobs
            applications={applications}
            isLoading={isLoading}
            error={error}
            onViewDetail={handleViewJobDetail}
          />
        );
      case "favorite-jobs":
        return <FavoriteJobs />;
      case "settings":
        return <Settings />;
      default:
        return (
          <Overview
            applications={applications}
            isLoading={isLoading}
            error={error}
            onViewDetail={handleViewJobDetail}
            onNavigateToSettings={handleNavigateToSettings}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
     {/* Header */}
<header className="bg-gray-100 pt-4">
  {/* Container */}
  <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3 bg-white rounded-2xl shadow-sm">
    {/* Left - Logo */}
    <div className="flex items-center">
      <img src="./images/auth/logo.png" alt="TalentHub" className="h-8 w-auto" />
    </div>

    {/* Middle - Navigation (hidden on mobile) */}
    <nav className="hidden md:flex items-center space-x-8">
      <a href="/home" className="text-gray-700 hover:text-[#0366c2] font-medium">
        Find Job
      </a>
      <a href="/jobs" className="text-gray-700 hover:text-[#0366c2] font-medium">
        Find Employer
      </a>
      <a
        href="/employee-dashboard"
        className="bg-blue-100 text-[#0366c2] font-medium px-3 py-1 rounded-md"
      >
        Dashboard
      </a>
    </nav>

    {/* Right - Notification + Profile + Mobile Menu */}
    <div className="flex items-center space-x-4 md:space-x-6">
      {/* Notification */}
      <div className="relative cursor-pointer">
        <svg
          className="h-6 w-6 text-[#0366c2]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        <span className="absolute -top-1 -right-1 bg-[#0366c2] text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
          3
        </span>
      </div>

      {/* Profile Image */}
      <div className="h-10 w-10 rounded-full overflow-hidden cursor-pointer">
        <img src="./images/profile.jpg" alt="User" className="h-full w-full object-cover" />
      </div>

      {/* Mobile Menu Button (Hamburger) */}
      <div className="md:hidden">
        <button
          onClick={() =>
            setIsMenuOpen((prev) => !prev)
          }
          className="focus:outline-none"
        >
          <svg
            className="h-6 w-6 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>
  </div>

  {/* Mobile Dropdown Menu */}
  {isMenuOpen && (
    <div className="md:hidden bg-white mt-2 mx-4 rounded-lg shadow-md">
      <a href="/home" className="block px-6 py-3 text-gray-700 hover:bg-gray-100">
        Find Job
      </a>
      <a href="/job" className="block px-6 py-3 text-gray-700 hover:bg-gray-100">
        Find Employer
      </a>
      <a href="/employee-dashboard" className="block px-6 py-3 text-[#0366c2] font-medium hover:bg-blue-50">
        Dashboard
      </a>
    </div>
  )}
</header>


      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb - Fixed alignment */}
        <nav className="text-sm text-gray-500 mb-6 flex justify-start">
          <span>Home</span>
          <span className="mx-2">/</span>
          <span>Dashboard</span>
          <span className="mx-2">/</span>
          <span className="text-gray-900">
            {activePage === "overview" && "Overview"}
            {activePage === "applied-jobs" && "Applied Jobs"}
            {activePage === "favorite-jobs" && "Favorite Jobs"}
            {activePage === "settings" && "Settings"}
          </span>
        </nav>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar - Now on the left side */}
          <div className="w-full md:w-64 flex flex-col">
            <div className="bg-white rounded-lg shadow p-6 flex flex-col h-full">
              <h2 className="text-lg font-bold text-gray-900 mb-4">TalentHub</h2>
              <div className="space-y-2 flex-grow">
                <div
                  className={`flex items-center p-3 rounded-lg cursor-pointer ${activePage === "overview" ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"}`}
                  onClick={() => setActivePage("overview")}
                >
                  <div className="h-5 w-5 mr-3 flex items-center justify-center">
                    <svg
                      className={`h-5 w-5 ${activePage === "overview" ? "text-blue-500" : "text-gray-400"}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4"
                      />
                    </svg>
                  </div>
                  <span>Overview</span>
                </div>

                <div
                  className={`flex items-center p-3 rounded-lg cursor-pointer ${activePage === "applied-jobs" ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"}`}
                  onClick={() => setActivePage("applied-jobs")}
                >
                  <div className="h-5 w-5 mr-3 flex items-center justify-center">
                    <svg
                      className={`h-5 w-5 ${activePage === "applied-jobs" ? "text-blue-500" : "text-gray-400"}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <span>Applied Jobs</span>
                </div>

                <div
                  className={`flex items-center p-3 rounded-lg cursor-pointer ${activePage === "favorite-jobs" ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"}`}
                  onClick={() => setActivePage("favorite-jobs")}
                >
                  <div className="h-5 w-5 mr-3 flex items-center justify-center">
                    <svg
                      className={`h-5 w-5 ${activePage === "favorite-jobs" ? "text-blue-500" : "text-gray-400"}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </div>
                  <span>Favorite Jobs</span>
                </div>

                <div
                  className={`flex items-center p-3 rounded-lg cursor-pointer ${activePage === "settings" ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"}`}
                  onClick={() => setActivePage("settings")}
                >
                  <div className="h-5 w-5 mr-3 flex items-center justify-center">
                    <svg
                      className={`h-5 w-5 ${activePage === "settings" ? "text-blue-500" : "text-gray-400"}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <span>Settings</span>
                </div>
              </div>

              {/* Logout at the bottom with red styling */}
              <div className="mt-auto pt-4 border-t border-gray-200">
                <div
                  className="flex items-center p-3 rounded-lg cursor-pointer text-red-600 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <div className="h-5 w-5 mr-3 flex items-center justify-center">
                    <svg
                      className="h-5 w-5 text-red-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                  </div>
                  <span className="font-medium">Logout</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area - Now on the right side */}
          <div className="flex-1">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
}

// Overview Component
function Overview({ applications, isLoading, error, onViewDetail, onNavigateToSettings }) {
  // Calculate stats from real data
  const totalApplications = applications.length;
  const viewedApplications = applications.filter((app) => app.status === "applied").length;
  const shortlistedApplications = applications.filter((app) => app.status === "shortlisted").length;
  const rejectedApplications = applications.filter((app) => app.status === "rejected").length;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "applied":
        return "bg-blue-100 text-blue-800";
      case "shortlisted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "applied":
        return "Applied";
      case "shortlisted":
        return "Shortlisted";
      case "rejected":
        return "Rejected";
      default:
        return "Unknown";
    }
  };

  if (isLoading) {
    return (
      <div className="h-full">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Overview</h2>
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6">
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="h-64 bg-gray-200"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Overview</h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="h-full">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Overview</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center mr-4">
              <svg
                className="h-6 w-6 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900">{totalApplications}</h3>
              <p className="text-gray-500">Applied jobs</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center mr-4">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900">{shortlistedApplications}</h3>
              <p className="text-gray-500">Shortlisted</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center mr-4">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900">{rejectedApplications}</h3>
              <p className="text-gray-500">Rejected</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recently Applied Jobs Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Recently applied jobs ({applications.length})
          </h3>
          <button className="text-blue-600 hover:text-blue-800 font-medium">Show all jobs →</button>
        </div>
        <div className="overflow-x-auto">
          {applications.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
              <p className="text-gray-600">Start applying to jobs to see them here!</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    JOB TITLE
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    COMPANY
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    APPLIED DATE
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    STATUS
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {applications.slice(0, 5).map((application) => (
                  <tr key={application._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {application.jobId.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {application.jobId.createdBy?.name || "Unknown Company"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(application.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(application.status)}`}
                      >
                        {getStatusText(application.status)}
                      </span>
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
                      onClick={() => onViewDetail(application.jobId._id)}
                    >
                      View Detail
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Updated Profile Completion Alert */}
      <div className="bg-[#0073b1] rounded-md flex items-center justify-between px-6 py-4 mt-6">
        {/* Left Stars Image */}
        <div className="flex items-center">
          <img src="/images/auth/stars.png" alt="Stars" className="w-6 h-6 mr-3" />
          <div>
            <h3 className="text-white font-semibold text-lg">Your profile isn't finished!</h3>
            <p className="text-white text-sm">
              Complete your profile and add resumes to boost hiring chances!
            </p>
          </div>
        </div>

        {/* Update Button - Now navigates to settings */}
        <button
          className="bg-white text-[#0073b1] font-medium px-4 py-2 rounded-md hover:bg-gray-100"
          onClick={onNavigateToSettings}
        >
          Update Profile
        </button>
      </div>
    </div>
  );
}

// Applied Jobs Component
function AppliedJobs({ applications, isLoading, error, onViewDetail }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "applied":
        return "bg-blue-100 text-blue-800";
      case "shortlisted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "applied":
        return "Applied";
      case "shortlisted":
        return "Shortlisted";
      case "rejected":
        return "Rejected";
      default:
        return "Unknown";
    }
  };

  if (isLoading) {
    return (
      <div className="h-full">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Applied Jobs</h2>
        <div className="animate-pulse">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="h-64 bg-gray-200"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Applied Jobs</h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Applied Jobs ({applications.length})
      </h2>

      {/* Applied Jobs Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          {applications.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
              <p className="text-gray-600">Start applying to jobs to see them here!</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    JOB TITLE
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    COMPANY
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    APPLIED DATE
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    STATUS
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {applications.map((application) => (
                  <tr key={application._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {application.jobId.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {application.jobId.createdBy?.name || "Unknown Company"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(application.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(application.status)}`}
                      >
                        {getStatusText(application.status)}
                      </span>
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
                      onClick={() => onViewDetail(application.jobId._id)}
                    >
                      View Detail
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}


// Favorite Jobs Component
function FavoriteJobs() {
  const navigate = useNavigate();

  const handleApplyNow = (jobId) => {
    navigate(`/job-application`);
  };

  return (
    <div className="h-full">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Favorite Jobs (12)</h2>

      {/* Favorite Jobs Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  JOB TITLE
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  COMPANY
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  LOCATION
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  SALARY
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Frontend Developer
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">TechCorp</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  San Francisco, CA
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  $120,000 - $150,000
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
                  onClick={() => handleApplyNow(1)}
                >
                  Apply Now
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Data Scientist
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">DataWorks</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Remote</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  $130,000 - $160,000
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
                  onClick={() => handleApplyNow(2)}
                >
                  Apply Now
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Product Designer
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">DesignHub</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">New York, NY</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  $110,000 - $140,000
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
                  onClick={() => handleApplyNow(3)}
                >
                  Apply Now
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Settings() {
  const [activeTab, setActiveTab] = useState("personal");
  const [formData, setFormData] = useState({
    // Personal Info
    fullName: "",
    professionalTitle: "",
    industry: "",
    experienceLevel: "",

    // Contact Info
    email: "",
    phone: "",
    location: "",

    // Professional Profile
    bio: "",

    // Social Presence
    linkedin: "",
    github: "",
    portfolio: "",
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleContinue = () => {
    // Determine next tab based on current tab
    const tabs = ["personal", "contact", "professional", "social", "resume"];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    // Determine previous tab based on current tab
    const tabs = ["personal", "contact", "professional", "social", "resume"];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };

  return (
    <div className="h-full">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Settings</h2>

      {/* Tabs Navigation - Boxed Design */}
<div className="bg-white rounded-lg shadow-sm p-2 mb-8">
  <div className="flex flex-wrap sm:flex-nowrap border border-gray-200 rounded-md overflow-hidden">
    <button
      className={`flex-1 py-3 px-4 sm:px-6 text-sm sm:text-lg font-medium border-r border-gray-200 ${
        activeTab === "personal"
          ? "bg-blue-50 text-blue-700 border-b-2 border-b-blue-500"
          : "text-gray-600 hover:bg-gray-50"
      }`}
      onClick={() => setActiveTab("personal")}
    >
      Personal Info
    </button>
    <button
      className={`flex-1 py-3 px-4 sm:px-6 text-sm sm:text-lg font-medium border-r border-gray-200 ${
        activeTab === "contact"
          ? "bg-blue-50 text-blue-700 border-b-2 border-b-blue-500"
          : "text-gray-600 hover:bg-gray-50"
      }`}
      onClick={() => setActiveTab("contact")}
    >
      Contact
    </button>
    <button
      className={`flex-1 py-3 px-4 sm:px-6 text-sm sm:text-lg font-medium border-r border-gray-200 ${
        activeTab === "professional"
          ? "bg-blue-50 text-blue-700 border-b-2 border-b-blue-500"
          : "text-gray-600 hover:bg-gray-50"
      }`}
      onClick={() => setActiveTab("professional")}
    >
      Profile
    </button>
    <button
      className={`flex-1 py-3 px-4 sm:px-6 text-sm sm:text-lg font-medium border-r border-gray-200 ${
        activeTab === "social"
          ? "bg-blue-50 text-blue-700 border-b-2 border-b-blue-500"
          : "text-gray-600 hover:bg-gray-50"
      }`}
      onClick={() => setActiveTab("social")}
    >
      Social
    </button>
    <button
      className={`flex-1 py-3 px-4 sm:px-6 text-sm sm:text-lg font-medium ${
        activeTab === "resume"
          ? "bg-blue-50 text-blue-700 border-b-2 border-b-blue-500"
          : "text-gray-600 hover:bg-gray-50"
      }`}
      onClick={() => setActiveTab("resume")}
    >
      Resume
    </button>
  </div>
</div>


      {/* Settings Form */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-8">
          <form className="space-y-8">
            {/* Personal Information Tab */}
            {activeTab === "personal" && (
              <div className="space-y-8">
                <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>

                {/* Profile Image Section */}
                <div>
                  <h4 className="text-lg font-medium text-gray-800 mb-4">Profile Image</h4>
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-1">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center h-64 flex flex-col justify-center items-center">
                        <svg
                          className="mx-auto h-16 w-16 text-gray-400 mb-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <p className="text-base text-gray-600 mb-2">Upload Photo or Drag it here</p>
                        <p className="text-sm text-gray-500">Max File size 2 MB</p>
                        <label
                          htmlFor="profile-upload"
                          className="mt-4 inline-block px-5 py-3 bg-blue-600 text-white text-base font-medium rounded-md hover:bg-blue-700 cursor-pointer"
                        >
                          Browse File
                          <input id="profile-upload" type="file" className="sr-only" />
                        </label>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center h-64 flex flex-col justify-center items-center">
                        <svg
                          className="mx-auto h-16 w-16 text-gray-400 mb-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-8 0H3m2 0h4M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                        <p className="text-base text-gray-600 mb-2">
                          Upload Cover Photo or Drag it here
                        </p>
                        <p className="text-sm text-gray-500">Max File size 2 MB</p>
                        <label
                          htmlFor="cover-upload"
                          className="mt-4 inline-block px-5 py-3 bg-blue-600 text-white text-base font-medium rounded-md hover:bg-blue-700 cursor-pointer"
                        >
                          Browse File
                          <input id="cover-upload" type="file" className="sr-only" />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-base font-medium text-gray-700 mb-2"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="professionalTitle"
                      className="block text-base font-medium text-gray-700 mb-2"
                    >
                      Professional Title
                    </label>
                    <input
                      type="text"
                      id="professionalTitle"
                      value={formData.professionalTitle}
                      onChange={handleInputChange}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g. Software Engineer"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="industry"
                      className="block text-base font-medium text-gray-700 mb-2"
                    >
                      Industry
                    </label>
                    <select
                      id="industry"
                      value={formData.industry}
                      onChange={handleInputChange}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Industry</option>
                      <option value="technology">Technology</option>
                      <option value="finance">Finance</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="education">Education</option>
                      <option value="marketing">Marketing</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="experienceLevel"
                      className="block text-base font-medium text-gray-700 mb-2"
                    >
                      Experience Level
                    </label>
                    <select
                      id="experienceLevel"
                      value={formData.experienceLevel}
                      onChange={handleInputChange}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Experience Level</option>
                      <option value="entry">Entry Level</option>
                      <option value="mid">Mid Level</option>
                      <option value="senior">Senior Level</option>
                      <option value="executive">Executive</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Contact Information Tab */}
            {activeTab === "contact" && (
              <div className="space-y-8">
                <h3 className="text-xl font-semibold text-gray-900">Contact Information</h3>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-base font-medium text-gray-700 mb-2"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-base font-medium text-gray-700 mb-2"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="location"
                      className="block text-base font-medium text-gray-700 mb-2"
                    >
                      Location
                    </label>
                    <input
                      type="text"
                      id="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your location"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Professional Profile Tab */}
            {activeTab === "professional" && (
              <div className="space-y-8">
                <h3 className="text-xl font-semibold text-gray-900">Professional Profile</h3>

                <div>
                  <label htmlFor="bio" className="block text-base font-medium text-gray-700 mb-2">
                    Professional Summary
                  </label>
                  <textarea
                    id="bio"
                    rows={8}
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Tell employers about yourself, your skills, and experience..."
                  ></textarea>
                </div>
              </div>
            )}

            {/* Social Presence Tab */}
            {activeTab === "social" && (
              <div className="space-y-8">
                <h3 className="text-xl font-semibold text-gray-900">Social Presence</h3>

                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="linkedin"
                      className="block text-base font-medium text-gray-700 mb-2"
                    >
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      id="linkedin"
                      value={formData.linkedin}
                      onChange={handleInputChange}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter LinkedIn URL"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="github"
                      className="block text-base font-medium text-gray-700 mb-2"
                    >
                      GitHub
                    </label>
                    <input
                      type="url"
                      id="github"
                      value={formData.github}
                      onChange={handleInputChange}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter GitHub URL"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="portfolio"
                      className="block text-base font-medium text-gray-700 mb-2"
                    >
                      Portfolio Website
                    </label>
                    <input
                      type="url"
                      id="portfolio"
                      value={formData.portfolio}
                      onChange={handleInputChange}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter portfolio website URL"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Resume Tab */}
            {activeTab === "resume" && (
              <div className="space-y-8">
                <h3 className="text-xl font-semibold text-gray-900">Resume</h3>

                <div className="mt-2 flex justify-center px-8 pt-8 pb-10 border-2 border-gray-300 border-dashed rounded-md h-64">
                  <div className="space-y-3 text-center flex flex-col justify-center items-center">
                    <svg
                      className="mx-auto h-16 w-16 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-base text-gray-600 justify-center">
                      <label
                        htmlFor="resume-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="resume-upload"
                          name="resume-upload"
                          type="file"
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-2">or drag and drop</p>
                    </div>
                    <p className="text-sm text-gray-500">PDF, DOC, DOCX up to 10MB</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-10">
              <button
                type="button"
                onClick={handlePrevious}
                className="px-8 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={handleContinue}
                className="px-8 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {activeTab === "resume" ? "Save Changes" : "Continue"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
