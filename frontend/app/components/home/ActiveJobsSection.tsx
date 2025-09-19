import React from "react";
import { Link } from "react-router";

const jobs = Array.from({ length: 12 }).map((_, i) => ({
  id: `j-${i + 1}`,
  company: "2f Capital",
  location: "Addis Ababa, Ethiopia",
  title: "UI/UX Designer",
  type: "FULL-TIME",
  salary: "Salary: $20,000 - $25,000",
  logo: "/images/jobs/default_company_logo.png",
}));

export default function ActiveJobsSection() {
  // render the first 9 and tease the rest with a fade overlay
  const visible = jobs.slice(0, 9);

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
              {visible.map((j) => (
                <JobCard key={j.id} {...j} />
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

function JobCard({
  company,
  location,
  title,
  type,
  salary,
  logo,
}: {
  company: string;
  location: string;
  title: string;
  type: string;
  salary: string;
  logo: string;
}) {
  return (
    <div className="h-full rounded-2xl border border-[#E5EAF1] bg-white p-4 md:p-5  transition-colors hover:border-[#1E73BE]/40">
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <img
            src={logo}
            alt={company}
            className="w-10 h-10 md:w-12 md:h-12 rounded-lg object-contain bg-[#F5F7FB]"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-[14px] md:text-[15px] font-semibold text-[#0F172A] truncate">
                {company}
              </h3>
            </div>
            <div className="flex items-center gap-2 text-[#6B7280] text-[12px] md:text-[13px]">
              <Pin className="w-4 h-4 text-[#A0AEC0]" />
              <span className="truncate">{location}</span>
            </div>
          </div>
        </div>

        <button
          aria-label="Save job"
          className="shrink-0 grid place-items-center w-9 h-9 rounded-lg border border-[#DDE6F2] text-[#7FA7D6] hover:text-[#1E73BE]"
        >
          <Bookmark className="w-5 h-5" />
        </button>
      </div>

      {/* Divider */}
      <div className="my-3 md:my-4 h-px bg-[#EEF2F6]" />

      {/* Title */}
      <div className="mb-2 text-[16px] md:text-[18px] font-semibold text-[#0F172A]">
        {title}
      </div>

      {/* Meta */}
      <div className="flex items-center gap-3">
        <span className="text-[11px] md:text-[12px] px-2 py-1 rounded-md bg-[#18C964] text-white font-semibold uppercase tracking-wide">
          {type}
        </span>
        <span className="text-[12px] md:text-[13px] text-[#6B7280]">
          {salary}
        </span>
      </div>
    </div>
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

function Pin({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M12 21s7-5.5 7-11a7 7 0 10-14 0c0 5.5 7 11 7 11z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function Bookmark({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M6.5 4.75h11a.75.75 0 01.75.75v14.5a.25.25 0 01-.39.21L12 16.5l-5.86 3.71a.25.25 0 01-.39-.21V5.5a.75.75 0 01.75-.75z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
