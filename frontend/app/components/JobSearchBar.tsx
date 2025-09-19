import { FaSearch, FaMapMarkerAlt } from "react-icons/fa";

export default function JobSearchBar() {
  return (
    <div className="mt-6 flex w-full max-w-3xl items-center rounded-sm border  bg-white px-4 py-2 shadow-neutral-300 shadow-sm">
      {/* Search Icon + Input */}
      <div className="flex flex-1 items-center gap-2">
        <FaSearch className="text-base text-lg" />
        <input
          type="text"
          placeholder="Job title, Keyword..."
          className="w-full border-none outline-none text-gray-700 placeholder-gray-400"
        />
      </div>

      {/* Divider */}
      <div className="h-6 w-px bg-gray-300 mx-3"></div>

      {/* Location Icon + Input */}
      <div className="flex flex-1 items-center gap-2">
        <FaMapMarkerAlt className="text-base text-lg" />
        <input
          type="text"
          placeholder="Your Location"
          className="w-full border-none outline-none text-gray-700 placeholder-gray-400"
        />
      </div>

      {/* Button */}
      <button className="ml-4 rounded-sm bg-base px-6 py-2 text-white font-medium hover:bg-blue-700 transition">
        Find Jobs
      </button>
    </div>
  );
}
