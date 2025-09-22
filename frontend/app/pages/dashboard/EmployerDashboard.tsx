import { JobsTable } from "../../components";
import { MdWork } from "react-icons/md";
import { HiUsers } from "react-icons/hi";
import { IoCheckmarkCircle } from "react-icons/io5";
import { FiTrendingUp } from "react-icons/fi";
import { useJobs } from "../../hooks/useJobs";
import { useMemo } from "react";
import { useNavigate } from "react-router";

export default function EmployerDashboard() {
  const navigate = useNavigate();
  const { jobs, isLoading, error, refetch } = useJobs();

  // Transform API jobs to match JobsTable expected format
  const transformedJobs = useMemo(() => {
    return jobs.map(job => ({
      id: job._id,
      title: job.title,
      company: job.createdBy.name,
      location: `${job.location.city}, ${job.location.country}`,
      applicants: 0, // TODO: Get actual applicant count from API
      status:
        job.status.toLowerCase() === "open"
          ? ("Active" as const)
          : job.status.toLowerCase() === "closed"
            ? ("Closed" as const)
            : ("Paused" as const),
      postedDate: new Date(job.createdAt).toISOString().split("T")[0],
    }));
  }, [jobs]);

  // Calculate stats from real data
  const stats = useMemo(() => {
    const totalJobs = jobs.length;
    const activeJobs = jobs.filter(
      job => job.status.toLowerCase() === "open"
    ).length;
    const totalApplicants = jobs.reduce((sum, job) => sum + 0, 0); // TODO: Add real applicant count
    const viewsThisMonth = 1234; // TODO: Get real views data

    return { totalJobs, activeJobs, totalApplicants, viewsThisMonth };
  }, [jobs]);

  const numberFmt = useMemo(() => new Intl.NumberFormat("en-US"), []);

  const handleViewJob = (jobId: string) => {
    navigate(`/jobs/${jobId}`);
  };

  const handleEditJob = (jobId: string) => {
    // Navigate to edit job page
    console.log("Edit job:", jobId);
  };

  const handleDeleteJob = (jobId: string) => {
    // Handle job deletion
    console.log("Delete job:", jobId);
  };

  const handleCreateJob = () => {
    // Navigate to create job page
    navigate("/employer/post-job");
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-100 px-4 md:px-6 py-4 md:py-5 flex items-center gap-3 md:gap-4">
          <div className="shrink-0 grid place-items-center w-10 h-10 md:w-16 md:h-16 rounded-lg bg-background-light">
            <img
              src="/icons/home/briefcase.png"
              alt=""
              className="w-5 h-5 md:w-8 md:h-8"
            />
          </div>
          <div>
            <div className="text-lg md:text-2xl font-semibold text-primary-text leading-tight">
              {isLoading ? "..." : stats.totalJobs}
            </div>
            <div className="text-[16px] text-text-secondary">Total Jobs</div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 px-4 md:px-6 py-4 md:py-5 flex items-center gap-3 md:gap-4">
          <div className="shrink-0 grid place-items-center w-10 h-10 md:w-16 md:h-16 rounded-lg bg-background-light">
            <img
              src="/icons/home/briefcase.png"
              alt=""
              className="w-5 h-5 md:w-8 md:h-8"
            />
          </div>
          <div>
            <div className="text-lg md:text-2xl font-semibold text-primary-text leading-tight">
              {isLoading ? "..." : stats.totalApplicants}
            </div>
            <div className="text-[16px] text-text-secondary">
              Total Applicants
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 px-4 md:px-6 py-4 md:py-5 flex items-center gap-3 md:gap-4">
          <div className="shrink-0 grid place-items-center w-10 h-10 md:w-16 md:h-16 rounded-lg bg-background-light">
            <img
              src="/icons/home/briefcase.png"
              alt=""
              className="w-5 h-5 md:w-8 md:h-8"
            />
          </div>
          <div>
            <div className="text-lg md:text-2xl font-semibold text-primary-text leading-tight">
              {isLoading ? "..." : stats.activeJobs}
            </div>
            <div className="text-[16px] text-text-secondary">Active Jobs</div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 px-4 md:px-6 py-4 md:py-5 flex items-center gap-3 md:gap-4">
          <div className="shrink-0 grid place-items-center w-10 h-10 md:w-16 md:h-16 rounded-lg bg-background-light">
            <img
              src="/icons/home/briefcase.png"
              alt=""
              className="w-5 h-5 md:w-8 md:h-8"
            />
          </div>
          <div>
            <div className="text-lg md:text-2xl font-semibold text-primary-text leading-tight">
              {isLoading ? "..." : stats.viewsThisMonth}
            </div>
            <div className="text-[16px] text-text-secondary">
              Views This Month
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="w-5 h-5 text-red-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error loading jobs
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={refetch}
                  className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Jobs Table */}
      <JobsTable
        jobs={transformedJobs}
        onView={handleViewJob}
        onEdit={handleEditJob}
        onDelete={handleDeleteJob}
        onCreate={handleCreateJob}
      />
    </div>
  );
}
