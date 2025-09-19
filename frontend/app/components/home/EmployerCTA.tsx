import React from "react";
import { Link } from "react-router";

export default function EmployerCTA() {
  return (
    <section className="relative w-full">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        {/* Gradient card */}
        <div
          className="relative overflow-hidden rounded-2xl px-6 py-8 md:px-10 md:py-10"
          style={{
            background: "linear-gradient(90deg,#1E73BE  0%,  #154B7C 100%)",
          }}
        >
          {/* Stars decoration (right side) */}
          <div className="absolute top-0 right-0">
            <img
              src="/images/auth/stars.png"
              alt=""
              className="w-[250px] h-[300px] opacity-50"
            />
          </div>

          <div className="relative max-w-2xl">
            <h3 className="text-white font-semibold leading-tight text-3xl sm:text-4xl">
              Start sharing your job
              <br className="hidden sm:block" /> today!
            </h3>
            <p className="mt-3 sm:mt-4 text-white/90 text-sm">
              With over 3.8 million candidates, you're bound to find the perfect
              fit!
            </p>
            <div className="mt-6">
              <Link
                to="/register?role=employer"
                className="inline-flex items-center rounded-md text-sm bg-white px-4 py-2 text-[#1E73BE] font-semibold shadow-sm hover:bg-white/95"
              >
                Sign Up For Free Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Star({
  className = "w-12 h-12 text-white/15",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M12 2.5c.3 2.8 1.7 4.2 4.5 4.5-2.8.3-4.2 1.7-4.5 4.5-.3-2.8-1.7-4.2-4.5-4.5 2.8-.3 4.2-1.7 4.5-4.5Z"
        fill="currentColor"
      />
    </svg>
  );
}
