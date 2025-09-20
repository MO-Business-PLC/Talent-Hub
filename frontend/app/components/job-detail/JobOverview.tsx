import {
  FiCalendar,
  FiClock,
  FiLayers,
  FiBriefcase,
  FiBookOpen,
  FiMap,
  FiCopy,
  FiLinkedin,
  FiFacebook,
  FiSend,
} from "react-icons/fi";

export interface JobOverviewProps {
  salary: string;
  location: string;
  postedAt: string;
  expiresAt: string;
  level: string;
  experience: string;
  education: string;
  className?: string;
}

export function JobOverview({
  salary,
  location,
  postedAt,
  expiresAt,
  level,
  experience,
  education,
  className = "",
}: JobOverviewProps) {
  const overviewItems = [
    {
      icon: <FiCalendar className="w-8 h-8" />,
      label: "JOB POSTED",
      value: postedAt,
    },
    {
      icon: <FiClock className="w-8 h-8" />,
      label: "JOB EXPIRE IN",
      value: expiresAt,
    },
    {
      icon: <FiLayers className="w-8 h-8" />,
      label: "JOB LEVEL",
      value: level,
    },
    {
      icon: <FiBriefcase className="w-8 h-8" />,
      label: "EXPERIENCE",
      value: experience,
    },
    {
      icon: <FiBookOpen className="w-8 h-8" />,
      label: "EDUCATION",
      value: education,
    },
  ];

  return (
    <div className={`${className}`}>
      <div className="mb-6 bg-white p-12 rounded-lg flex justify-between items-center">
        {/* Salary */}
        <div className="text-center flex-1">
          <h3 className="text-[16px] font-medium text-gray-700 mb-2">
            Salary (ETB)
          </h3>
          <p className="text-xl text-green-600">{salary}</p>
          <p className="text-sm text-gray-500">Monthly Net Salary</p>
        </div>

        {/* Vertical Separator */}
        <div className="mx-8 h-12 w-px bg-gray-200" />

        {/* Job Location */}
        <div className="flex flex-col items-center justify-center text-center flex-1">
          <FiMap className="w-5 h-5 text-base mb-2" />
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Job Location
          </h3>
          <span className="text-gray-900">{location}</span>
        </div>
      </div>

      {/* Job Overview */}
      <div className="bg-white p-12 rounded-lg">
        <h3 className="text-lg text-gray-900 mb-4">Job Overview</h3>
        <div className="grid grid-cols-3 gap-4">
          {overviewItems.map(item => (
            <div key={item.label} className="">
              <div className="text-base mb-3">{item.icon}</div>
              <p className="text-xs text-gray-500 font-medium">{item.label}</p>
              <p className="text-s text-gray-900">{item.value}</p>
            </div>
          ))}
        </div>
        {/* Share Job */}
        <div className="pt-12">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Share this job:
          </h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center space-x-2 bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 px-4 rounded-lg border border-blue-200 transition-colors duration-200">
              <FiCopy className="w-4 h-4" />
              <span className="text-sm font-medium">Copy Links</span>
            </button>

            <div className="flex justify-center space-x-3">
              <button className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors duration-200">
                <FiSend className="w-5 h-5 text-blue-600" />
              </button>
              <button className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors duration-200">
                <FiLinkedin className="w-5 h-5 text-blue-600" />
              </button>
              <button className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors duration-200">
                <FiFacebook className="w-5 h-5 text-blue-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
