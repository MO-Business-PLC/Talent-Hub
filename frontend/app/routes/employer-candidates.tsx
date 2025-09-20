import type { Route } from "./+types/employer-candidates";
import { DashboardLayout } from "../components/layout";
import EmployerCandidates from "../pages/dashboard/EmployerCandidates";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Candidates - TalentHub" },
    { name: "description", content: "Manage job applications and candidates" },
  ];
}

export default function EmployerCandidatesPage() {
  return (
      <EmployerCandidates />
  );
}
