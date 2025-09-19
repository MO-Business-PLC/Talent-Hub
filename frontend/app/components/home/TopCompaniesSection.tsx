import React from "react";
import { Link } from "react-router";

const companies = Array.from({ length: 6 }).map((_, i) => ({
  id: `c-${i + 1}`,
  name: "2f Capital",
  featured: true,
  location: "Addis Ababa, Ethiopia",
  openPositions: 3,
  logo: "/images/jobs/default_company_logo.png",
}));

export default function TopCompaniesSection() {
  return (
    <section className="relative w-full">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="bg-white p-4 md:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <h2 className="text-lg md:text-[28px] font-semibold text-black">
              Top companies
            </h2>
            <Link
              to="/companies"
              className="text-sm md:text-[16px] text-dark font-medium inline-flex items-center gap-2 hover:underline"
            >
              Show all companies
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {companies.map((c) => (
              <CompanyCard key={c.id} {...c} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CompanyCard({
  name,
  featured,
  location,
  openPositions,
  logo,
}: {
  name: string;
  featured?: boolean;
  location: string;
  openPositions: number;
  logo: string;
}) {
  return (
    <div className="rounded-2xl border border-[#E5EAF1] bg-white p-4 md:p-5">
      <div className="flex items-start gap-3">
        <img
          src={logo}
          alt={name}
          className="w-12 h-12 md:w-14 md:h-14 rounded-lg object-contain bg-[#F5F7FB]"
        />
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-[15px] md:text-[16px] font-semibold text-[#0F172A] truncate">
              {name}
            </h3>
            {featured && (
              <span className="text-[11px] md:text-[12px] px-2 py-0.5 rounded-full bg-[#EAF2FF] text-[#1E73BE] font-medium whitespace-nowrap">
                Featured
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-[#6B7280] text-[12px] md:text-[13px]">
            <Pin className="w-4 h-4 text-[#A0AEC0]" />
            <span>{location}</span>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <Link
          to={`/jobs?company=${encodeURIComponent(name)}`}
          className="w-full inline-flex items-center justify-center rounded-xl bg-[#EAF2FF] text-[#1E73BE] font-semibold text-[13px] md:text-[14px] py-2"
        >
          Open Position ({openPositions})
        </Link>
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
