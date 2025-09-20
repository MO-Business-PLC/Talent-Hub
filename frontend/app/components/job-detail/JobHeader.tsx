import { FiBookmark } from "react-icons/fi";
import { Link, useNavigate } from "react-router";
import { isAuthenticated } from "../../lib/auth";
import { useToast } from "../../components/ui";

export interface JobHeaderProps {
  title: string;
  company: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract" | "Remote";
  salary?: string;
  postedAt: string;
  logo?: string;
  isRemote?: boolean;
  className?: string;
  jobId?: string;
}

export function JobHeader({
  title,
  company,
  location,
  type,
  salary,
  postedAt,
  logo = "/images/jobs/default_company_logo.png",
  isRemote = false,
  className = "",
  jobId,
}: JobHeaderProps) {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleApplyClick = () => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      showToast({
        type: 'warning',
        title: 'Login Required',
        message: 'Please login first to apply for this job.',
        duration: 4000
      });
      // Delay redirect to give users time to see the toast
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      return;
    }
    
    if (jobId) {
      navigate(`/jobs/${jobId}/apply`);
    } else {
      navigate("/jobs");
    }
  };

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
    <div className={`rounded-2xl p-6 md:p-8 shadow-sm ${className}`}>
      <div className="flex items-start justify-between gap-6">
        <div className="flex items-start gap-4 md:gap-5">
          {/* Company Logo */}
          <div className="w-14 h-14 md:w-16 md:h-16 bg-black rounded-xl flex items-center justify-center flex-shrink-0">
            {logo ? (
              <img
                src={logo}
                alt={`${company} logo`}
                className="w-12 h-12 object-contain"
              />
            ) : (
              <span className="text-yellow-400 font-bold text-xl md:text-2xl">
                2F
              </span>
            )}
          </div>

          {/* Job Info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1.5">
              {title}
            </h1>
            <div className="flex gap-2">
              <p className="md:text-lg text-secondary-text mb-3">{company}</p>

              <div className="flex items-center gap-4 mb-1.5">
                <span
                  className={`px-3 py-1 rounded-sm text-xs md:text-sm font-medium ${getTypeColor(type)}`}
                >
                  {type.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 md:gap-4">
          <button
            aria-label="save job"
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiBookmark className="w-6 h-6" />
          </button>
          <button
            onClick={handleApplyClick}
            className="bg-base hover:bg-primary-600 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-sm font-semibold transition-colors duration-200"
          >
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
}
