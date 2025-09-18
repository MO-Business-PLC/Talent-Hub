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
      {/* Hero Section */}
      <section
        className="py-20 relative"
        style={{
          backgroundImage: "url('/images/jobs/jobs_background.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ fontFamily: "DM Sans, sans-serif" }}
            >
              Find your <span className="text-base">new job</span> today
            </h1>
            <p
              className="text-lg font-normal text-[#000000B2]"
              style={{ fontFamily: "DM Sans, sans-serif" }}
            >
              Thousands of jobs in the computer, engineering and technology
              sectors are waiting for you.
            </p>
          </div>

          {/* Search Bar */}
          <div className="w-full">
            <SearchBar onSearch={handleSearch} />
          </div>
          <p className="text-sm mt-2 text-secondary-text">
            {" "}
            <span className="text-disabled-text">Suggestion:</span> UI Designer,
            UX Researcher, Android, Admin
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Filters */}
          <div className="lg:col-span-1">
            <JobFilters onFiltersChange={() => {}} />
          </div>

          {/* Main Content - Job Listings */}
          <div className="lg:col-span-2">
            {/* Loading State */}
            {isSearching && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-base"></div>
                <p className="mt-4 text-gray-600">Searching for jobs...</p>
              </div>
            )}

            {/* Job Cards Grid */}
            {searchResults.length > 0 && !isSearching && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {searchResults.map(job => (
                  <JobCard key={job.id} {...job} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {searchResults.length === 0 && !isSearching && (
              <div className="text-center py-12">
                <FaBoxOpen className=" mx-auto w-20 h-20 text-base" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No jobs found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search criteria or browse all available
                  jobs.
                </p>
              </div>
            )}

            {/* Pagination */}
            <Pagination
              currentPage={1}
              totalPages={5}
              onPageChange={page => console.log("Page changed to:", page)}
            />
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <EmailSubscription />
            <ResumeUpload />
          </div>
        </div>
      </div>
    </div>
  );
}
