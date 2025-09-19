import React from "react";
import { Link } from "react-router";

export default function CandidateCTA() {
  return (
    <section className="relative w-full">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="relative overflow-hidden rounded-2xl bg-white border md:border-[#E5EAF1] border-[#E5EAF1] p-6 md:p-10 max-w-3xl md:max-w-none mx-auto">
          <div className="flex flex-col md:flex-row items-center md:items-center gap-6 md:gap-10">
            {/* Left copy */}
            <div className="flex-1 min-w-0 text-center md:text-left order-2 md:order-1">
              <h3 className="text-[#0F172A] font-semibold leading-tight text-[22px] sm:text-3xl">
                Control the job opportunities
                <br className="hidden sm:block" /> you see.
              </h3>
              <p className="mt-3 text-[#6B7280] text-sm leading-relaxed max-w-xl mx-auto md:mx-0">
                Sign up today to unlock personalized listings tailored to your
                skills—and get noticed by employers who are ready to hire.
              </p>
              <div className="mt-5">
                <Link
                  to="/register?role=employee"
                  className="inline-flex items-center justify-center rounded-md bg-[#1E73BE] px-4 py-2 text-white text-sm font-semibold shadow-sm hover:bg-[#155d97] w-full md:w-auto"
                >
                  Register Now
                </Link>
              </div>
            </div>

            {/* Right avatar decoration */}
            <div className="relative shrink-0 w-[220px] h-[220px] md:w-[220px] md:h-[220px] order-1 md:order-2 mb-2 md:mb-0">
              {/* Dots behind */}
              <div
                className="absolute -right-2 top-5 w-16 h-24 sm:w-20 sm:h-28 opacity-50 text-[#1E73BE]"
                style={{
                  backgroundImage:
                    "radial-gradient(currentColor 2px, transparent 2px)",
                  backgroundSize: "12px 12px",
                  backgroundPosition: "0 0",
                }}
              />
              {/* Blue circle with white ring */}
              <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full bg-[#EAF2FF] ring-4 ring-white" />
              {/* Avatar masked to circle */}
              <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full overflow-hidden">
                <img
                  src="/images/home/cardavatar.png"
                  alt="Happy candidate"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
