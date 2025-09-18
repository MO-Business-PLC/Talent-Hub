import { useState } from "react";

export interface SearchBarProps {
  onSearch?: (query: string, location: string) => void;
  className?: string;
  placeholder?: {
    job?: string;
    location?: string;
  };
  buttonText?: string;
}

export function SearchBar({
  onSearch,
  className = "",
  placeholder = {
    job: "Job title, Keyword...",
    location: "Your Location",
  },
  buttonText = "Find Jobs",
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(query, location);
  };

  return (
    <form onSubmit={handleSubmit} className={`w-full ${className}`}>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex flex-col sm:flex-row">
          {/* Job Search Input */}
          <div className="flex-1 flex items-center px-4 py-3 border-b sm:border-b-0 sm:border-r border-gray-200">
            <svg
              className="w-5 h-5 text-base mr-3 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={placeholder.job}
              className="flex-1 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none text-sm"
            />
          </div>

          {/* Location Input */}
          <div className="flex-1 flex items-center px-4 py-3 border-b sm:border-b-0 sm:border-r border-gray-200">
            <svg
              className="w-5 h-5 text-base mr-3 flex-shrink-0"
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
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder={placeholder.location}
              className="flex-1 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none text-sm"
            />
          </div>

          {/* Search Button */}
          <div className="px-4 py-3">
            <button
              type="submit"
              className="bg-base hover:bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200 text-sm whitespace-nowrap"
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
