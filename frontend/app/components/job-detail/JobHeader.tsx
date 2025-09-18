import { FiBookmark } from "react-icons/fi";

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
}

export function JobHeader({
  title,
  company,
  location,
  type,
  salary,
  postedAt,
  logo,
  isRemote = false,
  className = "",
}: JobHeaderProps) {
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
            <p className="text-base md:text-lg font-medium mb-3">{company}</p>

            <div className="flex items-center gap-3 mb-1.5">
              <span
                className={`px-3 py-1 rounded-full text-xs md:text-sm font-medium ${getTypeColor(type)}`}
              >
                {type.toUpperCase()}
              </span>
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
          <button className="bg-base hover:bg-primary-600 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-lg font-semibold transition-colors duration-200">
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
}
