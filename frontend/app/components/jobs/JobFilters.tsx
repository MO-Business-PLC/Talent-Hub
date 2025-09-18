import { useState } from "react";

export interface FilterOptions {
  location: string;
  salaryRange: string;
  salaryType: "Hourly" | "Monthly" | "Yearly";
  datePosted: string;
  workExperience: string;
  employmentType: string[];
}

export interface JobFiltersProps {
  onFiltersChange: (filters: FilterOptions) => void;
  className?: string;
}

export function JobFilters({
  onFiltersChange,
  className = "",
}: JobFiltersProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    location: "",
    salaryRange: "Any",
    salaryType: "Yearly",
    datePosted: "All Time",
    workExperience: "Any Experience",
    employmentType: ["Full-Time"],
  });

  const handleFilterChange = (
    key: keyof FilterOptions,
    value: string | string[]
  ) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleEmploymentTypeChange = (type: string) => {
    const currentTypes = filters.employmentType;
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    handleFilterChange("employmentType", newTypes);
  };

  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Filters</h3>

      <div className="space-y-6">
        {/* Location */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Location</h4>
          <div className="space-y-2">
            {[
              "Near Me",
              "Remote Job",
              "Exact Location",
              "Within 15 Km",
              "Within 30 Km",
              "Within 50 Km",
            ].map(option => (
              <label key={option} className="flex items-center">
                <input
                  type="radio"
                  name="location"
                  value={option}
                  checked={filters.location === option}
                  onChange={e => handleFilterChange("location", e.target.value)}
                  className="w-4 h-4 text-base border-gray-300 focus:ring-base"
                />
                <span className="ml-2 text-sm text-gray-600">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Salary */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Salary</h4>

          {/* Salary Type Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-3">
            {["Hourly", "Monthly", "Yearly"].map(type => (
              <button
                key={type}
                onClick={() => handleFilterChange("salaryType", type)}
                className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                  filters.salaryType === type
                    ? "bg-white text-base shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Salary Range */}
          <div className="space-y-2">
            {["Any", "> 30000k", "> 50000k", "> 80000k", "> 100000k"].map(
              range => (
                <label key={range} className="flex items-center">
                  <input
                    type="radio"
                    name="salaryRange"
                    value={range}
                    checked={filters.salaryRange === range}
                    onChange={e =>
                      handleFilterChange("salaryRange", e.target.value)
                    }
                    className="w-4 h-4 text-base border-gray-300 focus:ring-base"
                  />
                  <span className="ml-2 text-sm text-gray-600">{range}</span>
                </label>
              )
            )}
          </div>
        </div>

        {/* Date of Posting */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Date of posting
          </h4>
          <div className="space-y-2">
            {["All Time", "Last 24 Hours", "Last 3 Days", "Last 7 Days"].map(
              option => (
                <label key={option} className="flex items-center">
                  <input
                    type="radio"
                    name="datePosted"
                    value={option}
                    checked={filters.datePosted === option}
                    onChange={e =>
                      handleFilterChange("datePosted", e.target.value)
                    }
                    className="w-4 h-4 text-base border-gray-300 focus:ring-base"
                  />
                  <span className="ml-2 text-sm text-gray-600">{option}</span>
                </label>
              )
            )}
          </div>
        </div>

        {/* Work Experience */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Work experience
          </h4>
          <div className="space-y-2">
            {["Any Experience", "Internship", "Work Remotely"].map(option => (
              <label key={option} className="flex items-center">
                <input
                  type="radio"
                  name="workExperience"
                  value={option}
                  checked={filters.workExperience === option}
                  onChange={e =>
                    handleFilterChange("workExperience", e.target.value)
                  }
                  className="w-4 h-4 text-base border-gray-300 focus:ring-base"
                />
                <span className="ml-2 text-sm text-gray-600">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Type of Employment */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Type of employment
          </h4>
          <div className="space-y-2">
            {["Full-Time", "Temporary", "Part-Time"].map(type => (
              <label key={type} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.employmentType.includes(type)}
                  onChange={() => handleEmploymentTypeChange(type)}
                  className="w-4 h-4 text-base border-gray-300 rounded focus:ring-base"
                />
                <span className="ml-2 text-sm text-gray-600">{type}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
