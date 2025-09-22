import type { Route } from "./+types/about";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "About Us - Talent Hub" },
    {
      name: "description",
      content:
        "Learn about TalentHub and how we connect talent with opportunity.",
    },
  ];
}

export default function About() {
  return (
    <div className="">
      {/* Top section */}
      <section className="relative overflow-hidden">
        {/* Subtle background pattern */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_#e5e7eb_1px,_transparent_0)] [background-size:16px_16px] opacity-60"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left: copy */}
            <div>
              <h1 className="text-3xl sm:text-4xl  text-gray-900 mb-4">
                About <span className="text-base">Us</span>
              </h1>
              <p className="text-xl text-gray-800 leading-8">
                <span className="text-base font-semibold">Your</span> trusted
                partner in connecting talent with{" "}
                <span className="text-base font-semibold">opportunities</span>.
              </p>

              <p className="mt-6 text-gray-600 leading-7">
                TalentHub is a career platform built to bridge the gap between
                job seekers and employers. We empower professionals to find
                opportunities that match their skills, while giving companies
                access to a diverse pool of talent.
              </p>

              <p className="mt-4 text-gray-600 leading-7">
                With a focus on simplicity, trust, and growth, we help people
                build their careers and organizations build strong teams.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#mission"
                  className="inline-flex items-center justify-center rounded-xs bg-base px-5 py-2.5 text-white font-medium hover:bg-[#155d97] transition-colors"
                >
                  Learn More
                </a>
                <Link
                  to="/jobs"
                  className="inline-flex items-center justify-center rounded-xs bg-dark px-5 py-2.5 text-white font-medium hover:bg-dark transition-colors"
                >
                  Browse Jobs
                </Link>
              </div>
            </div>

            {/* Right: image */}
            <div className="relative">
              <div className="aspect-[4/3] sm:aspect-[5/4] lg:aspect-[3/3] w-full rounded-2xl  overflow-hidden flex items-end justify-center p-4">
                <img
                  src="/about1.png"
                  alt="TalentHub team member"
                  className="max-h-full object-contain"
                  onError={(e) => {
                    // Hide broken image icon if the asset isn't present
                    const target = e.currentTarget as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Stats section */}
      <section id="mission" className="">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Divider line */}
          <div className="h-px bg-gray-200 w-full mb-8"></div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
            {/* Stat 1 */}
            <div className="flex flex-col items-center">
              <svg
                className="w-8 h-8 text-amber-500 mb-3"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 2l2.917 5.911 6.527.949-4.722 4.603 1.115 6.5L12 17.77l-5.837 3.193 1.115-6.5L2.556 8.86l6.527-.949L12 2z" />
              </svg>
              <div className="text-2xl font-semibold text-gray-900">95 %</div>
              <div className="text-sm text-gray-500">Customer Satisfaction</div>
            </div>

            {/* Stat 2 */}
            <div className="flex flex-col items-center">
              <svg
                className="w-8 h-8 text-gray-900 mb-3"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <circle cx="12" cy="8" r="3"></circle>
                <circle cx="5.5" cy="10" r="2"></circle>
                <circle cx="18.5" cy="10" r="2"></circle>
                <path d="M12 13c-3 0-6 1.5-6 4v1h12v-1c0-2.5-3-4-6-4z"></path>
              </svg>
              <div className="text-2xl font-semibold text-gray-900">10 K</div>
              <div className="text-sm text-gray-500">candidates</div>
            </div>

            {/* Stat 3 */}
            <div className="flex flex-col items-center">
              <svg
                className="w-8 h-8 text-gray-900 mb-3"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 20h18"></path>
                <path d="M7 20v-6"></path>
                <path d="M12 20v-10"></path>
                <path d="M17 20v-4"></path>
                <path d="M9 11l3-3 3 3 3-3"></path>
              </svg>
              <div className="text-2xl font-semibold text-gray-900">87.4 %</div>
              <div className="text-sm text-gray-500">
                Hiring rate of companies
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left: image */}
            <div className="order-1">
              <div className="w-full max-w-md lg:max-w-none mx-auto">
                <img
                  src="/about2.png"
                  alt="Smiling professional using laptop"
                  className="w-full h-auto object-contain"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              </div>
            </div>

            {/* Right: copy */}
            <div className="order-2">
              <h2 className="text-3xl sm:text-4xl  text-gray-900 leading-snug">
                Unlock career{" "}
                <span className="text-[#1E73BE]">opportunities</span> with
                <span> </span>
                <span className="text-[#1E73BE]">ease</span> and confidence
              </h2>
              <p className="mt-4 text-gray-600 leading-7">
                At TalentHub, we simplify the hiring journey for both job
                seekers and employers. With our smart matching tools and trusted
                network, professionals can discover opportunities that fit their
                goals, while companies connect with the right talent faster.
              </p>

              {/* Bullet list */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 text-[#1E73BE] flex-shrink-0 mt-0.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.879 7.707 9.586a1 1 0 10-1.414 1.414L9 13.707l4.707-4.707z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="ml-3 text-gray-800">
                      Smart job matching
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 text-[#1E73BE] flex-shrink-0 mt-0.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.879 7.707 9.586a1 1 0 10-1.414 1.414L9 13.707l4.707-4.707z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="ml-3 text-gray-800">
                      Verified employers
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 text-[#1E73BE] flex-shrink-0 mt-0.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.879 7.707 9.586a1 1 0 10-1.414 1.414L9 13.707l4.707-4.707z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="ml-3 text-gray-800">
                      Fast applications
                    </span>
                  </li>
                </ul>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 text-[#1E73BE] flex-shrink-0 mt-0.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.879 7.707 9.586a1 1 0 10-1.414 1.414L9 13.707l4.707-4.707z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="ml-3 text-gray-800">Global reach</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 text-[#1E73BE] flex-shrink-0 mt-0.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.879 7.707 9.586a1 1 0 10-1.414 1.414L9 13.707l4.707-4.707z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="ml-3 text-gray-800">
                      Support for growth
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
