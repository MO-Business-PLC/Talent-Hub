import { useState } from "react";
import { SearchBar } from "../../components/search";
import {
  JobCard,
  JobFilters,
  EmailSubscription,
  ResumeUpload,
  Pagination,
} from "../../components/jobs";
import { FaBoxOpen } from "react-icons/fa";

export default function Jobs() {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (query: string, location: string) => {
    setIsSearching(true);
    // Simulate API call
    setTimeout(() => {
      setSearchResults([
        {
          id: 1,
          title: "UI/UX Designer",
          company: "2F Capital",
          location: "Addis Ababa, Ethiopia",
          salary: "$20,000 - $25,000",
          type: "Full-time",
          postedAt: "2 days ago",
          description:
            "We're looking for a talented UI/UX designer to join our growing team...",
          tags: ["Figma", "Sketch", "Adobe Creative Suite"],
        },
        {
          id: 2,
          title: "Frontend Developer",
          company: "TechCorp",
          location: "San Francisco, CA",
          salary: "$80,000 - $100,000",
          type: "Full-time",
          postedAt: "1 day ago",
          description:
            "Join our frontend team to build amazing user experiences...",
          tags: ["React", "TypeScript", "JavaScript"],
        },
        {
          id: 3,
          title: "Backend Engineer",
          company: "StartupXYZ",
          location: "Remote",
          salary: "$70,000 - $90,000",
          type: "Remote",
          postedAt: "3 days ago",
          description:
            "Build scalable APIs and microservices for our platform...",
          tags: ["Node.js", "Python", "AWS"],
        },
        {
          id: 4,
          title: "Product Manager",
          company: "ProductCo",
          location: "New York, NY",
          salary: "$90,000 - $120,000",
          type: "Full-time",
          postedAt: "1 week ago",
          description:
            "Lead product strategy and work with cross-functional teams...",
          tags: ["Product Strategy", "Agile", "Analytics"],
        },
        {
          id: 5,
          title: "Data Scientist",
          company: "DataCorp",
          location: "Boston, MA",
          salary: "$85,000 - $110,000",
          type: "Full-time",
          postedAt: "4 days ago",
          description:
            "Analyze complex datasets to drive business decisions...",
          tags: ["Python", "R", "Machine Learning"],
        },
        {
          id: 6,
          title: "DevOps Engineer",
          company: "CloudTech",
          location: "Austin, TX",
          salary: "$75,000 - $95,000",
          type: "Full-time",
          postedAt: "5 days ago",
          description:
            "Manage our cloud infrastructure and deployment pipelines...",
          tags: ["AWS", "Kubernetes", "Docker"],
        },
        {
          id: 7,
          title: "Mobile Developer",
          company: "AppStudio",
          location: "Seattle, WA",
          salary: "$70,000 - $90,000",
          type: "Full-time",
          postedAt: "2 days ago",
          description:
            "Develop mobile applications for iOS and Android platforms...",
          tags: ["React Native", "Swift", "Kotlin"],
        },
        {
          id: 8,
          title: "Marketing Manager",
          company: "GrowthCo",
          location: "Chicago, IL",
          salary: "$60,000 - $80,000",
          type: "Full-time",
          postedAt: "1 week ago",
          description: "Lead marketing campaigns and drive user acquisition...",
          tags: ["Digital Marketing", "SEO", "Analytics"],
        },
      ]);
      setIsSearching(false);
    }, 1000);
  };

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
            <JobFilters onFiltersChange={() => {}} />
          </div>

          {/* Main Content - Job Listings */}
          <div className="col-span-full lg:col-span-2">
            {/* Job Results Header */}
            {searchResults.length > 0 && !isSearching && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {searchResults.length} jobs found
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Showing the best matches for your search
                </p>
              </div>
            )}

            {/* Loading State */}
            {isSearching && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-base"></div>
                <p className="mt-4 text-gray-600">Searching for jobs...</p>
              </div>
            )}

            {/* Job Cards Grid - Responsive */}
            {searchResults.length > 0 && !isSearching && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
                {searchResults.map(job => (
                  <JobCard key={job.id} {...job} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {searchResults.length === 0 && !isSearching && (
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
            {searchResults.length > 0 && !isSearching && (
              <div className="mt-8">
                <Pagination
                  currentPage={1}
                  totalPages={5}
                  onPageChange={page => console.log("Page changed to:", page)}
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
