// src/App.tsx
import React, { useState } from 'react';

interface Job {
  id: number;
  title: string;
  status: 'In Progress' | 'Active' | 'Expired' | 'Suspended' | 'Renewed';
  expireDate: string;
  applicants: number;
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Active' | 'Closed' | 'Archived'>('Active');
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;

  // Mock data
  const jobs: Job[] = [
    { id: 1, title: 'Senior Product Manager', status: 'In Progress', expireDate: '2025-09-15', applicants: 35 },
    { id: 2, title: 'Software Engineer', status: 'Active', expireDate: '2026-01-30', applicants: 38 },
    { id: 3, title: 'UX Designer', status: 'Active', expireDate: '2024-12-01', applicants: 35 },
    { id: 4, title: 'Data Analyst', status: 'Expired', expireDate: '2023-05-20', applicants: 35 },
    { id: 5, title: 'Marketing Specialist', status: 'Suspended', expireDate: '2023-11-10', applicants: 35 },
    { id: 6, title: 'Sales Executive', status: 'Renewed', expireDate: '2023-08-05', applicants: 35 },
    { id: 7, title: 'Business Analyst', status: 'In Progress', expireDate: '2026-07-22', applicants: 35 },
    { id: 8, title: 'Project Coordinator', status: 'Active', expireDate: '2026-07-22', applicants: 35 },
  ];

  // ✅ FIXED: Only include 'Active' and 'In Progress' for 'Active' tab
  const filteredJobs = jobs.filter(job => {
    if (activeTab === 'Active') return job.status === 'Active' || job.status === 'In Progress';
    if (activeTab === 'Closed') return job.status === 'Expired' || job.status === 'Suspended';
    if (activeTab === 'Archived') return job.status === 'Renewed';
    return true;
  });

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const paginate = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= 5) {
      setCurrentPage(pageNumber);
    }
  };

  // Status icon and color mapping
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'In Progress':
      case 'Active':
        return (
          <svg className="w-4 h-4 text-green-600 inline-block" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'Expired':
      case 'Suspended':
        return (
          <svg className="w-4 h-4 text-red-600 inline-block" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      case 'Renewed':
        return (
          <svg className="w-4 h-4 text-yellow-600 inline-block" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress':
      case 'Active':
        return 'text-green-600';
      case 'Expired':
      case 'Suspended':
        return 'text-red-600';
      case 'Renewed':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-semibold text-blue-500">TalentHub</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-gray-600 hover:text-gray-900 transition">Find Employee</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition">Post Job</a>
            <a href="#" className="bg-blue-100 text-blue-700 px-4 py-2 rounded-md font-medium">Dashboard</a>
          </nav>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14V11a6.002 
                          6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 
                          6.165 6 8.388 6 11v3c0 .386-.149.735-.405 
                          1.001L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                </svg>
            </button>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="32" height="32">
                    {/* Black Circle Background */}
                    <circle cx="50" cy="50" r="40" fill="black" />
                    {/* Diagonal "2F" */}
                    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fontSize="36" fontFamily="Arial, sans-serif" fill="yellow" fontWeight="bold" transform="rotate(-45 50 50)"
                    >
                      2F
                    </text>
            </svg>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">My Jobs (50)</h1>
          <nav className="text-sm text-gray-500">
            <span>Home</span> / <span className="text-blue-600">Dashboard</span> / <span className="text-blue-600">My Jobs</span>
          </nav>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="lg:w-64 w-full bg-white rounded-lg shadow-sm p-4 flex-shrink-0 flex flex-col justify-between">
            <nav className="space-y-2 flex-grow">
              <a href="#" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Overview
              </a>
              <a href="#" className="flex items-center px-3 py-2 text-blue-600 bg-blue-50 font-medium rounded-md transition">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                My Jobs
              </a>
              <a href="#" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Post Job
              </a>
              <a href="#" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Candidate
              </a>
              <a href="#" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.638 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </a>
            </nav>

            {/* Logout Button */}
            <button className="mt-auto w-full text-left px-3 py-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="bg-white rounded-lg shadow-sm p-6 h-full flex flex-col">
              <div className="flex border-b mb-4">
                <button
                  onClick={() => setActiveTab('Active')}
                  className={`px-4 py-2 font-medium text-sm focus:outline-none ${activeTab === 'Active' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Active
                </button>
                <button
                  onClick={() => setActiveTab('Closed')}
                  className={`px-4 py-2 font-medium text-sm focus:outline-none ${activeTab === 'Closed' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Closed
                </button>
                <button
                  onClick={() => setActiveTab('Archived')}
                  className={`px-4 py-2 font-medium text-sm focus:outline-none ${activeTab === 'Archived' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Archived
                </button>
              </div>

              <div className="overflow-x-auto flex-grow">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">JOB TITLE</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EXPIRE DATE</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NO. OF APPLICANTS</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentJobs.map((job) => (
                      <tr key={job.id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{job.title}</td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center">
                            {getStatusIcon(job.status)}
                            <span className={`ml-1 text-sm font-medium ${getStatusColor(job.status)}`}>{job.status}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">{job.expireDate}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.336 2.14M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {job.applicants}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">View Application</a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination  Always show 5 buttons: < 01 02 03 04 05 > */}
              <div className="flex justify-center mt-6">
                <nav className="inline-flex items-center space-x-1">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  {/* Force display 01 to 05 always */}
                  {[1, 2, 3, 4, 5].map((page) => (
                    <button
                      key={page}
                      onClick={() => paginate(page)}
                      className={`px-3 py-1 text-sm border rounded-md ${
                        currentPage === page
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'text-gray-600 hover:bg-gray-100 border-gray-300'
                      }`}
                    >
                      {String(page).padStart(2, '0')}
                    </button>
                  ))}

                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === 5} // Max 5 pages
                    className="px-3 py-1 text-sm text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;