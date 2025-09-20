import { useEffect } from "react";
import { useSearchParams } from "react-router";
import { SearchBar } from "../../components/search";
import {
  JobCard,
  JobFilters,
  EmailSubscription,
  ResumeUpload,
  Pagination,
} from "../../components/jobs";
import { FaBoxOpen } from "react-icons/fa";
import { useJobSearch, formatJobForDisplay } from "../../hooks/useJobSearch";

export default function Jobs() {
  const [searchParams] = useSearchParams();
  const {
    jobs,
    pagination,
    isLoading,
    error,
    searchJobs,
    applyFilters,
    changePage,
    clearError,
    hasSearched,
  } = useJobSearch();

  // Initialize search from URL parameters
  useEffect(() => {
    const searchQuery = searchParams.get("search");
    const location = searchParams.get("location");
    
    // Only search if we have URL parameters and haven't searched yet
    if ((searchQuery || location) && !hasSearched) {
      searchJobs(searchQuery || "", location || "");
    }
  }, [searchParams, hasSearched]); // Add hasSearched to prevent multiple searches

  const handleSearch = (query: string, location: string) => {
    clearError();
    searchJobs(query, location);
  };

  const handleFiltersChange = (filters: any) => {
    clearError();

    // Map frontend filters to API parameters
    const apiFilters: any = {};

    // Map employment types to jobType
    if (filters.employmentType && filters.employmentType.length > 0) {
      // For now, just use the first selected type
      const employmentMap: Record<string, string> = {
        "Full-Time": "FULL_TIME",
        "Part-Time": "PART_TIME",
        Temporary: "CONTRACT",
      };
      apiFilters.jobType = employmentMap[filters.employmentType[0]];
    }

    // Map work experience to experience level
    if (filters.workExperience && filters.workExperience !== "Any Experience") {
      if (filters.workExperience === "Internship") {
        apiFilters.experienceLevel = "JUNIOR";
      } else if (filters.workExperience === "Work Remotely") {
        apiFilters.jobSite = "REMOTE";
      }
    }

    // Map location filters
    if (filters.location) {
      if (filters.location === "Remote Job") {
        apiFilters.jobSite = "REMOTE";
      }
      // Other location filters could be handled with search terms
    }

    applyFilters(apiFilters);
  };

  const handlePageChange = (page: number) => {
    changePage(page);
  };

  // Format jobs for display
  const formattedJobs = jobs.map(formatJobForDisplay);

  return (
    <div className="min-h-screen bg-light-gray">
      {/* Hero Section - Responsive */}
      <section
        className="py-12 sm:py-16 md:py-20 lg:py-24 relative"
        style={{
          backgroundImage: "url('/images/jobs/jobs_background.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 sm:mb-12 text-center sm:text-left">
            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight"
              style={{ fontFamily: "DM Sans, sans-serif" }}
            >
              Find your <span className="text-blue-600">new job</span> today
            </h1>
            <p
              className="text-lg sm:text-xl md:text-2xl font-normal text-gray-600"
              // style={{ fontFamily: "DM Sans, sans-serif" }}
            >
              Thousands of jobs in the computer, engineering and technology
              sectors are waiting for you.
            </p>
          </div>

          {/* Search Bar - Responsive */}
          <div className="w-full max-w-4xl mx-auto sm:mx-0">
            <SearchBar onSearch={handleSearch} />
          </div>
          <p className="text-xs sm:text-sm mt-2 text-secondary-text text-center sm:text-left">
            <span className="text-disabled-text">Suggestion:</span> UI Designer,
            UX Researcher, Android, Admin
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Filters (Hidden on mobile) */}
          <div className="hidden lg:block lg:col-span-1">
            <JobFilters onFiltersChange={handleFiltersChange} />
          </div>

          {/* Main Content - Job Listings */}
          <div className="col-span-full lg:col-span-2">
            {/* Job Results Header */}
            {jobs.length > 0 && !isLoading && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {pagination?.totalJobs || jobs.length} job
                  {(pagination?.totalJobs || jobs.length) !== 1 ? "s" : ""}{" "}
                  found
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {pagination
                    ? `Showing ${(pagination.currentPage - 1) * 10 + 1}-${Math.min(pagination.currentPage * 10, pagination.totalJobs)} of ${pagination.totalJobs} results`
                    : "Showing the best matches for your search"}
                </p>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-base"></div>
                <p className="mt-4 text-gray-600">Searching for jobs...</p>
              </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
              <div className="text-center py-12">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <p className="text-red-600 mb-4">{error}</p>
                  <button
                    onClick={() => handleSearch("", "")}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {/* Job Cards Grid - Responsive */}
            {formattedJobs.length > 0 && !isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
                {formattedJobs.map(job => (
                  <JobCard key={job.id} {...job} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {formattedJobs.length === 0 &&
              !isLoading &&
              !error &&
              hasSearched && (
                <div className="text-center py-16">
                  <FaBoxOpen className="mx-auto w-16 h-16 sm:w-20 sm:h-20 text-base mb-4" />
                  <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">
                    No jobs found
                  </h3>
                  <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto">
                    Try adjusting your search criteria or browse all available
                    jobs.
                  </p>
                  <button
                    onClick={() => handleSearch("", "")}
                    className="mt-6 px-6 py-2 bg-base text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Browse All Jobs
                  </button>
                </div>
              )}

            {/* Pagination - Responsive */}
            {pagination && pagination.totalPages > 1 && !isLoading && (
              <div className="mt-8">
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>

          {/* Right Sidebar (Hidden on mobile) */}
          <div className="hidden lg:block lg:col-span-1 space-y-6">
            <EmailSubscription />
            <ResumeUpload />
          </div>
        </div>
      </div>
    </div>
  );
}
