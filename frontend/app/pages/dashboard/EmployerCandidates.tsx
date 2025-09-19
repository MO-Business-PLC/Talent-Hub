import { useState, useMemo } from "react";
import { useEmployerApplications, type Applicant } from "../../hooks/useEmployerApplications";
import { CandidateDetailsModal } from "../../components/candidates/CandidateDetailsModal";
import {
  FiDownload,
  FiEye,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiFilter,
  FiSearch,
} from "react-icons/fi";
import { HiUsers, HiDocumentText, HiCheckCircle, HiXCircle, HiClock } from "react-icons/hi";

type FilterStatus = "all" | "applied" | "shortlisted" | "rejected";

export default function EmployerCandidates() {
  const { applications, isLoading, error, refetch } = useEmployerApplications();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [jobFilter, setJobFilter] = useState("all");
  const [selectedApplication, setSelectedApplication] = useState<Applicant | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Debug logging
  console.log("EmployerCandidates rendered", { applications, isLoading, error });

  // Get unique jobs for filter
  const uniqueJobs = useMemo(() => {
    const jobs = applications.map((app) => app.jobId);
    return Array.from(new Set(jobs.map((job) => job._id)))
      .map((id) => jobs.find((job) => job._id === id))
      .filter(Boolean);
  }, [applications]);

  // Filter applications
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const matchesSearch =
        app.userId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.userId.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.jobId.title.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "all" || app.status === statusFilter;
      const matchesJob = jobFilter === "all" || app.jobId._id === jobFilter;

      return matchesSearch && matchesStatus && matchesJob;
    });
  }, [applications, searchTerm, statusFilter, jobFilter]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = applications.length;
    const applied = applications.filter((app) => app.status === "applied").length;
    const shortlisted = applications.filter((app) => app.status === "shortlisted").length;
    const rejected = applications.filter((app) => app.status === "rejected").length;

    return { total, applied, shortlisted, rejected };
  }, [applications]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleViewCandidate = (application: Applicant) => {
    setSelectedApplication(application);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedApplication(null);
  };

  const handleStatusUpdate = () => {
    refetch(); // Refresh the applications list
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "applied":
        return <HiClock className="w-4 h-4 text-blue-500" />;
      case "shortlisted":
        return <HiCheckCircle className="w-4 h-4 text-green-500" />;
      case "rejected":
        return <HiXCircle className="w-4 h-4 text-red-500" />;
      default:
        return <HiClock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
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

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <HiXCircle className="w-5 h-5 text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
          <button
            onClick={refetch}
            className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 w-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Candidates</h1>
        <p className="text-gray-600">Manage job applications and candidate profiles</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <HiUsers className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Applications</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <HiClock className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">New Applications</p>
              <p className="text-2xl font-bold text-gray-900">{stats.applied}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <HiCheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Shortlisted</p>
              <p className="text-2xl font-bold text-gray-900">{stats.shortlisted}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <HiXCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search candidates, jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <FiFilter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="applied">Applied</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Job Filter */}
          <div className="flex items-center space-x-2">
            <select
              value={jobFilter}
              onChange={(e) => setJobFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Jobs</option>
              {uniqueJobs.map((job) => (
                <option key={job!._id} value={job!._id}>
                  {job!.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {filteredApplications.length === 0 ? (
          <div className="p-8 text-center">
            <HiUsers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
            <p className="text-gray-600">
              {applications.length === 0
                ? "No candidates have applied to your jobs yet."
                : "No applications match your current filters."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredApplications.map((application) => (
              <div key={application._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {application.userId.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {application.userId.name}
                        </h3>
                        <p className="text-sm text-gray-600">{application.userId.email}</p>
                      </div>
                    </div>

                    <div className="ml-13">
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center">
                          <FiMapPin className="w-4 h-4 mr-1" />
                          {application.jobId.location.city}, {application.jobId.location.country}
                        </div>
                        <div className="flex items-center">
                          <FiCalendar className="w-4 h-4 mr-1" />
                          Applied {formatDate(application.createdAt)}
                        </div>
                      </div>

                      <div className="mb-3">
                        <h4 className="font-medium text-gray-900 mb-1">Job Applied For:</h4>
                        <p className="text-sm text-gray-600">{application.jobId.title}</p>
                      </div>

                      {application.coverLetter && (
                        <div className="mb-3">
                          <h4 className="font-medium text-gray-900 mb-1">Cover Letter:</h4>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {application.coverLetter}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end space-y-3">
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(application.status)}`}
                    >
                      {getStatusIcon(application.status)}
                      <span className="ml-1 capitalize">{application.status}</span>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => window.open(application.resumeUrl, "_blank")}
                        className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                      >
                        <FiDownload className="w-4 h-4 mr-1" />
                        Resume
                      </button>
                      <button
                        onClick={() => handleViewCandidate(application)}
                        className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded transition-colors"
                      >
                        <FiEye className="w-4 h-4 mr-1" />
                        View
                      </button>
                      <button className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded transition-colors">
                        <FiMail className="w-4 h-4 mr-1" />
                        Contact
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Candidate Details Modal */}
      <CandidateDetailsModal
        application={selectedApplication}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
}
