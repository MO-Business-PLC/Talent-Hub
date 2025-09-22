import React, { useEffect, useState } from "react";
import { getPublicStats, type PublicStats } from "~/lib/api";

function formatNumber(n: number) {
  // Use Indian grouping to match existing visual style (e.g., 1,75,324)
  try {
    return new Intl.NumberFormat("en-IN").format(n);
  } catch {
    return new Intl.NumberFormat().format(n);
  }
}

export default function TopCompanies() {
  const [stats, setStats] = useState<PublicStats | null>(null);
  const [hasTried, setHasTried] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getPublicStats()
      .then((data) => {
        if (!cancelled) setStats(data);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setHasTried(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);
  return (
    <section className="relative w-full">
      {/* Subtle top background image for depth */}
      <div
        className="absolute inset-0 pointer-events-none select-none"
        aria-hidden
        style={{
          backgroundImage: "url(/images/home/landing_page_top.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.08,
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        {/* Heading */}
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl font-semibold text-black/70">
            Top Companies <span className="text-[#1E73BE]">Hiring</span> Now
          </h2>
          <p className="mt-2 text-sm md:text-[15px] font-semibold text-black/70">
            Trusted by 120,000+ businesses worldwide to find top talent
          </p>
        </div>

        {/* Logos strip with edge fade */}
        <div className="flex items-center justify-center mb-8 md:mb-12">
          <div
            className="relative w-full flex justify-center"
            style={{
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0, black 8%, black 92%, transparent 100%)",
              maskImage:
                "linear-gradient(to right, transparent 0, black 8%, black 92%, transparent 100%)",
            }}
          >
            <img
              src="/images/home/companies.png"
              alt="Trusted companies logos"
              className="max-w-full w-[980px] h-auto object-contain opacity-90"
              loading="lazy"
            />
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-5">
          <StatCard
            icon="/icons/home/briefcase.png"
            value={
              stats ? formatNumber(stats.jobs.total) : hasTried ? "0" : "1,75,324"
            }
            label="Live Job"
          />
          <StatCard
            icon="/icons/home/building.png"
            value={
              stats
                ? formatNumber(stats.users.employers)
                : hasTried
                ? "0"
                : "97,354"
            }
            label="Companies"
          />
          <StatCard
            icon="/icons/home/avatar.png"
            value={
              stats
                ? formatNumber(stats.users.employees)
                : hasTried
                ? "0"
                : "38,47,154"
            }
            label="Candidates"
          />
          <StatCard
            icon="/icons/home/briefcase.png"
            value={
              stats ? formatNumber(stats.jobs.today) : hasTried ? "0" : "7,532"
            }
            label="New Jobs"
          />
        </div>
      </div>
    </section>
  );
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: string;
  value: string;
  label: string;
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-100 px-4 md:px-6 py-4 md:py-5 flex items-center gap-3 md:gap-4">
      <div className="shrink-0 grid place-items-center w-10 h-10 md:w-16 md:h-16 rounded-lg bg-background-light">
        <img src={icon} alt="" className="w-5 h-5 md:w-8 md:h-8" />
      </div>
      <div>
        <div className="text-lg md:text-2xl font-semibold text-primary-text leading-tight">
          {value}
        </div>
        <div className="text-[12px] md:text-base text-text-secondary">
          {label}
        </div>
      </div>
    </div>
  );
}
