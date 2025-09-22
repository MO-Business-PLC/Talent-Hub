import JobApplicants from "../pages/jobs/JobApplicants";

export function meta({ params }: { params: { jobId: string } }) {
  return [
    { title: `Job Applicants - TalentHub` },
    { name: "description", content: "View and manage job applicants." },
  ];
}

export default function JobApplicantsRoute() {
  return <JobApplicants />;
}


