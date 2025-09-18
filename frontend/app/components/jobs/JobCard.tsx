import { Link } from "react-router";

export interface JobCardProps {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract" | "Remote";
  salary?: string;
  postedAt: string;
  description: string;
  tags: string[];
  logo?: string;
  isFeatured?: boolean;
  isUrgent?: boolean;
  className?: string;
}

export function JobCard({
  id,
  title,
  company,
  location,
  type,
  salary,
  postedAt,
  description,
  tags,
  logo = "images/jobs/default_company_logo.png",
  isFeatured = false,
  isUrgent = false,
  className = "",
}: JobCardProps) {
  const getTypeColor = (jobType: string) => {
    switch (jobType) {
      case "Full-time":
        return "bg-green-100 text-green-800";
      case "Part-time":
        return "bg-blue-100 text-blue-800";
      case "Contract":
        return "bg-purple-100 text-purple-800";
      case "Remote":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 relative ${className} min-w-[300px]`}
    >
      <div className="flex items-center justify-between">
        {/* Company Logo */}
        <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4">
          {logo ? (
            <img
              src={logo}
              alt={`${company} logo`}
              className="w-8 h-8 object-contain"
            />
          ) : (
            <span className="text-white font-bold text-lg">
              {company.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        <div className="flex-1">
          <h3 className="pl-2 text-[16px] font-[500] text-primary-text">
            {company}
          </h3>
          {/* Location */}
          <div className="flex items-center text-sm text-secondary-text">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {location}
          </div>
        </div>

        {/* Bookmark Icon */}
        <button className=" px-4 text-base hover:text-gray-600 transition-colors">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
        </button>
      </div>

      {/* Job Title */}
      <h4 className="text-lg mb-3 mt-5">{title}</h4>

      <div className="flex items-center justify-start">
        {/* Employment Type Badge */}
        <div className="mb-4 ">
          <span
            className={`px-3 py-1 rounded-xs text-xs font-medium ${getTypeColor(type)}`}
          >
            {type.toUpperCase()}
          </span>
        </div>

        {/* Salary */}
        {salary && (
          <div className="mb-4 ml-2 flex-1">
            <p className="text-sm text-gray-600">Salary: {salary}</p>
          </div>
        )}
      </div>
    </div>
  );
}
