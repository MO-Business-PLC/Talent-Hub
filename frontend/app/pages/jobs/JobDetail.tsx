// import type { Route } from "./+types/job.$id";
import { Link, useParams } from "react-router";
import {
  JobHeader,
  JobDescription,
  JobOverview,
} from "../../components/job-detail";
import { useJob } from "../../hooks/useJob";

export default function JobDetail() {
  const { id } = useParams();
  const { job, isLoading, error } = useJob(id);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-light-gray pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="h-32 bg-gray-200 rounded"></div>
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
              <div className="lg:col-span-1">
                <div className="h-48 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-light-gray pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-red-800 mb-2">
                Error Loading Job
              </h2>
              <p className="text-red-600 mb-4">{error}</p>
              <Link
                to="/jobs"
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Back to Jobs
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show not found state
  if (!job) {
    return (
      <div className="min-h-screen bg-light-gray pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-yellow-800 mb-2">
                Job Not Found
              </h2>
              <p className="text-yellow-600 mb-4">
                The job you're looking for doesn't exist or has been removed.
              </p>
              <Link
                to="/jobs"
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Browse All Jobs
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Format job data for display
  const formattedJob = {
    id: job._id,
    title: job.title,
    company: job.createdBy?.name || "Company",
    location: `${job.location.city}, ${job.location.country}`,
    type: formatJobType(job.jobType, job.jobSite),
    salary: "Salary not specified", // Backend doesn't include salary
    postedAt: formatTimeAgo(job.createdAt),
    expiresAt: formatDate(job.deadline),
    level: formatExperienceLevel(job.experienceLevel),
    experience: formatExperienceLevel(job.experienceLevel),
    education: "Not specified",
    isRemote: job.jobSite === "REMOTE",
    description: job.description,
    responsibilities: extractResponsibilities(job.description),
    requirements: extractRequirements(job.description),
    benefits: [], // Not provided by backend
    companyInfo: {
      name: job.createdBy?.name || "Company",
      description: `A company in the ${job.sector} sector.`,
      website: "#",
      size: "Not specified",
      industry: job.sector,
      founded: "Not specified",
      location: `${job.location.city}, ${job.location.country}`,
    },
  };

  return (
    <div className="min-h-screen bg-light-gray pt-16">
      {/* Breadcrumb */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center justify-end space-x-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-gray-700">
              Home
            </Link>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
            <Link to="/jobs" className="hover:text-gray-700">
              Find Job
            </Link>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
            <span className="hover:text-gray-700">{job.sector}</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
            <span className="text-gray-900">Job Details</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <JobHeader
            title={formattedJob.title}
            company={formattedJob.company}
            location={formattedJob.location}
            type={formattedJob.type}
            salary={formattedJob.salary}
            postedAt={formattedJob.postedAt}
            isRemote={formattedJob.isRemote}
            jobId={formattedJob.id}
            className="col-span-3"
          />

          {/* Job Header */}

          {/* Job Description */}
          <JobDescription
            description={formattedJob.description}
            responsibilities={formattedJob.responsibilities}
            requirements={formattedJob.requirements}
            benefits={formattedJob.benefits}
            className="col-span-2"
          />

          {/* Sidebar */}

          {/* Job Overview */}
          <JobOverview
            salary={formattedJob.salary}
            location={formattedJob.location}
            postedAt={formattedJob.postedAt}
            expiresAt={formattedJob.expiresAt}
            level={formattedJob.level}
            experience={formattedJob.experience}
            education={formattedJob.education}
          />
        </div>
      </div>
    </div>
  );
}

// Helper functions
function formatJobType(
  jobType: string,
  jobSite?: string
): "Full-time" | "Part-time" | "Contract" | "Remote" {
  if (jobSite === "REMOTE") return "Remote";

  switch (jobType) {
    case "FULL_TIME":
      return "Full-time";
    case "PART_TIME":
      return "Part-time";
    case "CONTRACT":
      return "Contract";
    default:
      return "Full-time";
  }
}

function formatExperienceLevel(level: string): string {
  switch (level) {
    case "JUNIOR":
      return "Entry Level";
    case "MID":
      return "Mid Level";
    case "SENIOR":
      return "Senior Level";
    case "LEAD":
      return "Lead Level";
    default:
      return "Not specified";
  }
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function extractResponsibilities(description: string): string[] {
  // Simple extraction - look for bullet points or numbered lists
  const lines = description.split("\n");
  const responsibilities: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.match(/^[-•*]\s/) || trimmed.match(/^\d+\.\s/)) {
      responsibilities.push(
        trimmed.replace(/^[-•*]\s/, "").replace(/^\d+\.\s/, "")
      );
    }
  }

  return responsibilities.length > 0
    ? responsibilities
    : [
        "Work on assigned projects and tasks",
        "Collaborate with team members",
        "Meet project deadlines",
        "Maintain code quality and standards",
      ];
}

function extractRequirements(description: string): string[] {
  // Simple extraction - look for requirements section
  const lines = description.split("\n");
  const requirements: string[] = [];
  let inRequirementsSection = false;

  for (const line of lines) {
    const trimmed = line.trim().toLowerCase();
    if (trimmed.includes("requirement") || trimmed.includes("qualification")) {
      inRequirementsSection = true;
      continue;
    }

    if (
      inRequirementsSection &&
      (trimmed.match(/^[-•*]\s/) || trimmed.match(/^\d+\.\s/))
    ) {
      requirements.push(
        line
          .trim()
          .replace(/^[-•*]\s/, "")
          .replace(/^\d+\.\s/, "")
      );
    }
  }

  return requirements.length > 0
    ? requirements
    : [
        "Relevant experience in the field",
        "Strong communication skills",
        "Ability to work in a team",
        "Problem-solving skills",
      ];
}
