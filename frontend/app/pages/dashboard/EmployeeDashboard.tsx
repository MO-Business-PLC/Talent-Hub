import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("overview");

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

  const renderContent = () => {
    switch (activePage) {
      case "overview":
        return <Overview />;
      case "applied-jobs":
        return <AppliedJobs />;
      case "favorite-jobs":
        return <FavoriteJobs />;
      case "settings":
        return <Settings />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          {/* Left side - Logo */}
          <div className="flex items-center">
            <img src="/images/logo.png" alt="TalentHub" className="h-8 w-auto" />
          </div>
          
          {/* Middle - Navigation */}
          <nav className="flex items-center space-x-8">
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Find Job</a>
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Find Employer</a>
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Dashboard</a>
          </nav>
          
          {/* Right side - Icons and Profile */}
          <div className="flex items-center space-x-4">
            {/* Notification Icon */}
            <div className="relative cursor-pointer">
              <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">3</span>
            </div>
            
            {/* Profile Section with Square Curve */}
            <div className="flex items-center cursor-pointer">
              <div className="h-10 w-10 rounded-lg bg-gray-300 flex items-center justify-center border-2 border-gray-400">
                <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 ml-4"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
     <nav className="text-sm text-gray-500 mb-6 flex justify-end">
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
                    <svg className={`h-5 w-5 ${activePage === "overview" ? "text-blue-500" : "text-gray-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4" />
                    </svg>
                  </div>
                  <span>Overview</span>
                </div>
                
                <div 
                  className={`flex items-center p-3 rounded-lg cursor-pointer ${activePage === "applied-jobs" ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"}`}
                  onClick={() => setActivePage("applied-jobs")}
                >
                  <div className="h-5 w-5 mr-3 flex items-center justify-center">
                    <svg className={`h-5 w-5 ${activePage === "applied-jobs" ? "text-blue-500" : "text-gray-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <span>Applied Jobs</span>
                </div>
                
                <div 
                  className={`flex items-center p-3 rounded-lg cursor-pointer ${activePage === "favorite-jobs" ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"}`}
                  onClick={() => setActivePage("favorite-jobs")}
                >
                  <div className="h-5 w-5 mr-3 flex items-center justify-center">
                    <svg className={`h-5 w-5 ${activePage === "favorite-jobs" ? "text-blue-500" : "text-gray-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <span>Favorite Jobs</span>
                </div>
                
                <div 
                  className={`flex items-center p-3 rounded-lg cursor-pointer ${activePage === "settings" ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"}`}
                  onClick={() => setActivePage("settings")}
                >
                  <div className="h-5 w-5 mr-3 flex items-center justify-center">
                    <svg className={`h-5 w-5 ${activePage === "settings" ? "text-blue-500" : "text-gray-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
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
                    <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </div>
                  <span className="font-medium">Logout</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content Area - Now on the right side */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

// Overview Component
function Overview() {
  return (
    <div className="h-full">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Overview</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center mr-4">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900">153</h3>
              <p className="text-gray-500">Applied jobs</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <div className="h-10 w-10 rounded-lg bg-pink-100 flex items-center justify-center mr-4">
              <svg className="h-6 w-6 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900">241</h3>
              <p className="text-gray-500">Favorite job</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center mr-4">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2m-6 10h4m-2 0v-6m-8 6h16a2 2 0 002-2V9a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900">7,341</h3>
              <p className="text-gray-500">Interview Scheduled</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recently Applied Jobs Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <h3 className="text-lg font-medium text-gray-900 p-6 border-b border-gray-200">Recently applied job</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">JOB TITLE</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COMPANY</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">APPLIED DATE</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Senior Product Manager</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2F Capital</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2025-09-15</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Viewed</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800 cursor-pointer">View Detail</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Software Engineer</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2F Capital</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2025-09-15</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Sent</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800 cursor-pointer">View Detail</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">UX Designer</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm ">2F Capital</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm ">2025-09-15</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Rejected</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800 cursor-pointer">View Detail</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Data Analyst</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm ">2F Capital</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm ">2025-09-15</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Interview Scheduled</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800 cursor-pointer">View Detail</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Marketing Specialist</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm ">2F Capital</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm ">2025-09-15</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Interview Scheduled</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800 cursor-pointer">View Detail</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Applied Jobs Component
function AppliedJobs() {
  return (
    <div className="h-full">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Applied Jobs (5)</h2>
      
      {/* Applied Jobs Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">JOB TITLE</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COMPANY</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">APPLIED DATE</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Senior Product Manager</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2F Capital</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2025-09-15</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Viewed</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800 cursor-pointer">View Detail</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Software Engineer</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2F Capital</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2025-09-15</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Sent</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800 cursor-pointer">View Detail</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">UX Designer</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2F Capital</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2025-09-15</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Rejected</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800 cursor-pointer">View Detail</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Data Analyst</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2F Capital</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2025-09-15</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Interview Scheduled</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800 cursor-pointer">View Detail</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Marketing Specialist</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2F Capital</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2025-09-15</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Interview Scheduled</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800 cursor-pointer">View Detail</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Favorite Jobs Component
function FavoriteJobs() {
  return (
    <div className="h-full">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Favorite Jobs (12)</h2>
      
      {/* Favorite Jobs Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">JOB TITLE</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COMPANY</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LOCATION</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SALARY</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Frontend Developer</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">TechCorp</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">San Francisco, CA</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$120,000 - $150,000</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800 cursor-pointer">Apply Now</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Data Scientist</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">DataWorks</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Remote</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$130,000 - $160,000</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800 cursor-pointer">Apply Now</td>
              </tr>
              <tr>
                <td className="px-6极 py-4 whitespace-nowrap text-sm text-gray-900">Product Designer</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">DesignHub</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">New York, NY</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$110,000 - $140,000</td>
               极 <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800 cursor-pointer">Apply Now</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
// Settings Component
function Settings() {
  return (
    <div className="h-full">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2>
      
      {/* Profile Completion Alert */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong>Your profile isn't finished!</strong> Complete your profile and add resumes to boost hiring chances!
            </p>
          </div>
        </div>
      </div>
      
      {/* Settings Form */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Profile Settings</h3>
        </div>
        <div className="p-6">
          <form className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">First name</label>
                <input type="text" name="first-name" id="first-name" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              
              <div>
                <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">Last name</label>
                <input type="text" name="last-name" id="last-name" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
              <input type="email" name="email" id="email" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            
            <div>
              <label htmlFor="resume" className="block text-sm font-medium text-gray-700">Resume</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</p>
                </div>
              </div>
            </div>
            
            <div>
              <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}