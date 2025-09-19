import React from "react";
import { Link } from "react-router";

// Using existing icons from public/icons/home
const ICONS = {
  briefcase: "/icons/home/briefcase.png",
  building: "/icons/home/building.png",
  avatar: "/icons/home/avatar.png",
};

const CATEGORIES: Array<{
  key: string;
  name: string;
  jobs: string;
  icon: keyof typeof ICONS;
  to?: string;
  highlight?: boolean;
}> = [
  {
    key: "tech",
    name: "Technology",
    jobs: "436 jobs available",
    icon: "briefcase",
    to: "/jobs?category=technology",
  },
  {
    key: "eng",
    name: "Engineering",
    jobs: "542 jobs available",
    icon: "building",
    to: "/jobs?category=engineering",
  },
  {
    key: "biz",
    name: "Business",
    jobs: "211 jobs available",
    icon: "briefcase",
    to: "/jobs?category=business",
  },
  {
    key: "hr",
    name: "Human Resource",
    jobs: "346 jobs available",
    icon: "avatar",
    to: "/jobs?category=hr",
  },
  {
    key: "design",
    name: "Design",
    jobs: "235 jobs available",
    icon: "avatar",
    to: "/jobs?category=design",
  },
  {
    key: "sales",
    name: "Sales",
    jobs: "756 jobs available",
    icon: "avatar",
    to: "/jobs?category=sales",
  },
  {
    key: "finance",
    name: "Finance",
    jobs: "325 jobs available",
    icon: "building",
    to: "/jobs?category=finance",
  },
  {
    key: "marketing",
    name: "Marketing",
    jobs: "140 jobs available",
    icon: "briefcase",
    to: "/jobs?category=marketing",
    highlight: true,
  },
];

export default function ExploreCategories() {
  return (
    <section className="relative w-full">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="bg-white  p-4 md:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <h2 className="text-lg md:text-[28px] font-semibold text-black">
              Explore Job by <span className="text-[#1E73BE]">category</span>
            </h2>
            <Link
              to="/jobs"
              className="text-sm md:text-[16px] text-dark font-medium inline-flex items-center gap-2 hover:underline"
            >
              Show all jobs
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {CATEGORIES.map(({ key, ...rest }) => (
              <CategoryCard key={key} {...(rest as any)} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CategoryCard({
  name,
  jobs,
  icon,
  to = "/jobs",
  highlight,
}: {
  name: string;
  jobs: string;
  icon: keyof typeof ICONS;
  to?: string;
  highlight?: boolean;
}) {
  const cardBase =
    "rounded-2xl border border-background-light transition-all duration-150";
  const normal =
    "bg-white border-[#E5EAF1] hover:border-[#1E73BE]/60 hover:shadow-sm";
  const active = "bg-[#1E73BE] border-[#1E73BE] text-white";

  return (
    <Link
      to={to}
      className={`group relative ${cardBase} ${highlight ? active : normal} px-5 py-5 md:px-6 md:py-6 block min-h-[168px]`}
    >
      <div className="flex flex-col items-start gap-4">
        <div
          className={`grid place-items-center rounded-xl w-11 h-11 md:w-12 md:h-12`}
        >
          <img
            src={ICONS[icon]}
            alt=""
            className={`w-5 h-5 md:w-10 md:h-10 ${highlight ? "bg-white brightness-200" : ""}`}
          />
        </div>
        <div
          className={`text-[16px] md:text-[24px] font-semibold leading-6 ${highlight ? "text-white" : "text-dark"}`}
        >
          {name}
        </div>
        <div
          className={`mt-[-4px] inline-flex items-center gap-2 text-[12px] md:text-[14px] ${highlight ? "text-white/85" : "text-[#7C8493]"}`}
        >
          {jobs}
          <ArrowRight
            className={`w-5 h-5 ${highlight ? "text-white" : "text-[#154B7C]"}`}
          />
        </div>
      </div>
    </Link>
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

function ArrowRightCircle({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M8 12h8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M12 8l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
