import React from "react";
import { Link } from "react-router";
import { useJobSearch, formatJobForDisplay } from "../../hooks/useJobSearch";
import { JobCard } from "../jobs";

export default function ActiveJobsSection() {
  const { jobs, isLoading } = useJobSearch({ limit: 12 });

  // Format jobs for display
  const formattedJobs = jobs.map(formatJobForDisplay);
  
  // Show loading state
  if (isLoading) {
    return (
      <section className="relative w-full">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <div className="bg-white p-4 md:p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="h-48 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Show empty state if no jobs
  if (formattedJobs.length === 0) {
    return (
      <section className="relative w-full">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <div className="bg-white p-4 md:p-6">
            <div className="text-center py-12">
              <h2 className="text-lg md:text-[28px] font-semibold text-black mb-4">
                No active jobs at the moment
              </h2>
              <p className="text-gray-600 mb-6">
                Check back later for new job opportunities.
              </p>
              <Link
                to="/jobs"
                className="text-sm md:text-[16px] text-dark font-medium inline-flex items-center gap-2 hover:underline"
              >
                Browse all jobs
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // render the first 9 and tease the rest with a fade overlay
  const visible = formattedJobs.slice(0, 9);

  return (
    <section className="relative w-full">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="bg-white p-4 md:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <h2 className="text-lg md:text-[28px] font-semibold text-black">
              Active jobs right now
            </h2>
            <Link
              to="/jobs"
              className="text-sm md:text-[16px] text-dark font-medium inline-flex items-center gap-2 hover:underline"
            >
              Show all jobs
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Grid wrapper with fade teaser */}
          <div className="relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {visible.map((job) => (
                <JobCard key={job.id} {...job} />
              ))}
            </div>

            {/* Bottom fade overlay */}
            <div
              aria-hidden
              className="pointer-events-none absolute left-0 right-0 bottom-0 h-24 md:h-28"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.85) 50%, rgba(255,255,255,1) 100%)",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function ArrowRight({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M5 12h14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}