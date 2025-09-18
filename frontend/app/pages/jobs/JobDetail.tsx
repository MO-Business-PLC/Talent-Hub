// import type { Route } from "./+types/job.$id";
import { Link, useParams } from "react-router";
import {
  JobHeader,
  JobDescription,
  JobOverview,
} from "../../components/job-detail";

// Mock data - replace with actual API calls
const mockJobData = {
  id: "1",
  title: "Senior UX Designer",
  company: "2F Capital",
  location: "Addis Ababa, Bole",
  type: "Full-time" as const,
  salary: "25K - 35K",
  postedAt: "23 Aug, 2025",
  expiresAt: "29 Aug, 2025",
  level: "Entry Level",
  experience: "6 - 12 month",
  education: "Graduation",
  isRemote: false,
  description:
    "We're looking for a talented Senior UX Designer to join our dynamic team.",
  responsibilities: [
    "Develop and maintain high-quality web applications using React, TypeScript, and modern frontend technologies",
    "Collaborate with designers and backend engineers to implement user-friendly interfaces",
    "Optimize applications for maximum speed and scalability",
    "Write clean, maintainable, and well-documented code",
    "Participate in code reviews and mentor junior developers",
    "Stay up-to-date with the latest frontend trends and technologies",
    "Contribute to technical decisions and architecture discussions",
  ],
  requirements: [
    "Strong troubleshooting and analytical skills",
    "Over 3 years of back-end development experience",
    "Proficiency in HTML, JavaScript, CSS, PHP, Symfony, and/or Laravel",
    "Experience with APIs and Web Services (REST, GraphQL, SOAP, etc.)",
    "Familiarity with Agile development, commercial software, middleware, servers, storage, and database management",
    "Experience with version control and project management tools (e.g., GitHub, Jira)",
    "Ambition and eagerness to advance in a rapidly growing agency",
  ],
  benefits: [
    "Early finishes on Fridays (4:30 PM finish, plus a drink)",
    "28 days of holiday (increasing annually), plus a birthday day off",
    "Generous annual bonus",
    "Comprehensive healthcare package",
    "Paid community days for charity",
    "£100 contribution towards personal learning and development",
    "Free breakfast on Mondays and office snacks",
    "Access to Perkbox for discounts and free points",
    "Cycle to Work Scheme",
  ],
  companyInfo: {
    name: "2F Capital",
    description:
      "2F Capital is a leading technology company that builds innovative solutions for businesses worldwide. We're passionate about creating products that solve real-world problems and make people's lives easier.",
    website: "https://2fcapital.com",
    size: "50-100 employees",
    industry: "Technology",
    founded: "2020",
    location: "Addis Ababa, Ethiopia",
  },
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

  // In a real app, you would fetch job data based on the id
  // const { data: job, loading, error } = useJobQuery(id);

  const job = mockJobData;

  return (
    <div className="min-h-screen bg-light-gray">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-base rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">TH</span>
                </div>
                <span className="text-xl font-bold text-gray-900">
                  TalentHub
                </span>
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <Link
                  to="/jobs"
                  className="text-base border-b-2 border-base px-3 py-2 text-sm font-medium"
                >
                  Jobs
                </Link>
                <Link
                  to="/about"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                >
                  About Us
                </Link>
                <Link
                  to="/contact"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                >
                  Contact
                </Link>
              </div>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <Link
                to="/register"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                className="bg-base hover:bg-primary-600 text-white px-4 py-2 text-sm font-medium rounded-lg"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
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
