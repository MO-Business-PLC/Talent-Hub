// import type { Route } from "./+types/job.$id";
import { Link, useParams } from "react-router";
import { useState, useEffect } from "react";
import {
  JobHeader,
  JobDescription,
  JobOverview,
} from "../../components/job-detail";
import { getJobById } from "../../lib/api";

// Transform backend job data to frontend format
const transformJobData = (backendJob: any) => {
  return {
    id: backendJob._id,
    title: backendJob.title,
    company: backendJob.createdBy?.name || "Unknown Company",
    location: `${backendJob.location?.city}, ${backendJob.location?.country}`,
    type: backendJob.jobType === "FULL_TIME" ? "Full-time" : 
          backendJob.jobType === "PART_TIME" ? "Part-time" : 
          backendJob.jobType === "CONTRACT" ? "Contract" : "Remote",
    salary: "Competitive", // Backend doesn't have salary field
    postedAt: new Date(backendJob.createdAt).toLocaleDateString(),
    expiresAt: new Date(backendJob.deadline).toLocaleDateString(),
    level: backendJob.experienceLevel === "JUNIOR" ? "Entry Level" :
           backendJob.experienceLevel === "MID" ? "Mid Level" : "Senior Level",
    experience: "2-5 years", // Default since backend doesn't have specific experience range
    education: "Bachelor's Degree", // Default since backend doesn't have education field
    isRemote: backendJob.jobSite === "REMOTE",
    description: backendJob.description,
    responsibilities: [
      "Work on exciting projects and cutting-edge technologies",
      "Collaborate with cross-functional teams",
      "Contribute to product development and innovation",
      "Mentor junior team members",
      "Participate in code reviews and technical discussions"
    ],
    requirements: backendJob.skills || [],
    benefits: [
      "Competitive salary and benefits package",
      "Flexible working hours",
      "Professional development opportunities",
      "Health insurance coverage",
      "Team building activities",
      "Modern office environment"
    ],
    companyInfo: {
      name: backendJob.createdBy?.name || "Company",
      description: "A dynamic company focused on innovation and growth",
      website: "#",
      size: "50-100 employees",
      industry: backendJob.sector || "Technology",
      founded: "2020",
      location: `${backendJob.location?.city}, ${backendJob.location?.country}`,
    },
  };
};

const mockSimilarJobs = [
  {
    id: "2",
    title: "Frontend Engineer",
    company: "StartupXYZ",
    location: "Remote",
    salary: "$100,000 - $130,000",
    type: "Remote" as const,
  },
  {
    id: "3",
    title: "React Developer",
    company: "WebCorp",
    location: "New York, NY",
    salary: "$110,000 - $140,000",
    type: "Full-time" as const,
  },
  {
    id: "4",
    title: "UI Developer",
    company: "DesignTech",
    location: "Austin, TX",
    salary: "$95,000 - $125,000",
    type: "Full-time" as const,
  },
];

export default function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) {
        setError("Job ID is required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await getJobById(id);
        const transformedJob = transformJobData(response.job);
        setJob(transformedJob);
      } catch (err: any) {
        console.error("Error fetching job:", err);
        setError(err.message || "Failed to fetch job details");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-light-gray pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-light-gray pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Job</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link 
            to="/jobs" 
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-light-gray pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Not Found</h2>
          <p className="text-gray-600 mb-4">The job you're looking for doesn't exist or has been removed.</p>
          <Link 
            to="/jobs" 
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

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
            <span className="hover:text-gray-700">Graphics & Design</span>
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
          <div className="lg:col-span-2 space-y-8">
            {/* Job Header */}
            <JobHeader
              title={job.title}
              company={job.company}
              location={job.location}
              type={job.type}
              salary={job.salary}
              postedAt={job.postedAt}
              isRemote={job.isRemote}
              jobId={job.id}
            />

            {/* Job Description */}
            <JobDescription
              description={job.description}
              responsibilities={job.responsibilities}
              requirements={job.requirements}
              benefits={job.benefits}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Job Overview */}
            <JobOverview
              salary={job.salary}
              location={job.location}
              postedAt={job.postedAt}
              expiresAt={job.expiresAt}
              level={job.level}
              experience={job.experience}
              education={job.education}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
