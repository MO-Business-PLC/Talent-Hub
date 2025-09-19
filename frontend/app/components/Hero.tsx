import JobSearchBar from "./JobSearchBar";

function Hero() {
  return (
    <div className="relative h-[500px] w-full overflow-hidden">
      <img
        className="absolute -top-20"
        src="/images/home/landing_page_top.jpg"
      />
      <div className="absolute top-0 left-0 w-full h-full bg-white opacity-70"></div>
      <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center px-4">
        <div className="flex mx-20 gap-60 items-center">
          {/* Left Section */}
          <div className="max-w-[550px] flex flex-col gap-2">
            <h1 className="text-background-dark text-[80px] font-bold leading-tight">
              Explore{" "}
              <span className="relative inline-block text-base">
                {/* Decorative Line */}
                <img
                  className="absolute -top-2 left-0 object-contain z-0"
                  src="/images/home/Abstract_Line.jpg"
                  alt="line"
                />
                <span className="relative z-10">Jobs</span>
              </span>
            </h1>
            <h1 className="text-background-dark text-[80px] font-bold leading-tight">
              Opportunities
            </h1>
            <p className="text-text-secondary text-2xl mt-4">
              A powerful career platform designed for ambitious professionals
              and passionate talent eager to grow with innovative startups.
            </p>
            <JobSearchBar />
            <p className="text-social text-sm">
              Suggestions:
              <span className="text-text-secondary text-sm">
                UI Designer, UX Researcher, Android, Admin
              </span>
            </p>
          </div>

          {/* Right Section */}
          <div className="flex-1 relative text-black">
            <img src="/images/home/landing_page_hero.jpg" alt="" />
            <img
              src="/images/home/landing_candidates.jpg"
              className="absolute rounded-2xl bottom-0 right-0"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
