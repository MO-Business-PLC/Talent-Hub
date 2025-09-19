import React from "react";
import JobSearchBar from "./JobSearchBar";

function Hero() {
  return (
    <div className="relative w-full overflow-hidden min-h-[460px] sm:min-h-[500px] lg:h-[500px]">
      {/* Background top image (decorative) */}
      <img
        className="pointer-events-none select-none absolute -top-24 sm:-top-20 w-full max-w-none"
        src="/images/home/landing_page_top.jpg"
        alt=""
        aria-hidden="true"
        loading="lazy"
      />
      {/* Light overlay */}
      <div className="absolute inset-0 bg-white/70" />

      <div className="relative flex flex-col justify-center px-5 sm:px-8 lg:px-16 xl:px-24 py-12 lg:py-0">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-10 lg:gap-32 xl:gap-52">
          {/* Left Section */}

          <div className="w-full max-w-xl flex flex-col gap-3 text-center lg:text-left">
            <h1 className="text-background-dark font-bold leading-[1.05] text-4xl sm:text-5xl md:text-6xl lg:text-[80px] tracking-tight">
              Explore{" "}
              <span className="relative inline-block align-baseline">
                {/* Decorative Line */}
                <img
                  className="absolute -top-2 left-0 object-contain z-0 w-24 sm:w-28 md:w-32 lg:w-auto hidden xs:block"
                  src="/images/home/Abstract_Line.jpg"
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                />
                <span className="relative z-10">Jobs</span>
              </span>
            </h1>
            <h2 className="text-background-dark font-bold leading-[1.05] text-4xl sm:text-5xl md:text-6xl lg:text-[80px] tracking-tight">
              Opportunities
            </h2>
            <p className="text-text-secondary text-sm  sm:text-text-secondary md:text-lg lg:text-2xl mt-3 sm:mt-4">
              A powerful career platform designed for ambitious professionals
              and passionate talent eager to grow with innovative startups.
            </p>
            <div className="mt-4 sm:mt-6 w-full">
              <JobSearchBar />
            </div>
            <p className="text-social text-xs sm:text-sm mt-2 sm:mt-3">
              Suggestions:{" "}
              <span className="text-text-secondary">
                UI Designer, UX Researcher, Android, Admin
              </span>
            </p>
          </div>

          {/* Right Section */}
          <div className="flex-1 w-full flex items-center justify-center lg:justify-end">
            <div className="relative w-72 sm:w-80 md:w-[380px] lg:w-[460px] xl:w-[500px]">
              <img
                className="w-full h-auto rounded-xl shadow-sm"
                src="/images/home/landing_page_hero.jpg"
                alt="Professionals collaborating illustration"
                loading="lazy"
              />
              <img
                src="/images/home/landing_candidates.jpg"
                className="absolute rounded-2xl bottom-0 right-2 sm:right-4 w-32 sm:w-40 md:w-48 lg:w-56 shadow-lg"
                alt="Happy candidates"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
