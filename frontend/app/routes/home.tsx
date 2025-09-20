import type { Route } from "./+types/home";
import { useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router";
import Hero from "~/components/Hero";
import TopCompanies from "~/components/home/TopCompanies";
import ExploreCategories from "~/components/home/ExploreCategories";
import TopCompaniesSection from "~/components/home/TopCompaniesSection";
import ActiveJobsSection from "~/components/home/ActiveJobsSection";
import EmployerCTA from "~/components/home/EmployerCTA";
import CandidateCTA from "~/components/home/CandidateCTA";
import Testimonials from "~/components/home/Testimonials";
import JobSteps from "~/components/home/JobSteps";
import { steps } from "~/links/home.steps";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const role = useMemo(() => {
    const r = (params.get("role") || "").toLowerCase();
    return r === "employer" ? "employer" : r === "employee" ? "employee" : "";
  }, [params]);

  useEffect(() => {
    if (role) {
      try {
        sessionStorage.setItem("role_hint", role);
      } catch {}
      const clean = new URL(window.location.href);
      clean.searchParams.delete("role");
      clean.searchParams.delete("sso");
      if (window.location.search !== clean.search) {
        navigate(`${clean.pathname}${clean.search}${clean.hash}`, {
          replace: true,
        });
      }
    }
  }, [role]);

  return (
    <>
      {/* <Navbar /> */}
      {role && (
        <div className="w-full bg-blue-50 text-blue-700 text-sm py-2 text-center">
          Signed in as{" "}
          <strong className="font-semibold capitalize">{role}</strong>
        </div>
      )}
      <Hero />
      <TopCompanies />
      <ExploreCategories />
      <TopCompaniesSection />
      <ActiveJobsSection />
      <EmployerCTA />
      <JobSteps steps={steps} title="How It For" span="Job Seeker"/>
      <JobSteps steps={steps} title="How It Works For" span="Employee"/>
      <CandidateCTA />
      <Testimonials />
    </>
  );
}
