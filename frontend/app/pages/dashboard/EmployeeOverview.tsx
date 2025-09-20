import { useNavigate } from "react-router";
import { useUserApplications } from "../../hooks/useUserApplications";

export default function Overview() {
    const { applications, isLoading, error } = useUserApplications();
    const navigate = useNavigate();
    // Calculate stats from real data
    const totalApplications = applications.length;
    // const viewedApplications = applications.filter((app) => app.status === "applied").length;
    const shortlistedApplications = applications.filter((app) => app.status === "shortlisted").length;
    const rejectedApplications = applications.filter((app) => app.status === "rejected").length;

    // Function to navigate to job detail page
  const onViewDetail = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  const onNavigateToSettings = ()=>{};
  
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
  