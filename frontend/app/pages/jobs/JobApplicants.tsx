import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ApplicantCard } from "../../components/jobs/ApplicantCard";
import { useJobApplicants } from "../../hooks/useJobApplicants";
import { useJob } from "../../hooks/useJob";

type FilterStatus = "all" | "shortlisted" | "interview" | "rejected";

export default function JobApplicantsPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<FilterStatus>("all");
  
  const { applicants, isLoading, error, refetch } = useJobApplicants(jobId);
  const { job } = useJob(jobId);

  const handleShortlist = async (applicantId: string) => {
    try {
      // TODO: Implement shortlist API call
      console.log("Shortlisting applicant:", applicantId);
      // After successful API call, refetch the data
      refetch();
    } catch (error) {
      console.error("Failed to shortlist applicant:", error);
    }
  };

  const handleReject = async (applicantId: string) => {
    try {
      // TODO: Implement reject API call
      console.log("Rejecting applicant:", applicantId);
      // After successful API call, refetch the data
      refetch();
    } catch (error) {
      console.error("Failed to reject applicant:", error);
    }
  };

  const handleViewDetail = (applicantId: string) => {
    // TODO: Navigate to applicant detail page
    console.log("Viewing applicant detail:", applicantId);
  };

  const handleDownloadCV = (resumeUrl: string, applicantName: string) => {
    try {
      // Create a temporary link to download the file
      const link = document.createElement('a');
      link.href = resumeUrl;
      link.download = `${applicantName}_CV.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Failed to download CV:", error);
    }
  };

  const filteredApplicants = applicants.filter(applicant => {
    switch (activeFilter) {
      case "shortlisted":
        return applicant.status === "shortlisted";
      case "interview":
        return applicant.status === "shortlisted"; // Assuming shortlisted means interview
      case "rejected":
        return applicant.status === "rejected";
      default:
        return true;
    }
  });

  const getFilterCount = (filter: FilterStatus) => {
    switch (filter) {
      case "shortlisted":
        return applicants.filter(a => a.status === "shortlisted").length;
      case "interview":
        return applicants.filter(a => a.status === "shortlisted").length;
      case "rejected":
        return applicants.filter(a => a.status === "rejected").length;
      default:
        return applicants.length;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="flex space-x-4 mb-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-10 bg-gray-200 rounded w-24"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-80 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Applicants</h2>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={refetch}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Applicants for {job?.title || "Job"}
              </h1>
              <p className="text-gray-600">
                {job?.company} • {job?.location ? `${job.location.city}, ${job.location.country}` : 'Location not specified'}
              </p>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Back to Jobs
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: "all", label: "All" },
                { key: "shortlisted", label: "Shortlisted" },
                { key: "interview", label: "Interview Invitation" },
                { key: "rejected", label: "Rejected" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveFilter(key as FilterStatus)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeFilter === key
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {label}
                  <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                    {getFilterCount(key as FilterStatus)}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Applicants Grid */}
        {filteredApplicants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredApplicants.map((applicant) => (
              <ApplicantCard
                key={applicant._id}
                applicant={applicant}
                onShortlist={handleShortlist}
                onReject={handleReject}
                onViewDetail={handleViewDetail}
                onDownloadCV={handleDownloadCV}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No applicants found
              </h3>
              <p className="text-gray-600">
                {activeFilter === "all" 
                  ? "No one has applied for this job yet."
                  : `No ${activeFilter} applicants found.`
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
