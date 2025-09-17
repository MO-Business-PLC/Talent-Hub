import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function EmployeeDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }

    // Check if user is actually an employee
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.role !== "employee") {
        navigate("/login", { replace: true });
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Job Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Overview Navigation */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Overviews</h2>
          <div className="flex space-x-6">
            <div className="flex items-center">
              <div className="h-5 w-5 rounded border border-gray-300 mr-2"></div>
              <span className="text-gray-700">Applied Job</span>
            </div>
            <div className="flex items-center">
              <div className="h-5 w-5 rounded border border-blue-500 bg-blue-500 mr-2 flex items-center justify-center">
                <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-gray-700">Favorite Job</span>
            </div>
            <div className="flex items-center">
              <div className="h-5 w-5 rounded border border-blue-500 bg-blue-500 mr-2 flex items-center justify-center">
                <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-gray-700">Settings</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Active Jobs Column */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-md font-medium text-gray-900 mb-4">Active</h3>
            <div className="space-y-4">
              <div className="text-gray-500">JOB TITLE</div>
              <div className="text-gray-900">Senior Product Manager</div>
              <div className="text-gray-900">Software Engineer</div>
              <div className="text-gray-900">UX Designer</div>
            </div>
          </div>

          {/* Saved Companies Column */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-md font-medium text-gray-900 mb-4">Saved</h3>
            <div className="space-y-4">
              <div className="text-gray-500">COMPANY</div>
              <div className="text-gray-900">2F Capital</div>
              <div className="text-gray-900">2F Capital</div>
              <div className="text-gray-900">2F Capital</div>
            </div>
          </div>

          {/* Favorite Jobs Column */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-md font-medium text-gray-900 mb-4">
              <span className="text-blue-600">241</span>
            </h3>
            <div className="space-y-4">
              <div className="text-gray-500">Favorite job</div>
              <div className="text-gray-500">APPLIED DATE</div>
              <div className="text-gray-900">2025-09-15</div>
              <div className="text-gray-900">2025-09-15</div>
              <div className="text-gray-900">2025-09-15</div>
            </div>
          </div>

          {/* Status Column */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-md font-medium text-gray-900 mb-4">STATUS</h3>
            <div className="space-y-4">
              <div className="text-gray-500">&nbsp;</div>
              <div className="text-green-600">Viewed</div>
              <div className="text-blue-600">Sent</div>
              <div className="text-red-600">Rejected</div>
            </div>
          </div>

          {/* Scheduled Jobs Column */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-md font-medium text-gray-900 mb-4">
              <span className="text-blue-600">7,532</span>
            </h3>
            <div className="space-y-4">
              <div className="text-gray-500">Scheduled jobs</div>
              <div className="text-gray-500">ACTIONS</div>
              <div className="text-blue-600 hover:underline cursor-pointer">View Detail</div>
              <div className="text-blue-600 hover:underline cursor-pointer">View Detail</div>
              <div className="text-blue-600 hover:underline cursor-pointer">View Detail</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}